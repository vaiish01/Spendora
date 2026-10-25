
import "../styles/Settings.css";

export default function Settings({ currency, setCurrency, onReset }) {
  return (
    <section className="settings-layout">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Preferences</h2>
            <p>Customise your Spendora experience</p>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>Display currency</strong>
            <p>
              Choose the currency used to display your amounts.
            </p>
          </div>

          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            aria-label="Display currency"
          >
            <option value="INR">INR — ₹ Rupee</option>
            <option value="USD">USD — $ US Dollar</option>
            <option value="GBP">GBP — £ Pound</option>
            <option value="EUR">EUR — € Euro</option>
          </select>
        </div>

        <div className="setting-row">
          <div>
            <strong>Local data storage</strong>
            <p>
              Your data is saved in this browser on this device.
            </p>
          </div>

          <span className="soft-tag">Enabled</span>
        </div>
      </div>

      <div className="panel danger-panel">
        <div className="panel-heading">
          <div>
            <h2>Reset workspace</h2>
            <p>Restore the original sample data</p>
          </div>
        </div>

        <p className="reset-description">
          This replaces your current transactions, budgets, and savings
          goals with the original examples.
        </p>

        <button
          type="button"
          className="button button-danger"
          onClick={onReset}
        >
          Reset sample data
        </button>
      </div>
    </section>
  );
}
