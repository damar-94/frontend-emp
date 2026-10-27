import { useGetOrganizerSalesAnalytics } from "@/hooks/API/dashboard/organizerDashboard/useGetSalesAnalytics";
import { useGetOrganizerTotalEvents } from "@/hooks/API/dashboard/organizerDashboard/useGetTotalEvents";
import { useGetTotalRevenue } from "@/hooks/API/dashboard/organizerDashboard/useGetTotalRevenue";
import { useGetTotalTicketSold } from "@/hooks/API/dashboard/organizerDashboard/useGetTotalTicketSold";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, Ticket, Wallet } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SummaryCard {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}
const summaryCards: SummaryCard[] = [
  {
    title: "Total Events",
    value: "0",
    description: "Events you have created",
    icon: CalendarDays,
  },
  {
    title: "Tickets Sold",
    value: "0",
    description: "From approved transactions",
    icon: Ticket,
  },
  {
    title: "Total Revenue",
    value: "0",
    description: "From approved transactions",
    icon: Wallet,
  },
];

type Metric = "tickets" | "revenue";
type Period = "year" | "month" | "day";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function EventOrganizerOverview() {
  const {
    data: totalEvents,
    isError,
    isPending,
  } = useGetOrganizerTotalEvents();

  const {
    data: totalTicketSold,
    isError: totalTicketSoldError,
    isPending: totalTicketSoldPending,
  } = useGetTotalTicketSold();

  const {
    data: totalRevenue,
    isError: totalRevenueError,
    isPending: totalRevenuePending,
  } = useGetTotalRevenue();

  const [metric, setMetric] = useState<Metric>("tickets");
  const [period, setPeriod] = useState<Period>("year");

  const [selectedDate, setSelectedDate] = useState("2026-10-19");

  const selectedYear = selectedDate.slice(0, 4);
  const selectedMonth = selectedDate.slice(5, 7);

  const updateSelectedDate = (year: string, month: string, day: number) => {
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

    const validDay = Math.min(day, daysInMonth);

    setSelectedDate(`${year}-${month}-${String(validDay).padStart(2, "0")}`);
  };

  const {
    data: salesAnalytics,
    isPending: salesAnalyticsPending,
    isError: salesAnalyticsError,
  } = useGetOrganizerSalesAnalytics(period, selectedDate);

  const chartData = salesAnalytics ?? [];

  const chartTitle = metric === "tickets" ? "Tickets Sold" : "Revenue";

  const chartColor = "#f4917b";

  const formatMetric = (value: number) =>
    metric === "revenue"
      ? formatRupiah(value)
      : new Intl.NumberFormat("id-ID").format(value);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor your events, ticket sales, and revenue.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          const value =
            card.title === "Total Events"
              ? isPending
                ? "Loading..."
                : isError
                  ? "Error"
                  : String(totalEvents ?? 0)
              : card.title === "Tickets Sold"
                ? totalTicketSoldPending
                  ? "Loading..."
                  : totalTicketSoldError
                    ? "Error"
                    : String(totalTicketSold ?? 0)
                : card.title === "Total Revenue"
                  ? totalRevenuePending
                    ? "Loading..."
                    : totalRevenueError
                      ? "Error"
                      : formatRupiah(totalRevenue ?? 0)
                  : card.value;

          return (
            <div
              key={card.title}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>

                  <p className="text-2xl font-bold tracking-tight">{value}</p>
                </div>

                <div className="rounded-lg bg-pink-50 p-2.5 text-[#f4917b]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Sales Chart */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Sales Analytics</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track ticket sales and revenue across your events.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-nowrap lg:justify-end">
            <select
              value={metric}
              onChange={(event) => setMetric(event.target.value as Metric)}
              className="h-9 w-full min-w-0 rounded-md border bg-background px-3 text-sm lg:min-w-[140px] focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] text-[#3d312e] focus-visible:ring-2"
            >
              <option value="tickets">Tickets Sold</option>
              <option value="revenue">Revenue</option>
            </select>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
              className="h-9 w-full min-w-0 rounded-md border bg-background px-3 text-sm focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] text-[#3d312e] focus-visible:ring-2"
            >
              <option value="year">Year</option>
              <option value="month">Month</option>
              <option value="day">Day</option>
            </select>

            {period === "year" && (
              <select
                value={selectedYear}
                onChange={(event) =>
                  updateSelectedDate(
                    event.target.value,
                    selectedMonth,
                    Number(selectedDate.slice(8, 10)),
                  )
                }
                className="h-9 w-full min-w-0 rounded-md border bg-background px-3 text-sm focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] text-[#3d312e] focus-visible:ring-2"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            )}

            {period === "month" && (
              <select
                value={selectedMonth}
                onChange={(event) =>
                  updateSelectedDate(
                    selectedYear,
                    event.target.value,
                    Number(selectedDate.slice(8, 10)),
                  )
                }
                className="h-9 w-full min-w-0 rounded-md border bg-background px-3 text-sm"
              >
                {Array.from({ length: 12 }, (_, index) => {
                  const month = String(index + 1).padStart(2, "0");

                  return (
                    <option key={month} value={month}>
                      {new Date(Number(selectedYear), index).toLocaleString(
                        "en-US",
                        { month: "long" },
                      )}
                    </option>
                  );
                })}
              </select>
            )}

            {period === "day" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="h-9 w-full min-w-0 rounded-md border bg-background px-3 text-sm"
              />
            )}
          </div>
        </div>

        <div className="mt-6 h-80 w-full">
          {salesAnalyticsPending ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading sales analytics...
            </div>
          ) : salesAnalyticsError ? (
            <div className="flex h-full items-center justify-center text-sm text-destructive">
              Failed to load sales analytics.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 16, left: 12, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={metric === "revenue" ? 100 : 45}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: number) =>
                    metric === "revenue"
                      ? value >= 1000000
                        ? `Rp ${(value / 1000000).toLocaleString("id-ID")} jt`
                        : `Rp ${value.toLocaleString("id-ID")}`
                      : value.toLocaleString("id-ID")
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    formatMetric(Number(value)),
                    chartTitle,
                  ]}
                  labelFormatter={(label) =>
                    period === "year"
                      ? `${label} ${selectedYear}`
                      : period === "month"
                        ? `${label}/${selectedMonth}/${selectedYear}`
                        : `${selectedDate} · ${label}`
                  }
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey={metric}
                  name={chartTitle}
                  stroke={chartColor}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
