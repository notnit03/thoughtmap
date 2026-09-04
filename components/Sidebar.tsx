"use client";

import { brainRegions, BrainRegion } from "@/lib/regionMap";
import { ClassifyResult } from "@/lib/groq";

interface SidebarProps {
  result: ClassifyResult | null;
  selectedRegion: BrainRegion | null;
  isLoading: boolean;
  thought: string;
}

export default function Sidebar({ result, selectedRegion, isLoading, thought }: SidebarProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 11, color: "#2a6a8a" }}>Scanning neural pathways...</div>
          {[85, 65, 75].map((w, i) => (
            <div key={i} style={{ height: 8, borderRadius: 4, width: `${w}%`, background: "#0d2d4a", animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      )}

      {result && !isLoading && (
        <>
          <div style={{ background: "rgba(0,180,255,0.06)", border: "1px solid #0d3d5a", borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: "#2a6a8a", marginBottom: 6 }}>Your thought</div>
            <p style={{ fontSize: 12, color: "#80c8e8", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{thought}"</p>
          </div>

          <div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: "#2a6a8a", marginBottom: 8 }}>Thought type</div>
            <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "capitalize", background: "rgba(0,180,255,0.1)", color: "#00b4ff", border: "1px solid #0d4d6a" }}>
              {result.thought_type}
            </span>
          </div>

          <div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: "#2a6a8a", marginBottom: 8 }}>What's happening</div>
            <p style={{ fontSize: 12, color: "#80c8e8", lineHeight: 1.6, margin: 0 }}>{result.explanation}</p>
          </div>

          <div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: "#2a6a8a", marginBottom: 10 }}>Active regions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.regions.map(id => {
                const region = brainRegions[id];
                if (!region) return null;
                return (
                  <div key={id} style={{ background: "rgba(5,20,40,0.8)", border: `1px solid ${region.color}44`, borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: region.color, boxShadow: `0 0 8px ${region.color}`, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: region.color }}>{region.displayName}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "#4a8aaa", lineHeight: 1.5, margin: "0 0 8px" }}>{region.description}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {region.functions.slice(0, 3).map(fn => (
                        <span key={fn} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: `${region.color}18`, color: region.color, border: `1px solid ${region.color}33` }}>
                          {fn}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p style={{ fontSize: 10, color: "#2a4a5a", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
            * Simulated cortical activity based on neuroscience research, not real neuroimaging data.
          </p>
        </>
      )}

      {!result && !isLoading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", paddingTop: 20 }}>
          <div style={{ fontSize: 36 }}>🧠</div>
          <p style={{ fontSize: 12, color: "#2a6a8a", lineHeight: 1.6, margin: 0 }}>
            Type any thought and watch the cortical regions activate in real time.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
            {["I feel anxious", "I remember my childhood", "Solving a puzzle"].map(ex => (
              <div key={ex} style={{ fontSize: 11, padding: "8px 10px", borderRadius: 8, background: "rgba(0,180,255,0.04)", border: "1px solid #0d2d4a", color: "#2a6a8a", textAlign: "left" }}>
                "{ex}"
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
