
/**
 * Spendora - Application helper functions.
 * File: src/data/initialData.js
 */

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
