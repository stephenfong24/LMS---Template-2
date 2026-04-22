import { defaultSettings, mockCases, mockDashboardStats, mockFinancialMetrics } from '../data/mock';
import type {
  DashboardStats,
  FinancialMetrics,
  PricingPayload,
  RiskScore,
  SystemSettings,
  UnderwritingCase,
} from '../types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let caseStore: UnderwritingCase[] = [...mockCases];
let settingsStore: SystemSettings = { ...defaultSettings };

export const api = {
  async getDashboardStats(): Promise<DashboardStats> {
    await wait(200);
    return {
      ...mockDashboardStats,
      totalCases: caseStore.length,
      pendingReview: caseStore.filter((item) => item.status === 'Pending Review').length,
      approvedCases: caseStore.filter((item) => item.status === 'Approved').length,
      rejectedCases: caseStore.filter((item) => item.status === 'Rejected').length,
    };
  },

  async getCases(): Promise<UnderwritingCase[]> {
    await wait(250);
    return [...caseStore].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async createCase(payload: Omit<UnderwritingCase, 'id' | 'createdAt' | 'status'>): Promise<UnderwritingCase> {
    await wait(300);
    const created: UnderwritingCase = {
      ...payload,
      id: `UW-${1000 + caseStore.length + 1}`,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'Pending Review',
    };
    caseStore = [created, ...caseStore];
    return created;
  },

  async overrideRisk(caseId: string, riskScore: RiskScore, comment: string): Promise<UnderwritingCase | undefined> {
    await wait(200);
    caseStore = caseStore.map((item) =>
      item.id === caseId ? { ...item, underwriterOverride: riskScore, underwriterComment: comment } : item,
    );
    return caseStore.find((item) => item.id === caseId);
  },

  async analyzeFinancialDocument(_fileName: string): Promise<{ metrics: FinancialMetrics; summary: string }> {
    await wait(500);
    return {
      metrics: mockFinancialMetrics,
      summary:
        'Financial profile indicates moderate leverage and resilient operating cash flow. Recommend standard covenant monitoring.',
    };
  },

  async sendToPricing(payload: PricingPayload): Promise<{ success: boolean; reference: string }> {
    await wait(300);
    return {
      success: true,
      reference: `PRC-${payload.caseId}-${Date.now().toString().slice(-6)}`,
    };
  },

  async getSettings(): Promise<SystemSettings> {
    await wait(150);
    return settingsStore;
  },

  async updateSettings(nextSettings: SystemSettings): Promise<SystemSettings> {
    await wait(200);
    settingsStore = nextSettings;
    return settingsStore;
  },
};