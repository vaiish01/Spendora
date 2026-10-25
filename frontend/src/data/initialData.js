
/**
 * Spendora - Initial application data and helper functions.
 * File: src/data/initialData.js
 */

// Initial transactions
export const initialTransactions = [
  {
    id: 1,
    name: "Monthly salary",
    category: "Salary",
    date: "2026-10-25",
    amount: 65000,
    type: "income",
  },
  {
    id: 2,
    name: "Grocery shopping",
    category: "Food",
    date: "2026-10-24",
    amount: 1850,
    type: "expense",
  },
  {
    id: 3,
    name: "Internet bill",
    category: "Bills",
    date: "2026-10-23",
    amount: 999,
    type: "expense",
  },
  {
    id: 4,
    name: "Coffee with friends",
    category: "Lifestyle",
    date: "2026-10-22",
    amount: 450,
    type: "expense",
  },
  {
    id: 5,
    name: "Cab fare",
    category: "Transport",
    date: "2026-10-21",
    amount: 320,
    type: "expense",
  },
];

// Initial budgets
export const initialBudgets = [
  { id: 1, category: "Food", limit: 6000 },
  { id: 2, category: "Transport", limit: 2500 },
  { id: 3, category: "Lifestyle", limit: 3000 },
  { id: 4, category: "Bills", limit: 2000 },
];

// Initial savings goals
export const initialGoals = [
  {
    id: 1,
    name: "Emergency fund",
    target: 50000,
    saved: 18000,
    icon: "✳",
  },
  {
    id: 2,
    name: "New laptop",
    target: 80000,
    saved: 32000,
    icon: "⌘",
  },
];

// Format an amount as Indian Rupees.
export const money = (value) => {
  const amount = Number(value);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
};

// Return today's date in YYYY-MM-DD format using local time.
export const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Safely read saved data from browser localStorage.
export function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (saved === null) {
      return fallback;
    }

    const parsed = JSON.parse(saved);

    return parsed ?? fallback;
  } catch (error) {
    console.error(`Unable to load Spendora data for "${key}":`, error);
    return fallback;
  }
}
