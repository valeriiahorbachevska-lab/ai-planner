"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addTasks } from "@/lib/storage";
import { Task } from "@/lib/types";
import { useSpeech } from "@/lib/useSpeech";

export default function CapturePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSpeechResult = useCallback((transcript: string) => {
    setText((prev) => prev ? `${prev} ${transcript}` : transcript);
  }, []);

  const { listening, supported, start, stop } = useSpeech(handleSpeechResult);

  async function handleSubmit() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/parse-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      const tasks: Task[] = data.tasks.map(
        (t: Omit<Task, "id" | "status" | "createdAt">) => ({
          ...t,
          id: crypto.randomUUID(),
          status: "inbox" as const,
          createdAt: new Date().toISOString(),
        })
      );

      addTasks(tasks);
      setText("");
      router.push("/inbox");
    } catch {
      setError("Упс, проблемка! Спробуй ще раз");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      padding: "24px 16px",
      minHeight: "calc(100vh - 70px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <h1 style={{
        color: "var(--text-primary)",
        fontSize: "32px",
        fontWeight: 700,
        margin: "0 0 16px",
        letterSpacing: "-0.5px",
      }}>
        TO-DO
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="..."
        style={{
          width: "100%",
          minHeight: "180px",
          background: "var(--bg-card)",
          border: listening ? "0.5px solid var(--accent)" : "0.5px solid #2a2a2a",
          borderRadius: "12px",
          padding: "16px",
          color: "var(--text-primary)",
          fontSize: "16px",
          lineHeight: 1.6,
          resize: "none",
          display: "block",
          transition: "border-color 0.15s",
        }}
      />

      {/* Mic button — centered, round */}
      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <button
          onClick={() => listening ? stop() : start()}
          disabled={!supported}
          title={listening ? "Зупинити" : "Говорити"}
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: listening ? "var(--accent)" : "var(--bg-card)",
            border: listening ? "none" : "0.5px solid #333",
            cursor: supported ? "pointer" : "not-allowed",
            fontSize: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
            boxShadow: listening ? "0 0 20px rgba(226,75,74,0.4)" : "none",
          }}
        >
          🎙
        </button>
      </div>

      {listening && (
        <div style={{
          color: "var(--accent)", fontSize: "13px", marginBottom: "12px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        }}>
          <span style={{
            display: "inline-block", width: "8px", height: "8px",
            borderRadius: "50%", background: "var(--accent)",
          }} />
          Слухаю...
        </div>
      )}

      {error && (
        <div style={{
          background: "var(--badge-must-bg)", color: "var(--accent)",
          padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px",
          textAlign: "center",
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!text.trim() || loading}
        style={{
          width: "100%",
          height: "52px",
          background: !text.trim() || loading ? "#2a2a2a" : "var(--accent)",
          color: !text.trim() || loading ? "var(--text-muted)" : "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: 500,
          cursor: !text.trim() || loading ? "not-allowed" : "pointer",
          transition: "background 0.15s",
        }}
      >
        {loading ? "AI розбирає задачі..." : "✦ Розібрати задачі"}
      </button>
    </main>
  );
}
