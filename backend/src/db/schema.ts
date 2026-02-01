/**
 * FlowSync database schema (learning project).
 * Minimal tables: workflows and executions.
 */
import { pgTable, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

export const workflows = pgTable("workflows", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  // Simple JSON definition (e.g. steps or config for learning)
  definition: jsonb("definition").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const executions = pgTable("executions", {
  id: text("id").primaryKey(),
  workflowId: text("workflow_id")
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"), // pending | running | completed | failed
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  // Log entries for this run (array of { level, message, timestamp })
  logs: jsonb("logs").default([]),
  // Optional: result or error message
  result: text("result"),
  error: text("error"),
});

export type Workflow = typeof workflows.$inferSelect;
export type NewWorkflow = typeof workflows.$inferInsert;
export type Execution = typeof executions.$inferSelect;
export type NewExecution = typeof executions.$inferInsert;
