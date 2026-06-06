"use client";

import { useState, useEffect } from "react";
import { getTasks } from "@/lib/storage";
import { Task } from "@/lib/types";
import TaskCard from "@/components/TaskCard";
import Link from "next/link";

export default function InboxPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState("");

  function refresh() {
    setTasks(getTasks().filter((t) => t.status === "inbox"));
  }

  useEffect(() => { refresh(); }, []);

  const filtered = query.trim()
    ? tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    : tasks;

  return (
    <main style={{ padding: "24px 16px" }}>
      <h1 style={{ color: "var(--text-primary)", fontSize: "22px", fontWeight: 500, margin: "0 0 16px" }}>
        {tasks.length > 0
          ? `AI розібрав ${tasks.length} ${tasks.length === 1 ? "задачу" : "задачі"}`
          : "Inbox"}
      </h1>

      {tasks.length > 0 && (
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <span style={{
            position: "absolute", left: "14px", top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)", fontSize: "16px", pointerEvents: "none",
          }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук задач..."
            style={{
              width: "100%",
              background: "var(--bg-card)",
              border: "0.5px solid #2a2a2a",
              borderRadius: "10px",
              padding: "11px 14px 11px 40px",
              color: "var(--text-primary)",
              fontSize: "15px",
              display: "block",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position: "absolute", right: "12px", top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "var(--text-muted)", fontSize: "18px", cursor: "pointer",
              }}
            >×</button>
          )}
        </div>
      )}

      {tasks.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "60px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
          <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "24px" }}>
            Inbox чистий! Час додати нові задачі
          </p>
          <Link href="/capture" style={{
            display: "inline-block", background: "var(--accent)", color: "#fff",
            padding: "14px 28px", borderRadius: "12px",
            fontSize: "15px", fontWeight: 500,
          }}>
            + Новий brain dump
          </Link>
        </div>
      ) : (
        filtered.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: "40px" }}>
            Нічого не знайдено
          </p>
        ) : (
          filtered.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={refresh} />
          ))
        )
      )}
    </main>
  );
}
