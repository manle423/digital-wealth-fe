export interface RiskAssessmentOption {
  value: number | string;
  textEn: string;
  textVi: string;
}

export interface CreateRiskAssessmentQuestion {
  textVi: string;
  textEn: string;
  order: number;
  categoryId: string;
  options: RiskAssessmentOption[];
}

export interface QuestionTranslation {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  questionId: string;
  language: string;
  text: string;
}

export interface RiskAssessmentQuestion {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  text: string;
  order: number;
  isActive: boolean;
  categoryId: string;
  category?: QuestionCategory;
  options: RiskAssessmentOption[];
  translations: QuestionTranslation[];
  textVi: string;
  textEn: string;
}

export interface RiskAssessmentPagination {
  offset: number;
  totalItems: number;
  page: number;
  limit: number;
}

export interface RiskAssessmentQuestionsResponse {
  data: RiskAssessmentQuestion[];
  pagination: RiskAssessmentPagination;
}

export interface RiskAssessmentQuestionParams {
  isActive?: boolean;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
  categories?: string;
}

export interface QuestionCategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  codeName: string;
  description: string;
  isActive: boolean;
  order: number;
  imageUrl: string | null;
  questions: RiskAssessmentQuestion[];
}

export interface QuestionCategoriesResponse {
  data: QuestionCategory[];
  pagination: RiskAssessmentPagination;
}

export interface QuestionCategoryParams {
  isActive?: boolean;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

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