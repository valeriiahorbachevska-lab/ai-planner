"use client";

import { useRef, useState } from "react";
import { Task, Category } from "@/lib/types";
import { updateTask, deleteTask } from "@/lib/storage";
import CalendarPicker from "@/components/CalendarPicker";

const CATEGORY_COLORS: Record<Category, string> = {
  "Work": "#4a90d9",
  "Personal": "#e07878",
  "Learning": "#9b7fe8",
  "Films/Books": "#c77dd9",
  "Other": "#5abfb0",
};

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

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
          ⏱ {task.duration} хв &nbsp;·&nbsp; 📅 {formatDeadline(task.deadline)}
        </span>
        {task.category && (
          <span style={{
            color: CATEGORY_COLORS[task.category] ?? "#888",
            fontSize: "12px",
            fontWeight: 500,
          }}>
            # {task.category}
          </span>
        )}
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
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {[0, 1, 2, 3].map((offset) => {
            const d = new Date();
            d.setDate(d.getDate() + offset);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            const label = offset === 0
              ? "Сьогодні"
              : offset === 1
              ? "Завтра"
              : d.toLocaleDateString("uk-UA", { weekday: "long", day: "numeric", month: "long" });

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (offset === 0) {
                    updateTask(task.id, { status: "today", deadline: "today" });
                  } else {
                    updateTask(task.id, { deadline: key });
                  }
                  setShowDateInput(false);
                  onUpdate();
                }}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "var(--bg-primary)",
                  border: "0.5px solid #333",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{label}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                  {d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowDateInput(false)}
            style={{
              width: "100%", padding: "10px",
              background: "transparent", border: "0.5px solid #2a2a2a",
              borderRadius: "10px", color: "var(--text-muted)",
              fontSize: "13px", cursor: "pointer",
            }}
          >
            Скасувати
          </button>
        </div>
      )}
    </div>
  );
}
