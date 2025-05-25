/**
 * Asset Management Types
 */

export enum AssetType {
  // Financial Assets
  STOCK = 'STOCK',
  BOND = 'BOND', 
  MUTUAL_FUND = 'MUTUAL_FUND',
  ETF = 'ETF',
  CRYPTO = 'CRYPTO',
  BANK_DEPOSIT = 'BANK_DEPOSIT',
  SAVINGS_ACCOUNT = 'SAVINGS_ACCOUNT',
  CERTIFICATE_OF_DEPOSIT = 'CERTIFICATE_OF_DEPOSIT',
  
  // Real Estate
  REAL_ESTATE = 'REAL_ESTATE',
  LAND = 'LAND',
  
  // Personal Assets
  VEHICLE = 'VEHICLE',
  JEWELRY = 'JEWELRY',
  ART = 'ART',
  COLLECTIBLES = 'COLLECTIBLES',
  
  // Business Assets
  BUSINESS = 'BUSINESS',
  EQUIPMENT = 'EQUIPMENT',
  
  // Insurance & Retirement
  INSURANCE = 'INSURANCE',
  PENSION = 'PENSION',
  
  // Others
  CASH = 'CASH',
  COMMODITY = 'COMMODITY',
  FOREX = 'FOREX',
  OTHER = 'OTHER'
}

export enum LiquidityLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface AssetCategory {
  id: string;
  name: string;
  codeName: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAsset {
  id: string;
  userId: string;
  categoryId: string;
  category?: AssetCategory;
  name: string;
  description?: string;
  type: AssetType;
  currentValue: number;
  purchasePrice?: number;
  purchaseDate?: Date;
  lastUpdated: Date;
  currency: string;
  annualReturn?: number;
  marketValue?: number;
  valuationDate?: Date;
  liquidityLevel: LiquidityLevel;
  additionalInfo?: Record<string, any>;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateAssetRequest {
  categoryId: string;
  name: string;
  description?: string;
  type?: AssetType;
  currentValue: number;
  purchasePrice?: number;
  purchaseDate?: string;
  currency?: string;
  annualReturn?: number;
  marketValue?: number;
  valuationDate?: string;
  liquidityLevel?: LiquidityLevel;
  additionalInfo?: {
    location?: string;
    condition?: string;
    serialNumber?: string;
    broker?: string;
    accountNumber?: string;
    interestRate?: number;
    maturityDate?: Date;
    dividendYield?: number;
    riskRating?: string;
    [key: string]: any;
  };
  notes?: string;
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {}

export interface UpdateAssetValueRequest {
  currentValue: number;
  marketValue?: number;
  notes?: string;
}

export interface AssetFilters {
  categoryId?: string;
  type?: AssetType;
  liquidityLevel?: LiquidityLevel;
  minValue?: number;
  maxValue?: number;
  currency?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

export interface AssetSummary {
  totalValue: number;
  totalAssets: number;
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    totalValue: number;
    percentage: number;
    assetCount: number;
  }>;
  byType: Array<{
    type: AssetType;
    totalValue: number;
    assetCount: number;
  }>;
}

export interface AssetsResponse {
  assets: UserAsset[];
  total: number;
  summary: AssetSummary;
}

export interface AssetBreakdown {
  categoryId: string;
  categoryName: string;
  totalValue: number;
  percentage: number;
  assetCount: number;
}

export interface TotalValueResponse {
  totalValue: number;
} 