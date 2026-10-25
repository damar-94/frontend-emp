import {
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LockKeyhole,
  MessageSquare,
  Receipt,
  Settings,
  Tags,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";

type DashboardRole = "ADMIN" | "EVENTORGANIZER" | "CUSTOMER";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface DashboardSidebarProps {
  role: DashboardRole;
}

const menuByRole: Record<DashboardRole, MenuItem[]> = {
  ADMIN: [
    { label: "Overview", icon: LayoutDashboard, path: "/admin" },
    { label: "Manage Users", icon: Users, path: "/admin/users" },
    { label: "Manage Events", icon: CalendarDays, path: "/admin/events" },
    { label: "Categories", icon: Tags, path: "/admin/categories" },
  ],

  EVENTORGANIZER: [
    {
      label: "Overview",
      icon: LayoutDashboard,
      path: "/event-organizer-dashboard",
    },
    {
      label: "My Events",
      icon: CalendarDays,
      path: "/event-organizer-dashboard/events",
    },
    {
      label: "Transactions",
      icon: Receipt,
      path: "/event-organizer-dashboard/transactions",
    },
    {
      label: "Reviews",
      icon: MessageSquare,
      path: "/event-organizer-dashboard/reviews",
    },
  ],

  CUSTOMER: [
    {
      label: "My Transactions",
      icon: Receipt,
      path: "/customer-dashboard/transactions",
    },
    {
      label: "My Points",
      icon: Wallet,
      path: "/customer-dashboard/points",
    },
    {
      label: "My Review",
      icon: MessageSquare,
      path: "/customer-dashboard/reviews",
    },
  ],
};

const profilePathByRole: Record<DashboardRole, string> = {
  ADMIN: "/admin/profile",
  EVENTORGANIZER: "/event-organizer-dashboard/profile",
  CUSTOMER: "/customer-dashboard/profile",
};

const changePasswordPathByRole: Record<DashboardRole, string> = {
  ADMIN: "/admin/change-password",
  EVENTORGANIZER: "/event-organizer-dashboard/change-password",
  CUSTOMER: "/customer-dashboard/change-password",
};

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const menuItems = menuByRole[role];
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const linkClassName = (isActive: boolean) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-pink-50 text-pink-700"
        : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
    }`;

  return (
    <div className="min-w-0 p-4">
      <div className="mb-8 px-2">
        <Link to="/" className="text-xl font-bold text-gray-900">
          EventTix
        </Link>

        <p className="mt-1 text-sm text-gray-500">
          {role === "ADMIN"
            ? "Admin Panel"
            : role === "EVENTORGANIZER"
              ? "Organizer Panel"
              : "Customer Panel"}
        </p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={
                item.path === "/admin" ||
                item.path === "/event-organizer-dashboard"
              }
              className={({ isActive }) => linkClassName(isActive)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="min-w-0 wrap-break-word">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 border-t pt-4">
        <button
          type="button"
          onClick={() => setIsSettingOpen(!isSettingOpen)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-pink-50 hover:text-pink-700"
        >
          <Settings className="h-5 w-5" />
          Settings
          <ChevronDown
            className={`ml-auto h-4 w-4 transition-transform ${
              isSettingOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isSettingOpen && (
          <div className="ml-8 mt-1 space-y-1">
            <NavLink
              to={profilePathByRole[role]}
              className={({ isActive }) => linkClassName(isActive)}
            >
              <UserRound className="h-4 w-4" />
              Profile
            </NavLink>

            <NavLink
              to={changePasswordPathByRole[role]}
              className={({ isActive }) => linkClassName(isActive)}
            >
              <LockKeyhole className="h-4 w-4" />
              Change Password
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
