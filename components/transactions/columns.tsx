"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  CreditCard,
  ArrowUpRight,
  Trash2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Transaction } from "@/lib/storage";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "merchant",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent font-semibold"
      >
        Merchant
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-2 rounded-lg",
            row.original.type === "income"
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-muted text-muted-foreground",
          )}
        >
          {row.original.type === "income" ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">
            {row.getValue("merchant")}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.id}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="rounded-full font-medium border-muted-foreground/20"
      >
        {row.getValue("category")}
      </Badge>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent font-semibold"
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground tabular-nums">
        {row.getValue("date")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="secondary"
          className={cn(
            "rounded-full px-3 py-0.5 font-medium capitalize border-none",
            status === "paid" && "bg-emerald-500/10 text-emerald-600",
            status === "pending" && "bg-amber-500/10 text-amber-600",
            status === "failed" && "bg-rose-500/10 text-rose-600",
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-mr-4 hover:bg-transparent font-semibold"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div
          className={cn(
            "text-right font-bold text-lg tabular-nums",
            row.original.type === "income"
              ? "text-emerald-600"
              : "text-foreground",
          )}
        >
          {row.original.type === "income" ? "+" : "-"}
          {formatted}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted rounded-full"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.id)}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              // Note: deleteTransaction needs to be passed via meta or similar if defined here
              // For now, we'll implement the table to receive meta.
              onClick={() =>
                (row.table.options.meta as any)?.deleteTransaction(
                  transaction.id,
                )
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    enableHiding: true,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "rounded-full font-medium capitalize",
          row.getValue("type") === "income"
            ? "border-emerald-500/20 text-emerald-600"
            : "border-rose-500/20 text-rose-600",
        )}
      >
        {row.getValue("type")}
      </Badge>
    ),
  },
];
