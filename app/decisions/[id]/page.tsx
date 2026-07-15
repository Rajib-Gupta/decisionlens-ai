"use client";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { decisionStatuses } from "@/lib/status";
type Brief = {
  id: string;
  title: string;
  category: string;
  decision: string;
  status: string;
  deadline?: string;
  updatedAt: string;
  analysis?: {
    score: { overall: number };
    recommendation: {
      verdict: string;
      confidence: number;
      reasoning: string;
      nextSteps: string[];
      whatWouldChangeMyMind: string[];
    };
    risks: { name: string; mitigation: string }[];
    opportunities: string[];
    blindSpots: string[];
  };
  evidence: {
    id: string;
    title: string;
    content: string;
    type: string;
    confidence: string;
    stance: string;
  }[];
  actions: {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
  }[];
  activity: { id: string; type: string; detail: string; createdAt: string }[];
  outcome?: { chosenOption: string; result: string; notes: string };
};
export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () =>
    fetch(`/api/briefs/${id}`)
      .then(async (r) => {
        const x = await r.json();
        if (!r.ok) throw new Error(x.error);
        setBrief(x.brief);
      })
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, [id]);
  
  async function patch(payload: unknown) {
    setBusy(true);
    try {
      const r = await fetch(`/api/briefs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const x = await r.json();
      if (!r.ok) throw new Error(x.error);
      setBrief(x.brief);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }
  if (error)
    return (
      <>
        <Nav />
        <main className="shell empty">
          {error}
          <br />
          <br />
          Configure <code>MONGODB_URI</code> and create a new decision
          workspace.
        </main>
      </>
    );
  if (!brief)
    return (
      <>
        <Nav />
        <main className="shell empty">Loading decision workspace…</main>
      </>
    );
  const days = brief.deadline
    ? Math.ceil((new Date(brief.deadline).getTime() - Date.now()) / 86400000)
    : null;
  return (
    <>
      <Nav />
      <main className="shell report">
        <header className="report-head">
          <div>
            <span className="eyebrow">
              Decision workspace · {brief.category}
            </span>
            <h1>{brief.title}</h1>
            <span className="pill">{brief.status}</span>
            {days !== null && (
              <span className="pill" style={{ marginLeft: 8 }}>
                {days < 0 ? "Deadline passed" : `${days} days remaining`}
              </span>
            )}
          </div>
          {brief.analysis && (
            <div className="score">
              {brief.analysis.score.overall}
              <small style={{ font: "500 14px Manrope" }}> / 100</small>
            </div>
          )}
        </header>
        <div className="report-grid">
          <section className="report-card">
            <h2>Decision control</h2>
            <p>{brief.decision}</p>
            <label className="label">Current status</label>
            <select
              value={brief.status}
              disabled={busy}
              onChange={(e) => patch({ status: e.target.value })}
            >
              {decisionStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <label className="label">Decision deadline</label>
            <input
              className="input"
              type="date"
              value={brief.deadline?.slice(0, 10) || ""}
              onChange={(e) => patch({ deadline: e.target.value })}
            />
          </section>
          <section className="report-card">
            <h2>Recommendation</h2>
            <span className="pill">
              {brief.analysis?.recommendation.verdict || "Awaiting analysis"}
            </span>
            <p>{brief.analysis?.recommendation.reasoning}</p>
            <h3>What would change my mind?</h3>
            <List
              items={brief.analysis?.recommendation.whatWouldChangeMyMind || []}
            />
          </section>
          <section className="report-card wide">
            <h2>Action plan</h2>
            <p>
              {brief.actions.filter((a) => a.status === "Completed").length} of{" "}
              {brief.actions.length} actions completed
            </p>
            {brief.actions.map((a) => (
              <div className="risk" key={a.id}>
                <div>
                  <b>{a.title}</b>
                  <br />
                  <span style={{ color: "#66716d" }}>{a.description}</span>
                </div>
                <div>
                  <span className="pill">{a.priority}</span>
                </div>
                <div>
                  {a.status === "Completed" ? (
                    "✓ Complete"
                  ) : (
                    <button
                      className="button alt"
                      disabled={busy}
                      onClick={() => patch({ actionId: a.id })}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
            <ActionForm onSave={(x) => patch({ action: x })} />
          </section>
          <section className="report-card">
            <h2>Evidence locker</h2>
            {brief.evidence.length ? (
              <List
                items={brief.evidence.map(
                  (e) => `${e.title} · ${e.type} · ${e.stance}`,
                )}
              />
            ) : (
              <p>
                No evidence logged yet. Add facts, assumptions, offers, or
                research before deciding.
              </p>
            )}
            <EvidenceForm onSave={(x) => patch({ evidence: x })} />
          </section>
          <section className="report-card">
            <h2>Pre-mortem</h2>
            <p>
              Imagine this failed one year from now. Use the highest-impact
              risks as failure modes and verify their early signals before
              committing.
            </p>
            <List
              items={
                brief.analysis?.risks.map(
                  (r) => `${r.name}: ${r.mitigation}`,
                ) || []
              }
            />
            <h2 style={{ marginTop: 22 }}>Blind spots</h2>
            <List items={brief.analysis?.blindSpots || []} />
          </section>
          <section className="report-card">
            <h2>Outcome learning</h2>
            {brief.outcome ? (
              <>
                <span className="pill">{brief.outcome.result}</span>
                <p>
                  <b>Chosen:</b> {brief.outcome.chosenOption}
                </p>
                <p>{brief.outcome.notes}</p>
              </>
            ) : (
              <OutcomeForm onSave={(x) => patch({ outcome: x })} />
            )}
          </section>
          <section className="report-card">
            <h2>Decision change log</h2>
            <List
              items={brief.activity
                .slice()
                .reverse()
                .map(
                  (x) =>
                    `${new Date(x.createdAt).toLocaleDateString()} · ${x.detail}`,
                )}
            />
          </section>
        </div>
      </main>
    </>
  );
}
function List({ items }: { items: string[] }) {
  const seen = new Map<string, number>();
  return (
    <ul>
      {items.map((x) => {
        const count = (seen.get(x) ?? 0) + 1;
        seen.set(x, count);
        return <li key={`${x}__${count}`}>{x}</li>;
      })}
    </ul>
  );
}
function EvidenceForm({ onSave }: { onSave: (x: unknown) => void }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSave({
      title: f.get("title"),
      content: f.get("content"),
      type: f.get("type"),
      confidence: "Medium",
      stance: f.get("stance"),
    });
    e.currentTarget.reset();
  };
  return (
    <form onSubmit={submit}>
      <label className="label">Add evidence</label>
      <input
        className="input"
        name="title"
        required
        placeholder="e.g. Funding runway confirmed"
      />
      <textarea
        name="content"
        required
        style={{ minHeight: 65, marginTop: 8 }}
        placeholder="What do you know, and how reliable is it?"
      />
      <div className="twocol">
        <select name="type">
          <option>Fact</option>
          <option>Assumption</option>
          <option>Opinion</option>
          <option>Data</option>
          <option>External source</option>
          <option>Personal constraint</option>
        </select>
        <select name="stance">
          <option>Supports</option>
          <option>Opposes</option>
          <option>Neutral</option>
        </select>
      </div>
      <button className="button alt" style={{ marginTop: 8 }}>
        Save evidence
      </button>
    </form>
  );
}
function ActionForm({ onSave }: { onSave: (x: unknown) => void }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSave({
      title: f.get("title"),
      description: f.get("description"),
      priority: f.get("priority"),
      status: "Open",
    });
    e.currentTarget.reset();
  };
  return (
    <form onSubmit={submit}>
      <label className="label">Add action</label>
      <div className="twocol">
        <input
          className="input"
          name="title"
          required
          placeholder="Action to take"
        />
        <select name="priority">
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
      <input
        className="input"
        name="description"
        placeholder="Why this matters"
        style={{ marginTop: 8 }}
      />
      <button className="button alt" style={{ marginTop: 8 }}>
        Add action
      </button>
    </form>
  );
}
function OutcomeForm({ onSave }: { onSave: (x: unknown) => void }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSave({
      chosenOption: f.get("choice"),
      decidedAt: new Date().toISOString(),
      result: f.get("result"),
      notes: f.get("notes"),
    });
  };
  return (
    <form onSubmit={submit}>
      <p>
        Close the loop after acting. DecisionLens compares learning—not
        predictions—with what happened.
      </p>
      <input
        className="input"
        name="choice"
        required
        placeholder="What did you choose?"
      />
      <select name="result" style={{ marginTop: 8 }}>
        <option>Better than expected</option>
        <option>Similar to expected</option>
        <option>Worse than expected</option>
      </select>
      <textarea
        name="notes"
        required
        style={{ minHeight: 65, marginTop: 8 }}
        placeholder="What happened? What surprised you?"
      />
      <button className="button green" style={{ marginTop: 8 }}>
        Record outcome
      </button>
    </form>
  );
}
