import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Eye, RefreshCw, AlertCircle, Star } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";

// 1. Six transaction statuses matching schema.prisma
export type TransactionStatus =
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_ADMIN_CONFIRMATION"
  | "DONE"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELED";

// 2. Transaction type matching backend response (including endDate & attendances.reviews)
export type Transaction = {
  id: number;
  status: TransactionStatus;
  subtotal: number;
  voucherDiscount: number;
  couponDiscount: number;
  pointsDiscount: number;
  totalAmount: number;
  paymentDeadline: string;
  adminDeadline: string | null;
  paymentProof: string | null;
  createdAt: string;
  attendances?: {
    id: number;
    reviews?: {
      id: number;
      rating: number;
      comment: string;
    }[];
  }[];
  transactionItems: {
    id: number;
    quantity: number;
    price: number;
    ticketType: {
      name: string;
      event: {
        id?: number;
        name: string;
        endDate?: string;
      };
    };
  }[];
};

// 3. Status badge labels
const statusLabels: Record<TransactionStatus, string> = {
  WAITING_FOR_PAYMENT: "Waiting for Payment",
  WAITING_FOR_ADMIN_CONFIRMATION: "Waiting for Confirmation",
  DONE: "Completed",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  CANCELED: "Canceled",
};

// 4. Status badge Tailwind styles
const statusStyles: Record<TransactionStatus, string> = {
  WAITING_FOR_PAYMENT: "bg-yellow-100 text-yellow-700",
  WAITING_FOR_ADMIN_CONFIRMATION: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  EXPIRED: "bg-gray-100 text-gray-600",
  CANCELED: "bg-gray-100 text-gray-600",
};

export function CustomerTransactions() {
  // 5. Initialize React Router navigation hook
  const navigate = useNavigate();

  // 6. Regular state for transactions list, loading, error, and status filter
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // 7. Pure async function to fetch customer transaction history from GET /transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await axiosInstance.get("/transactions");
      setTransactions(res.data.data || []);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Failed to load transaction history."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 8. Fetch transactions when component mounts
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // 9. Pure helper to format IDR currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  // 10. Pure helper to format ISO date string
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  // 11. Pure helper to get unique event names per transaction
  const getEventNames = (transaction: Transaction) => {
    const names = (transaction.transactionItems ?? []).map(
      (item) => item.ticketType?.event?.name || "Event"
    );
    return [...new Set(names)].join(", ");
  };

  // 12. Pure helper to sum total ticket quantity per transaction
  const getTotalTickets = (transaction: Transaction) =>
    (transaction.transactionItems ?? []).reduce(
      (total, item) => total + item.quantity,
      0
    );

  // 13. Pure helper: Check if event's endDate < current date
  const hasEventEnded = (transaction: Transaction): boolean => {
    const endDateStr =
      transaction.transactionItems?.[0]?.ticketType?.event?.endDate;
    if (!endDateStr) return false;
    return new Date(endDateStr).getTime() < Date.now();
  };

  // 14. Pure helper: Check if customer already submitted a review for this transaction
  const hasAlreadyReviewed = (transaction: Transaction): boolean => {
    return (transaction.attendances?.[0]?.reviews?.length ?? 0) > 0;
  };

  // 15. Filter transactions by status
  const filteredTransactions =
    statusFilter === "ALL"
      ? transactions
      : transactions.filter((t) => t.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header & Refresh Button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View your transaction history, payment details, and review past events.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchTransactions}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(
          [
            "ALL",
            "WAITING_FOR_PAYMENT",
            "WAITING_FOR_ADMIN_CONFIRMATION",
            "DONE",
            "REJECTED",
            "EXPIRED",
            "CANCELED",
          ] as const
        ).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              statusFilter === status
                ? "bg-gray-900 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {status === "ALL" ? "All Statuses" : statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Event</th>
                <th className="whitespace-nowrap px-6 py-4 font-semibold text-gray-700">
                  Transaction Date
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-center font-semibold text-gray-700">
                  Total Tickets
                </th>
                <th className="whitespace-nowrap px-6 py-4 font-semibold text-gray-700">
                  Total Payment
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Loading your transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => {
                  // Check Review Button eligibility: status === "DONE" AND event.endDate < current date
                  const canShowReviewButton =
                    transaction.status === "DONE" &&
                    hasEventEnded(transaction) &&
                    !hasAlreadyReviewed(transaction);

                  const isReviewed =
                    transaction.status === "DONE" &&
                    hasAlreadyReviewed(transaction);

                  return (
                    <tr
                      key={transaction.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="min-w-52 px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {getEventNames(transaction)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Transaction #{transaction.id}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {formatDate(transaction.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-center text-gray-600">
                        {getTotalTickets(transaction)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                        {formatCurrency(transaction.totalAmount)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[transaction.status]
                          }`}
                        >
                          {statusLabels[transaction.status]}
                        </span>
                      </td>

                      {/* Actions Column: View Details + Conditional Review Button */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() =>
                              navigate(`/transactions/${transaction.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>

                          {/* Review Button: ONLY appears when status === "DONE" and event.endDate < now */}
                          {canShowReviewButton && (
                            <Button
                              size="sm"
                              className="gap-1.5 bg-[#f4917b] text-[#222432] hover:bg-[#ffc7b9] font-semibold"
                              onClick={() =>
                                navigate(
                                  `/transactions/${transaction.id}#review`
                                )
                              }
                            >
                              <Star className="h-3.5 w-3.5 fill-[#222432]" />
                              Review
                            </Button>
                          )}

                          {/* Reviewed Badge if customer already submitted a review */}
                          {isReviewed && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              Reviewed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    You don't have any transactions yet.
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