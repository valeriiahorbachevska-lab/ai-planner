"use client";

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
        <span style={{
          background: task.priority === "must" ? "var(--badge-must-bg)" : "var(--badge-nice-bg)",
          color: task.priority === "must" ? "var(--badge-must-text)" : "var(--badge-nice-text)",
          fontSize: "11px",
          padding: "3px 8px",
          borderRadius: "6px",
          flexShrink: 0,
          fontWeight: 500,
        }}>
          {task.priority}
        </span>
      </div>

      <div style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "12px" }}>
        ⏱ {task.duration} хв &nbsp;·&nbsp; 📅 {formatDeadline(task.deadline)}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => { updateTask(task.id, { status: "today" }); onUpdate(); }}
          style={{
            flex: 1, padding: "9px 4px", background: "transparent",
            border: "0.5px solid var(--accent)", borderRadius: "8px",
            color: "var(--accent)", fontSize: "12px", cursor: "pointer", minHeight: "40px",
          }}
        >
          На сьогодні
        </button>
        <button
          onClick={() => onUpdate()}
          style={{
            flex: 1, padding: "9px 4px", background: "transparent",
            border: "0.5px solid #333", borderRadius: "8px",
            color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", minHeight: "40px",
          }}
        >
          Лишити
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
    </div>
  );
}
