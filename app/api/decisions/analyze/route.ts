import { NextResponse } from "next/server";
import { decisionInputSchema } from "@/lib/schema";
import { runAnalysis } from "@/lib/ai";
export async function POST(request: Request) {
  try {
    const input = decisionInputSchema.parse(await request.json());
    return NextResponse.json(await runAnalysis(input));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to analyze decision";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
