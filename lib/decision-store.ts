import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDb } from "./db";
import type { DecisionAnalysis, DecisionInput } from "./schema";
import { randomUUID } from "crypto";
import type { DecisionStatus } from "./status";
import { DEMO_ANALYSIS_TITLE } from "./demo";

export type EvidenceItem = {
  id: string;
  title: string;
  content: string;
  type:
    | "Fact"
    | "Assumption"
    | "Opinion"
    | "Data"
    | "External source"
    | "Personal constraint";
  sourceUrl?: string;
  confidence: "Low" | "Medium" | "High";
  stance: "Supports" | "Opposes" | "Neutral";
  createdAt: Date;
};
export type ActionItem = {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "Completed";
  relatedTo?: string;
  dueDate?: string;
  createdAt: Date;
};
export type Outcome = {
  chosenOption: string;
  decidedAt: string;
  result:
    | "Better than expected"
    | "Similar to expected"
    | "Worse than expected";
  notes: string;
  surprises?: string;
  lessons?: string;
  recordedAt: Date;
};
export type AnalysisVersion = {
  id: string;
  analysis: DecisionAnalysis;
  createdAt: Date;
  reason: string;
  changeSummary?: string;
};
export type DecisionRecord = {
  _id: ObjectId;
  ownerId: string;
  title: string;
  decision: string;
  category: string;
  why?: string;
  goal?: string;
  concern?: string;
  constraints?: string;
  context?: string;
  answers?: Record<string, string>;
  status: DecisionStatus;
  deadline?: string;
  tags: string[];
  analysis?: DecisionAnalysis;
  versions: AnalysisVersion[];
  evidence: EvidenceItem[];
  actions: ActionItem[];
  outcome?: Outcome;
  activity: { id: string; type: string; detail: string; createdAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
  lastAnalyzedAt?: Date;
  deletedAt?: Date;
};

export async function ownerFromRequest() {
  const store = await cookies();
  return store.get("dl_owner")?.value ?? randomUUID();
}
export function applyOwnerCookie(response: NextResponse, ownerId: string) {
  response.cookies.set("dl_owner", ownerId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}
export async function decisions() {
  const db = await getDb();
  const col = db.collection<DecisionRecord>("decisions");
  await Promise.all([
    col.createIndex({ ownerId: 1, updatedAt: -1 }),
    col.createIndex({ ownerId: 1, status: 1 }),
    col.createIndex({ ownerId: 1, category: 1 }),
  ]);
  return col;
}
export function publicDecision(d: DecisionRecord) {
  return { ...d, id: d._id.toHexString(), _id: undefined };
}

export function resolveDecisionTitle(
  decision: string,
  analysisTitle?: string,
) {
  const fallback =
    decision.slice(0, 72) + (decision.length > 72 ? "…" : "");
  const candidate = analysisTitle?.trim();
  if (!candidate) return fallback;
  if (candidate === DEMO_ANALYSIS_TITLE) return fallback;
  return candidate;
}

export function newRecord(
  input: DecisionInput,
  ownerId: string,
  analysis?: DecisionAnalysis,
): Omit<DecisionRecord, "_id"> {
  const now = new Date();
  const title = resolveDecisionTitle(input.decision, analysis?.title);
  return {
    ownerId,
    title,
    decision: input.decision,
    category: input.category,
    why: input.why,
    goal: input.goal,
    concern: input.concern,
    constraints: input.constraints,
    context: input.context,
    answers: input.answers,
    status: "Exploring",
    tags: [],
    analysis,
    versions: analysis
      ? [
          {
            id: randomUUID(),
            analysis,
            createdAt: now,
            reason: "Initial analysis",
          },
        ]
      : [],
    evidence: [],
    actions:
      analysis?.recommendation.nextSteps.map((title, i) => ({
        id: randomUUID(),
        title,
        description: "Generated from the decision brief.",
        priority: i === 0 ? "High" : "Medium",
        status: "Open",
        createdAt: now,
      })) ?? [],
    activity: [
      {
        id: randomUUID(),
        type: "created",
        detail: "Decision workspace created",
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
    lastAnalyzedAt: analysis ? now : undefined,
  };
}
export function activity(type: string, detail: string) {
  return { id: randomUUID(), type, detail, createdAt: new Date() };
}
