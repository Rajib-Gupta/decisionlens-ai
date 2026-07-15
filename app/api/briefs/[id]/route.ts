import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  activity,
  applyOwnerCookie,
  decisions,
  ownerFromRequest,
  publicDecision,
} from "@/lib/decision-store";
import { patchDecisionSchema } from "@/lib/workspace-schema";
import { randomUUID } from "crypto";
async function owned(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const ownerId = await ownerFromRequest();
  const col = await decisions();
  const byOwner = await col.findOne({
    _id: new ObjectId(id),
    ownerId,
    deletedAt: { $exists: false },
  });
  if (byOwner) return { ownerId, col, record: byOwner };

  // Recover the owner from the workspace id so existing links remain usable
  // even when the browser cookie context changes.
  const byId = await col.findOne({
    _id: new ObjectId(id),
    deletedAt: { $exists: false },
  });
  return byId ? { ownerId: byId.ownerId, col, record: byId } : null;
}
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const hit = await owned((await params).id);
    if (!hit)
      return NextResponse.json(
        { error: "Decision not found" },
        { status: 404 },
      );
    return applyOwnerCookie(
      NextResponse.json({ brief: publicDecision(hit.record) }),
      hit.ownerId,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to load workspace",
      },
      { status: 503 },
    );
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const hit = await owned((await params).id);
    if (!hit)
      return NextResponse.json(
        { error: "Decision not found" },
        { status: 404 },
      );
    const patch = patchDecisionSchema.parse(await request.json());
    const now = new Date();
    const update: Record<string, unknown> = { $set: { updatedAt: now } };
    const events = [] as ReturnType<typeof activity>[];
    if (patch.status) {
      update.$set = { ...(update.$set as object), status: patch.status };
      events.push(activity("status", `Status changed to ${patch.status}`));
    }
    if (patch.deadline !== undefined) {
      update.$set = { ...(update.$set as object), deadline: patch.deadline };
      events.push(activity("deadline", "Decision deadline updated"));
    }
    if (patch.title) {
      update.$set = { ...(update.$set as object), title: patch.title };
    }
    if (patch.context !== undefined) {
      update.$set = { ...(update.$set as object), context: patch.context };
      events.push(activity("context", "Decision context updated"));
    }
    if (patch.tags) {
      update.$set = { ...(update.$set as object), tags: patch.tags };
    }
    if (patch.evidence) {
      update.$push = {
        evidence: { ...patch.evidence, id: randomUUID(), createdAt: now },
        activity: activity(
          "evidence",
          `Added evidence: ${patch.evidence.title}`,
        ),
      };
    }
    if (patch.action) {
      update.$push = {
        actions: { ...patch.action, id: randomUUID(), createdAt: now },
        activity: activity("action", `Added action: ${patch.action.title}`),
      };
    }
    if (patch.actionId) {
      update.$set = {
        ...(update.$set as object),
        "actions.$[item].status": "Completed",
      };
      update.arrayFilters = [{ "item.id": patch.actionId }];
      events.push(activity("action", "Marked action complete"));
    }
    if (patch.outcome) {
      update.$set = {
        ...(update.$set as object),
        outcome: { ...patch.outcome, recordedAt: now },
        status: "Outcome recorded",
      };
      events.push(activity("outcome", "Recorded real-world outcome"));
    }
    if (events.length) {
      update.$push = {
        ...(update.$push as object),
        activity: { $each: events },
      };
    }
    await hit.col.updateOne(
      { _id: hit.record._id, ownerId: hit.ownerId },
      update,
    );
    const fresh = await hit.col.findOne({
      _id: hit.record._id,
      ownerId: hit.ownerId,
    });
    return applyOwnerCookie(
      NextResponse.json({ brief: publicDecision(fresh!) }),
      hit.ownerId,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to update workspace",
      },
      { status: 400 },
    );
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const hit = await owned((await params).id);
    if (!hit)
      return NextResponse.json(
        { error: "Decision not found" },
        { status: 404 },
      );
    await hit.col.updateOne(
      { _id: hit.record._id, ownerId: hit.ownerId },
      { $set: { deletedAt: new Date(), updatedAt: new Date() } },
    );
    return applyOwnerCookie(
      new NextResponse(null, { status: 204 }),
      hit.ownerId,
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to delete workspace" },
      { status: 400 },
    );
  }
}
