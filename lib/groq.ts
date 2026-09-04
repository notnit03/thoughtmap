import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface ClassifyResult {
  regions: string[];
  explanation: string;
  thought_type: string;
}

const VALID = ["prefrontal_cortex","broca_area","wernicke_area","amygdala","hippocampus","anterior_cingulate","occipital_lobe","cerebellum"];

export async function classifyThought(thought: string): Promise<ClassifyResult> {
  const completion = await groq.chat.completions.create({
    model: "qwen/qwen3.8-27b",
    messages: [{
      role: "user",
      content: `A person thinks: "${thought}"

Which brain regions activate? You MUST pick 2-3 from ONLY this list:
- prefrontal_cortex: planning, decisions, reasoning, weighing options
- broca_area: SPEAKING or WRITING words out loud, producing language
- wernicke_area: understanding speech someone else is saying, comprehension
- amygdala: fear, anger, threat, strong emotion
- hippocampus: recalling a past memory or specific episode
- anterior_cingulate: conflict, doubt, second-guessing, focus under pressure
- occipital_lobe: seeing, picturing, imagining something visually
- cerebellum: MOVEMENT, balance, coordination, physical skill, dancing, sport

Match the actual content of the thought. A thought about physical movement or
balance uses cerebellum, NOT broca_area. Only pick broca_area if the person is
actually speaking or writing.

Reply ONLY with JSON, no other text:
{"regions":["region1","region2"],"explanation":"one sentence","thought_type":"emotional"}

thought_type: emotional, analytical, creative, memory, language, visual, or physical`,
    }],
    max_tokens: 200,
    temperature: 0.1,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || "";

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    parsed.regions = (parsed.regions || []).filter((r: string) => VALID.includes(r));

    // if no valid regions found, map common alternatives
    if (parsed.regions.length === 0) {
      if (raw.includes("reward") || raw.includes("striatum")) parsed.regions.push("anterior_cingulate");
      if (raw.includes("memory") || raw.includes("hippoc")) parsed.regions.push("hippocampus");
      if (raw.includes("emotion") || raw.includes("amygd")) parsed.regions.push("amygdala");
      if (raw.includes("visual") || raw.includes("occip")) parsed.regions.push("occipital_lobe");
      if (parsed.regions.length === 0) parsed.regions = ["prefrontal_cortex", "anterior_cingulate"];
    }

    return {
      regions: parsed.regions,
      explanation: parsed.explanation || "Neural activity detected.",
      thought_type: parsed.thought_type || "analytical",
    };
  } catch {
    return {
      regions: ["prefrontal_cortex", "anterior_cingulate"],
      explanation: "[fallback] The model did not return a usable classification.",
      thought_type: "analytical",
    };
  }
}
