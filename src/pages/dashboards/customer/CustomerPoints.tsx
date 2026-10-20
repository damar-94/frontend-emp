import { Clock, Coins, History } from "lucide-react";
import { useState } from "react";

type PointLot = {
  id: number;
  amount: number;
  remainingAmount: number;
  creditedAt: string;
  expiresAt: string;
};

const pointLots: PointLot[] = [
  {
    id: 1,
    amount: 10000,
    remainingAmount: 7000,
    creditedAt: "2026-09-20T10:00:00.000Z",
    expiresAt: "2026-12-20T10:00:00.000Z",
  },
  {
    id: 2,
    amount: 15000,
    remainingAmount: 15000,
    creditedAt: "2026-10-01T10:00:00.000Z",
    expiresAt: "2027-01-01T10:00:00.000Z",
  },
  {
    id: 3,
    amount: 5000,
    remainingAmount: 0,
    creditedAt: "2026-06-10T10:00:00.000Z",
    expiresAt: "2026-09-10T10:00:00.000Z",
  },
];

export function CustomerPoints() {
  const [history] = useState<PointLot[]>(pointLots);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  const now = Date.now();

  // Total poin yang masih tersedia dan belum kedaluwarsa.
  const totalAvailablePoints = history.reduce((total, point) => {
    const isExpired = new Date(point.expiresAt).getTime() <= now;

    return total + (isExpired ? 0 : point.remainingAmount);
  }, 0);

  const getPointStatus = (point: PointLot) => {
    if (new Date(point.expiresAt).getTime() <= now) {
      return {
        label: "Expired",
        className: "bg-red-100 text-red-700",
      };
    }

    if (point.remainingAmount === 0) {
      return {
        label: "Used",
        className: "bg-gray-100 text-gray-600",
      };
    }

    return {
      label: "Available",
      className: "bg-green-100 text-green-700",
    };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          My Points
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View your available points, usage, and expiration history.
        </p>
      </div>

      {/* Total Available Points */}
      <div className="rounded-xl border border-pink-100 bg-linear-to-r from-pink-50 to-orange-50 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Available Points
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {formatNumber(totalAvailablePoints)}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Points available to use for your transactions.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            <Coins className="h-7 w-7 text-pink-600" />
          </div>
        </div>
      </div>

      {/* Points History */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50">
            <History className="h-5 w-5 text-pink-600" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Points History</h3>

            <p className="mt-1 text-sm text-gray-500">
              Track your earned, used, and expired points.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 font-semibold text-gray-700">
                  Credited Date
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-right font-semibold text-gray-700">
                  Initial Points
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-right font-semibold text-gray-700">
                  Remaining Points
                </th>

                <th className="whitespace-nowrap px-6 py-4 font-semibold text-gray-700">
                  Expiration Date
                </th>

                <th className="px-6 py-4 font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {history.length > 0 ? (
                history.map((point) => {
                  const status = getPointStatus(point);

                  return (
                    <tr
                      key={point.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {formatDate(point.creditedAt)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900">
                        {formatNumber(point.amount)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900">
                        {formatNumber(
                          new Date(point.expiresAt).getTime() <= now
                            ? 0
                            : point.remainingAmount,
                        )}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatDate(point.expiresAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    You don't have any points history yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
