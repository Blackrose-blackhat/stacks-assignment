"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Sector,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import {
  Utensils,
  Home,
  Tv,
  ShoppingBag,
  Car,
  MoreHorizontal,
  CreditCard,
} from "lucide-react";
import React from "react";
import { useTransactions } from "@/hooks/use-transactions";

const categoryIcons: Record<string, React.ReactNode> = {
  "Food & Drinks": <Utensils className="h-4 w-4" />,
  Housing: <Home className="h-4 w-4" />,
  Entertainment: <Tv className="h-4 w-4" />,
  Shopping: <ShoppingBag className="h-4 w-4" />,
  Transportation: <Car className="h-4 w-4" />,
  Electronics: <Tv className="h-4 w-4" />,
  Other: <MoreHorizontal className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  "Food & Drinks": "oklch(0.685 0.035 165.45)",
  Housing: "oklch(0.585 0.185 262.13)",
  Entertainment: "oklch(0.577 0.245 27.325)",
  Shopping: "oklch(0.769 0.188 70.08)",
  Electronics: "oklch(0.828 0.189 84.429)",
  Other: "oklch(0.6 0.1 200)",
};

export function CategoryBreakdown() {
  const { transactions } = useTransactions();
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [showLabel, setShowLabel] = React.useState(false);

  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const categoryData = React.useMemo(() => {
    const groups: Record<string, number> = {};
    expenseTransactions.forEach((t) => {
      groups[t.category] = (groups[t.category] || 0) + t.amount;
    });

    return Object.entries(groups)
      .map(([name, value]) => ({
        name,
        value,
        color: categoryColors[name] || categoryColors["Other"],
        icon: categoryIcons[name] || categoryIcons["Other"],
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenseTransactions]);

  const total = categoryData.reduce((acc, curr) => acc + curr.value, 0);
  const maxCategoryIndex = categoryData.length > 0 ? 0 : -1;
  const maxCategory = categoryData[0];
  const maxPercentage =
    total > 0 && maxCategory
      ? Math.round((maxCategory.value / total) * 100)
      : 0;

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      value: { label: "Amount" },
    };
    categoryData.forEach((item) => {
      config[item.name] = { label: item.name, color: item.color };
    });
    return config;
  }, [categoryData]);

  React.useEffect(() => {
    if (categoryData.length === 0) return;

    const zoomTimer = setTimeout(() => {
      setActiveIndex(0);
    }, 500);

    const labelTimer = setTimeout(() => {
      setShowLabel(true);
    }, 900);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(labelTimer);
    };
  }, [categoryData]);

  if (categoryData.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-4 bg-card rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl">Categories</CardTitle>
          <CardDescription>No expense data to display.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground italic">
          Add some expenses to see the breakdown.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-4 bg-card rounded-3xl overflow-hidden h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">Categories</CardTitle>
        <CardDescription>Highest spending areas.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-0">
        <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-6">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="95%"
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  activeIndex={activeIndex}
                  activeShape={(props: any) => {
                    const {
                      cx,
                      cy,
                      innerRadius,
                      outerRadius,
                      startAngle,
                      endAngle,
                      fill,
                    } = props;
                    return (
                      <Sector
                        cx={cx}
                        cy={cy}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius + 8}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        fill={fill}
                        stroke={fill}
                        strokeWidth={2}
                        style={{
                          filter: "drop-shadow(0 0 10px rgba(0,0,0,0.1))",
                          transition:
                            "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                      />
                    );
                  }}
                  animationBegin={0}
                  animationDuration={1200}
                  isAnimationActive={true}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    />
                  ))}
                  {showLabel && (
                    <Label
                      position="center"
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <g className="fade-in-label">
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                  textAnchor="middle"
                                >
                                  {maxPercentage}%
                                </text>
                                <text
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground text-[10px]"
                                  textAnchor="middle"
                                >
                                  {maxCategory.name}
                                </text>
                              </text>
                            </g>
                          );
                        }
                      }}
                    />
                  )}
                </Pie>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="space-y-4 pt-4 border-t border-muted/20">
          {categoryData.slice(0, 4).map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((item.value / total) * 100)}%
                  </p>
                </div>
              </div>
              <div className="text-right text-sm font-bold">
                ${item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
