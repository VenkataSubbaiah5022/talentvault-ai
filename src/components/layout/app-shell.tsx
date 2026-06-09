"use client";

import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--dashboard-bg)] dark:bg-background">
      <Sidebar />
      <div className="pl-[248px]">
        <main className="min-h-screen px-7 py-7">{children}</main>
      </div>
    </div>
  );
}
