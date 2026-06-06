"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

interface CalendarPickerProps {
  onSelect: (date: string) => void;
  onClose: () => void;
}

const UK_MONTHS = ["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"];
const UK_DAYS = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"];

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function CalendarPicker({ onSelect, onClose }: CalendarPickerProps) {
  const now = new Date();
  const todayKey = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  function prevMonth() {
    if (viewYear === now.getFullYear() && viewMonth === now.getMonth()) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    const maxY = now.getFullYear() + 1;
    const maxM = now.getMonth();
    if (viewYear === maxY && viewMonth === maxM) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const canGoPrev = !(viewYear === now.getFullYear() && viewMonth === now.getMonth());
  const maxDate = toDateKey(now.getFullYear() + 1, now.getMonth(), now.getDate());

  const modal = (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1a1a1a",
          borderRadius: "16px 16px 0 0",
          padding: "20px 16px 40px",
          width: "100%",
          maxWidth: "480px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <button
            type="button"
            onClick={prevMonth}
            style={{
              background: "none", border: "none",
              color: canGoPrev ? "#f0f0f0" : "#444",
              fontSize: "24px", cursor: canGoPrev ? "pointer" : "default",
              width: "44px", height: "44px",
            }}
          >‹</button>
          <span style={{ color: "#f0f0f0", fontSize: "16px", fontWeight: 500 }}>
            {UK_MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            style={{
              background: "none", border: "none",
              color: "#f0f0f0",
              fontSize: "24px", cursor: "pointer",
              width: "44px", height: "44px",
            }}
          >›</button>
        </div>

        {/* Day names */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "8px" }}>
          {UK_DAYS.map(d => (
            <div key={d} style={{ textAlign: "center", color: "#555", fontSize: "12px", padding: "4px 0" }}>{d}</div>
          ))}
        </div>

        {/* Days */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} style={{ height: "44px" }} />;

            const key = toDateKey(viewYear, viewMonth, day);
            const isPast = key < todayKey;
            const isFuture = key > maxDate;
            const disabled = isPast || isFuture;
            const isToday = key === todayKey;

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (!disabled) {
                    onSelect(key);
                    onClose();
                  }
                }}
                style={{
                  height: "44px",
                  borderRadius: "10px",
                  border: "none",
                  background: isToday ? "#e24b4a" : "transparent",
                  color: disabled ? "#444" : isToday ? "#fff" : "#f0f0f0",
                  fontSize: "15px",
                  fontWeight: isToday ? 600 : 400,
                  cursor: disabled ? "default" : "pointer",
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%", marginTop: "16px", height: "48px",
            background: "transparent", border: "0.5px solid #333",
            borderRadius: "12px", color: "#888", fontSize: "15px", cursor: "pointer",
          }}
        >
          Скасувати
        </button>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
