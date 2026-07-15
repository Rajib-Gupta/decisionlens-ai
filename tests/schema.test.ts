import { describe, it, expect } from "vitest";
import { decisionInputSchema, analysisSchema } from "../lib/schema";
import { demoAnalysis } from "../lib/demo";
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
});
