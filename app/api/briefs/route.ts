import { NextResponse } from "next/server";
import { analysisSchema, decisionInputSchema } from "@/lib/schema";
import {
  applyOwnerCookie,
  decisions,
  newRecord,
  ownerFromRequest,
  publicDecision,
} from "@/lib/decision-store";
import { z } from "zod";

const createSchema = z.object({
  input: decisionInputSchema,
  analysis: analysisSchema.optional(),
});
export async function GET() {
  try {
    const ownerId = await ownerFromRequest();
    const rows = await (
      await decisions()
    )
      .find(
        { ownerId, deletedAt: { $exists: false } },
        {
          projection: {
            ownerId: 0,
            versions: 0,
            evidence: 0,
            actions: 0,
            activity: 0,
          },
        },
      )
      .sort({ updatedAt: -1 })
      .toArray();
    return applyOwnerCookie(
      NextResponse.json({ briefs: rows.map(publicDecision) }),
      ownerId,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load saved briefs",
      },
      { status: 503 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const { input, analysis } = createSchema.parse(await request.json());
    const ownerId = await ownerFromRequest();
    const result = await (
      await decisions()
    ).insertOne(newRecord(input, ownerId, analysis) as any);
    const record = await (
      await decisions()
    ).findOne({ _id: result.insertedId, ownerId });
    return applyOwnerCookie(
      NextResponse.json({ brief: publicDecision(record!) }, { status: 201 }),
      ownerId,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to save brief",
      },
      { status: 400 },
    );
  }
}
