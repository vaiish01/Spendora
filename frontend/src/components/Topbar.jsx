
export default function Topbar({ page }) {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        <span className="breadcrumb-home">Spendora</span>
        <span className="crumb-slash">/</span>
        <strong>{page}</strong>
      </div>

      <div className="topbar-right">
        <div className="preview-status">
          <span className="status-dot" />
          <span>Personal Workspace</span>
        </div>

        <div className="topbar-divider" />

        <div
          className="avatar avatar-small"
          title="Your profile"
          aria-label="Your profile"
        >
          I
        </div>
      </div>
    </header>
  );
}
