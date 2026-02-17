export type Transaction = {
  id: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  merchant: string;
  category: string;
  date: string;
  type: "income" | "expense";
};

const STORAGE_KEY = "fin-tracker-transactions";

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    amount: 5200.0,
    status: "paid",
    merchant: "Monthly Salary",
    category: "Income",
    date: "2026-02-01",
    type: "income",
  },
  {
    id: "tx-2",
    amount: 199.0,
    status: "paid",
    merchant: "Apple Store",
    category: "Electronics",
    date: "2026-02-15",
    type: "expense",
  },
  {
    id: "tx-3",
    amount: 5.5,
    status: "paid",
    merchant: "Starbucks",
    category: "Food & Drinks",
    date: "2026-02-14",
    type: "expense",
  },
  {
    id: "tx-4",
    amount: 1200.0,
    status: "pending",
    merchant: "Monthly Rent",
    category: "Housing",
    date: "2026-02-01",
    type: "expense",
  },
  {
    id: "tx-5",
    amount: 45.99,
    status: "paid",
    merchant: "Amazon",
    category: "Shopping",
    date: "2026-02-12",
    type: "expense",
  },
  {
    id: "tx-6",
    amount: 15.99,
    status: "failed",
    merchant: "Netflix",
    category: "Entertainment",
    date: "2026-02-10",
    type: "expense",
  },
];

export const getStoredTransactions = (): Transaction[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return MOCK_TRANSACTIONS;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse transactions from local storage", error);
    return MOCK_TRANSACTIONS;
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};
