"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
type Saved = { id:string; title:string; category: string; status:string; updatedAt: string };
export default function History() {
  const [items, setItems] = useState<Saved[]>([]);
  const [message,setMessage]=useState("");
  useEffect(()=>{fetch("/api/briefs").then(async r=>{const body=await r.json();if(!r.ok) setMessage(body.error || "Saved workspaces need MongoDB configuration.");else setItems(body.briefs);}).catch(()=>setMessage("Could not load saved workspaces."));},[]);
  return (
    <>
      <Nav />
      <main className="shell">
        <div className="page-title">
          <span className="eyebrow">Decision operating system</span>
          <h1>Saved briefs</h1>
        </div>
        {items.length ? (
          <div className="examples">
            {items.map((x) => (
              <Link className="example" href={`/decisions/${x.id}`} key={x.id}>
                <small>
                  {x.category} · {x.status} · {new Date(x.updatedAt).toLocaleDateString()}
                </small>
                <b>{x.title}</b>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">
            {message || "No saved decision workspaces yet."}
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
