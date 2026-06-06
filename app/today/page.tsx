"use client";

import { useState, useEffect } from "react";
import { getTasks } from "@/lib/storage";
import { Task } from "@/lib/types";
import TodayTask from "@/components/TodayTask";
import Link from "next/link";

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function refresh() {
    const all = getTasks().filter((t) => t.status === "today" || t.status === "done");
    all.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority === "must" ? -1 : 1;
      if (a.status !== b.status) return a.status === "done" ? 1 : -1;
      return 0;
    });
    setTasks(all);
  }

  useEffect(() => { refresh(); }, []);

  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <main style={{ padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "var(--text-primary)", fontSize: "22px", fontWeight: 500, margin: 0 }}>
          Сьогодні
        </h1>
        {tasks.length > 0 && (
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            {doneCount}/{tasks.length} виконано
          </span>
        )}
      </div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "60px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
          <p style={{ color: "var(--text-muted)", fontSize: "16px", margin: "0 0 8px" }}>
            Ще немає задач.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 24px" }}>
            Закинь потік думок у Capture →
          </p>
          <Link href="/capture" style={{
            display: "inline-block", background: "var(--accent)", color: "#fff",
            padding: "14px 28px", borderRadius: "12px",
            fontSize: "15px", fontWeight: 500,
          }}>
            + Додати задачу
          </Link>
        </div>
      ) : (
        <>
          {tasks.map((task) => (
            <TodayTask key={task.id} task={task} onUpdate={refresh} />
          ))}
          <Link href="/capture" style={{
            display: "block",
            background: "var(--bg-card)",
            border: "0.5px solid #2a2a2a",
            color: "var(--text-muted)",
            padding: "14px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            textAlign: "center",
            marginTop: "8px",
          }}>
            + Додати задачу
          </Link>
        </>
      )}
    </main>
  );
}
