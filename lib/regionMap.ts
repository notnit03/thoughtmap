export interface BrainRegion {
  id: string;
  displayName: string;
  meshName: string;
  color: string;
  position: [number, number, number];
  description: string;
  functions: string[];
}

export const brainRegions: Record<string, BrainRegion> = {
  prefrontal_cortex: {
    id: "prefrontal_cortex",
    displayName: "Prefrontal Cortex",
    meshName: "prefrontal",
    color: "#a78bfa",
    position: [0, 1.2, 1.8],
    description: "The CEO of your brain — handles planning, decisions, and complex thought.",
    functions: ["decision making", "planning", "reasoning", "logic", "problem solving", "focus"],
  },
  broca_area: {
    id: "broca_area",
    displayName: "Broca's Area",
    meshName: "broca",
    color: "#34d399",
    position: [-1.5, 0.5, 1.0],
    description: "Controls speech production and language processing.",
    functions: ["language", "speaking", "writing", "words", "grammar", "communication"],
  },
  wernicke_area: {
    id: "wernicke_area",
    displayName: "Wernicke's Area",
    meshName: "wernicke",
    color: "#60a5fa",
    position: [-1.8, 0.2, 0.2],
    description: "Responsible for understanding language and comprehension.",
    functions: ["reading", "listening", "understanding", "comprehension", "meaning"],
  },
  amygdala: {
    id: "amygdala",
    displayName: "Amygdala",
    meshName: "amygdala",
    color: "#f87171",
    position: [-1.0, -0.5, 0.3],
    description: "The brain's emotional alarm system — processes fear, anxiety, and strong emotions.",
    functions: ["fear", "anxiety", "anger", "stress", "emotion", "worry", "excitement"],
  },
  hippocampus: {
    id: "hippocampus",
    displayName: "Hippocampus",
    meshName: "hippocampus",
    color: "#fbbf24",
    position: [-1.2, -0.8, 0.0],
    description: "Your memory hub — converts short-term memories into long-term ones.",
    functions: ["memory", "remembering", "past", "nostalgia", "learning", "recall"],
  },
  anterior_cingulate: {
    id: "anterior_cingulate",
    displayName: "Anterior Cingulate Cortex",
    meshName: "cingulate",
    color: "#f472b6",
    position: [0, 0.8, 0.8],
    description: "Monitors conflicts, errors, and helps with emotional regulation.",
    functions: ["conflict", "multitasking", "attention", "motivation", "doubt", "focus"],
  },
  occipital_lobe: {
    id: "occipital_lobe",
    displayName: "Occipital Lobe",
    meshName: "occipital",
    color: "#fb923c",
    position: [0, 0.2, -2.0],
    description: "Your visual processing center — handles everything you see or imagine.",
    functions: ["visualizing", "imagining", "colors", "shapes", "seeing", "pictures", "dreams"],
  },
  cerebellum: {
    id: "cerebellum",
    displayName: "Cerebellum",
    meshName: "cerebellum",
    color: "#2dd4bf",
    position: [0, -1.5, -1.5],
    description: "Coordinates movement, balance, and fine motor skills.",
    functions: ["movement", "balance", "coordination", "rhythm", "music", "dancing", "sport"],
  },
};

export const regionIds = Object.keys(brainRegions);
