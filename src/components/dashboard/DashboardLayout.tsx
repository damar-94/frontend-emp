import type { ReactNode } from "react";

interface DashboardLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({
  sidebar,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 shrink-0 border-r bg-white">
        {sidebar}
      </aside>

      <div className="min-w-0 flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}