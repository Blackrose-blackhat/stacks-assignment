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
} from "lucide-react";
import React from "react";

const data = [
  {
    name: "Food & Drink",
    value: 1200,
    color: "oklch(0.685 0.035 165.45)", // muted sage
    icon: <Utensils className="h-4 w-4" />,
  },
  {
    name: "Rent & Utilities",
    value: 2500,
    color: "oklch(0.585 0.185 262.13)", // desaturated blue
    icon: <Home className="h-4 w-4" />,
  },
  {
    name: "Entertainment",
    value: 800,
    color: "oklch(0.577 0.245 27.325)", // destructive red
    icon: <Tv className="h-4 w-4" />,
  },
  {
    name: "Shopping",
    value: 1500,
    color: "oklch(0.769 0.188 70.08)", // chart color
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    name: "Transport",
    value: 600,
    color: "oklch(0.828 0.189 84.429)", // chart color
    icon: <Car className="h-4 w-4" />,
  },
];

const chartConfig = {
  value: {
    label: "Amount",
  },
  "Food & Drink": {
    label: "Food & Drink",
    color: "oklch(0.685 0.035 165.45)",
  },
  "Rent & Utilities": {
    label: "Rent & Utilities",
    color: "oklch(0.585 0.185 262.13)",
  },
  Entertainment: {
    label: "Entertainment",
    color: "oklch(0.577 0.245 27.325)",
  },
  Shopping: {
    label: "Shopping",
    color: "oklch(0.769 0.188 70.08)",
  },
  Transport: {
    label: "Transport",
    color: "oklch(0.828 0.189 84.429)",
  },
} satisfies ChartConfig;

export function CategoryBreakdown() {
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [showLabel, setShowLabel] = React.useState(false);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const maxCategoryIndex = data.reduce(
    (maxIdx, curr, idx, arr) => (curr.value > arr[maxIdx].value ? idx : maxIdx),
    0,
  );
  const maxCategory = data[maxCategoryIndex];
  const maxPercentage = Math.round((maxCategory.value / total) * 100);

  React.useEffect(() => {
    // Stage 1: Initial chart draw
    // Stage 2: Zoom out top slice
    const zoomTimer = setTimeout(() => {
      setActiveIndex(maxCategoryIndex);
    }, 500);

    // Stage 3: Fade in label
    const labelTimer = setTimeout(() => {
      setShowLabel(true);
    }, 900);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(labelTimer);
    };
  }, [maxCategoryIndex]);

  return (
    <Card className="col-span-1 md:col-span-3 border-none shadow-md bg-card rounded-3xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Categories</CardTitle>
        <CardDescription>Highest spending areas this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-[200px] w-full relative">
            <style>{`
              @keyframes bounce-in {
                0% { transform: scale(0.9); opacity: 0; }
                50% { transform: scale(1.05); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
              }
              .sector-zoom {
                transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
              }
              .fade-in-label {
                animation: fade-up 0.8s ease-out forwards;
              }
              @keyframes fade-up {
                from { transform: translateY(10px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* @ts-ignore - Pie type might skip activeIndex in some versions */}
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    // @ts-ignore
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
                          outerRadius={outerRadius + 15}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                          stroke={fill}
                          strokeWidth={2}
                          style={{
                            filter: "drop-shadow(0 0 12px rgba(0,0,0,0.15))",
                            transition:
                              "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                        />
                      );
                    }}
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                    isAnimationActive={true}
                  >
                    {data.map((entry, index) => (
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
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-3xl font-bold"
                                  >
                                    {maxPercentage}%
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground text-xs"
                                  >
                                    Top Spent
                                  </tspan>
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
          <div className="space-y-4">
            {data.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
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
                      {Math.round((item.value / total) * 100)}% of spending
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm font-bold">
                  ${item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
