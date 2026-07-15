"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { demoAnalysis } from "@/lib/demo";
import type { DecisionAnalysis } from "@/lib/schema";
const stages = [
  "Understanding your decision…",
  "Identifying missing assumptions…",
  "The Optimist is analyzing upside…",
  "The Skeptic is challenging assumptions…",
  "The Risk Analyst is mapping failure modes…",
  "Simulating 30-day, 1-year, and 5-year outcomes…",
  "Resolving disagreements…",
  "Building your Decision Brief…",
];
export default function Analysis() {
  const { id } = useParams<{ id: string }>();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<DecisionAnalysis | null>(null);
  useEffect(() => {
    const timer = setInterval(
      () =>
        setStep((x) => {
          if (x >= stages.length - 1) {
            clearInterval(timer);
            return x;
          }
          return x + 1;
        }),
      420,
    );
    const raw = localStorage.getItem(`decisionlens:${id}`);
    if (!raw) {
      setData(demoAnalysis);
      return;
    }
    fetch("/api/decisions/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    })
      .then((r) => r.json())
      .then((x) => setData(x.analysis || demoAnalysis))
      .catch(() => setData(demoAnalysis));
    return () => clearInterval(timer);
  }, [id]);
  if (!data || step < stages.length - 1)
    return (
      <>
        <Nav />
        <main className="shell progress">
          <div>
            <span className="eyebrow">Analysis stages</span>
            <h1 style={{ fontFamily: "Playfair Display", fontSize: 42 }}>
              Looking at this from every angle.
            </h1>
            <div className="stages">
              {stages.map((x, i) => (
                <div className={`stage ${i === step ? "active" : ""}`} key={x}>
                  {i < step ? "✓ " : i === step ? "↳ " : "○ "}
                  {x}
                </div>
              ))}
            </div>
            <p className="disclaimer">
              These are analysis stages, not a precise measure of real-time
              progress.
            </p>
          </div>
        </main>
      </>
    );
  return (
    <>
      <Nav />
      <Report data={data} />
    </>
  );
}
function Report({ data: d }: { data: DecisionAnalysis }) {
  const p = d.perspectives;
  return (
    <main className="shell report">
      <header className="report-head">
        <div>
          <span className="eyebrow">
            Decision brief · heuristic decision support
          </span>
          <h1>{d.title}</h1>
          <span className="pill">{d.recommendation.verdict}</span>
        </div>
        <div>
          <div className="score">
            {d.score.overall}
            <small style={{ font: "500 14px Manrope" }}> / 100</small>
          </div>
          <small style={{ color: "#66716d" }}>
            Decision score · not objective truth
          </small>
        </div>
      </header>
      <div className="report-grid">
        <section className="report-card">
          <h2>Recommendation</h2>
          <p className="callout">{d.recommendation.reasoning}</p>
          <h3 style={{ marginTop: 17 }}>Conditions to proceed</h3>
          <List items={d.recommendation.conditions} />
        </section>
        <section className="report-card">
          <h2>Score dimensions</h2>
          {d.score.dimensions.map((x) => (
            <div key={x.name}>
              <b style={{ fontSize: 12 }}>
                {x.name} · {x.score}
              </b>
              <div className="meter">
                <i style={{ width: `${x.score}%` }} />
              </div>
            </div>
          ))}
        </section>
        <section className="report-card wide">
          <h2>Independent perspectives</h2>
          <div className="perspectives">
            <Perspective name="Optimist" x={p.optimist} />
            <Perspective name="Skeptic" x={p.skeptic} />
            <Perspective name="Risk Analyst" x={p.riskAnalyst} />
            <Perspective name="Long-Term Strategist" x={p.longTermStrategist} />
          </div>
        </section>
        <section className="report-card wide">
          <h2>AI debate</h2>
          <div className="twocol">
            <div>
              <h3>Where the lenses agree</h3>
              <List items={d.debate.agreements} />
              <h3>Strongest case for</h3>
              <p>{d.debate.strongestArgumentFor}</p>
            </div>
            <div>
              <h3>Where they disagree</h3>
              <List items={d.debate.disagreements} />
              <h3>Strongest case against</h3>
              <p>{d.debate.strongestArgumentAgainst}</p>
            </div>
          </div>
        </section>
        <section className="report-card wide">
          <h2>Consequence simulator</h2>
          <p>
            Scenario analysis, not a prediction. Watch the signals; update the
            decision as evidence changes.
          </p>
          <div className="timeline">
            {[
              ["30 days", d.scenarios.thirtyDays],
              ["1 year", d.scenarios.oneYear],
              ["5 years", d.scenarios.fiveYears],
            ].map(([time, s]) => {
              const x = s as typeof d.scenarios.thirtyDays;
              return (
                <div className="card" key={time as string}>
                  <span className="eyebrow">{time as string}</span>
                  <h3>Likely</h3>
                  <p>{x.likely}</p>
                  <h3>Early signals</h3>
                  <List items={x.signals} />
                </div>
              );
            })}
          </div>
        </section>
        <section className="report-card">
          <h2>Risk matrix</h2>
          {d.risks.map((r) => (
            <div className="risk" key={r.name}>
              <div>
                <b>{r.name}</b>
                <br />
                <span style={{ color: "#66716d" }}>{r.mitigation}</span>
              </div>
              <div>
                Probability
                <br />
                <b>{r.probability}</b>
              </div>
              <div>
                Impact
                <br />
                <b>{r.impact}</b>
              </div>
            </div>
          ))}
        </section>
        <section className="report-card">
          <h2>What you might be missing</h2>
          <List items={d.blindSpots} />
          <h3>Critical unknowns</h3>
          <List items={d.debate.unresolvedQuestions} />
        </section>
        <section className="report-card">
          <h2>Reversibility</h2>
          <span className="pill">{d.reversibility.classification}</span>
          <p>{d.reversibility.explanation}</p>
        </section>
        <section className="report-card">
          <h2>Next steps</h2>
          <List items={d.recommendation.nextSteps} />
          <h3>What would change my mind?</h3>
          <List items={d.recommendation.whatWouldChangeMyMind} />
        </section>
      </div>
    </main>
  );
}
function List({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}
function Perspective({
  name,
  x,
}: {
  name: string;
  x: DecisionAnalysis["perspectives"]["optimist"];
}) {
  return (
    <article className="perspective">
      <span className="name">
        {name} · {x.confidence}%
      </span>
      <h3>{x.position}</h3>
      <p>{x.strongestInsight}</p>
      <p>
        <b>Watch:</b> {x.mainConcern}
      </p>
    </article>
  );
}
