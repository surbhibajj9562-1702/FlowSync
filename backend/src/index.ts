/**
 * FlowSync — AI-Driven Workflow Automation Platform (learning project).
 * Node.js REST API: workflows and executions.
 */
import express from "express";
import cors from "cors";
import workflowsRouter from "./routes/workflows.js";
import executionsRouter from "./routes/executions.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 4000;

app.get("/health", (_req, res) => res.json({ status: "ok", name: "FlowSync API" }));

app.use("/api/workflows", workflowsRouter);
app.use("/api/executions", executionsRouter);

app.listen(PORT, () => {
  console.log(`FlowSync API running at http://localhost:${PORT}`);
});
