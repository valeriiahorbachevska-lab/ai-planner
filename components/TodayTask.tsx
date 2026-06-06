"use client";

import { Task, Category } from "@/lib/types";
import { updateTask } from "@/lib/storage";

const CATEGORY_COLORS: Record<Category, string> = {
  "Work": "#4a90d9",
  "Personal": "#e07878",
  "Learning": "#9b7fe8",
  "Films/Books": "#c77dd9",
  "Other": "#5abfb0",
};
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TodayTaskProps {
  task: Task;
  onUpdate: () => void;
}

export default function TodayTask({ task, onUpdate }: TodayTaskProps) {
  const done = task.status === "done";

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, disabled: done });

  function toggle() {
    updateTask(task.id, { status: done ? "today" : "done" });
    onUpdate();
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : done ? 0.5 : 1,
        zIndex: isDragging ? 10 : "auto",
        background: "var(--bg-card)",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderLeft: task.priority === "must" ? "2px solid var(--accent)" : "2px solid transparent",
      }}
    >
      {!done && (
        <div
          {...attributes}
          {...listeners}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            color: "#444",
            fontSize: "16px",
            flexShrink: 0,
            touchAction: "none",
            padding: "2px 4px",
            lineHeight: 1,
          }}
          aria-label="Перетягнути"
        >
          ⠿
        </div>
      )}

      <button
        onClick={toggle}
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          border: done ? "none" : `1.5px solid ${task.priority === "must" ? "var(--accent)" : "#444"}`,
          background: done ? "var(--accent)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: "pointer",
          padding: 0,
        }}
        aria-label={done ? "Відмінити виконання" : "Відмітити виконаним"}
      >
        {done && <span style={{ color: "#fff", fontSize: "12px", lineHeight: 1 }}>✓</span>}
      </button>

      <div style={{ flex: 1, cursor: "pointer" }} onClick={toggle}>
        <div style={{
          color: done ? "var(--text-muted)" : "var(--text-primary)",
          fontSize: "15px",
          textDecoration: done ? "line-through" : "none",
          marginBottom: "3px",
          lineHeight: 1.4,
        }}>
          {task.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            ⏱ {task.duration} хв
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateTask(task.id, { priority: task.priority === "must" ? "nice" : "must" });
              onUpdate();
            }}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              color: task.priority === "must" ? "var(--badge-must-text)" : "var(--badge-nice-text)",
              fontSize: "12px", fontFamily: "inherit",
            }}
          >
            {task.priority}
          </button>
          {task.category && (
            <span style={{
              color: CATEGORY_COLORS[task.category] ?? "#888",
              fontSize: "12px", fontWeight: 500,
            }}>
              # {task.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
