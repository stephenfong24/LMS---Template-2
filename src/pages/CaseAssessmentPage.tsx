import { FormEvent, useEffect, useMemo, useState } from 'react';
import { RiskBadge } from '../components/RiskBadge';
import { api } from '../services/api';
import type { RiskScore, UnderwritingCase } from '../types';

const defaultForm = {
  companyName: '',
  industry: '',
  revenue: 0,
  country: '',
  policyLimit: 0,
  coverageType: '',
  currency: 'USD',
};

export function CaseAssessmentPage() {
  const [cases, setCases] = useState<UnderwritingCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [comment, setComment] = useState('');
  const [overrideScore, setOverrideScore] = useState<RiskScore>('Medium');
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    const load = async () => {
      const nextCases = await api.getCases();
      setCases(nextCases);
      if (nextCases.length > 0) {
        setSelectedCaseId(nextCases[0].id);
      }
    };
    void load();
  }, []);

  const selectedCase = useMemo(() => cases.find((item) => item.id === selectedCaseId), [cases, selectedCaseId]);

  useEffect(() => {
    if (selectedCase) {
      setComment(selectedCase.underwriterComment ?? '');
      setOverrideScore(selectedCase.underwriterOverride ?? selectedCase.riskAnalysis.score);
    }
  }, [selectedCase]);

  const onCreateCase = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const revenueRisk = form.revenue < 7000000 ? 'High' : form.revenue < 15000000 ? 'Medium' : 'Low';
    const debtDriver = form.revenue < 7000000 ? 'Limited earnings buffer' : 'Balanced operating performance';

    const created = await api.createCase({
      ...form,
      riskAnalysis: {
        score: revenueRisk,
        drivers: [debtDriver, `${form.industry} sector cyclicality`],
        explanation:
          'Generated from submitted underwriting profile. Validate against detailed financial statements and sector outlook before final decision.',
      },
    });

    const refreshed = await api.getCases();
    setCases(refreshed);
    setSelectedCaseId(created.id);
    setForm(defaultForm);
  };

  const onSaveOverride = async () => {
    if (!selectedCase) {
      return;
    }

    await api.overrideRisk(selectedCase.id, overrideScore, comment);
    setCases(await api.getCases());
  };

  return (
    <section className="page">
      <div className="page-header-row">
        <div>
          <h1>Case Assessment</h1>
          <p className="page-subtitle">Create new cases, review AI risk output, and apply underwriter overrides</p>
        </div>
      </div>

      <div className="content-grid">
        <article className="card">
          <h2>Create Underwriting Case</h2>
          <form className="form-grid" onSubmit={onCreateCase}>
            <label>
              Company Name
              <input required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </label>
            <label>
              Industry
              <input required value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </label>
            <label>
              Revenue
              <input
                type="number"
                min={0}
                required
                value={form.revenue}
                onChange={(e) => setForm({ ...form, revenue: Number(e.target.value) })}
              />
            </label>
            <label>
              Country
              <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </label>
            <label>
              Policy Limit
              <input
                type="number"
                min={0}
                required
                value={form.policyLimit}
                onChange={(e) => setForm({ ...form, policyLimit: Number(e.target.value) })}
              />
            </label>
            <label>
              Coverage Type
              <input
                required
                value={form.coverageType}
                onChange={(e) => setForm({ ...form, coverageType: e.target.value })}
              />
            </label>
            <label>
              Currency
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>CAD</option>
              </select>
            </label>
            <button className="button" type="submit">
              Create Case
            </button>
          </form>
        </article>

        <article className="card">
          <h2>AI Risk Assessment</h2>
          <label>
            Select Case
            <select value={selectedCaseId} onChange={(e) => setSelectedCaseId(e.target.value)}>
              {cases.map((caseItem) => (
                <option key={caseItem.id} value={caseItem.id}>
                  {caseItem.id} - {caseItem.companyName}
                </option>
              ))}
            </select>
          </label>

          {selectedCase && (
            <>
              <div className="stack-sm">
                <p>
                  Risk Score: <RiskBadge score={selectedCase.riskAnalysis.score} />
                </p>
                <p>
                  AI Explanation: <span className="muted">{selectedCase.riskAnalysis.explanation}</span>
                </p>
                <p>Risk Drivers:</p>
                <ul className="driver-list">
                  {selectedCase.riskAnalysis.drivers.map((driver) => (
                    <li key={driver}>{driver}</li>
                  ))}
                </ul>
              </div>

              <div className="override-panel">
                <h3>Underwriter Override</h3>
                <label>
                  Override Risk Score
                  <select value={overrideScore} onChange={(e) => setOverrideScore(e.target.value as RiskScore)}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
                <label>
                  Comments
                  <textarea
                    rows={4}
                    placeholder="Document rationale for any override decision"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </label>
                <button className="button" onClick={onSaveOverride} type="button">
                  Save Override
                </button>
              </div>
            </>
          )}
        </article>
      </div>
    </section>
  );
}