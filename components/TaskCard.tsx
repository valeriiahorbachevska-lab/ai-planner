"use client";

import { useRef, useState } from "react";
import { Task } from "@/lib/types";
import { updateTask, deleteTask } from "@/lib/storage";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

const DEADLINE_LABELS: Record<string, string> = {
  today: "сьогодні",
  flexible: "гнучко",
};

function formatDeadline(deadline: string): string {
  return DEADLINE_LABELS[deadline] ?? deadline;
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [showDateInput, setShowDateInput] = useState(false);

  function handleDateSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const date = e.target.value;
    if (!date) return;
    const today = new Date().toISOString().split("T")[0];
    if (date === today) {
      updateTask(task.id, { status: "today", deadline: "today" });
    } else {
      updateTask(task.id, { deadline: date });
    }
    setShowDateInput(false);
    onUpdate();
  }

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "12px",
      padding: "14px 16px",
      marginBottom: "10px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
        <span style={{ color: "var(--text-primary)", fontSize: "15px", flex: 1, marginRight: "10px", lineHeight: 1.4 }}>
          {task.title}
        </span>
        <button
          onClick={() => {
            updateTask(task.id, { priority: task.priority === "must" ? "nice" : "must" });
            onUpdate();
          }}
          title="Натисни щоб змінити пріоритет"
          style={{
            background: task.priority === "must" ? "var(--badge-must-bg)" : "var(--badge-nice-bg)",
            color: task.priority === "must" ? "var(--badge-must-text)" : "var(--badge-nice-text)",
            fontSize: "11px",
            padding: "3px 8px",
            borderRadius: "6px",
            flexShrink: 0,
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          {task.priority}
        </button>
      </div>

      <div style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "12px" }}>
        ⏱ {task.duration} хв &nbsp;·&nbsp; 📅 {formatDeadline(task.deadline)}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => { updateTask(task.id, { status: "today", deadline: "today" }); onUpdate(); }}
          style={{
            flex: 1, padding: "9px 4px", background: "transparent",
            border: "0.5px solid var(--accent)", borderRadius: "8px",
            color: "var(--accent)", fontSize: "12px", cursor: "pointer", minHeight: "40px",
          }}
        >
          На сьогодні
        </button>

        <button
          onClick={() => setShowDateInput(!showDateInput)}
          style={{
            flex: 1, padding: "9px 4px", background: showDateInput ? "#2a2a2a" : "transparent",
            border: "0.5px solid #444", borderRadius: "8px",
            color: "var(--text-primary)", fontSize: "12px", cursor: "pointer", minHeight: "40px",
          }}
        >
          📅 На дату
        </button>

        <button
          onClick={() => { deleteTask(task.id); onUpdate(); }}
          style={{
            flex: 1, padding: "9px 4px", background: "transparent",
            border: "0.5px solid #333", borderRadius: "8px",
            color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", minHeight: "40px",
          }}
        >
          Видалити
        </button>
      </div>

      {showDateInput && (
        <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i + 1);
            const key = d.toISOString().split("T")[0];
            const label = i === 0
              ? "Завтра"
              : d.toLocaleDateString("uk-UA", { weekday: "short", day: "numeric", month: "short" });
            return (
              <button
                key={key}
                onClick={() => {
                  updateTask(task.id, { deadline: key });
                  setShowDateInput(false);
                  onUpdate();
                }}
                style={{
                  padding: "7px 12px",
                  background: "#222",
                  border: "0.5px solid #444",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  fontSize: "12px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
