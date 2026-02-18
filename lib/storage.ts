export type Transaction = {
  id: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  merchant: string;
  category: string;
  date: string;
  type: "income" | "expense";
};

const STORAGE_KEY = "fin-tracker-transactions-v2";

const MOCK_TRANSACTIONS: Transaction[] = [
  // ── February 2026 ──
  { id: "tx-01", amount: 5200,    status: "paid",    merchant: "Monthly Salary",      category: "Income",          date: "2026-02-01", type: "income"  },
  { id: "tx-02", amount: 750,     status: "paid",    merchant: "Freelance Project",   category: "Income",          date: "2026-02-10", type: "income"  },
  { id: "tx-03", amount: 1200,    status: "pending", merchant: "Monthly Rent",         category: "Housing",         date: "2026-02-01", type: "expense" },
  { id: "tx-04", amount: 199,     status: "paid",    merchant: "Apple Store",          category: "Electronics",     date: "2026-02-15", type: "expense" },
  { id: "tx-05", amount: 85.5,    status: "paid",    merchant: "Whole Foods",          category: "Groceries",       date: "2026-02-08", type: "expense" },
  { id: "tx-06", amount: 45.99,   status: "paid",    merchant: "Amazon",               category: "Shopping",        date: "2026-02-12", type: "expense" },
  { id: "tx-07", amount: 15.99,   status: "failed",  merchant: "Netflix",              category: "Entertainment",   date: "2026-02-10", type: "expense" },

  // ── January 2026 ──
  { id: "tx-08", amount: 5200,    status: "paid",    merchant: "Monthly Salary",      category: "Income",          date: "2026-01-01", type: "income"  },
  { id: "tx-09", amount: 320,     status: "paid",    merchant: "Side Gig Payment",    category: "Income",          date: "2026-01-18", type: "income"  },
  { id: "tx-10", amount: 1200,    status: "paid",    merchant: "Monthly Rent",         category: "Housing",         date: "2026-01-01", type: "expense" },
  { id: "tx-11", amount: 120,     status: "paid",    merchant: "Electric Company",     category: "Utilities",       date: "2026-01-05", type: "expense" },
  { id: "tx-12", amount: 65,      status: "paid",    merchant: "Trader Joe's",         category: "Groceries",       date: "2026-01-10", type: "expense" },
  { id: "tx-13", amount: 299,     status: "paid",    merchant: "Winter Jacket",        category: "Shopping",        date: "2026-01-22", type: "expense" },
  { id: "tx-14", amount: 42,      status: "paid",    merchant: "Uber Eats",            category: "Food & Drinks",   date: "2026-01-15", type: "expense" },

  // ── December 2025 ──
  { id: "tx-15", amount: 5200,    status: "paid",    merchant: "Monthly Salary",      category: "Income",          date: "2025-12-01", type: "income"  },
  { id: "tx-16", amount: 2500,    status: "paid",    merchant: "Year-End Bonus",      category: "Income",          date: "2025-12-20", type: "income"  },
  { id: "tx-17", amount: 1200,    status: "paid",    merchant: "Monthly Rent",         category: "Housing",         date: "2025-12-01", type: "expense" },
  { id: "tx-18", amount: 450,     status: "paid",    merchant: "Holiday Gifts",        category: "Shopping",        date: "2025-12-18", type: "expense" },
  { id: "tx-19", amount: 180,     status: "paid",    merchant: "Christmas Dinner",     category: "Food & Drinks",   date: "2025-12-25", type: "expense" },
  { id: "tx-20", amount: 89,      status: "paid",    merchant: "Spotify Annual",       category: "Entertainment",   date: "2025-12-15", type: "expense" },
  { id: "tx-21", amount: 55,      status: "paid",    merchant: "Gas Station",          category: "Transportation",  date: "2025-12-10", type: "expense" },

  // ── November 2025 ──
  { id: "tx-22", amount: 5200,    status: "paid",    merchant: "Monthly Salary",      category: "Income",          date: "2025-11-01", type: "income"  },
  { id: "tx-23", amount: 1200,    status: "paid",    merchant: "Monthly Rent",         category: "Housing",         date: "2025-11-01", type: "expense" },
  { id: "tx-24", amount: 135,     status: "paid",    merchant: "Internet + Phone",     category: "Utilities",       date: "2025-11-05", type: "expense" },
  { id: "tx-25", amount: 72,      status: "paid",    merchant: "Target",               category: "Groceries",       date: "2025-11-12", type: "expense" },
  { id: "tx-26", amount: 250,     status: "paid",    merchant: "Car Insurance",        category: "Insurance",       date: "2025-11-15", type: "expense" },
  { id: "tx-27", amount: 38,      status: "paid",    merchant: "Chipotle",             category: "Food & Drinks",   date: "2025-11-20", type: "expense" },

  // ── October 2025 ──
  { id: "tx-28", amount: 5200,    status: "paid",    merchant: "Monthly Salary",      category: "Income",          date: "2025-10-01", type: "income"  },
  { id: "tx-29", amount: 600,     status: "paid",    merchant: "Consulting Fee",       category: "Income",          date: "2025-10-15", type: "income"  },
  { id: "tx-30", amount: 1200,    status: "paid",    merchant: "Monthly Rent",         category: "Housing",         date: "2025-10-01", type: "expense" },
  { id: "tx-31", amount: 95,      status: "paid",    merchant: "Costco",               category: "Groceries",       date: "2025-10-08", type: "expense" },
  { id: "tx-32", amount: 150,     status: "paid",    merchant: "Concert Tickets",      category: "Entertainment",   date: "2025-10-20", type: "expense" },
  { id: "tx-33", amount: 200,     status: "paid",    merchant: "Health Checkup",       category: "Healthcare",      date: "2025-10-25", type: "expense" },
  { id: "tx-34", amount: 60,      status: "paid",    merchant: "Gas Station",          category: "Transportation",  date: "2025-10-12", type: "expense" },

  // ── September 2025 ──
  { id: "tx-35", amount: 5200,    status: "paid",    merchant: "Monthly Salary",      category: "Income",          date: "2025-09-01", type: "income"  },
  { id: "tx-36", amount: 1200,    status: "paid",    merchant: "Monthly Rent",         category: "Housing",         date: "2025-09-01", type: "expense" },
  { id: "tx-37", amount: 350,     status: "paid",    merchant: "Back to School",       category: "Education",       date: "2025-09-05", type: "expense" },
  { id: "tx-38", amount: 88,      status: "paid",    merchant: "Grocery Outlet",       category: "Groceries",       date: "2025-09-14", type: "expense" },
  { id: "tx-39", amount: 110,     status: "paid",    merchant: "Electric Company",     category: "Utilities",       date: "2025-09-03", type: "expense" },
  { id: "tx-40", amount: 25,      status: "paid",    merchant: "Starbucks",            category: "Food & Drinks",   date: "2025-09-22", type: "expense" },
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
