
import { useState } from "react";
import "../styles/Transactions.css";

import TransactionList from "../components/TransactionList";
import EmptyState from "../components/EmptyState";

export default function Transactions({
  transactions,
  formatMoney,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const visibleTransactions = [...transactions]
    .filter((transaction) => {
      const query = search.toLowerCase();

      const matchesSearch =
        transaction.name.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" || transaction.type === filter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="panel">
      <div className="panel-heading transactions-heading">
        <div>
          <h2>Transaction history</h2>
          <p>{transactions.length} recorded transactions</p>
        </div>

        <button className="button button-primary" onClick={onAdd}>
          ＋ Add transaction
        </button>
      </div>

      <div className="table-tools">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search transactions..."
            aria-label="Search transactions"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter transactions"
        >
          <option value="all">All transactions</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
      </div>

      {visibleTransactions.length > 0 ? (
        <TransactionList
          items={visibleTransactions}
          formatMoney={formatMoney}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions
        />
      ) : (
        <EmptyState text="No transactions match your search." />
      )}
    </section>
  );
}
