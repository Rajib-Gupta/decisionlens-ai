"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
type Saved = { decision: string; category: string; createdAt: number };
export default function History() {
  const [items, setItems] = useState<[string, Saved][]>([]);
  useEffect(
    () =>
      setItems(
        Object.keys(localStorage)
          .filter((x) => x.startsWith("decisionlens:"))
          .map((k) => [
            k.replace("decisionlens:", ""),
            JSON.parse(localStorage.getItem(k)!),
          ]),
      ),
    [],
  );
  return (
    <>
      <Nav />
      <main className="shell">
        <div className="page-title">
          <span className="eyebrow">Local decision archive</span>
          <h1>Saved briefs</h1>
        </div>
        {items.length ? (
          <div className="examples">
            {items.map(([id, x]) => (
              <Link className="example" href={`/analysis/${id}`} key={id}>
                <small>
                  {x.category} · {new Date(x.createdAt).toLocaleDateString()}
                </small>
                <b>{x.decision}</b>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">
            No decisions saved on this device yet.
            <br />
            <br />
            <Link className="button" href="/analyze">
              Analyze a decision
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
