"use client";

import { useState } from "react";

interface CalendarPickerProps {
  onSelect: (date: string) => void;
  onClose: () => void;
}

const UK_MONTHS = ["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"];
const UK_DAYS = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"];

export default function CalendarPicker({ onSelect, onClose }: CalendarPickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  // Monday-based: Mon=0 ... Sun=6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = startOffset + lastDay.getDate();
  const rows = Math.ceil(totalCells / 7);
  const cells = Array.from({ length: rows * 7 }, (_, i) => {
    const dayNum = i - startOffset + 1;
    if (dayNum < 1 || dayNum > lastDay.getDate()) return null;
    return new Date(viewYear, viewMonth, dayNum);
  });

  function toKey(d: Date) {
    return d.toISOString().split("T")[0];
  }

  const todayKey = toKey(today);
  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth());
  const canGoNext = !(viewYear === maxDate.getFullYear() && viewMonth === maxDate.getMonth());

  return (
    <div style={{
      background: "#1a1a1a",
      border: "0.5px solid #333",
      borderRadius: "12px",
      padding: "12px",
      marginTop: "10px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          style={{
            background: "none", border: "none", color: canGoPrev ? "var(--text-primary)" : "#333",
            fontSize: "18px", cursor: canGoPrev ? "pointer" : "default", padding: "4px 8px",
          }}
        >‹</button>
        <span style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 500 }}>
          {UK_MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          style={{
            background: "none", border: "none", color: canGoNext ? "var(--text-primary)" : "#333",
            fontSize: "18px", cursor: canGoNext ? "pointer" : "default", padding: "4px 8px",
          }}
        >›</button>
      </div>

      {/* Day names */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "4px" }}>
        {UK_DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "11px", padding: "2px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const key = toKey(date);
          const isToday = key === todayKey;
          const isPast = date < today;
          const isFuture = date > maxDate;
          const disabled = isPast || isFuture;

          return (
            <button
              key={key}
              onClick={() => { if (!disabled) { onSelect(key); onClose(); } }}
              style={{
                padding: "7px 2px",
                borderRadius: "8px",
                border: "none",
                background: isToday ? "var(--accent)" : "transparent",
                color: disabled ? "#333" : isToday ? "#fff" : "var(--text-primary)",
                fontSize: "13px",
                cursor: disabled ? "default" : "pointer",
                textAlign: "center",
                minHeight: "34px",
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Cancel */}
      <button
        onClick={onClose}
        style={{
          width: "100%", marginTop: "10px", padding: "8px",
          background: "transparent", border: "0.5px solid #333",
          borderRadius: "8px", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer",
        }}
      >
        Скасувати
      </button>
    </div>
  );
}
