import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Settings.css";

export default function Settings({ currency, setCurrency }) {
  const [settings, setSettings] = useState({
    currency: currency || "INR",
    darkMode: false,
    notificationsEnabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Apply dark mode whenever the saved setting changes.
 // Apply dark mode globally and keep it enabled when leaving Settings.
useEffect(() => {
  document.documentElement.classList.toggle(
    "dark-mode",
    settings.darkMode
  );
}, [settings.darkMode]);

  // Load settings from the backend.
  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        setError("");
        const response = await api.get("/settings");
        if (!active) return;

        const saved = response.data;

        setSettings({
          currency: saved.currency || "INR",
          darkMode: Boolean(saved.darkMode),
          notificationsEnabled: Boolean(saved.notificationsEnabled),
        });

        setCurrency(saved.currency || "INR");
      } catch (err) {
        if (active) {
          setError(
            "Could not load settings. Check that the backend is running."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, [setCurrency]);

  async function updateSetting(field, value) {
    const previousSettings = settings;

    const updatedSettings = {
      ...settings,
      [field]: value,
    };

    // Update the interface immediately.
    setSettings(updatedSettings);
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await api.put("/settings", updatedSettings);
      const saved = response.data;

      const savedSettings = {
        currency: saved.currency || "INR",
        darkMode: Boolean(saved.darkMode),
        notificationsEnabled: Boolean(saved.notificationsEnabled),
      };

      setSettings(savedSettings);
      setCurrency(savedSettings.currency);
      setMessage("Settings saved successfully.");
    } catch (err) {
      console.error("Settings update failed:", err);
      console.error("Backend response:", err.response?.data);

      // Restore the previous state if saving fails.
      setSettings(previousSettings);

      setError(
        err.response?.data?.message ||
          "Could not save settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="settings-layout">Loading settings...</p>;
  }

  return (
    <section className="settings-layout">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Preferences</h2>
            <p>Customise your Spendora experience</p>
          </div>
        </div>

        {error && (
          <p role="alert" className="settings-error">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="settings-success">
            {message}
          </p>
        )}

        <div className="setting-row">
          <div>
            <strong>Display currency</strong>
            <p>Choose the currency used to display your amounts.</p>
          </div>

          <select
            value={settings.currency}
            onChange={(event) =>
              updateSetting("currency", event.target.value)
            }
            aria-label="Display currency"
            disabled={saving}
          >
            <option value="INR">INR — ₹ Rupee</option>
            <option value="USD">USD — $ US Dollar</option>
            <option value="GBP">GBP — £ Pound</option>
            <option value="EUR">EUR — € Euro</option>
          </select>
        </div>

        <div className="setting-row">
          <div>
            <strong>Dark mode</strong>
            <p>Enable a darker appearance across the app.</p>
          </div>

          <input
            type="checkbox"
            aria-label="Dark mode"
            checked={settings.darkMode}
            disabled={saving}
            onChange={(event) =>
              updateSetting("darkMode", event.target.checked)
            }
          />
        </div>

        <div className="setting-row">
          <div>
            <strong>Notifications</strong>
            <p>Enable or disable app notifications.</p>
          </div>

          <input
            type="checkbox"
            aria-label="Notifications"
            checked={settings.notificationsEnabled}
            disabled={saving}
            onChange={(event) =>
              updateSetting("notificationsEnabled", event.target.checked)
            }
          />
        </div>

       
      </div>
    </section>
  );
}
