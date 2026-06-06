"use client";

import { useState, useEffect } from "react";
import { getTasks, saveTasks } from "@/lib/storage";
import { Task } from "@/lib/types";
import TodayTask from "@/components/TodayTask";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function refresh() {
    const all = getTasks().filter((t) => t.status === "today" || t.status === "done");
    all.sort((a, b) => {
      if (a.status !== b.status) return a.status === "done" ? 1 : -1;
      if (a.priority !== b.priority) return a.priority === "must" ? -1 : 1;
      return 0;
    });
    setTasks(all);
  }

  useEffect(() => { refresh(); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTasks = tasks.filter((t) => t.status !== "done");
    const doneTasks = tasks.filter((t) => t.status === "done");

    const oldIndex = activeTasks.findIndex((t) => t.id === active.id);
    const newIndex = activeTasks.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(activeTasks, oldIndex, newIndex);
    const newTasks = [...reordered, ...doneTasks];
    setTasks(newTasks);

    const allTasks = getTasks();
    const otherTasks = allTasks.filter(
      (t) => t.status !== "today" && t.status !== "done"
    );
    saveTasks([...otherTasks, ...newTasks]);
  }

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const allDone = tasks.length > 0 && doneCount === tasks.length;
  const activeTasks = tasks.filter((t) => t.status !== "done");

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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={activeTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <TodayTask key={task.id} task={task} onUpdate={refresh} />
              ))}
            </SortableContext>
          </DndContext>

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
      {allDone && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.85)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
          onClick={() => setTasks(t => [...t])}
        >
          <div style={{
            background: "#1a1a1a",
            border: "0.5px solid #e24b4a",
            borderRadius: "20px",
            padding: "40px 32px",
            textAlign: "center",
            maxWidth: "320px",
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{
              color: "#f0f0f0", fontSize: "22px",
              fontWeight: 700, margin: "0 0 12px",
            }}>
              Ура, оце ти постаралась!
            </h2>
            <p style={{ color: "#555", fontSize: "15px", margin: "0 0 28px" }}>
              Всі задачі на сьогодні виконані 🔥
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setTasks(t => [...t]); }}
              style={{
                width: "100%", height: "48px",
                background: "#e24b4a", border: "none",
                borderRadius: "12px", color: "#fff",
                fontSize: "16px", fontWeight: 500, cursor: "pointer",
              }}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
