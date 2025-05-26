export interface DebtCategory {
  id: string;
  name: string;
  codeName: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSchedule {
  frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  amount: number;
  nextPaymentDate: string;
  remainingPayments: number;
}

export interface AdditionalInfo {
  accountNumber?: string;
  contractNumber?: string;
  [key: string]: any;
}

export interface Debt {
  id: string;
  name: string;
  description?: string;
  type: 'PERSONAL_LOAN' | 'CREDIT_CARD' | 'MORTGAGE' | 'AUTO_LOAN' | 'STUDENT_LOAN' | 'BUSINESS_LOAN' | 'OTHER';
  status: 'ACTIVE' | 'PAID_OFF' | 'OVERDUE' | 'DEFAULTED' | 'RESTRUCTURED' | 'SUSPENDED';
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  startDate: string;
  dueDate: string;
  monthlyPayment: number;
  creditor: string;
  currency: string;
  termMonths: number;
  totalPaid: number;
  totalInterest: number;
  penaltyRate?: number;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  paymentMethod?: string;
  paymentSchedule?: PaymentSchedule;
  additionalInfo?: AdditionalInfo;
  notes?: string;
  category: DebtCategory;
  createdAt: string;
  updatedAt: string;
}

export interface DebtFilters {
  type?: string;
  status?: string;
  categoryId?: string;
  creditor?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'name' | 'currentBalance' | 'dueDate' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface DebtBreakdown {
  categoryId: string;
  categoryName: string;
  totalValue: number;
  count: number;
  percentage: number;
}

export interface DebtSummary {
  totalDebt: number;
  breakdown: DebtBreakdown[];
  overdueCount: number;
  overdueAmount: number;
  upcomingPaymentsCount: number;
  upcomingPaymentsAmount: number;
}

export interface CreateDebtRequest {
  categoryId: string;
  name: string;
  description?: string;
  type: Debt['type'];
  status?: Debt['status'];
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  startDate: string;
  dueDate: string;
  monthlyPayment: number;
  creditor: string;
  currency?: string;
  termMonths?: number;
  totalPaid?: number;
  totalInterest?: number;
  penaltyRate?: number;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  paymentMethod?: string;
  paymentSchedule?: PaymentSchedule;
  additionalInfo?: AdditionalInfo;
  notes?: string;
}

export interface UpdateBalanceRequest {
  currentBalance: number;
  lastPaymentDate?: string;
  paymentAmount: number;
  notes?: string;
}
