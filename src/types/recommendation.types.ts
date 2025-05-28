export type RecommendationType =
  | 'DEBT_REDUCTION'
  | 'DEBT_CONSOLIDATION'
  | 'REFINANCING'
  | 'INCREASE_SAVINGS'
  | 'EMERGENCY_FUND'
  | 'INVESTMENT_OPPORTUNITY'
  | 'PORTFOLIO_REBALANCING'
  | 'DIVERSIFICATION'
  | 'INSURANCE_COVERAGE'
  | 'LIFE_INSURANCE'
  | 'HEALTH_INSURANCE'
  | 'RETIREMENT_PLANNING'
  | 'PENSION_OPTIMIZATION'
  | 'EXPENSE_REDUCTION'
  | 'BUDGET_OPTIMIZATION'
  | 'TAX_OPTIMIZATION'
  | 'TAX_PLANNING'
  | 'CREDIT_IMPROVEMENT'
  | 'CREDIT_UTILIZATION'
  | 'FINANCIAL_GOAL'
  | 'WEALTH_BUILDING'
  | 'FINANCIAL_EDUCATION'
  | 'RISK_AWARENESS'
  | 'GENERAL_ADVICE'
  | 'MARKET_OPPORTUNITY';

export type RecommendationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RecommendationStatus =
  | 'ACTIVE'
  | 'VIEWED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DISMISSED'
  | 'EXPIRED'
  | 'ARCHIVED';

export interface ActionStep {
  step: number;
  description: string;
  isCompleted: boolean;
}

export interface ExpectedImpact {
  financialImpact: number;
  timeframe: string;
  riskLevel: string;
  description: string;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  title: string;
  description: string;
  rationale?: string;
  actionSteps?: ActionStep[];
  expectedImpact?: ExpectedImpact;
  expiresAt?: string;
  createdAt: string;
  viewedAt?: string;
  completedAt?: string;
  userRating?: number;
  userFeedback?: string;
}

export interface RecommendationStats {
  total: number;
  active: number;
  completed: number;
  dismissed: number;
  byPriority: Array<{
    priority: RecommendationPriority;
    count: number;
  }>;
  byType: Array<{
    type: RecommendationType;
    count: number;
  }>;
}

export interface RecommendationFeedback {
  feedback: string;
  rating: number;
} 