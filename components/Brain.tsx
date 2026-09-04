"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BrainRegion, brainRegions } from "@/lib/regionMap";

interface BrainProps {
  activeRegions: string[];
  onRegionClick: (region: BrainRegion) => void;
}

type Coord = { x: number; y: number; lx: number; ly: number };

const COORDS_LEFT: Record<string, Coord> = {
  prefrontal_cortex:  { x: 290, y: 190, lx: 20,  ly: 120 },
  anterior_cingulate: { x: 400, y: 115, lx: 20,  ly: 60  },
  broca_area:         { x: 360, y: 300, lx: 20,  ly: 300 },
  wernicke_area:      { x: 600, y: 300, lx: 840, ly: 150 },
  amygdala:           { x: 430, y: 330, lx: 20,  ly: 380 },
  hippocampus:        { x: 495, y: 340, lx: 20,  ly: 440 },
  occipital_lobe:     { x: 760, y: 275, lx: 840, ly: 220 },
  cerebellum:         { x: 660, y: 445, lx: 840, ly: 470 },
};

const COORDS_RIGHT: Record<string, Coord> = {
  prefrontal_cortex:  { x: 730, y: 190, lx: 840, ly: 120 },
  anterior_cingulate: { x: 620, y: 115, lx: 840, ly: 60  },
  broca_area:         { x: 660, y: 300, lx: 840, ly: 300 },
  wernicke_area:      { x: 420, y: 300, lx: 20,  ly: 150 },
  amygdala:           { x: 590, y: 330, lx: 840, ly: 380 },
  hippocampus:        { x: 525, y: 340, lx: 840, ly: 440 },
  occipital_lobe:     { x: 260, y: 275, lx: 20,  ly: 220 },
  cerebellum:         { x: 360, y: 445, lx: 20,  ly: 470 },
};

const COORDS_FRONT: Record<string, Coord> = {
  prefrontal_cortex:  { x: 600, y: 180, lx: 830, ly: 120 },
  anterior_cingulate: { x: 495, y: 240, lx: 830, ly: 210 },
};

const COORDS_REAR: Record<string, Coord> = {
  occipital_lobe:     { x: 620, y: 290, lx: 30,  ly: 240 },
  cerebellum:         { x: 650, y: 440, lx: 30,  ly: 470 },
  amygdala:           { x: 540, y: 340, lx: 30,  ly: 340 },
  hippocampus:        { x: 1150, y: 340, lx: 1180, ly: 400 },
  wernicke_area:      { x: 1120, y: 300, lx: 1180, ly: 250 },
};

const NEON = "#00b4ff";

const FRAMES: { src: string; name: string; coords: Record<string, Coord> }[] = [
  { src: "/brain-left.png",  name: "left",  coords: COORDS_LEFT  },
  { src: "/brain/front.png", name: "front", coords: COORDS_FRONT },
  { src: "/brain-right.png", name: "right", coords: COORDS_RIGHT },
  { src: "/brain/rear.png",  name: "rear",  coords: COORDS_REAR  },
];

const PRIORITY = [0, 2, 3, 1];

function bestFrame(active: string[]): number {
  let best = 0, bestScore = -1;
  for (const i of PRIORITY) {
    const score = active.filter(id => FRAMES[i].coords[id]).length;
    if (score > bestScore) { bestScore = score; best = i; }
  }
  return best;
}

const DRAG_PER_FRAME = 55;

export default function Brain({ activeRegions, onRegionClick }: BrainProps) {
  const [tick, setTick] = useState(0);
  const [pulsingIndex, setPulsingIndex] = useState(0);
  const [frame, setFrame] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startFrame: 0 });

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!activeRegions.length) return;
    setPulsingIndex(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i >= activeRegions.length) { clearInterval(id); return; }
      setPulsingIndex(i);
    }, 600);
    return () => clearInterval(id);
  }, [activeRegions]);

  const hasActive = activeRegions.length > 0;

  useEffect(() => {
    if (hasActive) setFrame(bestFrame(activeRegions));
  }, [hasActive, activeRegions]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    dragRef.current = { startX: e.clientX, startFrame: frame };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [frame]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const steps = Math.round(dx / DRAG_PER_FRAME);
    const n = FRAMES.length;
    setFrame(((dragRef.current.startFrame + steps) % n + n) % n);
  }, [dragging]);

  const endDrag = useCallback(() => setDragging(false), []);

  const pulseValue = Math.sin(tick * 0.15) * 0.5 + 0.5;
  const coords = FRAMES[frame].coords;
  const visible = coords ? activeRegions.filter(id => coords[id]) : [];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative w-full h-full"
        style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {FRAMES.map((f, i) => (
          <img
            key={f.src}
            src={f.src}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain"
            style={{ opacity: i === frame ? 1 : 0, userSelect: "none", pointerEvents: "none" }}
          />
        ))}
        {visible.length > 0 && coords && (
          <svg
            viewBox="0 0 1000 800"
            className="absolute inset-0 w-full h-full"
            style={{ opacity: dragging ? 0 : 1, transition: "opacity .15s" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {visible.length > 1 && visible.map((id, i) => {
              if (i === 0) return null;
              const from = coords[visible[0]];
              const to = coords[id];
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2 - 50;
              return (
                <path key={`conn-${id}`}
                  d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                  fill="none" stroke={NEON} strokeWidth="3"
                  strokeDasharray="8,5"
                  opacity={0.45 + pulseValue * 0.4}
                  strokeLinecap="round" />
              );
            })}

            {visible.map((regionId) => {
              const region = brainRegions[regionId];
              const coord = coords[regionId];
              if (!region) return null;
              const isPulsing = activeRegions[pulsingIndex] === regionId;
              const dotR = isPulsing ? 12 + pulseValue * 5 : 12;
              const haloR = isPulsing ? 28 + pulseValue * 14 : 22;
              const isLeft = coord.lx < 400;

              return (
                <g key={regionId} style={{ cursor: "pointer" }} onClick={() => onRegionClick(region)}>
                  <circle cx={coord.x} cy={coord.y} r={haloR}
                    fill={NEON} opacity={0.25 + pulseValue * 0.2} />
                  <circle cx={coord.x} cy={coord.y} r={dotR}
                    fill={NEON} stroke="white" strokeWidth="2.5"
                    style={{ filter: `drop-shadow(0 0 10px ${NEON})` }} />
                  <line
                    x1={coord.x} y1={coord.y}
                    x2={isLeft ? coord.lx + 138 : coord.lx}
                    y2={coord.ly}
                    stroke={NEON} strokeWidth="1.8"
                    strokeDasharray="5,3" opacity="0.85" />
                  <rect
                    x={coord.lx} y={coord.ly - 14}
                    width="138" height="26" rx="13"
                    fill="rgba(5,5,20,0.88)"
                    stroke={NEON} strokeWidth="1.8" />
                  <text
                    x={coord.lx + 69} y={coord.ly + 5}
                    textAnchor="middle" fontSize="12"
                    fontFamily="system-ui, sans-serif" fontWeight="700"
                    fill={NEON}
                    style={{ filter: `drop-shadow(0 0 4px ${NEON})` }}>
                    {region.displayName}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        <div style={{
          position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
          fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
          color: "#2a5a7a", pointerEvents: "none", whiteSpace: "nowrap",
        }}>
          drag to rotate
        </div>
      </div>
    </div>
  );
}
