import { useEffect, useState } from 'react';
import { RiskBadge } from '../components/RiskBadge';
import { api } from '../services/api';
import type { UnderwritingCase } from '../types';

export function CaseHistoryPage() {
  const [cases, setCases] = useState<UnderwritingCase[]>([]);

  useEffect(() => {
    const load = async () => {
      setCases(await api.getCases());
    };
    void load();
  }, []);

  return (
    <section className="page">
      <div className="page-header-row">
        <div>
          <h1>Case History</h1>
          <p className="page-subtitle">Complete underwriting case registry with status and actions</p>
        </div>
      </div>

      <article className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Company Name</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td>{caseItem.id}</td>
                  <td>{caseItem.companyName}</td>
                  <td>
                    <RiskBadge score={caseItem.underwriterOverride ?? caseItem.riskAnalysis.score} />
                  </td>
                  <td>{caseItem.status}</td>
                  <td>{caseItem.createdAt}</td>
                  <td>
                    <button className="table-action" type="button">
                      View
                    </button>
                    <button className="table-action" type="button">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}