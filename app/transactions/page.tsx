"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { columns } from "@/components/transactions/columns";
import { DataTable } from "@/components/transactions/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactions();

  const openAddTransaction = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 space-y-10 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage and monitor your complete financial history.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-muted-foreground/20 gap-2 h-10"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            className="rounded-xl flex items-center gap-2 h-10 px-3 lg:pr-1.5"
            onClick={openAddTransaction}
          >
            <Plus className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
            <span className="hidden lg:inline">New Transaction</span>
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        meta={{ deleteTransaction }}
      />
    </div>
  );
}
