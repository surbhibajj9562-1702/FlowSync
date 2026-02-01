/**
 * Simple LLM helpers for FlowSync (learning project).
 * Used only for: workflow summaries and basic execution insights.
 */
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function getWorkflowSummary(name: string, description?: string | null): Promise<string> {
  if (!openai) {
    return `Workflow: ${name}. ${description || "No description."}`;
  }
  try {
    const res = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `In one short sentence, summarize this workflow for a beginner. Name: ${name}. ${description ? `Description: ${description}` : ""}`,
        },
      ],
      max_tokens: 80,
    });
    return res.choices[0]?.message?.content?.trim() || `${name}: ${description || "No summary."}`;
  } catch {
    return `${name}. ${description || ""}`;
  }
}

export async function getExecutionInsight(
  workflowName: string,
  status: string,
  logCount: number
): Promise<string> {
  if (!openai) {
    return `Workflow "${workflowName}" finished with status: ${status}. Log entries: ${logCount}.`;
  }
  try {
    const res = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `In one short supportive sentence, give a simple insight about this run. Workflow: ${workflowName}. Status: ${status}. Number of log entries: ${logCount}. Keep it beginner-friendly.`,
        },
      ],
      max_tokens: 60,
    });
    return res.choices[0]?.message?.content?.trim() || `Run completed: ${status}.`;
  } catch {
    return `Run completed with status: ${status}.`;
  }
}
