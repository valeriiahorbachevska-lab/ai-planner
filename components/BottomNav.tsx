"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/capture", label: "Capture" },
  { href: "/inbox", label: "Inbox" },
  { href: "/today", label: "Today" },
  { href: "/week", label: "Week" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#111111",
      borderTop: "0.5px solid #222222",
      display: "flex",
      justifyContent: "space-around",
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
              padding: "4px 12px",
              color: active ? "var(--accent)" : "var(--text-muted)",
              fontSize: "12px",
              fontWeight: active ? 500 : 400,
              borderBottom: active ? "1.5px solid var(--accent)" : "1.5px solid transparent",
              minWidth: "60px",
              minHeight: "44px",
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
