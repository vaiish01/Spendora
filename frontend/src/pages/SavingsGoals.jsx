
import { useState } from "react";
import "../styles/SavingsGoals.css";

import GoalProgress from "../components/GoalProgress";
import EmptyState from "../components/EmptyState";

export default function SavingsGoals({
  goals,
  formatMoney,
  onAddGoal,
  onAddSavings,
  onDeleteGoal,
}) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const targetAmount = Number(target);
    const savedAmount = saved === "" ? 0 : Number(saved);

    if (
      !name.trim() ||
      !Number.isFinite(targetAmount) ||
      targetAmount <= 0 ||
      !Number.isFinite(savedAmount) ||
      savedAmount < 0
    ) {
      return;
    }

    onAddGoal({
      name: name.trim(),
      target: targetAmount,
      saved: savedAmount,
      icon: "✳",
    });

    setName("");
    setTarget("");
    setSaved("");
  }

  return (
    <section className="goals-layout">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Your savings goals</h2>
            <p>Every little contribution counts</p>
          </div>
        </div>

        <div className="goal-list">
          {goals.map((goal) => (
            <div className="goal-card" key={goal.id}>
              <div className="goal-card-top">
                <div className="goal-icon">
                  {goal.icon || "✳"}
                </div>

                <div className="goal-name">
                  <strong>{goal.name}</strong>
                  <span>Target {formatMoney(goal.target)}</span>
                </div>

                <button
                  className="icon-button danger-text"
                  onClick={() => onDeleteGoal(goal.id)}
                  aria-label={`Delete ${goal.name} goal`}
                >
                  ×
                </button>
              </div>

              <GoalProgress
                goal={goal}
                formatMoney={formatMoney}
              />

              <button
                className="button button-secondary button-full"
                onClick={() => onAddSavings(goal.id)}
              >
                ＋ Add savings
              </button>
            </div>
          ))}

          {goals.length === 0 && (
            <EmptyState text="Create a goal and start building towards it." />
          )}
        </div>
      </div>

      <div className="panel form-panel">
        <div className="panel-heading">
          <div>
            <h2>Create a goal</h2>
            <p>Plan your next milestone</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="stack-form">
          <label>
            Goal name
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Holiday fund"
            />
          </label>

          <label>
            Target amount
            <input
              type="number"
              min="1"
              required
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              placeholder="e.g. 30000"
            />
          </label>

          <label>
            Already saved (optional)
            <input
              type="number"
              min="0"
              value={saved}
              onChange={(event) => setSaved(event.target.value)}
              placeholder="0"
            />
          </label>

          <button className="button button-primary button-full" type="submit">
            Create goal
          </button>
        </form>
      </div>
    </section>
  );
}
