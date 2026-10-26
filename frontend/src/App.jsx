
import { useEffect, useMemo, useState } from "react";
import api from "./api/api";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import TransactionModal from "./components/TransactionModal";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import SavingsGoals from "./pages/SavingsGoals";
import Settings from "./pages/Settings";

import { loadData, money } from "./data/initialData";

const PAGE_INFO = {
  Dashboard: {
    title: "Your finances, made clearer.",
    description: "A simple picture of where your money stands.",
  },
  Transactions: {
    title: "Every rupee, accounted for.",
    description: "Review and manage your income and expenses.",
  },
  Budgets: {
    title: "Spend with intention.",
    description: "Set limits that work for your everyday life.",
  },
  Goals: {
    title: "Make room for what matters.",
    description: "Turn your plans into achievable milestones.",
  },
  Settings: {
    title: "Make Spendora yours.",
    description: "Personalise your finance workspace.",
  },
};

// Convert backend transaction fields into the fields used by your UI.
function mapTransaction(item) {
  return {
    ...item,
    id: item.id,
    name: item.name ?? item.title ?? "",
    amount: Number(item.amount ?? 0),
    type: item.type ?? "expense",
    category: item.category ?? "Other",
    date: item.date ?? "",
  };
}

// Convert backend budget data into the fields used by your UI.
function mapBudget(item) {
  return {
    ...item,
    id: item.id,
    category: item.category ?? "Other",
    limit: Number(item.limit ?? 0),
  };
}

// Convert backend goal fields into the fields used by your UI.
function mapGoal(item) {
  return {
    ...item,
    id: item.id,
    name: item.name ?? "",
    target: Number(item.target ?? item.targetAmount ?? 0),
    saved: Number(item.saved ?? item.savedAmount ?? 0),
    icon: item.icon ?? "✳",
  };
}

export default function App() {
  const [page, setPage] = useState("Dashboard");

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  const [currency, setCurrency] = useState(() =>
    loadData("spendora-currency", "INR")
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  // Load saved data from Spring Boot when the app opens.
  useEffect(() => {
    let active = true;

    async function loadBackendData() {
      setLoading(true);

      const results = await Promise.allSettled([
        api.get("/transactions"),
        api.get("/budgets"),
        api.get("/goals"),
        api.get("/settings"),
      ]);

      if (!active) return;

      const [transactionResult, budgetResult, goalResult, settingsResult] =
        results;

      const errors = [];

      if (transactionResult.status === "fulfilled") {
        const data = transactionResult.value.data;
        setTransactions(
          (Array.isArray(data) ? data : data?.content ?? []).map(mapTransaction)
        );
      } else {
        console.error("Could not load transactions:", transactionResult.reason);
        errors.push("transactions");
      }

      if (budgetResult.status === "fulfilled") {
        const data = budgetResult.value.data;
        setBudgets(
          (Array.isArray(data) ? data : data?.content ?? []).map(mapBudget)
        );
      } else {
        console.error("Could not load budgets:", budgetResult.reason);
        errors.push("budgets");
      }

      if (goalResult.status === "fulfilled") {
        const data = goalResult.value.data;
        setGoals(
          (Array.isArray(data) ? data : data?.content ?? []).map(mapGoal)
        );
      } else {
        console.error("Could not load goals:", goalResult.reason);
        errors.push("savings goals");
      }

      if (settingsResult.status === "fulfilled") {
        const settings = settingsResult.value.data;

        document.documentElement.classList.toggle(
          "dark-mode",
          Boolean(settings.darkMode)
        );

        if (settings.currency) {
          setCurrency(settings.currency);
        }
      } else {
        console.error("Could not load settings:", settingsResult.reason);
        errors.push("settings");
      }

      if (errors.length > 0) {
        setNotice(
          `Could not load ${errors.join(", ")} from the backend. Check that Spring Boot and PostgreSQL are running.`
        );
      }

      setLoading(false);
    }

    loadBackendData();

    return () => {
      active = false;
    };
  }, []);

  // Save the selected currency locally.
  useEffect(() => {
    localStorage.setItem("spendora-currency", JSON.stringify(currency));
  }, [currency]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const saved = goals.reduce(
      (sum, goal) => sum + Number(goal.saved),
      0
    );

    return {
      income,
      expenses,
      balance: income - expenses,
      saved,
    };
  }, [transactions, goals]);

  const expensesByCategory = useMemo(() => {
    return transactions
      .filter((item) => item.type === "expense")
      .reduce((result, item) => {
        result[item.category] =
          (result[item.category] || 0) + Number(item.amount);

        return result;
      }, {});
  }, [transactions]);

  function formatMoney(amount) {
    if (currency === "INR") {
      return money(amount);
    }

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(Number(amount) || 0);
    } catch {
      return money(amount);
    }
  }

  function openAddTransaction() {
    setEditingTransaction(null);
    setModalOpen(true);
  }

  function openEditTransaction(transaction) {
    setEditingTransaction(transaction);
    setModalOpen(true);
  }

  // Create or update a transaction in the backend.
  async function saveTransaction(transaction) {
    const payload = {
      title: transaction.name,
      amount: Number(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    };

    try {
      if (transaction.id) {
        const response = await api.put(
          `/transactions/${transaction.id}`,
          payload
        );

        const updated = mapTransaction({
          ...payload,
          ...(response.data ?? {}),
          id: transaction.id,
          name: response.data?.name ?? response.data?.title ?? payload.title,
        });

        setTransactions((current) =>
          current.map((item) =>
            item.id === transaction.id ? updated : item
          )
        );

        setNotice("Transaction updated successfully.");
      } else {
        const response = await api.post("/transactions", payload);

        const created = mapTransaction({
          ...payload,
          ...(response.data ?? {}),
          name: response.data?.name ?? response.data?.title ?? payload.title,
        });

        if (created.id == null) {
          throw new Error("The backend did not return the new transaction ID.");
        }

        setTransactions((current) => [created, ...current]);
        setNotice("Transaction added successfully.");
      }

      setModalOpen(false);
      setEditingTransaction(null);
      setPage("Transactions");
    } catch (error) {
      console.error("Could not save transaction:", error);
      setNotice(
        error.response?.data?.message ??
          "Could not save the transaction. Check the backend and try again."
      );
    }
  }

  async function deleteTransaction(id) {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await api.delete(`/transactions/${id}`);

      setTransactions((current) =>
        current.filter((item) => item.id !== id)
      );

      setNotice("Transaction deleted.");
    } catch (error) {
      console.error("Could not delete transaction:", error);
      setNotice("Could not delete the transaction. Please try again.");
    }
  }

  // Create a budget or update the existing budget for its category.
  async function saveBudget(budget) {
    const existing = budgets.find(
      (item) => item.category === budget.category
    );

    const payload = {
      category: budget.category,
      limit: Number(budget.limit),
    };

    try {
      if (existing) {
        const response = await api.put(
          `/budgets/${existing.id}`,
          payload
        );

        const updated = mapBudget({
          ...payload,
          ...(response.data ?? {}),
          id: existing.id,
        });

        setBudgets((current) =>
          current.map((item) =>
            item.id === existing.id ? updated : item
          )
        );
      } else {
        const response = await api.post("/budgets", payload);
        const created = mapBudget(response.data);

        if (created.id == null) {
          throw new Error("The backend did not return the new budget ID.");
        }

        setBudgets((current) => [...current, created]);
      }

      setNotice("Budget saved successfully.");
    } catch (error) {
      console.error("Could not save budget:", error);
      setNotice(
        error.response?.data?.message ??
          "Could not save the budget. Please try again."
      );
    }
  }

  async function deleteBudget(id) {
    try {
      await api.delete(`/budgets/${id}`);

      setBudgets((current) =>
        current.filter((item) => item.id !== id)
      );

      setNotice("Budget deleted.");
    } catch (error) {
      console.error("Could not delete budget:", error);
      setNotice("Could not delete the budget. Please try again.");
    }
  }

  // Create a savings goal.
  async function addGoal(goal) {
    const payload = {
      name: goal.name,
      targetAmount: Number(goal.target),
      savedAmount: Number(goal.saved ?? 0),
    };

    try {
      const response = await api.post("/goals", payload);
      const created = mapGoal({
        ...payload,
        ...(response.data ?? {}),
        icon: goal.icon ?? "✳",
      });

      if (created.id == null) {
        throw new Error("The backend did not return the new goal ID.");
      }

      setGoals((current) => [...current, created]);
      setNotice("Savings goal created.");
    } catch (error) {
      console.error("Could not create savings goal:", error);
      setNotice(
        error.response?.data?.message ??
          "Could not create the savings goal. Please try again."
      );
    }
  }

  // Add savings by updating the existing goal in the backend.
  async function addSavings(id) {
    const answer = window.prompt("Enter the amount you saved:");

    if (answer === null) return;

    const amount = Number(answer);

    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert("Please enter a valid amount greater than zero.");
      return;
    }

    const existing = goals.find((goal) => goal.id === id);

    if (!existing) {
      setNotice("Could not find that savings goal.");
      return;
    }

    const payload = {
      name: existing.name,
      targetAmount: Number(existing.target),
      savedAmount: Number(existing.saved) + amount,
    };

    try {
      const response = await api.put(`/goals/${id}`, payload);

      const updated = mapGoal({
        ...payload,
        ...(response.data ?? {}),
        id,
        icon: existing.icon,
      });

      setGoals((current) =>
        current.map((goal) => (goal.id === id ? updated : goal))
      );

      setNotice("Savings progress updated.");
    } catch (error) {
      console.error("Could not update savings:", error);
      setNotice(
        error.response?.data?.message ??
          "Could not update savings. Please try again."
      );
    }
  }

  async function deleteGoal(id) {
    try {
      await api.delete(`/goals/${id}`);

      setGoals((current) =>
        current.filter((goal) => goal.id !== id)
      );

      setNotice("Savings goal deleted.");
    } catch (error) {
      console.error("Could not delete savings goal:", error);
      setNotice("Could not delete the savings goal. Please try again.");
    }
  }

  function resetData() {
    const confirmed = window.confirm(
      "This app is connected to the backend. Resetting sample data is not available here. Your saved database records will not be deleted. Reset your currency preference to INR?"
    );

    if (!confirmed) return;

    setCurrency("INR");
    setNotice("Currency preference reset to INR. Your database records are unchanged.");
  }

  const pageInfo = PAGE_INFO[page] || PAGE_INFO.Dashboard;

  return (
    <div className="spendora-app">
      <Sidebar page={page} setPage={setPage} />

      <main className="main-area">
        <Topbar page={page} />

        <div className="page-wrap">
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).toUpperCase()}
              </div>

              <h1>{pageInfo.title}</h1>
              <p>{pageInfo.description}</p>
            </div>
          </section>

          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}

          {loading ? (
            <section className="panel">
              <p>Connecting to Spendora backend...</p>
            </section>
          ) : (
            <>
              {page === "Dashboard" && (
                <Dashboard
                  totals={totals}
                  formatMoney={formatMoney}
                  expensesByCategory={expensesByCategory}
                  transactions={transactions}
                  goals={goals}
                  onEdit={openEditTransaction}
                  onDelete={deleteTransaction}
                  onViewTransactions={() => setPage("Transactions")}
                  onViewGoals={() => setPage("Goals")}
                />
              )}

              {page === "Transactions" && (
                <Transactions
                  transactions={transactions}
                  formatMoney={formatMoney}
                  onAdd={openAddTransaction}
                  onEdit={openEditTransaction}
                  onDelete={deleteTransaction}
                />
              )}

              {page === "Budgets" && (
                <Budgets
                  budgets={budgets}
                  expensesByCategory={expensesByCategory}
                  formatMoney={formatMoney}
                  onSaveBudget={saveBudget}
                  onDeleteBudget={deleteBudget}
                />
              )}

              {page === "Goals" && (
                <SavingsGoals
                  goals={goals}
                  formatMoney={formatMoney}
                  onAddGoal={addGoal}
                  onAddSavings={addSavings}
                  onDeleteGoal={deleteGoal}
                />
              )}

              {page === "Settings" && (
                <Settings
                  currency={currency}
                  setCurrency={setCurrency}
                  onReset={resetData}
                />
              )}
            </>
          )}

          <footer className="footer">
            <span className="footer-brand">
              spendora<span className="footer-dot"></span>
            </span>
            <span>Make every rupee count.</span>
          </footer>
        </div>
      </main>

      <TransactionModal
        open={modalOpen}
        editingTransaction={editingTransaction}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={saveTransaction}
      />
    </div>
  );
}
