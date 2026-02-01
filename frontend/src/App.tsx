import { useState, useEffect } from "react";
import { WorkflowList } from "./WorkflowList";
import { ExecutionLogs } from "./ExecutionLogs";

export type Workflow = {
  id: string;
  name: string;
  description: string | null;
  definition: unknown;
  createdAt: string;
  updatedAt: string;
};

export type Execution = {
  id: string;
  workflowId: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  logs: Array<{ level: string; message: string; timestamp: string }>;
  result: string | null;
  error: string | null;
};

const API = "/api";

export function getWorkflows(): Promise<Workflow[]> {
  return fetch(`${API}/workflows`).then((r) =>
    r.ok ? r.json() : Promise.reject(new Error("Failed to load workflows"))
  );
}

export function createWorkflow(body: { name: string; description?: string }) {
  return fetch(`${API}/workflows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) =>
    r.ok ? r.json() : Promise.reject(new Error("Failed to create workflow"))
  );
}

export function runWorkflow(id: string): Promise<Execution> {
  return fetch(`${API}/workflows/${id}/run`, { method: "POST" }).then((r) =>
    r.ok ? r.json() : Promise.reject(new Error("Failed to run workflow"))
  );
}

export function getExecutions(workflowId?: string): Promise<Execution[]> {
  const url = workflowId
    ? `${API}/executions?workflowId=${workflowId}`
    : `${API}/executions`;
  return fetch(url).then((r) =>
    r.ok ? r.json() : Promise.reject(new Error("Failed to load executions"))
  );
}

export function getExecution(id: string): Promise<Execution & { insight?: string }> {
  return fetch(`${API}/executions/${id}`).then((r) =>
    r.ok ? r.json() : Promise.reject(new Error("Failed to load execution"))
  );
}

export default function App() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([getWorkflows(), getExecutions()])
      .then(([w, e]) => {
        setWorkflows(w);
        setExecutions(e);
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleRun = async (workflowId: string) => {
    setError(null);
    try {
      const exec = await runWorkflow(workflowId);
      setExecutions((prev) => [exec, ...prev]);
      setSelectedExecutionId(exec.id);
    } catch (err) {
      setError(String(err));
    }
  };

  const selectedExecution = selectedExecutionId
    ? executions.find((e) => e.id === selectedExecutionId) ?? null
    : null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>FlowSync</h1>
        <p style={{ color: "#94a3b8", marginTop: 4 }}>
          AI-driven workflow automation — view, trigger, and monitor workflows (learning project).
        </p>
      </header>

      {error && (
        <div
          style={{
            padding: 12,
            background: "#7f1d1d",
            color: "#fecaca",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <WorkflowList workflows={workflows} onRun={handleRun} onRefresh={load} />
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Executions</h2>
            <ExecutionLogs
              executions={executions}
              selectedId={selectedExecutionId}
              onSelect={setSelectedExecutionId}
              selectedExecution={selectedExecution}
            />
          </section>
        </>
      )}
    </div>
  );
}
