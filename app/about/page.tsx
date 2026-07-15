import { Nav } from "@/components/Nav";
export default function About() {
  return (
    <>
      <Nav />
      <main className="shell">
        <div className="page-title">
          <span className="eyebrow">How it works</span>
          <h1>Better questions lead to better commitments.</h1>
          <p className="section-intro">
            DecisionLens separates opportunity, skepticism, risk, and long-term
            thinking before presenting a single structured brief.
          </p>
        </div>
        <section className="formcard formwrap">
          <h2>Important limitations</h2>
          <p className="section-intro">
            This tool provides structured reflection, not certainty or
            professional advice. Scenarios are not predictions and scores are
            transparent heuristics—not mathematical facts. For legal, medical,
            emergency, or consequential financial decisions, consult a qualified
            professional.
          </p>
        </section>
      </main>
    </>
  );
}
