"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "destructive" | "warning";
}

function OverviewCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
}: OverviewCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-none shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group",
        variant === "success" &&
          "bg-gradient-to-br from-emerald-500/10 via-card to-card",
        variant === "destructive" &&
          "bg-gradient-to-br from-rose-500/10 via-card to-card",
        variant === "warning" &&
          "bg-gradient-to-br from-amber-500/10 via-card to-card",
        variant === "default" &&
          "bg-gradient-to-br from-primary/10 via-card to-card",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "p-2 rounded-xl transition-colors duration-300 group-hover:scale-110",
            variant === "success" && "bg-emerald-500/10 text-emerald-500",
            variant === "destructive" && "bg-rose-500/10 text-rose-500",
            variant === "warning" && "bg-amber-500/10 text-amber-500",
            variant === "default" && "bg-primary/10 text-primary",
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <div
              className={cn(
                "flex items-center text-xs font-medium",
                trend.isPositive ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {trend.value}
            </div>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        title="Total Income"
        value="$12,450.00"
        description="from last month"
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: "12%", isPositive: true }}
        variant="success"
      />
      <OverviewCard
        title="Total Expenses"
        value="$4,280.50"
        description="from last month"
        icon={<TrendingDown className="h-5 w-5" />}
        trend={{ value: "8%", isPositive: false }}
        variant="destructive"
      />
      <OverviewCard
        title="Net Balance"
        value="$8,169.50"
        description="Available now"
        icon={<Wallet className="h-5 w-5" />}
        variant="default"
      />
      <OverviewCard
        title="Savings Rate"
        value="65.6%"
        description="of total income"
        icon={<PiggyBank className="h-5 w-5" />}
        trend={{ value: "2.4%", isPositive: true }}
        variant="warning"
      />
    </div>
  );
}
