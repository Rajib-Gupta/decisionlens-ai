import OpenAI from "openai";
import { analysisSchema, decisionInputSchema } from "./schema";
import { demoAnalysis } from "./demo";

const instruction = "You are DecisionLens AI, a careful decision-intelligence system. Analyze the user decision through independent Optimist, Skeptic, Risk Analyst, and Long-Term Strategist perspectives. Return only JSON with title, summary, perspectives, debate, thirty-day/one-year/five-year scenarios, risks, opportunities, blindSpots, reversibility, score dimensions, and recommendation. Recommendation must include verdict, confidence, reasoning, conditions, nextSteps, and whatWouldChangeMyMind. Be specific, non-judgmental, distinguish assumptions from facts, and never make predictions or guarantees.";
export async function runAnalysis(input: ReturnType<typeof decisionInputSchema.parse>) {
  if (!process.env.OPENAI_API_KEY) return { analysis: demoAnalysis, demo: true };
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({ model: "gpt-5.6-terra", instructions: instruction, input: JSON.stringify(input), text: { format: { type: "json_object" } } });
  return { analysis: analysisSchema.parse(JSON.parse(response.output_text)), demo: false };
}
