
import { useEffect, useMemo, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import TransactionModal from "./components/TransactionModal";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import SavingsGoals from "./pages/SavingsGoals";
import Settings from "./pages/Settings";

import {
  initialTransactions,
  initialBudgets,
  initialGoals,
  loadData,
  money,
} from "./data/initialData";

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

export default function App() {
  const [page, setPage] = useState("Dashboard");

  const [transactions, setTransactions] = useState(() =>
    loadData("spendora-transactions", initialTransactions)
  );

  const [budgets, setBudgets] = useState(() =>
    loadData("spendora-budgets", initialBudgets)
  );

  const [goals, setGoals] = useState(() =>
    loadData("spendora-goals", initialGoals)
  );

  const [currency, setCurrency] = useState(() =>
    loadData("spendora-currency", "INR")
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "spendora-transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      "spendora-budgets",
      JSON.stringify(budgets)
    );
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(
      "spendora-goals",
      JSON.stringify(goals)
    );
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(
      "spendora-currency",
      JSON.stringify(currency)
    );
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

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  }

  function openAddTransaction() {
    setEditingTransaction(null);
    setModalOpen(true);
  }

  function openEditTransaction(transaction) {
    setEditingTransaction(transaction);
    setModalOpen(true);
  }

  function saveTransaction(transaction) {
    if (transaction.id) {
      setTransactions((current) =>
        current.map((item) =>
          item.id === transaction.id ? transaction : item
        )
      );

      setNotice("Transaction updated successfully.");
    } else {
      setTransactions((current) => [
        { ...transaction, id: Date.now() },
        ...current,
      ]);

      setNotice("Transaction added successfully.");
    }

    setModalOpen(false);
    setEditingTransaction(null);
    setPage("Transactions");
  }

  function deleteTransaction(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this transaction?"
      )
    ) {
      return;
    }

    setTransactions((current) =>
      current.filter((item) => item.id !== id)
    );

    setNotice("Transaction deleted.");
  }

  function saveBudget(budget) {
    setBudgets((current) => {
      const existing = current.find(
        (item) => item.category === budget.category
      );

      if (existing) {
        return current.map((item) =>
          item.category === budget.category
            ? { ...item, limit: budget.limit }
            : item
        );
      }

      return [...current, { ...budget, id: Date.now() }];
    });

    setNotice("Budget saved successfully.");
  }

  function addGoal(goal) {
    setGoals((current) => [
      ...current,
      { ...goal, id: Date.now() },
    ]);

    setNotice("Savings goal created.");
  }

  function addSavings(id) {
    const answer = window.prompt(
      "Enter the amount you saved:"
    );

    if (answer === null) return;

    const amount = Number(answer);

    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert(
        "Please enter a valid amount greater than zero."
      );
      return;
    }

    setGoals((current) =>
      current.map((goal) =>
        goal.id === id
          ? { ...goal, saved: Number(goal.saved) + amount }
          : goal
      )
    );

    setNotice("Savings progress updated.");
  }

  function resetData() {
    const confirmed = window.confirm(
      "Restore sample data? Your current browser data will be replaced."
    );

    if (!confirmed) return;

    setTransactions(initialTransactions);
    setBudgets(initialBudgets);
    setGoals(initialGoals);
    setCurrency("INR");

    setNotice("Sample data restored.");
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
              onDeleteBudget={(id) => {
                setBudgets((current) =>
                  current.filter((item) => item.id !== id)
                );
                setNotice("Budget deleted.");
              }}
            />
          )}

          {page === "Goals" && (
            <SavingsGoals
              goals={goals}
              formatMoney={formatMoney}
              onAddGoal={addGoal}
              onAddSavings={addSavings}
              onDeleteGoal={(id) => {
                setGoals((current) =>
                  current.filter((goal) => goal.id !== id)
                );
                setNotice("Savings goal deleted.");
              }}
            />
          )}

          {page === "Settings" && (
            <Settings
              currency={currency}
              setCurrency={setCurrency}
              onReset={resetData}
            />
          )}

          <footer className="footer">
            <span className="footer-brand">
              spendora<span className="footer-dot">.</span>
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
