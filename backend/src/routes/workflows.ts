/**
 * FlowSync workflow REST routes (learning project).
 * create workflow, list workflows, run workflow.
 */
import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { workflows as workflowsTable } from "../db/schema.js";
import { executions as executionsTable } from "../db/schema.js";
import { getWorkflowSummary } from "../llm.js";
import { v4 as uuid } from "uuid";

const router = Router();

// List all workflows
router.get("/", async (_req, res) => {
  try {
    const list = await db.select().from(workflowsTable).orderBy(desc(workflowsTable.updatedAt));
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Create workflow
router.post("/", async (req, res) => {
  try {
    const { name, description, definition } = req.body;
    if (!name || typeof name !== "string") {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const id = uuid();
    await db.insert(workflowsTable).values({
      id,
      name: name.trim(),
      description: typeof description === "string" ? description : null,
      definition: definition && typeof definition === "object" ? definition : {},
    });
    const [row] = await db.select().from(workflowsTable).where(eq(workflowsTable.id, id));
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Get one workflow (optional: with AI summary)
router.get("/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(workflowsTable).where(eq(workflowsTable.id, req.params.id));
    if (!row) {
      res.status(404).json({ error: "Workflow not found" });
      return;
    }
    const summary = await getWorkflowSummary(row.name, row.description);
    res.json({ ...row, summary });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Run workflow (simplified: creates execution and appends logs)
router.post("/:id/run", async (req, res) => {
  try {
    const [workflow] = await db.select().from(workflowsTable).where(eq(workflowsTable.id, req.params.id));
    if (!workflow) {
      res.status(404).json({ error: "Workflow not found" });
      return;
    }
    const executionId = uuid();
    const now = new Date();
    const logEntry = (level: string, message: string) => ({
      level,
      message,
      timestamp: new Date().toISOString(),
    });
    const logs = [
      logEntry("info", `Started workflow: ${workflow.name}`),
      logEntry("info", "Processing steps..."),
    ];
    await db.insert(executionsTable).values({
      id: executionId,
      workflowId: workflow.id,
      status: "running",
      startedAt: now,
      logs,
    });
    // Simulate minimal processing (learning project: no real agent pipeline)
    await new Promise((r) => setTimeout(r, 500));
    const completedLogs = [
      ...logs,
      logEntry("info", "Steps completed."),
      logEntry("info", "Workflow run finished."),
    ];
    await db
      .update(executionsTable)
      .set({
        status: "completed",
        endedAt: new Date(),
        logs: completedLogs,
        result: "Run completed successfully.",
      })
      .where(eq(executionsTable.id, executionId));
    const [execution] = await db.select().from(executionsTable).where(eq(executionsTable.id, executionId));
    res.status(201).json(execution);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
