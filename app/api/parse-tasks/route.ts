import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { PARSE_TASKS_PROMPT } from "@/lib/prompts";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `${PARSE_TASKS_PROMPT}\n\nBrain dump:\n${text.trim()}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const cleaned = content.text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const tasks = JSON.parse(cleaned);

    if (!Array.isArray(tasks)) {
      throw new Error("Claude response is not a JSON array");
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[parse-tasks] error:", error);
    return NextResponse.json({ error: "Failed to parse tasks" }, { status: 500 });
  }
}
