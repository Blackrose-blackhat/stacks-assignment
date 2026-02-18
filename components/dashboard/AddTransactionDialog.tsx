"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionDialog({
  open,
  onOpenChange,
}: AddTransactionDialogProps) {
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    category: "",
    status: "paid" as "paid" | "pending" | "failed",
    type: "expense" as "income" | "expense",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.merchant || !formData.amount || !formData.category) return;

    addTransaction({
      merchant: formData.merchant,
      amount: parseFloat(formData.amount),
      category: formData.category,
      status: formData.status,
      type: formData.type,
    });

    onOpenChange(false);
    setFormData({
      merchant: "",
      amount: "",
      category: "",
      status: "paid",
      type: "expense",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-[425px] bg-background rounded-3xl border-input/30 p-6">
        <DialogHeader className="mb-4 text-left">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Add Transaction
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the details of your new transaction below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex p-1 bg-input/20 rounded-2xl mb-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "expense" })}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                formData.type === "expense"
                  ? "bg-input/20 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "income" })}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                formData.type === "income"
                  ? "bg-input/20 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Income
            </button>
          </div>

          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="merchant" className="text-sm font-medium ml-1">
                Merchant
              </Label>
              <Input
                id="merchant"
                name="merchant"
                placeholder="Apple Store, Starbucks..."
                value={formData.merchant}
                onChange={(e) =>
                  setFormData({ ...formData, merchant: e.target.value })
                }
                className="h-11 rounded-xl bg-input/20 border-muted/20 focus:bg-input/20 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium ml-1">
                  Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="h-11 pl-7 rounded-xl bg-muted/30 border-muted/20 focus:bg-background transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium ml-1">
                  Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Technology..."
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="h-11 rounded-xl bg-muted/30 border-muted/20 focus:bg-background transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 sm:pt-2">
            <Button
              type="submit"
              className="w-full sm:w-auto rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all shadow-sm"
            >
              Save Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
