import { Navigate, Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { CaseAssessmentPage } from './pages/CaseAssessmentPage';
import { CaseHistoryPage } from './pages/CaseHistoryPage';
import { ChatPage } from './pages/ChatPage';
import { DashboardPage } from './pages/DashboardPage';
import { FinancialAnalysisPage } from './pages/FinancialAnalysisPage';
import { PricingToolPage } from './pages/PricingToolPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/case-assessment" element={<CaseAssessmentPage />} />
          <Route path="/financial-analysis" element={<FinancialAnalysisPage />} />
          <Route path="/case-history" element={<CaseHistoryPage />} />
          <Route path="/pricing-tool" element={<PricingToolPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}