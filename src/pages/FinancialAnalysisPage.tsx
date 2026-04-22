import { useState } from 'react';
import { api } from '../services/api';
import type { FinancialMetrics } from '../types';

export function FinancialAnalysisPage() {
  const [fileName, setFileName] = useState('');
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const onAnalyze = async () => {
    if (!fileName) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.analyzeFinancialDocument(fileName);
      setMetrics(response.metrics);
      setSummary(response.summary);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header-row">
        <div>
          <h1>Financial Document Analysis</h1>
          <p className="page-subtitle">Upload PDF or Excel statements and extract underwriting metrics</p>
        </div>
      </div>

      <div className="content-grid">
        <article className="card">
          <h2>Upload Document</h2>
          <label>
            Select financial file
            <input
              type="file"
              accept=".pdf,.xlsx,.xls"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setFileName(file ? file.name : '');
              }}
            />
          </label>
          <button className="button" type="button" onClick={onAnalyze} disabled={!fileName || loading}>
            {loading ? 'Analyzing...' : 'Run AI Analysis'}
          </button>
        </article>

        <article className="card">
          <h2>Extracted Metrics</h2>
          {metrics ? (
            <div className="metric-grid">
              <div className="metric">
                <span>Revenue</span>
                <strong>${metrics.revenue.toLocaleString()}</strong>
              </div>
              <div className="metric">
                <span>Net Profit</span>
                <strong>${metrics.netProfit.toLocaleString()}</strong>
              </div>
              <div className="metric">
                <span>Debt Ratio</span>
                <strong>{(metrics.debtRatio * 100).toFixed(1)}%</strong>
              </div>
              <div className="metric">
                <span>Liquidity Ratio</span>
                <strong>{metrics.liquidityRatio.toFixed(2)}</strong>
              </div>
              <div className="ai-summary">
                <h3>AI Analysis Summary</h3>
                <p>{summary}</p>
              </div>
            </div>
          ) : (
            <p className="muted">Upload a file to view extracted financial metrics and summary.</p>
          )}
        </article>
      </div>
    </section>
  );
}