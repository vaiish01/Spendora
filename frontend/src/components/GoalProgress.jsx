
export default function GoalProgress({ goal, formatMoney }) {
  const percent = goal.target > 0
    ? Math.min((goal.saved / goal.target) * 100, 100)
    : 0;

  return (
    <div className="goal-progress">
      <div className="goal-progress-top">
        <span>{Math.round(percent)}% completed</span>
        <strong>
          {formatMoney(Math.max(goal.target - goal.saved, 0))} to go
        </strong>
      </div>

      <div className="progress-track goal-track">
        <div
          className="progress-fill fill-0"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="goal-progress-bottom">
        <span>{formatMoney(goal.saved)} saved</span>
        <span>{formatMoney(goal.target)} goal</span>
      </div>
    </div>
  );
}
