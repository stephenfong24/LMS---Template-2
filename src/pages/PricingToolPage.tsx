import { useEffect, useMemo, useState } from 'react';
import { RiskBadge } from '../components/RiskBadge';
import { api } from '../services/api';
import type { PricingPayload, RiskScore, UnderwritingCase } from '../types';

export function PricingToolPage() {
  const [cases, setCases] = useState<UnderwritingCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [payload, setPayload] = useState<PricingPayload>({
    caseId: '',
    riskBand: 'Medium',
    currency: 'USD',
    coverageLimit: 0,
  });
  const [result, setResult] = useState('');

  useEffect(() => {
    const load = async () => {
      const allCases = await api.getCases();
      const approvedCases = allCases.filter((item) => item.status === 'Approved');
      setCases(approvedCases);
      if (approvedCases.length > 0) {
        setSelectedCaseId(approvedCases[0].id);
      }
    };
    void load();
  }, []);

  const selectedCase = useMemo(() => cases.find((item) => item.id === selectedCaseId), [cases, selectedCaseId]);

  useEffect(() => {
    if (!selectedCase) {
      return;
    }
    setPayload({
      caseId: selectedCase.id,
      riskBand: selectedCase.underwriterOverride ?? selectedCase.riskAnalysis.score,
      currency: selectedCase.currency,
      coverageLimit: selectedCase.policyLimit,
    });
  }, [selectedCase]);

  const onSubmit = async () => {
    if (!payload.caseId) {
      return;
    }
    const response = await api.sendToPricing(payload);
    setResult(response.success ? `Submitted successfully. Pricing ref: ${response.reference}` : 'Submission failed.');
  };

  return (
    <section className="page">
      <div className="page-header-row">
        <div>
          <h1>Pricing Tool Integration</h1>
          <p className="page-subtitle">Send approved cases with editable pricing factors before final submission</p>
        </div>
      </div>

      <article className="card form-grid">
        <label>
          Approved Case
          <select value={selectedCaseId} onChange={(e) => setSelectedCaseId(e.target.value)}>
            {cases.length === 0 && <option value="">No approved cases available</option>}
            {cases.map((caseItem) => (
              <option key={caseItem.id} value={caseItem.id}>
                {caseItem.id} - {caseItem.companyName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Risk Band
          <select
            value={payload.riskBand}
            onChange={(e) => setPayload({ ...payload, riskBand: e.target.value as RiskScore })}
            disabled={!selectedCase}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <label>
          Currency
          <select
            value={payload.currency}
            onChange={(e) => setPayload({ ...payload, currency: e.target.value })}
            disabled={!selectedCase}
          >
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>CAD</option>
          </select>
        </label>

        <label>
          Coverage Limit
          <input
            type="number"
            min={0}
            value={payload.coverageLimit}
            onChange={(e) => setPayload({ ...payload, coverageLimit: Number(e.target.value) })}
            disabled={!selectedCase}
          />
        </label>

        {selectedCase && (
          <p>
            Current Case Risk: <RiskBadge score={selectedCase.underwriterOverride ?? selectedCase.riskAnalysis.score} />
          </p>
        )}

        <button className="button" onClick={onSubmit} disabled={!selectedCase} type="button">
          Send to Pricing Tool
        </button>
        {result && <p className="success-text">{result}</p>}
      </article>
    </section>
  );
}