
import "../styles/Dashboard.css";

import SummaryCard from "../components/SummaryCard";
import TransactionList from "../components/TransactionList";
import GoalProgress from "../components/GoalProgress";
import EmptyState from "../components/EmptyState";

export default function Dashboard({
  totals,
  formatMoney,
  expensesByCategory,
  transactions,
  goals,
  onEdit,
  onDelete,
  onViewTransactions,
  onViewGoals,
}) {
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const categories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1]);

  return (
    <>
      <section className="hero-balance">
        <div>
          <div className="balance-label">
            <span className="balance-spark">✳</span>
            TOTAL AVAILABLE BALANCE
          </div>

          <div className="balance-value">
            {formatMoney(totals.balance)}
          </div>

          <p>Your recorded income minus your recorded expenses.</p>
        </div>

        <div className="balance-side">
          <span className="balance-side-label">SAVINGS GOALS</span>
          <strong>{formatMoney(totals.saved)}</strong>
          <span className="balance-side-foot">
            Across {goals.length} goals
          </span>
        </div>

      </section>

      <section className="summary-grid">
        <SummaryCard
          label="Total income"
          value={formatMoney(totals.income)}
          icon="↗"
          tone="green"
          caption="Money received"
        />

        <SummaryCard
          label="Total expenses"
          value={formatMoney(totals.expenses)}
          icon="↘"
          tone="rose"
          caption="Money spent"
        />

        <SummaryCard
          label="Savings goals"
          value={formatMoney(totals.saved)}
          icon="◎"
          tone="gold"
          caption="Money set aside"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel spending-panel">
          <div className="panel-heading">
            <div>
              <h2>Spending breakdown</h2>
              <p>Where your money is going</p>
            </div>
          </div>

          {categories.length === 0 ? (
            <EmptyState text="Your spending breakdown will appear after you add expenses." />
          ) : (
            <div className="category-list">
              {categories.map(([category, amount], index) => {
                const percentage = totals.expenses > 0
                  ? (amount / totals.expenses) * 100
                  : 0;

                return (
                  <div className="category-item" key={category}>
                    <div className="category-top">
                      <span>
                        <i className={`category-dot dot-${index % 4}`} />
                        {category}
                      </span>
                      <strong>{formatMoney(amount)}</strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className={`progress-fill fill-${index % 4}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="category-percent">
                      {Math.round(percentage)}% of expenses
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="panel recent-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent transactions</h2>
              <p>Your latest money activity</p>
            </div>

            <button
              className="text-button"
              onClick={onViewTransactions}
            >
              View all ↗
            </button>
          </div>

          <TransactionList
            items={recentTransactions}
            formatMoney={formatMoney}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </section>

      <section className="panel goals-preview">
        <div className="panel-heading">
          <div>
            <h2>Savings in progress</h2>
            <p>Keep moving towards your goals</p>
          </div>

          <button className="text-button" onClick={onViewGoals}>
            All goals ↗
          </button>
        </div>

        <div className="goals-preview-grid">
          {goals.slice(0, 2).map((goal) => (
            <GoalProgress
              key={goal.id}
              goal={goal}
              formatMoney={formatMoney}
            />
          ))}

          {goals.length === 0 && (
            <EmptyState text="Create your first savings goal to see it here." />
          )}
        </div>
      </section>
    </>
  );
}
