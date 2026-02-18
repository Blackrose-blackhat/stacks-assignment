"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useTransactions } from "@/hooks/use-transactions";

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

/* ── Custom Tooltip ───────────────────────────────── */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-popover/95 backdrop-blur-md p-3 shadow-xl text-sm min-w-[180px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground capitalize">
                {entry.dataKey}
              </span>
            </div>
            <span className="font-mono font-medium tabular-nums">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Custom Active Dot ────────────────────────────── */
function GlowDot(props: Record<string, unknown>) {
  const { cx, cy, fill } = props as { cx: number; cy: number; fill: string };
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill={fill} opacity={0.2} />
      <circle cx={cx} cy={cy} r={5} fill={fill} opacity={0.4} />
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill={fill}
        stroke="var(--background)"
        strokeWidth={1.5}
      />
    </g>
  );
}

export function IncomeExpenseChart() {
  const { transactions, isHydrated } = useTransactions();

  const chartData = React.useMemo(() => {
    if (!isHydrated) return [];
    const months = [
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
    ];

    const data: Record<
      string,
      { month: string; income: number; expenses: number; sortKey: number }
    > = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = months[d.getMonth()];
      const key = `${m} ${d.getFullYear()}`;
      data[key] = { month: m, income: 0, expenses: 0, sortKey: d.getTime() };
    }

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const m = months[d.getMonth()];
      const key = `${m} ${d.getFullYear()}`;
      if (data[key]) {
        if (t.type === "income") data[key].income += t.amount;
        else data[key].expenses += t.amount;
      }
    });

    return Object.values(data).sort((a, b) => a.sortKey - b.sortKey);
  }, [transactions]);

  return (
    <Card className="col-span-1 md:col-span-8 bg-input/10 rounded-3xl overflow-hidden h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">Cash Flow</CardTitle>
        <CardDescription>
          Comparison of your income and expenses for the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 flex-grow">
        <div className="min-h-[350px] w-full">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[350px] min-h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
              >
                <defs>
                  {/* Income gradient */}
                  <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  {/* Expenses gradient */}
                  <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-muted/30"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-muted-foreground text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-muted-foreground text-xs"
                  tickFormatter={(v) =>
                    `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`
                  }
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "var(--muted-foreground)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                    opacity: 0.4,
                  }}
                />

                <ChartLegend content={<ChartLegendContent />} />

                <Area
                  dataKey="expenses"
                  type="natural"
                  fill="url(#fillExpenses)"
                  stroke="var(--chart-2)"
                  strokeWidth={2.5}
                  activeDot={<GlowDot fill="var(--chart-2)" />}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
                <Area
                  dataKey="income"
                  type="natural"
                  fill="url(#fillIncome)"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  activeDot={<GlowDot fill="var(--chart-1)" />}
                  animationDuration={1400}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
