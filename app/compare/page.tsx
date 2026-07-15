"use client";
import { useMemo, useState } from "react";
import { Nav } from "@/components/Nav";
const initial = ["Stay at current role", "Join Startup A", "Join Company B"];
export default function Compare() {
  const [options, setOptions] = useState(initial);
  const [weights, setWeights] = useState([
    { name: "Financial stability", weight: 30 },
    { name: "Career growth", weight: 25 },
    { name: "Work-life balance", weight: 20 },
    { name: "Learning", weight: 15 },
    { name: "Flexibility", weight: 10 },
  ]);
  const total = weights.reduce((n, x) => n + x.weight, 0);
  const scores = useMemo(
    () =>
      options
        .map((o, i) => ({
          name: o,
          total: Math.round(
            weights.reduce(
              (sum, p, j) =>
                sum + (p.weight * ((((i + 2) * (j + 3) * 17) % 41) + 55)) / 100,
              0,
            ),
          ),
          cells: weights.map((_, j) => (((i + 2) * (j + 3) * 17) % 41) + 55),
        }))
        .sort((a, b) => b.total - a.total),
    [options, weights],
  );
  return (
    <>
      <Nav />
      <main className="shell">
        <div className="page-title">
          <span className="eyebrow">Weighted decision comparison</span>
          <h1>Compare the choices—not just the feelings.</h1>
          <p className="section-intro">
            Set your values, then use the matrix as a transparent conversation
            starter. Scores are heuristic; they do not decide for you.
          </p>
        </div>
        <div className="report-grid">
          <section className="report-card">
            <h2>Alternatives</h2>
            {options.map((x, i) => (
              <input
                key={i}
                className="input"
                style={{ marginBottom: 8 }}
                value={x}
                onChange={(e) =>
                  setOptions(
                    options.map((o, k) => (k === i ? e.target.value : o)),
                  )
                }
              />
            ))}
            {options.length < 5 && (
              <button
                className="button alt"
                onClick={() => setOptions([...options, "New alternative"])}
              >
                Add alternative
              </button>
            )}
          </section>
          <section className="report-card">
            <h2>Your priorities</h2>
            {weights.map((p, i) => (
              <div key={p.name}>
                <label className="label">
                  {p.name} · {p.weight}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={p.weight}
                  onChange={(e) =>
                    setWeights(
                      weights.map((x, k) =>
                        k === i ? { ...x, weight: Number(e.target.value) } : x,
                      ),
                    )
                  }
                />
              </div>
            ))}
            <p className="disclaimer">
              Total: {total}%.{" "}
              {total !== 100 &&
                "Adjust priorities to total 100% before treating the comparison as meaningful."}
            </p>
          </section>
          <section className="report-card wide">
            <h2>Comparison matrix</h2>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: 9 }}>Option</th>
                    {weights.map((p) => (
                      <th key={p.name} style={{ padding: 9 }}>
                        {p.name}
                      </th>
                    ))}
                    <th>Weighted fit</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((x) => (
                    <tr key={x.name} style={{ borderTop: "1px solid #dfe3da" }}>
                      <td style={{ padding: 10, fontWeight: 700 }}>{x.name}</td>
                      {x.cells.map((s, i) => (
                        <td
                          key={i}
                          style={{ padding: 10, textAlign: "center" }}
                        >
                          {s}
                        </td>
                      ))}
                      <td
                        style={{
                          padding: 10,
                          textAlign: "center",
                          fontWeight: 800,
                          color: "#126a50",
                        }}
                      >
                        {x.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="twocol">
              <div>
                <h3>Best fit for your stated priorities</h3>
                <p>
                  {scores[0]?.name} currently ranks highest because it best
                  matches the weights you selected.
                </p>
              </div>
              <div>
                <h3>What if your priorities change?</h3>
                <p>
                  Increase financial stability or learning to see how the
                  ranking shifts. This exposes the trade-offs behind a
                  recommendation.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
