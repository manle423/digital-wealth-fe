import { RiskAssessmentPagination } from "./risk-assessment.types";

export type RiskProfileType = 'CONSERVATIVE' | 'MODERATELY_CONSERVATIVE' | 'MODERATE' | 'MODERATELY_AGGRESSIVE' | 'AGGRESSIVE';

export interface RiskProfileTranslation {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  riskProfileId: string;
  language: string;
  name: string;
  description: string;
}

export interface RiskProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  type: RiskProfileType;
  minScore: number;
  maxScore: number;
  translations: RiskProfileTranslation[];
  totalUsers?: number;
}

export interface RiskProfileResponse {
  success: boolean;
  data: RiskProfile[];
  pagination: RiskAssessmentPagination;
  message: string;
  statusCode: number;
}

export interface RiskProfileTypeResponse {
  success: boolean;
  data: RiskProfileType[];
  message: string;
  statusCode: number;
} 


interface Translation {
  id?: string;
  language: string;
  name: string;
  description: string;
}

export interface AssetClass {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isActive: boolean;
  order: number;
  icon: string;
  riskLevel: number;
  expectedReturn: number;
  translations: Translation[];
}

export interface AssetClassesResponse {
  data: AssetClass[];
  pagination: {
    offset: number;
    totalItems: number;
    page: number;
    limit: number;
  };
}

export interface AssetClassParams {
  isActive?: boolean;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface AssetAllocation {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  riskProfileId: string;
  assetClassId: string;
  percentage: number;
  assetClass: AssetClass;
  riskProfile: RiskProfile;
}

export interface AssetAllocationsResponse {
  data: AssetAllocation[];
  message: string;
  statusCode: number;
}