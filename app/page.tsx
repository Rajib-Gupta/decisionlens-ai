import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  ShieldAlert,
  Telescope,
  Scale,
} from "lucide-react";
import { Nav } from "@/components/Nav";
const examples = [
  ["Career", "Should I leave my stable job for a 40% raise at a startup?"],
  ["Finance", "Should I take a large loan for this purchase?"],
  ["Business", "Should we launch now or wait three months?"],
  ["Technology", "Should we rewrite our existing product?"],
];
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <section className="hero shell">
          <div>
            <span className="eyebrow">
              Decision intelligence, before commitment
            </span>
            <h1>
              Make Better Decisions Before They Become Expensive Mistakes.
            </h1>
            <p>
              DecisionLens AI challenges your assumptions, exposes blind spots,
              and simulates what could happen next—before you commit.
            </p>
            <div className="actions">
              <Link href="/analyze" className="button green">
                Analyze a decision <ArrowRight size={16} />
              </Link>
              <Link href="/analyze?demo=1" className="button alt">
                Try an example
              </Link>
            </div>
          </div>
          <div className="lens">
            <h3>DECISION LENS / ACTIVE REVIEW</h3>
            <div className="mini-card">
              <span>Opportunity</span>
              <p>What becomes possible if this works?</p>
            </div>
            <div className="mini-card">
              <span>Blind spot detected</span>
              <p>Is a short-term raise being mistaken for durable income?</p>
            </div>
            <div className="mini-card">
              <span>Decision posture</span>
              <p>Proceed with conditions · 64/100</p>
            </div>
          </div>
        </section>
        <section className="section shell">
          <span className="eyebrow">The method</span>
          <h2>One decision. Multiple perspectives. Fewer blind spots.</h2>
          <p className="section-intro">
            Independent lenses pressure-test the same decision before they are
            synthesized into one clear, actionable brief.
          </p>
          <div className="grid">
            <Lens
              icon={<BrainCircuit size={19} />}
              title="The Optimist"
              text="Finds upside, leverage, and positive second-order effects."
            />
            <Lens
              icon={<ShieldAlert size={19} />}
              title="The Skeptic"
              text="Challenges weak reasoning and untested assumptions."
            />
            <Lens
              icon={<Scale size={19} />}
              title="Risk Analyst"
              text="Maps probability, impact, reversibility, and mitigations."
            />
            <Lens
              icon={<Telescope size={19} />}
              title="Long-Term Strategist"
              text="Tests whether today’s move compounds tomorrow’s options."
            />
          </div>
        </section>
        <section className="section shell">
          <span className="eyebrow">Explore a decision</span>
          <h2>Start with the question that keeps following you around.</h2>
          <div className="examples">
            {examples.map(([tag, text]) => (
              <Link
                href={`/analyze?decision=${encodeURIComponent(text)}`}
                className="example"
                key={tag}
              >
                <small>{tag}</small>
                <b>{text}</b>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <footer className="footer shell">
        <span>© 2026 DecisionLens AI</span>
        <span>Decision support, not professional advice.</span>
      </footer>
    </>
  );
}
function Lens({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
