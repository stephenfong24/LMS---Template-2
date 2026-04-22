import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { RiskBadge } from '../components/RiskBadge';
import { api } from '../services/api';
import type { DashboardStats, UnderwritingCase } from '../types';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cases, setCases] = useState<UnderwritingCase[]>([]);

  useEffect(() => {
    const load = async () => {
      const [nextStats, nextCases] = await Promise.all([api.getDashboardStats(), api.getCases()]);
      setStats(nextStats);
      setCases(nextCases);
    };
    void load();
  }, []);

  const recentCases = useMemo(() => cases.slice(0, 5), [cases]);

  return (
    <section className="page">
      <div className="page-header-row">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Portfolio health and underwriting activity overview</p>
        </div>
        <div className="header-actions">
          <Link className="button" to="/case-assessment">
            Start New Case
          </Link>
          <Link className="button button-secondary" to="/case-history">
            Review Cases
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Cases" value={stats?.totalCases ?? 0} />
        <StatCard title="Pending Review" value={stats?.pendingReview ?? 0} accentClass="accent-pending" />
        <StatCard title="Approved Cases" value={stats?.approvedCases ?? 0} accentClass="accent-approved" />
        <StatCard title="Rejected Cases" value={stats?.rejectedCases ?? 0} accentClass="accent-rejected" />
      </div>

      <div className="content-grid">
        <article className="card">
          <h2>Recent Case Activity</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Company</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((caseItem) => (
                  <tr key={caseItem.id}>
                    <td>{caseItem.id}</td>
                    <td>{caseItem.companyName}</td>
                    <td>
                      <RiskBadge score={caseItem.underwriterOverride ?? caseItem.riskAnalysis.score} />
                    </td>
                    <td>{caseItem.status}</td>
                    <td>{caseItem.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card">
          <h2>Case Status Mix</h2>
          <div className="bars">
            <div className="bar-row">
              <span>Approved</span>
              <div className="bar-track">
                <div className="bar approved" style={{ width: `${((stats?.approvedCases ?? 0) / Math.max(1, stats?.totalCases ?? 1)) * 100}%` }} />
              </div>
              <strong>{stats?.approvedCases ?? 0}</strong>
            </div>
            <div className="bar-row">
              <span>Pending</span>
              <div className="bar-track">
                <div className="bar pending" style={{ width: `${((stats?.pendingReview ?? 0) / Math.max(1, stats?.totalCases ?? 1)) * 100}%` }} />
              </div>
              <strong>{stats?.pendingReview ?? 0}</strong>
            </div>
            <div className="bar-row">
              <span>Rejected</span>
              <div className="bar-track">
                <div className="bar rejected" style={{ width: `${((stats?.rejectedCases ?? 0) / Math.max(1, stats?.totalCases ?? 1)) * 100}%` }} />
              </div>
              <strong>{stats?.rejectedCases ?? 0}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}