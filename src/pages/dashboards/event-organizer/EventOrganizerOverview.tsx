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
import { CalendarDays, Clock, Ticket, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SummaryCard {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}
const summaryCards: SummaryCard[] = [
  {
    title: "Total Events",
    value: "12",
    description: "Events you have created",
    icon: CalendarDays,
  },
  {
    title: "Tickets Sold",
    value: "1,248",
    description: "From approved transactions",
    icon: Ticket,
  },
  {
    title: "Total Revenue",
    value: "Rp 125.500.000",
    description: "From approved transactions",
    icon: Wallet,
  },
  {
    title: "Pending Payments",
    value: "8",
    description: "Awaiting payment verification",
    icon: Clock,
  },
];

type Metric = "tickets" | "revenue";
type Period = "year" | "month" | "day";

interface ChartData {
  label: string;
  tickets: number;
  revenue: number;
}

const monthlyData: ChartData[] = [
  { label: "Jan", tickets: 120, revenue: 12000000 },
  { label: "Feb", tickets: 180, revenue: 18000000 },
  { label: "Mar", tickets: 150, revenue: 15000000 },
  { label: "Apr", tickets: 220, revenue: 22000000 },
  { label: "May", tickets: 190, revenue: 19000000 },
  { label: "Jun", tickets: 280, revenue: 28000000 },
  { label: "Jul", tickets: 240, revenue: 24000000 },
  { label: "Aug", tickets: 310, revenue: 31000000 },
  { label: "Sep", tickets: 270, revenue: 27000000 },
  { label: "Oct", tickets: 350, revenue: 35000000 },
  { label: "Nov", tickets: 300, revenue: 30000000 },
  { label: "Dec", tickets: 400, revenue: 40000000 },
];

const dailyData: ChartData[] = Array.from({ length: 31 }, (_, index) => ({
  label: String(index + 1),
  tickets: 10 + ((index * 7 + 13) % 35),
  revenue: (10 + ((index * 7 + 13) % 35)) * 100000,
}));

const hourlyData: ChartData[] = Array.from({ length: 24 }, (_, index) => ({
  label: `${String(index).padStart(2, "0")}:00`,
  tickets: index >= 8 && index <= 21 ? 5 + ((index * 3 + 7) % 20) : 0,
  revenue:
    index >= 8 && index <= 21 ? (5 + ((index * 3 + 7) % 20)) * 100000 : 0,
}));

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function EventOrganizerOverview() {
  const [metric, setMetric] = useState<Metric>("tickets");
  const [period, setPeriod] = useState<Period>("year");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("10");
  const [selectedDate, setSelectedDate] = useState("2026-10-19");

  const chartData =
    period === "year"
      ? monthlyData
      : period === "month"
        ? dailyData.filter((item) => {
            const daysInMonth = new Date(
              Number(selectedYear),
              Number(selectedMonth),
              0,
            ).getDate();

            return Number(item.label) <= daysInMonth;
          })
        : hourlyData;

  const chartTitle = metric === "tickets" ? "Tickets Sold" : "Revenue";

  const chartColor = "#DB2777";

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

                  <p className="text-2xl font-bold tracking-tight">
                    {card.value}
                  </p>
                </div>

                <div className="rounded-lg bg-pink-50 p-2.5 text-pink-600">
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

          <div className="flex flex-wrap gap-2">
            <select
              value={metric}
              onChange={(event) => setMetric(event.target.value as Metric)}
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="tickets">Tickets Sold</option>
              <option value="revenue">Revenue</option>
            </select>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="year">Year</option>
              <option value="month">Month</option>
              <option value="day">Day</option>
            </select>

            {period === "year" && (
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            )}

            {period === "month" && (
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm"
              >
                {Array.from({ length: 12 }, (_, index) => {
                  const month = String(index + 1).padStart(2, "0");

                  return (
                    <option key={month} value={month}>
                      {new Date(2026, index).toLocaleString("en-US", {
                        month: "long",
                      })}
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
                className="h-9 rounded-md border bg-background px-3 text-sm"
              />
            )}
          </div>
        </div>

        <div className="mt-6 h-80 w-full">
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
                formatter={(value) => [formatMetric(Number(value)), chartTitle]}
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
        </div>
      </div>
    </div>
  );
}
