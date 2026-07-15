import { describe, it, expect } from "vitest";
import { decisionInputSchema, analysisSchema } from "../lib/schema";
import { demoAnalysis } from "../lib/demo";
import { newRecord } from "../lib/decision-store";
describe("schemas", () => {
  it("accepts a valid decision", () =>
    expect(
      decisionInputSchema.parse({
        decision: "Should I take a new role with more uncertainty?",
        category: "Career",
      }).category,
    ).toBe("Career"));
  it("rejects a short decision", () =>
    expect(() =>
      decisionInputSchema.parse({ decision: "Too short", category: "Career" }),
    ).toThrow());
  it("accepts the full decision brief", () =>
    expect(analysisSchema.parse(demoAnalysis).score.overall).toBe(64));

  it("uses the decision text as title when demo analysis title is static", () => {
    const input = decisionInputSchema.parse({
      decision: "Should I buy an apartment now or wait one year?",
      category: "Finance",
    });

    const record = newRecord(input, "owner-1", demoAnalysis);

    expect(record.title).toContain("Should I buy an apartment now or wait one year?");
    expect(record.title).not.toBe("Join the early-stage startup?");
  });
});
