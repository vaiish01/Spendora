
export default function Sidebar({ page, setPage }) {
  const navItems = [
    "Dashboard",
    "Transactions",
    "Budgets",
    "Goals",
    "Settings",
  ];

  return (
    <aside className="sidebar">
      <button
        type="button"
        className="brand"
        onClick={() => setPage("Dashboard")}
        aria-label="Spendora home"
      >
       <img
  src="/icon.svg"
  alt="Spendora logo"
  className="brand-logo"
/>

        <span className="brand-text">
          <strong>Spendora</strong>
          <small>PERSONAL FINANCE</small>
        </span>
      </button>

      <nav className="side-nav">
        <span className="nav-label">MENU</span>

        {navItems.map((item) => (
          <button
            type="button"
            key={item}
            className={`nav-link ${
              page === item ? "active" : ""
            }`}
            onClick={() => setPage(item)}
          >
            <span>{item}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
