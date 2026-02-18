"use client";

import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-10 max-w-7xl animate-in">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Financial Overview
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Track income, expenses, and balance trends across your recent
            activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl px-6 border-muted-foreground/20 hover:bg-muted/50 h-10"
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>

          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2 rounded-xl transition-all text-xs font-medium h-10 px-3 lg:pr-1.5"
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
                cancelable: true,
              });
              document.dispatchEvent(event);
            }}
          >
            <Plus className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
            <span className="hidden lg:inline">Add Transaction</span>
            <kbd className="pointer-events-none ml-1 hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
      </div>

      {/* Overview Cards Section */}
      <section className="space-y-6">
        <OverviewCards />
      </section>

      {/* Main Charts and Breakdown Section */}
      <div className="grid gap-8 md:grid-cols-12 items-stretch">
        <IncomeExpenseChart />
        <CategoryBreakdown />
      </div>

      {/* Detailed Transactions Section */}
      <section className="space-y-6">
        <TransactionList />
      </section>
    </div>
  );
}
