"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Search,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Filter,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/use-transactions";
import { Transaction } from "@/lib/storage";

// --- Empty State Component ---
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-muted/50 p-6 rounded-full">
        <Inbox className="h-12 w-12 text-muted-foreground opacity-50" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">No transactions found</h3>
        <p className="text-muted-foreground max-w-[300px]">
          It looks like you haven't made any transactions yet. Start tracking
          your spending by adding a new one.
        </p>
      </div>
      <Button
        variant="default"
        className="rounded-full px-8 "
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
        Add Transaction
      </Button>
    </div>
  );
}

export function TransactionList() {
  const { transactions, deleteTransaction, isHydrated } = useTransactions();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filterValue, setFilterValue] = React.useState("");

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "merchant",
        header: "Merchant",
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
              <span className="font-semibold ">{row.getValue("merchant")}</span>
              <span className="text-xs text-muted-foreground">
                {row.original.category}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div className="text-muted-foreground">{row.getValue("date")}</div>
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
                "rounded-full px-3 py-1 font-medium capitalize border-none",
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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="hover:bg-transparent p-0 font-medium"
            >
              Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount);

          return (
            <div className="text-right font-bold text-lg">{formatted}</div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
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
              <DropdownMenuContent
                align="end"
                className="rounded-xl border-border"
              >
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(row.original.id)}
                >
                  Copy transaction ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => deleteTransaction(row.original.id)}
                >
                  Delete transaction
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteTransaction],
  );

  const data = React.useMemo(() => {
    if (!filterValue) return transactions;
    return transactions.filter(
      (t) =>
        t.merchant.toLowerCase().includes(filterValue.toLowerCase()) ||
        t.category.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [filterValue, transactions]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  // --- Skeleton while loading ---
  if (!isHydrated) {
    return (
      <Card className="bg-input/10 rounded-3xl overflow-hidden">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="h-7 w-48 bg-muted/50 rounded animate-pulse" />
              <div className="h-4 w-56 bg-muted/30 rounded animate-pulse mt-2" />
            </div>
            <div className="h-10 w-[250px] bg-muted/30 rounded-xl animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border overflow-hidden">
            <div className="bg-input/20 px-6 py-4 flex gap-12">
              {["w-24", "w-16", "w-16", "w-20"].map((w, i) => (
                <div
                  key={i}
                  className={`h-4 ${w} bg-muted/40 rounded animate-pulse`}
                />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="px-6 py-4 border-t border-input/20 flex items-center gap-12"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-muted/30 rounded-lg animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 w-28 bg-muted/40 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-muted/30 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-20 bg-muted/30 rounded animate-pulse" />
                <div className="h-6 w-16 bg-muted/30 rounded-full animate-pulse" />
                <div className="h-5 w-20 bg-muted/40 rounded animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-input/10 rounded-3xl overflow-hidden">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Recent Transactions</CardTitle>
            <CardDescription>
              A list of your last {data.length} activities.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={filterValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilterValue(e.target.value)
                }
                className="pl-9 w-full md:w-[250px] bg-muted/30 border-muted-foreground/20 rounded-xl focus:ring-primary/20"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-muted-foreground/20"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border  overflow-hidden">
              <Table>
                <TableHeader className="bg-input/20">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-transparent border-muted/30"
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className={cn(
                              "px-6 py-4 font-semibold text-foreground/80",
                              header.id === "amount" && "text-right",
                            )}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-input/20  transition-colors border-muted/20"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-6 py-4 border-b border-input/20"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 py-4">
              <p className="text-sm text-muted-foreground">
                Showing {table.getPaginationRowModel().rows.length} of{" "}
                {data.length} transactions
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="rounded-lg gap-1 border-muted/30"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="rounded-lg gap-1 border-muted/30"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
