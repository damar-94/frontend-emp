import { useGetUsers } from "@/hooks/API/dashboard/adminDasboard/useGetUsers";
import { useState } from "react";

type UserRole = "ALL" | "ADMIN" | "EVENTORGANIZER" | "CUSTOMER";

export function AdminManageUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole>("ALL");
  const [page, setPage] = useState(1);

  const { data, isPending, isError } = useGetUsers({
    page,
    search,
    role: roleFilter,
  });

  const users = data?.data ?? [];
  const totalUsers = data?.meta.total ?? 0;
  const currentPage = data?.meta.page ?? page;
  const take = data?.meta.take ?? 10;
  const totalPages = Math.ceil(totalUsers / take);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (value: UserRole) => {
    setRoleFilter(value);
    setPage(1);
  };

  const getRoleStyle = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-rose-50 text-rose-700";

      case "EVENTORGANIZER":
        return "bg-violet-50 text-violet-700";

      case "CUSTOMER":
        return "bg-sky-50 text-sky-700";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Manage Users
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View, search, and filter platform users.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">User List</h2>
            <p className="text-sm text-gray-500">
              View and search registered users.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            />

            <select
              value={roleFilter}
              onChange={(event) =>
                handleRoleChange(event.target.value as UserRole)
              }
              className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="EVENTORGANIZER">Event Organizer</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {isPending ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-red-500"
                  >
                    Failed to load users. Please try again.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleStyle(
                          item.role,
                        )}`}
                      >
                        {item.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 justify-center items-center sm:flex-row sm:items-center sm:justify-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={currentPage <= 1 || isPending}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {Math.max(totalPages, 1)}
            </span>

            <button
              type="button"
              disabled={
                currentPage >= totalPages || isPending || totalPages === 0
              }
              onClick={() => setPage((current) => current + 1)}
              className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
