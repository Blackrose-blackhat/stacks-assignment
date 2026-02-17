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
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <main className="container mx-auto max-w-7xl py-12 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            className="rounded-xl border-muted-foreground/20 gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="rounded-xl gap-2 " onClick={openAddTransaction}>
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        meta={{ deleteTransaction }}
      />
    </main>
  );
}
