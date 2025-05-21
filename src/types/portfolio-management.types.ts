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