import { useGetTotalCustomer } from "@/hooks/API/dashboard/adminDasboard/useGetTotalCustomers";
import { Users, CalendarDays, Tags, UserRound } from "lucide-react";
import { useGetTotalEvents } from "@/hooks/API/dashboard/adminDasboard/useGetTotalEvents";
import { useGetTotalCategories } from "@/hooks/API/dashboard/adminDasboard/useGetTotalCategories";
import { useGetTotalOrganizer } from "@/hooks/API/dashboard/adminDasboard/useGetTotalOrganizers";

export function AdminOverview() {
  const { data, isLoading, isError } = useGetTotalCustomer();

  const {
    data: totalEventsData,
    isLoading: isTotalEventsLoading,
    isError: isTotalEventsError,
  } = useGetTotalEvents();

  const {
    data: totalCategoriesData,
    isLoading: isTotalCategoriesLoading,
    isError: isTotalCategoriesError,
  } = useGetTotalCategories();

  const {
    data: totalOrganizersData,
    isLoading: isTotalOrganizersLoading,
    isError: isTotalOrganizersError,
  } = useGetTotalOrganizer();

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Overview
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Ringkasan statistik dan aktivitas platform.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Customers */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Customers</p>
            <Users className="h-5 w-5 text-[#f4917b]" />
          </div>

          {/* Total Customer dari database */}
          <p className="mt-3 text-3xl font-bold">
            {isLoading
              ? "..."
              : isError
                ? "Gagal"
                : (data?.totalCustomers ?? 0)}
          </p>
        </div>

        {/* Total Events */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Events</p>
            <CalendarDays className="h-5 w-5 text-[#f4917b]" />
          </div>

          <p className="mt-3 text-3xl font-bold">
            {isTotalEventsLoading
              ? "..."
              : isTotalEventsError
                ? "Gagal"
                : (totalEventsData?.totalEvents ?? 0)}
          </p>
        </div>

        {/* Categories */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Categories</p>
            <Tags className="h-5 w-5 text-[#f4917b]" />
          </div>

          <p className="mt-3 text-3xl font-bold">
            {isTotalCategoriesLoading
              ? "..."
              : isTotalCategoriesError
                ? "Gagal"
                : (totalCategoriesData?.totalCategories ?? 0)}
          </p>
        </div>

        {/* Organizers */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Organizers</p>
            <UserRound className="h-5 w-5 text-[#f4917b]" />
          </div>

          <p className="mt-3 text-3xl font-bold">
            {isTotalOrganizersLoading
              ? "..."
              : isTotalOrganizersError
                ? "Gagal"
                : (totalOrganizersData?.totalOrganizers ?? 0)}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>

        <p className="mt-2 text-sm text-gray-500">
          Recent platform activity will appear here.
        </p>
      </div>
    </>
  );
}
