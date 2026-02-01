import type { Execution } from "./App";

type Props = {
  executions: Execution[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  selectedExecution: Execution | null;
};

export function ExecutionLogs({ executions, selectedId, onSelect, selectedExecution }: Props) {
  if (executions.length === 0) {
    return <p style={{ color: "#94a3b8" }}>No executions yet. Run a workflow above.</p>;
  }

  const logs = selectedExecution?.logs ?? [];
  const hasLogs = Array.isArray(logs) && logs.length > 0;

  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 280px", minWidth: 0 }}>
        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>Click an execution to view logs.</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {executions.map((e) => (
            <li key={e.id} style={{ marginBottom: 6 }}>
              <button
                type="button"
                onClick={() => onSelect(selectedId === e.id ? null : e.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  background: selectedId === e.id ? "#334155" : "#1e293b",
                  color: "#e2e8f0",
                  border: "1px solid #334155",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontWeight: 500 }}>{e.status}</span>
                <span style={{ color: "#94a3b8", marginLeft: 8, fontSize: 13 }}>
                  {new Date(e.startedAt).toLocaleString()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          flex: "1 1 320px",
          minWidth: 0,
          padding: 16,
          background: "#1e293b",
          borderRadius: 8,
          fontFamily: "ui-monospace, monospace",
          fontSize: 13,
        }}
      >
        <h3 style={{ margin: "0 0 12px", fontSize: 14 }}>Execution status & logs</h3>
        {!selectedExecution ? (
          <p style={{ color: "#94a3b8" }}>Select an execution to see logs.</p>
        ) : (
          <>
            <p style={{ margin: "0 0 12px", color: "#94a3b8" }}>
              Status: <strong style={{ color: "#e2e8f0" }}>{selectedExecution.status}</strong>
              {selectedExecution.result && (
                <span style={{ display: "block", marginTop: 4 }}>{selectedExecution.result}</span>
              )}
            </p>
            {hasLogs ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {logs.map((entry, i) => (
                  <li
                    key={i}
                    style={{
                      padding: "4px 0",
                      borderBottom: "1px solid #334155",
                      color: entry.level === "error" ? "#fca5a5" : "#e2e8f0",
                    }}
                  >
                    <span style={{ color: "#64748b" }}>{entry.timestamp}</span> [{entry.level}] {entry.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#94a3b8" }}>No log entries.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
