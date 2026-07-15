"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Nav } from "@/components/Nav";
import { categories } from "@/lib/schema";
const demo =
  "I'm earning ₹79,000 per month in a stable software engineering job. I have significant monthly financial commitments and have received an offer from an early-stage startup with a 40% salary increase. The startup offers better learning opportunities, but I'm worried about job stability. Should I accept the offer?";
export default function Analyze() {
  return (
    <Suspense fallback={<AnalyzeLoading />}>
      <AnalyzeForm />
    </Suspense>
  );
}

function AnalyzeLoading() {
  return (
    <>
      <Nav />
      <main className="shell empty">Preparing your decision workspace…</main>
    </>
  );
}

function AnalyzeForm() {
  const q = useSearchParams(),
    router = useRouter();
  const [decision, setDecision] = useState(
    q.get("demo") ? demo : q.get("decision") || "",
  );
  const [category, setCategory] = useState("Career");
  const [why, setWhy] = useState("");
  const [goal, setGoal] = useState("");
  const [concern, setConcern] = useState("");
  const [constraints, setConstraints] = useState("");
  const [context, setContext] = useState("");
  const [error, setError] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (decision.trim().length < 15) {
      setError("Please share a little more detail so the analysis is useful.");
      return;
    }
    const id = crypto.randomUUID();
    localStorage.setItem(
      `decisionlens:${id}`,
      JSON.stringify({
        decision,
        category,
        why,
        goal,
        concern,
        constraints,
        context,
        createdAt: Date.now(),
      }),
    );
    router.push(`/analysis/${id}`);
  }
  return (
    <>
      <Nav />
      <main className="shell">
        <div className="page-title">
          <span className="eyebrow">New decision review</span>
          <h1>Give the decision some room to breathe.</h1>
          <p className="section-intro">
            Start with what you know. DecisionLens will identify the evidence
            worth finding next.
          </p>
        </div>
        <form className="formwrap formcard" onSubmit={submit}>
          <label className="label">What decision are you considering?</label>
          <textarea
            autoFocus
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            placeholder="I'm considering leaving my stable job to join an early-stage startup offering a 40% salary increase..."
          />
          <div className="twocol">
            <div>
              <label className="label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Primary goal</label>
              <input
                className="input"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. grow faster in my career"
              />
            </div>
          </div>
          <label className="label">Why are you considering it?</label>
          <input
            className="input"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="What changed or made this timely?"
          />
          <div className="twocol">
            <div>
              <label className="label">Biggest concern</label>
              <input
                className="input"
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                placeholder="What feels risky?"
              />
            </div>
            <div>
              <label className="label">Relevant constraints</label>
              <input
                className="input"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="Financial, timing, family, etc."
              />
            </div>
          </div>
          <label className="label">
            Anything else that matters?{" "}
            <span style={{ fontWeight: 400, color: "#66716d" }}>
              (optional)
            </span>
          </label>
          <textarea
            style={{ minHeight: 75 }}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Context, trade-offs, people affected, numbers..."
          />
          {error && <p style={{ color: "#b33", fontSize: 13 }}>{error}</p>}
          <p className="disclaimer">
            DecisionLens is a decision-support tool, not medical, legal,
            emergency, or financial advice. It cannot predict the future.
          </p>
          <button className="button green" type="submit">
            Begin analysis
          </button>
        </form>
      </main>
    </>
  );
}
