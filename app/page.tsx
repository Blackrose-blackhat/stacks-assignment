"use client";

import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-10 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Financial Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track income, expenses, and balance trends across your recent
            activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full px-6 border-muted-foreground/20 hover:bg-muted/50"
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>

          <Button
            variant="default"
            size="sm"
            className="hidden  lg:flex items-center gap-2 rounded-xl   transition-all text-xs font-medium pr-1.5 h-9"
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                ctrlKey: true,
                bubbles: true,
                cancelable: true,
              });
              document.dispatchEvent(event);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Transaction
            <kbd className="pointer-events-none ml-1 inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
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
