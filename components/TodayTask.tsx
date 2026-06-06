"use client";

import { Task } from "@/lib/types";
import { updateTask } from "@/lib/storage";

interface TodayTaskProps {
  task: Task;
  onUpdate: () => void;
}

export default function TodayTask({ task, onUpdate }: TodayTaskProps) {
  const done = task.status === "done";

  function toggle() {
    updateTask(task.id, { status: done ? "today" : "done" });
    onUpdate();
  }

  return (
    <div
      onClick={toggle}
      role="checkbox"
      aria-checked={done}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && toggle()}
      style={{
        background: "var(--bg-card)",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        cursor: "pointer",
        borderLeft: task.priority === "must" ? "2px solid var(--accent)" : "2px solid transparent",
        opacity: done ? 0.5 : 1,
        transition: "opacity 0.15s",
      }}
    >
      <div style={{
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        border: done ? "none" : `1.5px solid ${task.priority === "must" ? "var(--accent)" : "#444"}`,
        background: done ? "var(--accent)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {done && <span style={{ color: "#fff", fontSize: "12px", lineHeight: 1 }}>✓</span>}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          color: done ? "var(--text-muted)" : "var(--text-primary)",
          fontSize: "15px",
          textDecoration: done ? "line-through" : "none",
          marginBottom: "3px",
          lineHeight: 1.4,
        }}>
          {task.title}
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
          ⏱ {task.duration} хв &nbsp;·&nbsp;
          <span style={{
            color: task.priority === "must" ? "var(--badge-must-text)" : "var(--badge-nice-text)",
          }}>
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
}
