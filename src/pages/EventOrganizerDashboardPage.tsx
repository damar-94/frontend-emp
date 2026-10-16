import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Ticket,
  Wallet,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type TransactionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

interface EventItem {
  id: number;
  name: string;
  date: string;
  location: string;
  sold: number;
  capacity: number;
  revenue: number;
  status: "Published" | "Draft";
}

interface Transaction {
  id: string;
  attendee: string;
  email: string;
  eventName: string;
  quantity: number;
  amount: number;
  date: string;
  status: TransactionStatus;
  proof: string;
}

interface Attendee {
  id: number;
  name: string;
  email: string;
  eventName: string;
  quantity: number;
  totalPrice: number;
}

const initialEvents: EventItem[] = [
  {
    id: 1,
    name: "Jakarta Creative Summit",
    date: "25 Oct 2026",
    location: "Jakarta Convention Center",
    sold: 348,
    capacity: 500,
    revenue: 52_200_000,
    status: "Published",
  },
  {
    id: 2,
    name: "Tech & Innovation Expo",
    date: "08 Nov 2026",
    location: "ICE BSD, Tangerang",
    sold: 216,
    capacity: 300,
    revenue: 32_400_000,
    status: "Published",
  },
  {
    id: 3,
    name: "Startup Networking Night",
    date: "15 Nov 2026",
    location: "M Bloc Space, Jakarta",
    sold: 0,
    capacity: 150,
    revenue: 0,
    status: "Draft",
  },
];

const initialTransactions: Transaction[] = [
  {
    id: "TRX-1024",
    attendee: "Andi Pratama",
    email: "andi@example.com",
    eventName: "Jakarta Creative Summit",
    quantity: 2,
    amount: 300_000,
    date: "15 Oct 2026",
    status: "PENDING",
    proof: "/payment-proofs/proof-1024.jpg",
  },
  {
    id: "TRX-1023",
    attendee: "Siti Rahma",
    email: "siti@example.com",
    eventName: "Tech & Innovation Expo",
    quantity: 1,
    amount: 150_000,
    date: "15 Oct 2026",
    status: "PENDING",
    proof: "/payment-proofs/proof-1023.jpg",
  },
  {
    id: "TRX-1022",
    attendee: "Budi Santoso",
    email: "budi@example.com",
    eventName: "Jakarta Creative Summit",
    quantity: 3,
    amount: 450_000,
    date: "14 Oct 2026",
    status: "ACCEPTED",
    proof: "/payment-proofs/proof-1022.jpg",
  },
  {
    id: "TRX-1021",
    attendee: "Dina Putri",
    email: "dina@example.com",
    eventName: "Tech & Innovation Expo",
    quantity: 1,
    amount: 150_000,
    date: "14 Oct 2026",
    status: "REJECTED",
    proof: "/payment-proofs/proof-1021.jpg",
  },
];

const attendees: Attendee[] = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@example.com",
    eventName: "Jakarta Creative Summit",
    quantity: 3,
    totalPrice: 450_000,
  },
  {
    id: 2,
    name: "Andi Pratama",
    email: "andi@example.com",
    eventName: "Jakarta Creative Summit",
    quantity: 2,
    totalPrice: 300_000,
  },
  {
    id: 3,
    name: "Siti Rahma",
    email: "siti@example.com",
    eventName: "Tech & Innovation Expo",
    quantity: 1,
    totalPrice: 150_000,
  },
  {
    id: 4,
    name: "Rina Maharani",
    email: "rina@example.com",
    eventName: "Tech & Innovation Expo",
    quantity: 2,
    totalPrice: 300_000,
  },
];

const chartData = {
  Day: [24, 35, 29, 48, 39, 58, 45],
  Month: [32, 45, 38, 58, 49, 70, 60, 78, 55, 85, 68, 92],
  Year: [30, 45, 38, 62, 55, 72, 65, 85, 76, 95, 82, 100],
};

const rupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    ACCEPTED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
  };

  const labels: Record<TransactionStatus, string> = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function StatCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  positive = true,
}: {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: typeof Wallet;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs">
        <span
          className={`flex items-center gap-1 font-semibold ${
            positive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          {change}
        </span>
        <span className="text-slate-400">{description}</span>
      </div>
    </div>
  );
}

function RevenueChart({ period }: { period: keyof typeof chartData }) {
  const values = chartData[period];
  const width = 640;
  const height = 200;
  const padding = 12;
  const max = Math.max(...values) + 10;

  const points = values.map((value, index) => ({
    x: padding + (index / (values.length - 1)) * (width - padding * 2),
    y: height - padding - (value / max) * (height - padding * 2),
  }));

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${width - padding} ${height} L ${padding} ${height} Z`;

  const labels = {
    Day: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"],
    Month: ["1", "3", "5", "7", "9", "11", "13", "15", "17", "19", "21", "23"],
    Year: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };

  return (
    <div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-3">
          {[0, 1, 2, 3].map((line) => (
            <div
              key={line}
              className="border-t border-dashed border-slate-200"
            />
          ))}
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="relative z-10 h-52 w-full overflow-visible"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Revenue trend by ${period.toLowerCase()}`}
        >
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f47282" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f47282" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#revenueFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#e76f82"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="#ffffff"
              stroke="#e76f82"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div
        className="mt-2 grid text-center text-xs text-slate-400"
        style={{
          gridTemplateColumns: `repeat(${labels[period].length}, minmax(0, 1fr))`,
        }}
      >
        {labels[period].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function EventOrganizerDashboardPage() {
  const [period, setPeriod] = useState<keyof typeof chartData>("Month");
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [transactionFilter, setTransactionFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("ALL");
  const [selectedProof, setSelectedProof] = useState<Transaction | null>(null);
  const [events] = useState<EventItem[]>(initialEvents);

  const pendingCount = transactions.filter(
    (transaction) => transaction.status === "PENDING",
  ).length;

  const totalRevenue = events.reduce(
    (total, event) => total + event.revenue,
    0,
  );

  const totalTickets = events.reduce((total, event) => total + event.sold, 0);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      transactionFilter === "ALL" || transaction.status === transactionFilter;

    const matchesSearch =
      transaction.attendee.toLowerCase().includes(search.toLowerCase()) ||
      transaction.id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.eventName.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const filteredAttendees = useMemo(
    () =>
      attendees.filter((attendee) => {
        const matchesEvent =
          selectedEvent === "ALL" || attendee.eventName === selectedEvent;

        const matchesSearch =
          attendee.name.toLowerCase().includes(search.toLowerCase()) ||
          attendee.email.toLowerCase().includes(search.toLowerCase());

        return matchesEvent && matchesSearch;
      }),
    [selectedEvent, search],
  );

  function updateTransaction(
    id: string,
    status: Exclude<TransactionStatus, "PENDING">,
  ) {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id ? { ...transaction, status } : transaction,
      ),
    );

    setSelectedProof(null);
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-900">
      <main className="mx-auto max-w-375 space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* Page header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-rose-600">
              EVENT MANAGEMENT
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Organizer Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor your events, revenue, and attendee activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.assign("/organizer/events/create")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <Plus size={18} />
            Create Event
          </button>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={rupiah(totalRevenue)}
            change="+12.8%"
            description="vs last month"
            icon={Wallet}
          />
          <StatCard
            title="Tickets Sold"
            value={totalTickets.toLocaleString("id-ID")}
            change="+8.2%"
            description="vs last month"
            icon={Ticket}
          />
          <StatCard
            title="Total Events"
            value={events.length.toString()}
            change="+2"
            description="this month"
            icon={CalendarDays}
          />
          <StatCard
            title="Pending Payments"
            value={pendingCount.toString()}
            change={`${pendingCount} transactions`}
            description="need review"
            icon={Clock3}
            positive={false}
          />
        </section>

        {/* Revenue chart and event summary */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 xl:col-span-2">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-bold">Revenue Overview</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track your event revenue over time.
                </p>
                <p className="mt-4 text-2xl font-bold">
                  {rupiah(totalRevenue)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight size={14} />
                  12.8% compared with the previous period
                </p>
              </div>

              <div className="flex w-fit rounded-xl bg-slate-100 p-1">
                {(["Day", "Month", "Year"] as const).map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setPeriod(item)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                      period === item
                        ? "bg-white text-rose-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <RevenueChart period={period} />
            </div>

            <p className="mt-5 text-xs text-slate-400">
              Illustrative chart data. Connect your transaction API for actual
              revenue reports.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Your Events</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Event performance at a glance.
                </p>
              </div>
              <Activity size={20} className="text-rose-500" />
            </div>

            <div className="mt-6 space-y-6">
              {events.map((event) => {
                const percentage =
                  event.capacity > 0
                    ? Math.min((event.sold / event.capacity) * 100, 100)
                    : 0;

                return (
                  <div key={event.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold">
                          {event.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                          {event.date}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          event.status === "Published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between text-xs text-slate-500">
                      <span>
                        {event.sold} / {event.capacity} tickets
                      </span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-rose-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => window.location.assign("/organizer/events")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium transition hover:bg-slate-50"
            >
              Manage All Events
              <ChevronDown className="-rotate-90" size={16} />
            </button>
          </div>
        </section>

        {/* Transaction management */}
        <section
          id="transactions"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">Recent Transactions</h2>
                {pendingCount > 0 && (
                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
                    {pendingCount} pending
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Review payments and verify proof of payment.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Filter transaction status"
                value={transactionFilter}
                onChange={(event) => setTransactionFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-400"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setTransactionFilter("ALL");
                  setSearch("");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50"
              >
                <Filter size={16} />
                Reset
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Transaction</th>
                  <th className="px-6 py-4 font-medium">Attendee</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold">{transaction.id}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {transaction.eventName}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium">{transaction.attendee}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {transaction.quantity} ticket(s)
                      </p>
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {rupiah(transaction.amount)}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {transaction.date}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={transaction.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          title="View payment proof"
                          aria-label={`View payment proof for ${transaction.id}`}
                          onClick={() => setSelectedProof(transaction)}
                          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
                        >
                          <Eye size={16} />
                        </button>

                        {transaction.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              title="Accept payment"
                              aria-label={`Accept ${transaction.id}`}
                              onClick={() =>
                                updateTransaction(transaction.id, "ACCEPTED")
                              }
                              className="rounded-lg bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100"
                            >
                              <Check size={16} />
                            </button>

                            <button
                              type="button"
                              title="Reject payment"
                              aria-label={`Reject ${transaction.id}`}
                              onClick={() =>
                                updateTransaction(transaction.id, "REJECTED")
                              }
                              className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </div>
        </section>

        {/* Attendee list */}
        <section
          id="attendees"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="text-lg font-bold">Attendee List</h2>
              <p className="mt-1 text-sm text-slate-500">
                View registered attendees and their ticket purchases.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search attendee..."
                  aria-label="Search attendee"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-rose-400 sm:w-52"
                />
              </div>

              <select
                value={selectedEvent}
                onChange={(event) => setSelectedEvent(event.target.value)}
                aria-label="Filter attendees by event"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-400"
              >
                <option value="ALL">All Events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Attendee</th>
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">Tickets</th>
                  <th className="px-6 py-4 font-medium">Total Paid</th>
                  <th className="px-6 py-4 text-right font-medium">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 font-semibold text-rose-600">
                          {attendee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{attendee.name}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {attendee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {attendee.eventName}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2">
                        <Ticket size={15} className="text-slate-400" />
                        {attendee.quantity}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {rupiah(attendee.totalPrice)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          window.location.assign(
                            `/organizer/attendees/${attendee.id}`,
                          )
                        }
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-rose-600"
                        aria-label={`View ${attendee.name}`}
                      >
                        <MoreHorizontal size={19} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredAttendees.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No attendees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
            {filteredAttendees.length} attendees found
          </div>
        </section>

        <footer className="pb-4 text-center text-xs text-slate-400">
          Event Organizer Dashboard · 2026
        </footer>
      </main>

      {/* Payment proof modal */}
      {selectedProof && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setSelectedProof(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="proof-modal-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="proof-modal-title" className="text-lg font-bold">
                  Payment Proof
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedProof.id} · {selectedProof.attendee}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setSelectedProof(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                {selectedProof.eventName}
              </p>
              <p className="mt-2 text-xl font-bold">
                {rupiah(selectedProof.amount)}
              </p>

              <div className="mt-4 flex min-h-48 items-center justify-center rounded-lg bg-white">
                <div className="text-center">
                  <Eye size={30} className="mx-auto text-slate-400" />
                  <p className="mt-3 text-sm font-medium">
                    Payment proof preview
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Replace the mock path with your uploaded proof URL.
                  </p>
                </div>
              </div>
            </div>

            {selectedProof.status === "PENDING" && (
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateTransaction(selectedProof.id, "REJECTED")
                  }
                  className="flex-1 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Reject Payment
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateTransaction(selectedProof.id, "ACCEPTED")
                  }
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Accept Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventOrganizerDashboardPage;
