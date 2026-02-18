"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/use-transactions";

interface OverviewCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  variant?: "default" | "success" | "destructive" | "warning";
}

function OverviewCard({
  title,
  value,
  description,
  icon,
  variant = "default",
}: OverviewCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 group hover:border-muted-foreground/30">
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
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export function OverviewCards() {
  const { transactions, isHydrated } = useTransactions();

  if (!isHydrated) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
              <div className="h-9 w-9 bg-muted/50 rounded-xl animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-7 w-28 bg-muted/50 rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-muted/30 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        description="Lifetime earnings"
        icon={<TrendingUp className="h-5 w-5" />}
        variant="success"
      />
      <OverviewCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        description="Lifetime spending"
        icon={<TrendingDown className="h-5 w-5" />}
        variant="destructive"
      />
      <OverviewCard
        title="Net Balance"
        value={formatCurrency(netBalance)}
        description="Available capital"
        icon={<Wallet className="h-5 w-5" />}
        variant="default"
      />
      <OverviewCard
        title="Savings Rate"
        value={`${savingsRate.toFixed(1)}%`}
        description="of total income"
        icon={<PiggyBank className="h-5 w-5" />}
        variant="warning"
      />
    </div>
  );
}
