export type RiskScore = 'Low' | 'Medium' | 'High';
export type CaseStatus = 'Pending Review' | 'Approved' | 'Rejected';

export interface RiskAnalysis {
  score: RiskScore;
  drivers: string[];
  explanation: string;
}

export interface FinancialMetrics {
  revenue: number;
  netProfit: number;
  debtRatio: number;
  liquidityRatio: number;
}

export interface UnderwritingCase {
  id: string;
  companyName: string;
  industry: string;
  revenue: number;
  country: string;
  policyLimit: number;
  coverageType: string;
  riskAnalysis: RiskAnalysis;
  underwriterOverride?: RiskScore;
  underwriterComment?: string;
  status: CaseStatus;
  createdAt: string;
  currency: string;
}

export interface DashboardStats {
  totalCases: number;
  pendingReview: number;
  approvedCases: number;
  rejectedCases: number;
}

export interface PricingPayload {
  caseId: string;
  riskBand: RiskScore;
  currency: string;
  coverageLimit: number;
}

export interface SystemSettings {
  riskThresholds: {
    lowMax: number;
    mediumMax: number;
  };
  defaultCurrency: string;
  underwritingFactors: {
    debtWeight: number;
    liquidityWeight: number;
    industryRiskWeight: number;
  };
}