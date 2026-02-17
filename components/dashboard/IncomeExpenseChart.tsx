"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
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
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useTransactions } from "@/hooks/use-transactions";

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--primary)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--secondary)",
  },
} satisfies ChartConfig;

export function IncomeExpenseChart() {
  const { transactions } = useTransactions();

  const chartData = React.useMemo(() => {
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

    // Initialize last 6 months
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
    <Card className="col-span-1 md:col-span-8 bg-card rounded-3xl overflow-hidden h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">Cash Flow</CardTitle>
        <CardDescription>
          Comparison of your income and expenses for the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 flex-grow">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] min-h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <defs>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--secondary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--secondary)"
                    stopOpacity={0}
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
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="expenses"
                type="monotone"
                fill="url(#fillExpenses)"
                stroke="var(--secondary)"
                strokeWidth={2}
                activeDot={{ r: 4 }}
              />
              <Area
                dataKey="income"
                type="monotone"
                fill="url(#fillIncome)"
                stroke="var(--primary)"
                strokeWidth={2}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
