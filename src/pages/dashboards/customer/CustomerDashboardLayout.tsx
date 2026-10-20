import { Outlet } from "react-router";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function CustomerDashboardLayout() {
  return (
    <DashboardLayout sidebar={<DashboardSidebar role="CUSTOMER" />}>
      <Outlet />
    </DashboardLayout>
  );
}