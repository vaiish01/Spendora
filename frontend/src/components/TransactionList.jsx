
import EmptyState from "./EmptyState";

export default function TransactionList({
  items,
  formatMoney,
  onEdit,
  onDelete,
  showActions = false,
}) {
  if (!items.length) {
    return <EmptyState text="No transactions yet. Add one to get started." />;
  }

  return (
    <div className="transaction-list">
      {items.map((item) => (
        <div className="transaction-row" key={item.id}>
          <div className={`transaction-icon ${item.type}`}>
            {item.type === "income" ? "↗" : "↘"}
          </div>

          <div className="transaction-description">
            <strong>{item.name}</strong>
            <span>
              {item.category} <i>·</i> {item.date}
            </span>
          </div>

          <strong className={`transaction-amount ${item.type}`}>
            {item.type === "income" ? "+" : "−"}
            {formatMoney(item.amount)}
          </strong>

          {showActions && (
            <div className="transaction-actions">
              <button
                className="icon-button"
                onClick={() => onEdit(item)}
                aria-label={`Edit ${item.name}`}
              >
                ✎
              </button>
              <button
                className="icon-button danger-text"
                onClick={() => onDelete(item.id)}
                aria-label={`Delete ${item.name}`}
              >
                ×
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
