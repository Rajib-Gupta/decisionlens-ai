import Link from "next/link";
export function Nav() {
  return (
    <nav className="nav shell">
      <Link href="/" className="brand">
        <span className="mark">D</span>DecisionLens AI
      </Link>
      <div className="navlinks">
        <Link href="/about">How it works</Link>
        <Link href="/history">Saved briefs</Link>
      </div>
      <Link className="button" href="/analyze">
        Analyze a decision
      </Link>
    </nav>
  );
}
