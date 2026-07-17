import OpenAI from "openai";
import { analysisSchema, decisionInputSchema } from "./schema";
import { demoAnalysis } from "./demo";

const instruction =
  "You are DecisionLens AI, a careful decision-intelligence system. Analyze the user decision through independent Optimist, Skeptic, Risk Analyst, and Long-Term Strategist perspectives. Return only json with title, summary, perspectives, debate, thirty-day/one-year/five-year scenarios, risks, opportunities, blindSpots, reversibility, score dimensions, and recommendation. Recommendation must include verdict, confidence, reasoning, conditions, nextSteps, and whatWouldChangeMyMind. Output must be valid json object and contain no markdown. Be specific, non-judgmental, distinguish assumptions from facts, and never make predictions or guarantees.";

const schemaGuide = `Return json with this exact shape and value types:
{
  "title": string,
  "summary": string,
  "perspectives": {
    "optimist": {"position": string, "keyArguments": string[], "strongestInsight": string, "mainConcern": string, "confidence": number},
    "skeptic": {"position": string, "keyArguments": string[], "strongestInsight": string, "mainConcern": string, "confidence": number},
    "riskAnalyst": {"position": string, "keyArguments": string[], "strongestInsight": string, "mainConcern": string, "confidence": number},
    "longTermStrategist": {"position": string, "keyArguments": string[], "strongestInsight": string, "mainConcern": string, "confidence": number}
  },
  "debate": {"agreements": string[], "disagreements": string[], "strongestArgumentFor": string, "strongestArgumentAgainst": string, "unresolvedQuestions": string[]},
  "scenarios": {
    "thirtyDays": {"bestCase": string, "likely": string, "worstCase": string, "assumptions": string[], "signals": string[]},
    "oneYear": {"bestCase": string, "likely": string, "worstCase": string, "assumptions": string[], "signals": string[]},
    "fiveYears": {"bestCase": string, "likely": string, "worstCase": string, "assumptions": string[], "signals": string[]}
  },
  "risks": [{"name": string, "description": string, "probability": "Low"|"Medium"|"High", "impact": "Low"|"Medium"|"High", "mitigation": string, "reversible": boolean}],
  "opportunities": string[],
  "blindSpots": string[],
  "reversibility": {"classification": string, "explanation": string, "irreversibleConsequences": string[]},
  "score": {"overall": number, "dimensions": [{"name": string, "score": number, "explanation": string}]},
  "recommendation": {
    "verdict": "Strongly proceed"|"Proceed with conditions"|"Neutral / gather more information"|"Do not proceed yet"|"Strongly reconsider",
    "confidence": number,
    "reasoning": string,
    "conditions": string[],
    "nextSteps": string[],
    "whatWouldChangeMyMind": string[]
  }
}`;

async function requestAnalysis(
  client: OpenAI,
  input: ReturnType<typeof decisionInputSchema.parse>,
  repairHint?: string,
) {
  const modelInput = [
    "Return valid json only.",
    schemaGuide,
    repairHint,
    `Decision input:\n${JSON.stringify(input)}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await client.responses.create({
    model: "gpt-5.6-terra",
    instructions: instruction,
    input: modelInput,
    text: { format: { type: "json_object" } },
  });

  return JSON.parse(response.output_text);
}

export async function runAnalysis(
  input: ReturnType<typeof decisionInputSchema.parse>,
) {
  if (!process.env.OPENAI_API_KEY)
    return { analysis: demoAnalysis, demo: true };

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const first = await requestAnalysis(client, input);
  const firstParsed = analysisSchema.safeParse(first);
  if (firstParsed.success) {
    return { analysis: firstParsed.data, demo: false };
  }

  const repairHint = `Your previous json failed validation. Fix all issues and return only corrected json. Validation errors: ${firstParsed.error.issues
    .slice(0, 10)
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("; ")}`;
  const second = await requestAnalysis(client, input, repairHint);
  const parsed = analysisSchema.parse(second);

  return {
    analysis: parsed,
    demo: false,
  };
}
