import OpenAI from "openai";
import { NextResponse } from "next/server";
import { analysisSchema, decisionInputSchema } from "@/lib/schema";
import { demoAnalysis } from "@/lib/demo";
const instruction = `You are DecisionLens AI, a careful decision-intelligence system. Analyze the user's decision through four genuinely independent lenses: optimist, skeptic, risk analyst, and long-term strategist. Be non-judgmental, specific, and do not claim predictions. Return ONLY valid JSON matching this exact shape: ${JSON.stringify({ title: "string", summary: "string", perspectives: { optimist: { position: "string", keyArguments: ["string"], strongestInsight: "string", mainConcern: "string", confidence: 70 }, skeptic: { position: "string", keyArguments: ["string"], strongestInsight: "string", mainConcern: "string", confidence: 70 }, riskAnalyst: { position: "string", keyArguments: ["string"], strongestInsight: "string", mainConcern: "string", confidence: 70 }, longTermStrategist: { position: "string", keyArguments: ["string"], strongestInsight: "string", mainConcern: "string", confidence: 70 } }, debate: { agreements: ["string"], disagreements: ["string"], strongestArgumentFor: "string", strongestArgumentAgainst: "string", unresolvedQuestions: ["string"] }, scenarios: { thirtyDays: { bestCase: "string", likely: "string", worstCase: "string", assumptions: ["string"], signals: ["string"] }, oneYear: { bestCase: "string", likely: "string", worstCase: "string", assumptions: ["string"], signals: ["string"] }, fiveYears: { bestCase: "string", likely: "string", worstCase: "string", assumptions: ["string"], signals: ["string"] } }, risks: [{ name: "string", description: "string", probability: "Low", impact: "High", mitigation: "string", reversible: true }], opportunities: ["string"], blindSpots: ["string"], reversibility: { classification: "Partially reversible", explanation: "string", irreversibleConsequences: ["string"] }, score: { overall: 60, dimensions: [{ name: "string", score: 60, explanation: "string" }] }, recommendation: { verdict: "Proceed with conditions", confidence: 70, reasoning: "string", conditions: ["string"], nextSteps: ["string"], whatWouldChangeMyMind: ["string"] } })};`;
export async function POST(request: Request) {
  try {
    const input = decisionInputSchema.parse(await request.json());
    if (!process.env.OPENAI_API_KEY)
      return NextResponse.json({ analysis: demoAnalysis, demo: true });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: instruction,
      input: JSON.stringify(input),
      text: { format: { type: "json_object" } },
    });
    const parsed = analysisSchema.parse(JSON.parse(response.output_text));
    return NextResponse.json({ analysis: parsed });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to analyze decision";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
