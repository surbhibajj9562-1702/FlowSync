/**
 * FlowSync execution REST routes (learning project).
 * list executions, fetch execution logs.
 */
import { Router } from "express";
import { db } from "../db/index.js";
import { executions as executionsTable } from "../db/schema.js";
import { workflows as workflowsTable } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { getExecutionInsight } from "../llm.js";

const router = Router();

// List executions (optionally by workflow id)
router.get("/", async (req, res) => {
  try {
    const workflowId = req.query.workflowId as string | undefined;
    const list = workflowId
      ? await db
          .select()
          .from(executionsTable)
          .where(eq(executionsTable.workflowId, workflowId))
          .orderBy(desc(executionsTable.startedAt))
      : await db.select().from(executionsTable).orderBy(desc(executionsTable.startedAt));
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Get one execution with logs and optional AI insight
router.get("/:id", async (req, res) => {
  try {
    const [exec] = await db.select().from(executionsTable).where(eq(executionsTable.id, req.params.id));
    if (!exec) {
      res.status(404).json({ error: "Execution not found" });
      return;
    }
    const [workflow] = await db.select().from(workflowsTable).where(eq(workflowsTable.id, exec.workflowId));
    const logCount = Array.isArray(exec.logs) ? exec.logs.length : 0;
    const insight = await getExecutionInsight(workflow?.name ?? "Unknown", exec.status, logCount);
    res.json({ ...exec, insight });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
