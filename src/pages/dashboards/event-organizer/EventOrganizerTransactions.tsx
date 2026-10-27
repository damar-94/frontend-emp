import type { LucideIcon } from "lucide-react";
import {
  Check,
  CircleCheck,
  CircleX,
  Clock,
  Eye,
  Receipt,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useGetTotalDonePayment } from "@/hooks/API/dashboard/organizerDashboard/useGetTotalDonePayment";
import { useGetTotalPendingPayment } from "@/hooks/API/dashboard/organizerDashboard/useGetTotalPendingPayment";
import { useGetTotalRejectedPayment } from "@/hooks/API/dashboard/organizerDashboard/useGetTotalRejectedPayment";

import useApproveTransaction from "@/hooks/API/dashboard/organizerDashboard/useApproveTransaction";
import { useGetOrganizerTransactions } from "@/hooks/API/dashboard/organizerDashboard/useGetTableTransactions";
import { useRejectTransaction } from "@/hooks/API/dashboard/organizerDashboard/useRejectTransaction";
import type {
  OrganizerTransaction,
  TransactionStatusFilter,
} from "@/types/dashboard";
import { useDebounceValue } from "usehooks-ts";
import { useGetTotalTransactions } from "@/hooks/API/dashboard/organizerDashboard/useGetTotalTransactions";

type TransactionStatus = "WAITING_FOR_ADMIN_CONFIRMATION" | "DONE" | "REJECTED";

interface SummaryCard {
  key: "total" | "pending" | "done" | "rejected";
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}

const summaryCards: SummaryCard[] = [
  {
    key: "total",
    title: "Total Transactions",
    description: "All recorded transactions",
    icon: Receipt,
    iconColor: "text-[#f4917b]",
  },
  {
    key: "pending",
    title: "Pending Confirmation",
    description: "Awaiting payment review",
    icon: Clock,
    iconColor: "text-[#f4917b]",
  },
  {
    key: "done",
    title: "Approved",
    description: "Approved transactions",
    icon: CircleCheck,
    iconColor: "text-[#f4917b]",
  },
  {
    key: "rejected",
    title: "Rejected",
    description: "Transactions not approved",
    icon: CircleX,
    iconColor: "text-[#f4917b]",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

const statusStyles: Record<TransactionStatus, string> = {
  WAITING_FOR_ADMIN_CONFIRMATION: "bg-amber-100 text-amber-700",
  DONE: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

const statusLabels: Record<TransactionStatus, string> = {
  WAITING_FOR_ADMIN_CONFIRMATION: "Pending",
  DONE: "Approved",
  REJECTED: "Rejected",
};

export default function EventOrganizerTransactions() {
  // Summary cards: hooks tetap dipertahankan

  const {
    data: totalTransactions,
    isPending: totalTransactionsPending,
    isError: totalTransactionsError,
  } = useGetTotalTransactions();

  const {
    data: totalPendingPayment,
    isPending: totalPendingPaymentPending,
    isError: totalPendingPaymentError,
  } = useGetTotalPendingPayment();

  const {
    data: totalDonePayment,
    isPending: totalDonePaymentPending,
    isError: totalDonePaymentError,
  } = useGetTotalDonePayment();

  const {
    data: totalRejectedPayment,
    isPending: totalRejectedPaymentPending,
    isError: totalRejectedPaymentError,
  } = useGetTotalRejectedPayment();

  const { mutate: approveTransaction, isPending: approveTransactionPending } =
    useApproveTransaction();
  const { mutate: rejectTransaction, isPending: rejectTransactionPending } =
    useRejectTransaction();

  // State untuk server-side search, filter, dan pagination.
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 700);
  const [statusFilter, setStatusFilter] =
    useState<TransactionStatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const take = 10;

  const {
    data: transactionResponse,
    isPending: transactionsPending,
    isError: transactionsError,
  } = useGetOrganizerTransactions({
    page,
    take,
    search: debouncedSearch,
    status: statusFilter,
  });

  const transactions = transactionResponse?.data ?? [];
  const meta = transactionResponse?.meta;

  const [selectedTransaction, setSelectedTransaction] =
    useState<OrganizerTransaction | null>(null);
  const [isProofDialogOpen, setIsProofDialogOpen] = useState(false);

  const openProofDialog = (transaction: OrganizerTransaction) => {
    setSelectedTransaction(transaction);
    setIsProofDialogOpen(true);
  };

  const closeProofDialog = () => {
    setIsProofDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string | null) => {
    const allowedStatuses: TransactionStatusFilter[] = [
      "ALL",
      "WAITING_FOR_ADMIN_CONFIRMATION",
      "DONE",
      "REJECTED",
    ];

    if (value && allowedStatuses.includes(value as TransactionStatusFilter)) {
      setStatusFilter(value as TransactionStatusFilter);
      setPage(1);
    }
  };

  const totalPages = meta?.totalPages ?? Math.ceil((meta?.total ?? 0) / take);

  const summaryValues: Record<SummaryCard["key"], number> = {
    total: totalTransactions ?? 0,
    pending: totalPendingPayment ?? 0,
    done: totalDonePayment ?? 0,
    rejected: totalRejectedPayment ?? 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review payments and manage customer transactions for your events.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          const isLoading =
            card.key === "total"
              ? totalTransactionsPending
              : card.key === "pending"
                ? totalPendingPaymentPending
                : card.key === "done"
                  ? totalDonePaymentPending
                  : card.key === "rejected"
                    ? totalRejectedPaymentPending
                    : transactionsPending;

          const hasError =
            card.key === "total"
              ? totalTransactionsError
              : card.key === "pending"
                ? totalPendingPaymentError
                : card.key === "done"
                  ? totalDonePaymentError
                  : card.key === "rejected"
                    ? totalRejectedPaymentError
                    : transactionsError;

          const value = isLoading
            ? "Loading..."
            : hasError
              ? "Error"
              : summaryValues[card.key];

          const description =
            card.key === "done" ? "Transaction approved" : card.description;

          return (
            <div
              key={card.key}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <Icon className={`size-5 ${card.iconColor}`} />
              </div>

              <p className="mt-3 text-2xl font-bold">{value}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="space-y-4 border-b p-5">
          <div>
            <h2 className="text-lg font-semibold">All Transactions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search and review customer payments.
            </p>
          </div>

          {/* Search and Status Filter */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search transaction ID, customer, or event..."
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="pl-9 focus:outline-none border-input focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] text-[#3d312e] focus-visible:ring-2"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none sm:w-48 focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] text-[#3d312e] focus-visible:ring-2"
            >
              <option value="ALL">All Statuses</option>
              <option value="WAITING_FOR_ADMIN_CONFIRMATION">Pending</option>
              <option value="DONE">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Table */}
          <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-262.5 text-left text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">Transaction</th>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Event</th>
                  <th className="px-5 py-4 text-center font-medium">Tickets</th>
                  <th className="px-5 py-4 font-medium">Total Payment</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {transactionsPending ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactionsError ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-red-600"
                    >
                      Failed to load transactions. Please try again.
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <Search className="mx-auto size-8 text-muted-foreground/50" />
                      <p className="mt-3 font-medium">No transactions found</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">#{transaction.id}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(transaction.transactionDate)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {transaction.customerName}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {transaction.customerEmail}
                        </p>
                      </td>

                      <td className="max-w-48 px-5 py-4">
                        <p className="truncate font-medium">
                          {transaction.eventName}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(transaction.eventDate)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-center">
                        {transaction.ticketQuantity}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold">
                        {formatCurrency(transaction.totalPayment)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[
                              transaction.status as TransactionStatus
                            ]
                          }`}
                        >
                          {
                            statusLabels[
                              transaction.status as TransactionStatus
                            ]
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            title="View payment proof"
                            onClick={() => openProofDialog(transaction)}
                          >
                            <Eye className="mr-2 size-4" />
                            View Proof
                          </Button>

                          {transaction.status ===
                            "WAITING_FOR_ADMIN_CONFIRMATION" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Approve transaction"
                                className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                disabled={approveTransactionPending}
                                onClick={() =>
                                  approveTransaction(transaction.id)
                                }
                              >
                                <Check className="size-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                title="Reject transaction"
                                disabled={rejectTransactionPending}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() =>
                                  rejectTransaction(transaction.id)
                                }
                              >
                                <X className="size-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Server-side Pagination */}
          <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || transactionsPending}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </Button>

              <span className="text-sm">
                {totalPages === 0 ? 0 : page} / {totalPages}
                {/* Page {page} of {Math.max(1, totalPages)} */}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  page >= totalPages || transactionsPending || totalPages === 0
                }
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Proof Dialog */}
        <Dialog
          open={isProofDialogOpen}
          onOpenChange={(open) => {
            if (!open) closeProofDialog();
          }}
        >
          <DialogContent
            className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-2xl"
            showCloseButton={true}
          >
            {selectedTransaction && (
              <div className="flex justify-center">
                {selectedTransaction.paymentProof ? (
                  <img
                    src={selectedTransaction.paymentProof}
                    alt={`Payment proof for transaction ${selectedTransaction.id}`}
                    className="max-h-[80vh] w-auto max-w-full rounded-md object-contain"
                  />
                ) : (
                  <p className="py-10 text-sm text-muted-foreground">
                    Payment proof is not available for this transaction.
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
