import { NextRequest, NextResponse } from "next/server";
import { classifyThought } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { thought } = await req.json();

    if (!thought || thought.trim().length === 0) {
      return NextResponse.json({ error: "No thought provided" }, { status: 400 });
    }

    const t = thought.trim();
    if (t.length < 8 || t.split(/\s+/).length < 3 || !/[aeiou]/i.test(t)) {
      return NextResponse.json({
        regions: [],
        explanation: "That's not quite enough to work with — try a full sentence about what you're thinking.",
        thought_type: "unclear",
      });
    }

    const result = await classifyThought(thought);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Classification error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Classification failed", detail: message }, { status: 500 });
  }
}
