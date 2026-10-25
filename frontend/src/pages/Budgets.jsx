
import { useState } from "react";
import "../styles/Budgets.css";

import EmptyState from "../components/EmptyState";

const categories = [
  "Food",
  "Transport",
  "Lifestyle",
  "Bills",
  "Shopping",
  "Health",
  "Other",
];

export default function Budgets({
  budgets,
  expensesByCategory,
  formatMoney,
  onSaveBudget,
  onDeleteBudget,
}) {
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const amount = Number(limit);

    if (!Number.isFinite(amount) || amount <= 0) return;

    onSaveBudget({
      category,
      limit: amount,
    });

    setLimit("");
  }

  return (
    <section className="budget-layout">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Your budgets</h2>
            <p>Keep spending within your limits</p>
          </div>
        </div>

        <div className="budget-list">
          {budgets.map((budget) => {
            const spent = expensesByCategory[budget.category] || 0;
            const percentage = budget.limit > 0
              ? Math.min((spent / budget.limit) * 100, 100)
              : 0;

            const overBudget = spent > budget.limit;

            return (
              <div className="budget-item" key={budget.id}>
                <div className="budget-top">
                  <div>
                    <span className="budget-symbol">◇</span>
                    <strong>{budget.category}</strong>
                  </div>

                  <button
                    className="icon-button danger-text"
                    onClick={() => onDeleteBudget(budget.id)}
                    aria-label={`Delete ${budget.category} budget`}
                  >
                    ×
                  </button>
                </div>

                <div className="budget-numbers">
                  <strong>{formatMoney(spent)}</strong>
                  <span>of {formatMoney(budget.limit)}</span>
                </div>

                <div className="progress-track budget-track">
                  <div
                    className={`progress-fill ${
                      overBudget ? "fill-over" : "fill-0"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className={`budget-foot ${overBudget ? "over-budget" : ""}`}>
                  {overBudget
                    ? `${formatMoney(spent - budget.limit)} over budget`
                    : `${formatMoney(budget.limit - spent)} remaining`}
                </div>
              </div>
            );
          })}

          {budgets.length === 0 && (
            <EmptyState text="Create your first budget to get started." />
          )}
        </div>
      </div>

      <div className="panel form-panel">
        <div className="panel-heading">
          <div>
            <h2>Set a budget</h2>
            <p>Choose a spending limit</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="stack-form">
          <label>
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Budget limit
            <input
              type="number"
              min="1"
              required
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
              placeholder="e.g. 5000"
            />
          </label>

          <button className="button button-primary button-full" type="submit">
            Save budget
          </button>

          <p className="form-hint">
            Saving a category again updates its existing limit.
          </p>
        </form>
      </div>
    </section>
  );
}
