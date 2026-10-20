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
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  eventName: string;
  eventDate: string;
  transactionDate: string;
  ticketQuantity: number;
  totalPayment: number;
  paymentProof: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const initialTransactions: Transaction[] = [
  {
    id: "TRX-2026-001",
    customerName: "Andi Pratama",
    customerEmail: "andi@example.com",
    eventName: "Jakarta Music Festival",
    eventDate: "2026-11-15",
    transactionDate: "2026-10-18",
    ticketQuantity: 2,
    totalPayment: 500000,
    paymentProof: "https://placehold.co/600x800?text=Payment+Proof+001",
    status: "PENDING",
  },
  {
    id: "TRX-2026-002",
    customerName: "Siti Rahma",
    customerEmail: "siti@example.com",
    eventName: "Tech Conference 2026",
    eventDate: "2026-11-20",
    transactionDate: "2026-10-17",
    ticketQuantity: 1,
    totalPayment: 350000,
    paymentProof: "https://placehold.co/600x800?text=Payment+Proof+002",
    status: "APPROVED",
  },
  {
    id: "TRX-2026-003",
    customerName: "Budi Santoso",
    customerEmail: "budi@example.com",
    eventName: "Jakarta Music Festival",
    eventDate: "2026-11-15",
    transactionDate: "2026-10-16",
    ticketQuantity: 3,
    totalPayment: 750000,
    paymentProof: "https://placehold.co/600x800?text=Payment+Proof+003",
    status: "PENDING",
  },
  {
    id: "TRX-2026-004",
    customerName: "Dewi Anggraini",
    customerEmail: "dewi@example.com",
    eventName: "Creative Design Workshop",
    eventDate: "2026-12-05",
    transactionDate: "2026-10-15",
    ticketQuantity: 1,
    totalPayment: 200000,
    paymentProof: "https://placehold.co/600x800?text=Payment+Proof+004",
    status: "REJECTED",
  },
  {
    id: "TRX-2026-005",
    customerName: "Rizky Maulana",
    customerEmail: "rizky@example.com",
    eventName: "Tech Conference 2026",
    eventDate: "2026-11-20",
    transactionDate: "2026-10-14",
    ticketQuantity: 2,
    totalPayment: 700000,
    paymentProof: "https://placehold.co/600x800?text=Payment+Proof+005",
    status: "APPROVED",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusStyles: Record<Transaction["status"], string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

function EventOrganizerTransactions() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [dialogType, setDialogType] = useState<"DETAILS" | "PROOF" | null>(
    null,
  );

  const eventOptions = useMemo(
    () => [
      ...new Set(transactions.map((transaction) => transaction.eventName)),
    ],
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(keyword) ||
        transaction.customerName.toLowerCase().includes(keyword);

      const matchesEvent =
        eventFilter === "ALL" || transaction.eventName === eventFilter;

      const matchesStatus =
        statusFilter === "ALL" || transaction.status === statusFilter;

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [transactions, search, eventFilter, statusFilter]);

  const pendingCount = transactions.filter(
    (transaction) => transaction.status === "PENDING",
  ).length;

  const approvedCount = transactions.filter(
    (transaction) => transaction.status === "APPROVED",
  ).length;

  const rejectedCount = transactions.filter(
    (transaction) => transaction.status === "REJECTED",
  ).length;

  const totalRevenue = transactions
    .filter((transaction) => transaction.status === "APPROVED")
    .reduce((total, transaction) => total + transaction.totalPayment, 0);

  const openDialog = (transaction: Transaction, type: "DETAILS" | "PROOF") => {
    setSelectedTransaction(transaction);
    setDialogType(type);
  };

  const closeDialog = () => {
    setDialogType(null);
    setSelectedTransaction(null);
  };

  const updateTransactionStatus = (
    transactionId: string,
    status: Transaction["status"],
  ) => {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, status }
          : transaction,
      ),
    );

    closeDialog();
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
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Transactions
            </p>
            <Receipt className="size-5 text-pink-600" />
          </div>
          <p className="mt-3 text-2xl font-bold">{transactions.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            All recorded transactions
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Pending Confirmation
            </p>
            <Clock className="size-5 text-amber-600" />
          </div>
          <p className="mt-3 text-2xl font-bold">{pendingCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Awaiting payment review
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Approved
            </p>
            <CircleCheck className="size-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-2xl font-bold">{approvedCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatCurrency(totalRevenue)} approved
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Rejected
            </p>
            <CircleX className="size-5 text-red-600" />
          </div>
          <p className="mt-3 text-2xl font-bold">{rejectedCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Transactions not approved
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="space-y-4 border-b p-5">
          <div>
            <h2 className="text-lg font-semibold">All Transactions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search, filter, and review customer payments.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transaction ID or customer..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={eventFilter}
              onValueChange={(value) => setEventFilter(value ?? "ALL")}
            >
              <SelectTrigger className="w-full lg:w-56">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Events</SelectItem>
                {eventOptions.map((eventName) => (
                  <SelectItem key={eventName} value={eventName}>
                    {eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value ?? "ALL")}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-262.5 text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-medium">Transaction</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Event</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Tickets</th>
                <th className="px-5 py-4 font-medium">Total Payment</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold">{transaction.id}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(transaction.transactionDate)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium">{transaction.customerName}</p>
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

                  <td className="whitespace-nowrap px-5 py-4">
                    {formatDate(transaction.transactionDate)}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {transaction.ticketQuantity}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold">
                    {formatCurrency(transaction.totalPayment)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[transaction.status]}`}
                    >
                      {transaction.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View details"
                        onClick={() => openDialog(transaction, "DETAILS")}
                      >
                        <Eye className="size-4" />
                      </Button>

                      {transaction.status === "PENDING" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Approve transaction"
                            className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() =>
                              updateTransactionStatus(
                                transaction.id,
                                "APPROVED",
                              )
                            }
                          >
                            <Check className="size-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            title="Reject transaction"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() =>
                              updateTransactionStatus(
                                transaction.id,
                                "REJECTED",
                              )
                            }
                          >
                            <X className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <Search className="mx-auto size-8 text-muted-foreground/50" />
                    <p className="mt-3 font-medium">No transactions found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t px-5 py-4 text-sm text-muted-foreground">
          Showing {filteredTransactions.length} of {transactions.length}{" "}
          transactions
        </div>
      </div>

      {/* Transaction Details and Payment Proof Dialogs */}
      <Dialog
        open={dialogType !== null}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {selectedTransaction && dialogType === "DETAILS" && (
            <>
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogDescription>
                  Information for {selectedTransaction.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-lg bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground">Total Payment</p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatCurrency(selectedTransaction.totalPayment)}
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedTransaction.status]}`}
                  >
                    {selectedTransaction.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Transaction ID</p>
                    <p className="mt-1 font-medium">{selectedTransaction.id}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Transaction Date</p>
                    <p className="mt-1 font-medium">
                      {formatDate(selectedTransaction.transactionDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="mt-1 font-medium">
                      {selectedTransaction.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedTransaction.customerEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Event</p>
                    <p className="mt-1 font-medium">
                      {selectedTransaction.eventName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(selectedTransaction.eventDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Ticket Quantity</p>
                    <p className="mt-1 font-medium">
                      {selectedTransaction.ticketQuantity} tickets
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Payment Amount</p>
                    <p className="mt-1 font-medium">
                      {formatCurrency(selectedTransaction.totalPayment)}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Close
                </Button>

                <Button
                  className="bg-pink-600 text-white hover:bg-pink-700"
                  onClick={() => setDialogType("PROOF")}
                >
                  View Payment Proof
                </Button>
              </DialogFooter>
            </>
          )}

          {selectedTransaction && dialogType === "PROOF" && (
            <>
              <DialogHeader>
                <DialogTitle>Payment Proof</DialogTitle>
                <DialogDescription>
                  {selectedTransaction.id} · {selectedTransaction.customerName}
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-center rounded-lg border bg-muted/20 p-3">
                <img
                  src={selectedTransaction.paymentProof}
                  alt={`Payment proof for ${selectedTransaction.id}`}
                  className="max-h-[55vh] w-auto rounded-md object-contain"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Close
                </Button>

                {selectedTransaction.status === "PENDING" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        updateTransactionStatus(
                          selectedTransaction.id,
                          "REJECTED",
                        )
                      }
                    >
                      Reject
                    </Button>

                    <Button
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() =>
                        updateTransactionStatus(
                          selectedTransaction.id,
                          "APPROVED",
                        )
                      }
                    >
                      Approve
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventOrganizerTransactions;
