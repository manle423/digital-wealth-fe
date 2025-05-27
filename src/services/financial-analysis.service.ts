import { ApiResponse } from '@/types/api.types';
import {
  FinancialSummary,
  FinancialMetric,
  MetricType,
  MetricTrendPoint
} from '@/types/financial-analysis.types';
import apiService from './api.service';
import { logger } from '@/utils/logger.utils';

class FinancialAnalysisService {
  private readonly baseUrl = '/financial-analysis';

  async getFinancialSummary(): Promise<ApiResponse<FinancialSummary>> {
    try {
      logger.debug('Fetching financial summary');
      
      const response = await apiService.get<FinancialSummary>(`${this.baseUrl}/summary`);
      
      if (!response.success) {
        logger.error('Failed to fetch financial summary', undefined, {
          statusCode: response.statusCode,
          message: response.message
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching financial summary', error as Error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải thông tin phân tích tài chính'
      };
    }
  }

  async calculateAllMetrics(): Promise<ApiResponse<FinancialMetric[]>> {
    try {
      logger.debug('Calculating all financial metrics');
      
      const response = await apiService.post<FinancialMetric[]>(`${this.baseUrl}/calculate`);
      
      if (response.success || (response.statusCode !== undefined && response.statusCode >= 200 && response.statusCode < 300)) {
        logger.info('Financial metrics calculated successfully');
        return {
          success: true,
          data: response.data,
          message: response.message || 'Success',
          statusCode: response.statusCode || 200
        };
      } else {
        logger.error('Failed to calculate financial metrics', undefined, {
          statusCode: response.statusCode,
          message: response.message
        });
        return response;
      }
    } catch (error) {
      logger.error('Error calculating financial metrics', error as Error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tính toán các chỉ số tài chính'
      };
    }
  }

  async getMetricsByType(type: MetricType): Promise<ApiResponse<FinancialMetric[]>> {
    try {
      logger.debug('Fetching metrics by type', { type });
      
      const response = await apiService.get<FinancialMetric[]>(
        `${this.baseUrl}/metrics?type=${type}`
      );
      
      if (!response.success) {
        logger.error('Failed to fetch metrics', undefined, {
          type,
          statusCode: response.statusCode,
          message: response.message
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching metrics', error as Error, { type });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải chỉ số tài chính'
      };
    }
  }

  async getLatestMetric(type: MetricType): Promise<ApiResponse<FinancialMetric>> {
    try {
      logger.debug('Fetching latest metric', { type });
      
      const response = await apiService.get<FinancialMetric>(
        `${this.baseUrl}/metrics/latest?type=${type}`
      );
      
      if (!response.success) {
        logger.error('Failed to fetch latest metric', undefined, {
          type,
          statusCode: response.statusCode,
          message: response.message
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching latest metric', error as Error, { type });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải chỉ số tài chính mới nhất'
      };
    }
  }

  async getMetricTrend(type: MetricType, months: number = 12): Promise<ApiResponse<MetricTrendPoint[]>> {
    try {
      logger.debug('Fetching metric trend', { type, months });
      
      const response = await apiService.get<MetricTrendPoint[]>(
        `${this.baseUrl}/metrics/trend?type=${type}&months=${months}`
      );
      
      if (!response.success) {
        logger.error('Failed to fetch metric trend', undefined, {
          type,
          months,
          statusCode: response.statusCode,
          message: response.message
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching metric trend', error as Error, { type, months });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải dữ liệu xu hướng'
      };
    }
  }
}

const financialAnalysisService = new FinancialAnalysisService();
export default financialAnalysisService; 