"use client";

import { useState, Suspense, lazy } from "react";
import Sidebar from "@/components/Sidebar";
import { BrainRegion } from "@/lib/regionMap";
import { ClassifyResult } from "@/lib/groq";

const Brain = lazy(() => import("@/components/Brain"));

const EXAMPLES = [
  "I feel anxious about tomorrow",
  "I remember my childhood home",
  "I am solving a math problem",
  "I hear my favorite song",
  "I want to eat something sweet",
  "I am imagining a sunset",
];

export default function Home() {
  const [thought, setThought] = useState("");
  const [result, setResult] = useState<ClassifyResult | null>(null);
  const [activeRegions, setActiveRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!thought.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setActiveRegions([]);
    setSelectedRegion(null);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thought }),
      });
      if (!res.ok) throw new Error("Failed");
      const data: ClassifyResult = await res.json();
      setResult(data);
      setActiveRegions(data.regions);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleRegionClick(region: BrainRegion) {
    setSelectedRegion(prev => prev?.id === region.id ? null : region);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020c1b", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", borderBottom: "1px solid #0d2d4a", background: "rgba(2,12,27,0.95)", backdropFilter: "blur(12px)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #00b4ff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(0,180,255,0.4)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00b4ff", boxShadow: "0 0 10px #00b4ff" }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1, color: "#e0f4ff" }}>
            Thought<span style={{ color: "#00b4ff" }}>Map</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#4a8aaa" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px rgba(0,255,136,0.6)" }} />
          Neural simulation active
        </div>
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 64px)" }}>

        {/* Left panel */}
        <aside style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20, padding: 24, borderRight: "1px solid #0d2d4a", background: "rgba(5,15,35,0.8)", overflowY: "auto" }}>
          <div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#2a6a8a", marginBottom: 10 }}>Thought Input</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#e0f4ff", lineHeight: 1.3, marginBottom: 6, margin: "0 0 6px" }}>Visualize a thought.</h1>
            <p style={{ fontSize: 13, color: "#4a8aaa", lineHeight: 1.6, margin: 0 }}>Type a thought and watch your brain activate in real time.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <textarea
              value={thought}
              onChange={e => setThought(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSubmit()}
              placeholder="e.g. I remember my childhood home..."
              rows={4}
              maxLength={280}
              style={{ width: "100%", background: "rgba(0,180,255,0.05)", border: "1px solid #0d3d5a", borderRadius: 12, padding: "12px 14px", color: "#c0e8ff", fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ fontSize: 10, color: thought.length > 250 ? "#ff8866" : "#2a5a7a", textAlign: "right" }}>
              {thought.length}/280
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !thought.trim()}
              style={{ padding: "12px", borderRadius: 10, background: isLoading || !thought.trim() ? "#0a2a3a" : "#0070aa", color: isLoading || !thought.trim() ? "#2a5a7a" : "#fff", fontSize: 13, fontWeight: 700, border: "1px solid #00b4ff", cursor: isLoading || !thought.trim() ? "not-allowed" : "pointer", letterSpacing: 1, boxShadow: isLoading || !thought.trim() ? "none" : "0 0 20px rgba(0,180,255,0.3)" }}
            >
              {isLoading ? "SCANNING..." : "TRACE THOUGHT →"}
            </button>
            {error && <p style={{ fontSize: 12, color: "#ff4466", textAlign: "center", margin: 0 }}>{error}</p>}
          </div>

          <div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#2a6a8a", marginBottom: 10 }}>Try an example</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => setThought(ex)}
                  style={{ textAlign: "left", padding: "8px 12px", borderRadius: 8, background: "rgba(0,180,255,0.04)", border: "1px solid #0d2d4a", color: "#4a8aaa", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Brain canvas */}
        <main style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at center, #041428 0%, #020c1b 70%)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#2a5a7a", whiteSpace: "nowrap" }}>
            Cortical Activity Map
          </div>
          <div style={{ width: "100%", height: "100%" }}>
            <Suspense fallback={<div style={{ color: "#2a6a8a", textAlign: "center", marginTop: 100 }}>Loading...</div>}>
              <Brain activeRegions={activeRegions} onRegionClick={handleRegionClick} />
            </Suspense>
          </div>
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 24, fontSize: 10, color: "#2a6a8a" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00b4ff", boxShadow: "0 0 6px #00b4ff" }} />
              Active region
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff69b4", boxShadow: "0 0 6px #ff69b4" }} />
              Neural pathway
            </div>
          </div>
        </main>

        {/* Right sidebar */}
        <aside style={{ width: 280, flexShrink: 0, padding: "24px 18px", borderLeft: "1px solid #0d2d4a", background: "rgba(5,15,35,0.8)", overflowY: "auto" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#2a6a8a", marginBottom: 16 }}>Neural Activity</div>
          <Sidebar result={result} selectedRegion={selectedRegion} isLoading={isLoading} thought={thought} />
        </aside>
      </div>
    </div>
  );
}
