import { FormEvent, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { SystemSettings } from '../types';

const currentUserRole = 'admin';

export function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      setSettings(await api.getSettings());
    };
    void load();
  }, []);

  if (currentUserRole !== 'admin') {
    return (
      <section className="page">
        <h1>Settings</h1>
        <p className="muted">Admin-only access. Contact your system administrator.</p>
      </section>
    );
  }

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings) {
      return;
    }
    const updated = await api.updateSettings(settings);
    setSettings(updated);
    setMessage('Settings saved. Updated risk parameters are now active.');
  };

  return (
    <section className="page">
      <div className="page-header-row">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">Manage risk thresholds, currencies, and underwriting factor weights</p>
        </div>
      </div>

      {settings && (
        <form className="card form-grid" onSubmit={onSave}>
          <label>
            Risk Threshold (Low Max)
            <input
              type="number"
              value={settings.riskThresholds.lowMax}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  riskThresholds: { ...settings.riskThresholds, lowMax: Number(e.target.value) },
                })
              }
            />
          </label>

          <label>
            Risk Threshold (Medium Max)
            <input
              type="number"
              value={settings.riskThresholds.mediumMax}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  riskThresholds: { ...settings.riskThresholds, mediumMax: Number(e.target.value) },
                })
              }
            />
          </label>

          <label>
            Default Currency
            <select
              value={settings.defaultCurrency}
              onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>CAD</option>
            </select>
          </label>

          <label>
            Debt Weight
            <input
              type="number"
              step="0.01"
              value={settings.underwritingFactors.debtWeight}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  underwritingFactors: {
                    ...settings.underwritingFactors,
                    debtWeight: Number(e.target.value),
                  },
                })
              }
            />
          </label>

          <label>
            Liquidity Weight
            <input
              type="number"
              step="0.01"
              value={settings.underwritingFactors.liquidityWeight}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  underwritingFactors: {
                    ...settings.underwritingFactors,
                    liquidityWeight: Number(e.target.value),
                  },
                })
              }
            />
          </label>

          <label>
            Industry Risk Weight
            <input
              type="number"
              step="0.01"
              value={settings.underwritingFactors.industryRiskWeight}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  underwritingFactors: {
                    ...settings.underwritingFactors,
                    industryRiskWeight: Number(e.target.value),
                  },
                })
              }
            />
          </label>

          <button className="button" type="submit">
            Save Settings
          </button>
          {message && <p className="success-text">{message}</p>}
        </form>
      )}
    </section>
  );
}