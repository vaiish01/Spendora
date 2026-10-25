
export default function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <span>✳</span>
      <p>{text}</p>
    </div>
  );
}
