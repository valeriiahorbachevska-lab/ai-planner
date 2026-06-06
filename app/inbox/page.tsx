"use client";

import { useState, useEffect } from "react";
import { getTasks } from "@/lib/storage";
import { Task } from "@/lib/types";
import TaskCard from "@/components/TaskCard";
import Link from "next/link";

export default function InboxPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function refresh() {
    setTasks(getTasks().filter((t) => t.status === "inbox"));
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main style={{ padding: "24px 16px" }}>
      <h1 style={{ color: "var(--text-primary)", fontSize: "22px", fontWeight: 500, margin: "0 0 20px" }}>
        {tasks.length > 0
          ? `AI розібрав ${tasks.length} ${tasks.length === 1 ? "задачу" : "задачі"}`
          : "Inbox"}
      </h1>

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
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} onUpdate={refresh} />
        ))
      )}
    </main>
  );
}
