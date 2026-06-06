"use client";

import { useState, useEffect } from "react";
import { getTasks } from "@/lib/storage";
import { Task } from "@/lib/types";

const UK_DAYS = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const UK_MONTHS = ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"];

function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDayLabel(date: Date, index: number): string {
  const day = date.getDate();
  const month = UK_MONTHS[date.getMonth()];
  if (index === 0) return `Сьогодні, ${day} ${month}`;
  if (index === 1) return `Завтра, ${day} ${month}`;
  return `${UK_DAYS[date.getDay()]}, ${day} ${month}`;
}

export default function WeekPage() {
  const [tasksByDay, setTasksByDay] = useState<Map<string, Task[]>>(new Map());
  const [flexible, setFlexible] = useState<Task[]>([]);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = toDateKey(today);

    const next7: Date[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
    setDays(next7);

    const tasks = getTasks().filter(
      (t) => t.status === "inbox" || t.status === "today" || t.status === "done"
    );

    const map = new Map<string, Task[]>();
    next7.forEach((d) => map.set(toDateKey(d), []));

    const flexibleTasks: Task[] = [];

    tasks.forEach((task) => {
      if (task.deadline === "today" || task.status === "today" || task.status === "done") {
        const list = map.get(todayKey) || [];
        list.push(task);
        map.set(todayKey, list);
      } else if (task.deadline === "flexible") {
        flexibleTasks.push(task);
      } else {
        const key = task.deadline;
        if (map.has(key)) {
          const list = map.get(key) || [];
          list.push(task);
          map.set(key, list);
        } else {
          flexibleTasks.push(task);
        }
      }
    });

    setTasksByDay(map);
    setFlexible(flexibleTasks);
  }, []);

  return (
    <main style={{ padding: "24px 16px" }}>
      <h1 style={{ color: "var(--text-primary)", fontSize: "22px", fontWeight: 500, margin: "0 0 20px" }}>
        Тиждень
      </h1>

      {days.map((day, index) => {
        const key = toDateKey(day);
        const dayTasks = tasksByDay.get(key) || [];
        const isToday = index === 0;

        return (
          <div key={key} style={{ marginBottom: "20px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}>
              <span style={{
                color: isToday ? "var(--accent)" : "var(--text-muted)",
                fontSize: "13px",
                fontWeight: isToday ? 500 : 400,
              }}>
                {formatDayLabel(day, index)}
              </span>
              {dayTasks.length > 0 && (
                <span style={{
                  background: isToday ? "var(--badge-must-bg)" : "#1a1a1a",
                  color: isToday ? "var(--accent)" : "var(--text-muted)",
                  fontSize: "11px",
                  padding: "2px 7px",
                  borderRadius: "10px",
                }}>
                  {dayTasks.length}
                </span>
              )}
              <div style={{ flex: 1, height: "0.5px", background: "#2a2a2a" }} />
            </div>

            {dayTasks.length === 0 ? (
              <div style={{
                color: "#333",
                fontSize: "13px",
                padding: "8px 0",
                fontStyle: "italic",
              }}>
                Вільний день
              </div>
            ) : (
              dayTasks.map((task) => (
                <div key={task.id} style={{
                  background: "var(--bg-card)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  marginBottom: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: task.status === "done" ? 0.4 : 1,
                  borderLeft: task.priority === "must" ? "2px solid var(--accent)" : "2px solid transparent",
                }}>
                  <span style={{
                    color: task.status === "done" ? "var(--text-muted)" : "var(--text-primary)",
                    fontSize: "14px",
                    textDecoration: task.status === "done" ? "line-through" : "none",
                    flex: 1,
                    marginRight: "8px",
                  }}>
                    {task.title}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                      ⏱{task.duration}хв
                    </span>
                    <span style={{
                      background: task.priority === "must" ? "var(--badge-must-bg)" : "var(--badge-nice-bg)",
                      color: task.priority === "must" ? "var(--badge-must-text)" : "var(--badge-nice-text)",
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      })}

      {flexible.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>Без дати</span>
            <div style={{ flex: 1, height: "0.5px", background: "#2a2a2a" }} />
          </div>
          {flexible.map((task) => (
            <div key={task.id} style={{
              background: "var(--bg-card)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ color: "var(--text-primary)", fontSize: "14px", flex: 1, marginRight: "8px" }}>
                {task.title}
              </span>
              <span style={{
                background: task.priority === "must" ? "var(--badge-must-bg)" : "var(--badge-nice-bg)",
                color: task.priority === "must" ? "var(--badge-must-text)" : "var(--badge-nice-text)",
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "4px",
              }}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
