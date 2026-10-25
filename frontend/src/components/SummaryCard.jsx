
export default function SummaryCard({ label, value, icon, tone, caption }) {
  return (
    <div className="summary-card">
      <div className="summary-card-top">
        <span>{label}</span>
        <span className={`summary-icon ${tone}`}>{icon}</span>
      </div>
      <strong className="summary-value">{value}</strong>
      <span className="summary-caption">{caption}</span>
    </div>
  );
}
