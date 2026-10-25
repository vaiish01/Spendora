
import { useEffect, useState } from "react";

export default function TransactionModal({
  open,
  editingTransaction,
  onClose,
  onSave,
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name: "",
    category: "Food",
    amount: "",
    type: "expense",
    date: today,
  });

  useEffect(() => {
    if (!open) return;

    if (editingTransaction) {
      setForm({
        name: editingTransaction.name,
        category: editingTransaction.category,
        amount: String(editingTransaction.amount),
        type: editingTransaction.type,
        date: editingTransaction.date,
      });
    } else {
      setForm({
        name: "",
        category: "Food",
        amount: "",
        type: "expense",
        date: today,
      });
    }
  }, [open, editingTransaction]);

  if (!open) return null;

  function handleSubmit(event) {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!form.name.trim() || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    onSave({
      ...(editingTransaction ? { id: editingTransaction.id } : {}),
      name: form.name.trim(),
      category: form.type === "income" ? "Salary" : form.category,
      amount,
      type: form.type,
      date: form.date,
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="transaction-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-title"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">YOUR MONEY</span>
            <h2 id="transaction-title">
              {editingTransaction ? "Edit transaction" : "Add a transaction"}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="stack-form">
          <div className="type-switch">
            <button
              type="button"
              className={form.type === "expense" ? "selected expense-selected" : ""}
              onClick={() => setForm({ ...form, type: "expense" })}
            >
              ↘ Expense
            </button>

            <button
              type="button"
              className={form.type === "income" ? "selected income-selected" : ""}
              onClick={() => setForm({ ...form, type: "income" })}
            >
              ↗ Income
            </button>
          </div>

          <label>
            Description
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="What was this transaction?"
            />
          </label>

          <label>
            Amount
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
            />
          </label>

          {form.type === "expense" && (
            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {["Food", "Transport", "Lifestyle", "Bills", "Shopping", "Health", "Other"].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
          )}

          <label>
            Date
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              {editingTransaction ? "Save changes" : "Save transaction"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
