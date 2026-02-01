import { useState } from "react";
import type { Workflow } from "./App";
import { createWorkflow } from "./App";

type Props = {
  workflows: Workflow[];
  onRun: (id: string) => void;
  onRefresh: () => void;
};

export function WorkflowList({ workflows, onRun, onRefresh }: Props) {
  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>Workflows</h2>
        <button
          type="button"
          onClick={onRefresh}
          style={{
            padding: "8px 12px",
            background: "#334155",
            color: "#e2e8f0",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>
      {workflows.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No workflows yet. Create one below.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {workflows.map((w) => (
            <li
              key={w.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#1e293b",
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <div>
                <strong>{w.name}</strong>
                {w.description && (
                  <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 14 }}>{w.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRun(w.id)}
                style={{
                  padding: "8px 16px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Run
              </button>
            </li>
          ))}
        </ul>
      )}
      <CreateWorkflowForm onCreated={onRefresh} />
    </section>
  );
}

function CreateWorkflowForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    createWorkflow({ name: name.trim(), description: description.trim() || undefined })
      .then(() => {
        setName("");
        setDescription("");
        onCreated();
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: 24,
        padding: 16,
        background: "#1e293b",
        borderRadius: 8,
      }}
    >
      <h3 style={{ fontSize: 16, marginTop: 0 }}>Create workflow</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
        <input
          type="text"
          placeholder="Workflow name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: 8,
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: 6,
            color: "#e2e8f0",
          }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: 8,
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: 6,
            color: "#e2e8f0",
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "8px 16px",
            background: "#059669",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}

