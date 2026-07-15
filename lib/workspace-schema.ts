import { z } from "zod";
import { decisionStatuses } from "./status";
export const evidenceSchema = z.object({
  title: z.string().min(2).max(160),
  content: z.string().min(2).max(4000),
  type: z.enum([
    "Fact",
    "Assumption",
    "Opinion",
    "Data",
    "External source",
    "Personal constraint",
  ]),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  confidence: z.enum(["Low", "Medium", "High"]),
  stance: z.enum(["Supports", "Opposes", "Neutral"]),
});
export const actionSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(1000).default(""),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Open", "Completed"]),
  relatedTo: z.string().max(160).optional(),
  dueDate: z.string().optional(),
});
export const outcomeSchema = z.object({
  chosenOption: z.string().min(2).max(300),
  decidedAt: z.string(),
  result: z.enum([
    "Better than expected",
    "Similar to expected",
    "Worse than expected",
  ]),
  notes: z.string().min(2).max(4000),
  surprises: z.string().max(2000).optional(),
  lessons: z.string().max(2000).optional(),
});
export const patchDecisionSchema = z
  .object({
    status: z.enum(decisionStatuses).optional(),
    deadline: z.string().max(40).optional(),
    tags: z.array(z.string().max(40)).max(12).optional(),
    title: z.string().min(2).max(160).optional(),
    context: z.string().max(2500).optional(),
    evidence: evidenceSchema.optional(),
    action: actionSchema.optional(),
    actionId: z.string().uuid().optional(),
    outcome: outcomeSchema.optional(),
  })
  .refine((x) => Object.keys(x).length > 0);
export const comparisonSchema = z
  .object({
    options: z
      .array(
        z.object({
          name: z.string().min(2).max(140),
          description: z.string().max(1200).optional(),
        }),
      )
      .min(2)
      .max(5),
    priorities: z
      .array(
        z.object({
          name: z.string().min(2).max(70),
          weight: z.number().min(0).max(100),
        }),
      )
      .min(1)
      .max(7),
  })
  .refine((x) => x.priorities.reduce((sum, p) => sum + p.weight, 0) === 100, {
    message: "Priority weights must total 100.",
  });
