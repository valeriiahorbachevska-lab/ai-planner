"use client";

import { useState } from "react";

interface CalendarPickerProps {
  onSelect: (date: string) => void;
  onClose: () => void;
}

const UK_MONTHS = ["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"];
const UK_DAYS_SHORT = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"];

function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarPicker({ onSelect, onClose }: CalendarPickerProps) {
  const now = new Date();
  const todayKey = toKey(now);

  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const maxYear = now.getFullYear() + 1;
  const maxMonth = now.getMonth();

  function prevMonth() {
    if (viewYear === now.getFullYear() && viewMonth === now.getMonth()) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewYear === maxYear && viewMonth === maxMonth) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Monday = 0, ..., Sunday = 6
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const canGoPrev = !(viewYear === now.getFullYear() && viewMonth === now.getMonth());
  const canGoNext = !(viewYear === maxYear && viewMonth === maxMonth);

  function isDisabled(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day);
    const dKey = toKey(d);
    if (dKey < todayKey) return true;
    if (viewYear > maxYear) return true;
    if (viewYear === maxYear && viewMonth > maxMonth) return true;
    return false;
  }

  return (
    <div style={{
      background: "#1a1a1a",
      border: "0.5px solid #333",
      borderRadius: "12px",
      padding: "14px",
      marginTop: "10px",
    }}>
      {/* Month navigation */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: "12px",
      }}>
        <button onClick={prevMonth} style={{
          background: "none", border: "none", padding: "8px 12px",
          color: canGoPrev ? "var(--text-primary)" : "#333",
          fontSize: "20px", cursor: canGoPrev ? "pointer" : "default",
          minWidth: "44px", minHeight: "44px",
        }}>‹</button>

        <span style={{ color: "var(--text-primary)", fontSize: "15px", fontWeight: 500 }}>
          {UK_MONTHS[viewMonth]} {viewYear}
        </span>

        <button onClick={nextMonth} style={{
          background: "none", border: "none", padding: "8px 12px",
          color: canGoNext ? "var(--text-primary)" : "#333",
          fontSize: "20px", cursor: canGoNext ? "pointer" : "default",
          minWidth: "44px", minHeight: "44px",
        }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        marginBottom: "4px",
      }}>
        {UK_DAYS_SHORT.map(d => (
          <div key={d} style={{
            textAlign: "center", color: "var(--text-muted)",
            fontSize: "11px", padding: "4px 0",
          }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} style={{ minHeight: "40px" }} />;

          const key = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const disabled = isDisabled(day);
          const isToday = key === todayKey;

          return (
            <button
              key={key}
              onClick={() => {
                if (!disabled) {
                  onSelect(key);
                  onClose();
                }
              }}
              style={{
                minHeight: "40px",
                borderRadius: "8px",
                border: "none",
                background: isToday ? "var(--accent)" : "transparent",
                color: disabled ? "#3a3a3a" : isToday ? "#fff" : "var(--text-primary)",
                fontSize: "14px",
                fontWeight: isToday ? 600 : 400,
                cursor: disabled ? "default" : "pointer",
                textAlign: "center",
                padding: "4px 2px",
                WebkitTapHighlightColor: "rgba(226,75,74,0.2)",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      <button onClick={onClose} style={{
        width: "100%", marginTop: "12px", padding: "10px",
        background: "transparent", border: "0.5px solid #333",
        borderRadius: "8px", color: "var(--text-muted)",
        fontSize: "13px", cursor: "pointer", minHeight: "44px",
      }}>
        Скасувати
      </button>
    </div>
  );
}
