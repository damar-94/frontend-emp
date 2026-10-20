import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Outlet } from "react-router";

export default function AdminDashboardLayout() {
  return (
    <DashboardLayout
      sidebar={<DashboardSidebar role="ADMIN" />}
    >
      <Outlet />
    </DashboardLayout>
  );
}