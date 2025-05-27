export type FinancialStatus = 'GOOD' | 'FAIR' | 'POOR';
export type OverallStatus = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

export interface LiquidityAnalysis {
  liquidityRatio: string | number;
  emergencyFundRatio: string | number;
  status: FinancialStatus;
}

export interface DebtAnalysis {
  debtToAssetRatio: string | number;
  debtToIncomeRatio: string | number;
  status: FinancialStatus;
}

export interface InvestmentAnalysis {
  investmentRatio: string | number;
  diversificationIndex: string | number;
  status: FinancialStatus;
}

export interface OverallAnalysis {
  netWorth: number;
  financialHealthScore: number;
  status: OverallStatus;
}

export interface FinancialSummary {
  liquidity: LiquidityAnalysis;
  debt: DebtAnalysis;
  investment: InvestmentAnalysis;
  overall: OverallAnalysis;
}

export type MetricCategory = 'liquidity' | 'debt' | 'investment' | 'net_worth' | 'expense' | 'financial_independence' | 'diversification' | 'risk' | 'other';

export type MetricType =
  | 'LIQUIDITY_RATIO'
  | 'EMERGENCY_FUND_RATIO'
  | 'DEBT_TO_INCOME_RATIO'
  | 'DEBT_TO_ASSET_RATIO'
  | 'DEBT_SERVICE_RATIO'
  | 'SAVINGS_RATE'
  | 'INVESTMENT_RATIO'
  | 'PORTFOLIO_RETURN'
  | 'RISK_ADJUSTED_RETURN'
  | 'SHARPE_RATIO'
  | 'NET_WORTH'
  | 'NET_WORTH_GROWTH'
  | 'EXPENSE_RATIO'
  | 'HOUSING_EXPENSE_RATIO'
  | 'FINANCIAL_INDEPENDENCE_RATIO'
  | 'RETIREMENT_READINESS'
  | 'DIVERSIFICATION_INDEX'
  | 'ASSET_ALLOCATION_SCORE'
  | 'PORTFOLIO_VOLATILITY'
  | 'VALUE_AT_RISK'
  | 'CREDIT_UTILIZATION'
  | 'INSURANCE_COVERAGE_RATIO';

export interface CalculationDetails {
  formula: string;
  inputs: Record<string, number>;
}

export interface FinancialMetric {
  id: string;
  userId: string;
  type: MetricType;
  value: number;
  calculationDate: string;
  category: MetricCategory;
  calculationDetails: CalculationDetails;
  isCurrent: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface MetricTrendPoint {
  date: string;
  value: number;
} 