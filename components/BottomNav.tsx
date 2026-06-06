"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TABS = [
  { href: "/capture", label: "Capture" },
  { href: "/inbox", label: "Inbox" },
  { href: "/today", label: "Today" },
  { href: "/week", label: "Week" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved !== "light";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <nav style={{
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      background: "var(--nav-bg)",
      borderTop: "0.5px solid var(--nav-border)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
      zIndex: 100,
    }}>
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 8px",
              color: active ? "var(--accent)" : "var(--text-muted)",
              fontSize: "12px",
              fontWeight: active ? 500 : 400,
              borderBottom: active ? "1.5px solid var(--accent)" : "1.5px solid transparent",
              minWidth: "52px",
              minHeight: "44px",
            }}
          >
            {tab.label}
          </Link>
        );
      })}

      <button
        onClick={toggleTheme}
        style={{
          background: "none", border: "none",
          color: "var(--text-muted)",
          fontSize: "18px", cursor: "pointer",
          minWidth: "44px", minHeight: "44px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        title={dark ? "Світла тема" : "Темна тема"}
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}
