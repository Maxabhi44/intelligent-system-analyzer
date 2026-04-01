// ─── PageTransition.tsx ───────────────────────────────────────
// Route change pe smooth fade+slide animation.
//
// Fix (v2): Pehli render pe blank screen bug hataya.
// Ab displayChildren ko initializer mein hi set karte hain —
// ek extra render cycle nahi lagti.
// ──────────────────────────────────────────────────────────────

import { useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // displayChildren ko seedha children se initialize karo —
  // pehli baar blank screen nahi aayegi
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const prevKey = useRef(location.key);

  useEffect(() => {
    // Same route pe dobara trigger mat karo
    if (prevKey.current === location.key) return;
    prevKey.current = location.key;

    // Phase 1: current page fade out
    setPhase("out");

    const outTimer = setTimeout(() => {
      // Phase 2: naya content set karo + fade in
      setDisplayChildren(children);
      setPhase("in");

      // Phase 3: animation done — idle
      const inTimer = setTimeout(() => setPhase("idle"), 150);
      return () => clearTimeout(inTimer);
    }, 120);

    return () => clearTimeout(outTimer);
  }, [location.key]); // children dependency hata di — ye hi race condition tha

  // Children update karo sirf jab koi transition nahi chal rahi
  // (same route pe data refresh hone pe — jaise scan complete)
  useEffect(() => {
    if (phase === "idle") {
      setDisplayChildren(children);
    }
  }, [children]); // phase dependency hata di

  return (
    <div style={{
      opacity: phase === "out" ? 0 : 1,
      transform: phase === "out" ? "translateY(4px)" : "translateY(0px)",
      transition: phase === "idle"
        ? "none"
        : "opacity 120ms cubic-bezier(0.4,0,0.2,1), transform 120ms cubic-bezier(0.4,0,0.2,1)",
      height: "100%",
      willChange: "opacity, transform",
    }}>
      {displayChildren}
    </div>
  );
}