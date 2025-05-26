import { CreateDebtRequest, Debt, DebtBreakdown, DebtCategory, DebtFilters, DebtSummary, UpdateBalanceRequest } from '@/types/debt-management.types';
import apiService from './api.service';

class DebtManagementService {
  private baseUrl = '/debt-management';

  // Get all debts with filtering
  async getDebts(filters?: DebtFilters) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `${this.baseUrl}/debts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
      return {
        success: true,
        data: response.data as { debts: Debt[]; total: number; page: number; limit: number }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách nợ',
        error
      };
    }
  }

  // Get debt by ID
  async getDebtById(id: string) {
    try {
      const response = await apiService.get(`${this.baseUrl}/debts/${id}`);
      
      return {
        success: true,
        data: response.data as Debt
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thông tin nợ',
        error
      };
    }
  }

  // Create new debt
  async createDebt(debtData: CreateDebtRequest) {
    try {
      const response = await apiService.post(`${this.baseUrl}/debts`, debtData);
      
      return {
        success: true,
        data: response.data as Debt
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo khoản nợ mới',
        error
      };
    }
  }

  // Update debt
  async updateDebt(id: string, debtData: Partial<CreateDebtRequest>) {
    try {
      const response = await apiService.put(`${this.baseUrl}/debts/${id}`, debtData);
      
      return {
        success: true,
        data: response.data as Debt
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật khoản nợ',
        error
      };
    }
  }

  // Delete debt
  async deleteDebt(id: string) {
    try {
      const response = await apiService.delete(`${this.baseUrl}/debts/${id}`);
      
      return {
        success: true,
        data: response.data as { message: string }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa khoản nợ',
        error
      };
    }
  }

  // Update debt balance (for payments)
  async updateDebtBalance(id: string, balanceData: UpdateBalanceRequest) {
    try {
      const response = await apiService.put(`${this.baseUrl}/debts/${id}/balance`, balanceData);
      
      return {
        success: true,
        data: response.data as Debt
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật số dư nợ',
        error
      };
    }
  }

  // Get total debt value
  async getTotalDebtValue() {
    try {
      const response = await apiService.get(`${this.baseUrl}/summary/total-value`);
      
      return {
        success: true,
        data: response.data as { totalValue: number }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải tổng giá trị nợ',
        error
      };
    }
  }

  // Get debt breakdown
  async getDebtBreakdown() {
    try {
      const response = await apiService.get(`${this.baseUrl}/summary/breakdown`);
      
      return {
        success: true,
        data: response.data as DebtBreakdown[]
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải phân tích nợ',
        error
      };
    }
  }

  // Get debt summary
  async getDebtSummary() {
    try {
      const response = await apiService.get(`${this.baseUrl}/summary`);
      
      return {
        success: true,
        data: response.data as DebtSummary
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải tổng quan nợ',
        error
      };
    }
  }

  // Get overdue debts
  async getOverdueDebts() {
    try {
      const response = await apiService.get(`${this.baseUrl}/overdue`);
      
      return {
        success: true,
        data: response.data as Debt[]
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách nợ quá hạn',
        error
      };
    }
  }

  // Get upcoming payments
  async getUpcomingPayments(days?: number) {
    try {
      const url = `${this.baseUrl}/upcoming-payments${days ? `?days=${days}` : ''}`;
      const response = await apiService.get(url);
      
      return {
        success: true,
        data: response.data as Debt[]
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách thanh toán sắp tới',
        error
      };
    }
  }

  // Get debt categories
  async getDebtCategories() {
    try {
      const response = await apiService.get(`${this.baseUrl}/categories`);
      
      return {
        success: true,
        data: response.data as DebtCategory[]
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh mục nợ',
        error
      };
    }
  }

  // Create debt category (admin only)
  async createDebtCategory(categoryData: Omit<DebtCategory, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await apiService.post(`${this.baseUrl}/categories`, categoryData);
      
      return {
        success: true,
        data: response.data as DebtCategory
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo danh mục nợ mới',
        error
      };
    }
  }
}

const debtManagementService = new DebtManagementService();
export default debtManagementService; 