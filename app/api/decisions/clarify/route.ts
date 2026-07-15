import { NextResponse } from "next/server";
import { decisionInputSchema } from "@/lib/schema";
export async function POST(request: Request) {
  try {
    const d = decisionInputSchema.parse(await request.json());
    const questions: string[] = [];
    if (!d.constraints)
      questions.push(
        "What constraints would make a bad outcome difficult to absorb?",
      );
    if (!d.goal)
      questions.push(
        "What matters most right now: stability, learning, income, or flexibility?",
      );
    if (!d.concern)
      questions.push("What is the outcome you are most trying to avoid?");
    return NextResponse.json({ questions: questions.slice(0, 3) });
  } catch {
    return NextResponse.json(
      { error: "Invalid decision input" },
      { status: 400 },
    );
  }
}
