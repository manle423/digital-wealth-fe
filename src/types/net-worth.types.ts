export interface NetWorthBreakdownItem {
  categoryId: string;
  categoryName: string;
  totalValue: number;
  percentage: number;
  count?: number;
  assetCount?: number;
}

export interface NetWorthCurrent {
  totalAssets: number;
  totalDebts: number;
  netWorth: number;
  liquidAssets: number;
}

export interface NetWorthTrend {
  change: number;
  changePercentage: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface NetWorthBreakdown {
  assets: NetWorthBreakdownItem[];
  debts: NetWorthBreakdownItem[];
}

export interface NetWorthSummary {
  current: NetWorthCurrent;
  trend: NetWorthTrend;
  breakdown: NetWorthBreakdown;
}

export interface NetWorthSnapshot {
  id: string;
  userId: string;
  snapshotDate: string;
  totalAssets: number;
  totalDebts: number;
  netWorth: number;
  assetBreakdown: NetWorthBreakdownItem[];
  debtBreakdown: NetWorthBreakdownItem[];
  liquidAssets: number;
  investmentAssets: number;
  realEstateAssets: number;
  personalAssets: number;
  shortTermDebts: number;
  longTermDebts: number;
  notes: string | null;
  isManual: boolean;
  createdAt: string;
  updatedAt?: string;
} 