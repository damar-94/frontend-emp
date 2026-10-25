import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({
  sidebar,
  children,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen
            ? "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
            : "hidden"
        } md:relative md:block md:w-64 md:shrink-0 md:border-r md:shadow-none`}
      >
        <div className="flex justify-end p-2 md:hidden">
          <button onClick={() => setIsSidebarOpen(false)}>
            <X />
          </button>
        </div>

        {sidebar}
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-3 border-b bg-white p-4 md:hidden">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu />
          </button>
          <span className="font-bold">EventTix</span>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}