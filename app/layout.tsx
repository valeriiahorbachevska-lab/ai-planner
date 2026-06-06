import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "AI Planner",
  description: "Твій AI-планер дня",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <div style={{ paddingBottom: "70px", minHeight: "100vh", maxWidth: "480px", margin: "0 auto" }}>
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
