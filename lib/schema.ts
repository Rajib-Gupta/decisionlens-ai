import { z } from "zod";
export const categories = [
  "Career",
  "Finance",
  "Business",
  "Technology",
  "Education",
  "Relationships",
  "Other",
] as const;
export const decisionInputSchema = z.object({
  decision: z.string().min(15).max(4000),
  category: z.enum(categories),
  why: z.string().max(1500).optional(),
  goal: z.string().max(800).optional(),
  concern: z.string().max(800).optional(),
  constraints: z.string().max(1500).optional(),
  context: z.string().max(2500).optional(),
  answers: z.record(z.string()).optional(),
});
export type DecisionInput = z.infer<typeof decisionInputSchema>;
const perspective = z.object({
  position: z.string(),
  keyArguments: z.array(z.string()).min(1).max(5),
  strongestInsight: z.string(),
  mainConcern: z.string(),
  confidence: z.number().min(0).max(100),
});
const scenario = z.object({
  bestCase: z.string(),
  likely: z.string(),
  worstCase: z.string(),
  assumptions: z.array(z.string()),
  signals: z.array(z.string()),
});
export const analysisSchema = z.object({
  title: z.string(),
  summary: z.string(),
  perspectives: z.object({
    optimist: perspective,
    skeptic: perspective,
    riskAnalyst: perspective,
    longTermStrategist: perspective,
  }),
  debate: z.object({
    agreements: z.array(z.string()),
    disagreements: z.array(z.string()),
    strongestArgumentFor: z.string(),
    strongestArgumentAgainst: z.string(),
    unresolvedQuestions: z.array(z.string()),
  }),
  scenarios: z.object({
    thirtyDays: scenario,
    oneYear: scenario,
    fiveYears: scenario,
  }),
  risks: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        probability: z.enum(["Low", "Medium", "High"]),
        impact: z.enum(["Low", "Medium", "High"]),
        mitigation: z.string(),
        reversible: z.boolean(),
      }),
    )
    .min(1),
  opportunities: z.array(z.string()),
  blindSpots: z.array(z.string()),
  reversibility: z.object({
    classification: z.enum([
      "Highly reversible",
      "Partially reversible",
      "Difficult to reverse",
    ]),
    explanation: z.string(),
    irreversibleConsequences: z.array(z.string()),
  }),
  score: z.object({
    overall: z.number().min(0).max(100),
    dimensions: z.array(
      z.object({
        name: z.string(),
        score: z.number().min(0).max(100),
        explanation: z.string(),
      }),
    ),
  }),
  recommendation: z.object({
    verdict: z.enum([
      "Strongly proceed",
      "Proceed with conditions",
      "Neutral / gather more information",
      "Do not proceed yet",
      "Strongly reconsider",
    ]),
    confidence: z.number().min(0).max(100),
    reasoning: z.string(),
    conditions: z.array(z.string()),
    nextSteps: z.array(z.string()),
    whatWouldChangeMyMind: z.array(z.string()),
  }),
});
export type DecisionAnalysis = z.infer<typeof analysisSchema>;
