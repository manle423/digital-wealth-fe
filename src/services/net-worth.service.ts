import { NetWorthSummary, NetWorthSnapshot } from '@/types/net-worth.types';
import { ApiResponse } from '@/types/api.types';
import apiService from './api.service';
import { logger } from '@/utils/logger.utils';

class NetWorthService {
  private readonly baseUrl = '/net-worth';

  async getCurrentNetWorth(): Promise<ApiResponse<NetWorthSummary['current']>> {
    try {
      logger.debug('Fetching current net worth');
      
      const response = await apiService.get<NetWorthSummary['current']>(`${this.baseUrl}/current`);
      
      if (!response.success) {
        logger.error('Failed to fetch current net worth', undefined, {
          statusCode: response.statusCode,
          message: response.message
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching current net worth', error as Error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải thông tin tài sản ròng hiện tại'
      };
    }
  }

  async getNetWorthSummary(): Promise<ApiResponse<NetWorthSummary>> {
    try {
      logger.debug('Fetching net worth summary');
      
      const response = await apiService.get<NetWorthSummary>(`${this.baseUrl}/summary`);
      
      if (!response.success) {
        logger.error('Failed to fetch net worth summary', undefined, {
          statusCode: response.statusCode,
          message: response.message
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching net worth summary', error as Error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải tổng quan tài sản ròng'
      };
    }
  }

  async getNetWorthHistory(months: number = 12): Promise<ApiResponse<NetWorthSnapshot[]>> {
    try {
      logger.debug('Fetching net worth history', { months });
      
      const response = await apiService.get<NetWorthSnapshot[]>(
        `${this.baseUrl}/history?months=${months}`
      );
      
      if (!response.success) {
        logger.error('Failed to fetch net worth history', undefined, {
          months,
          statusCode: response.statusCode,
          message: response.message
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching net worth history', error as Error, { months });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải lịch sử tài sản ròng'
      };
    }
  }

  async createSnapshot(): Promise<ApiResponse<NetWorthSnapshot>> {
    try {
      logger.debug('Creating net worth snapshot');
      
      const response = await apiService.post<NetWorthSnapshot>(`${this.baseUrl}/snapshot`);
      
      if (response.success) {
        logger.info('Net worth snapshot created successfully');
      } else {
        logger.error('Failed to create net worth snapshot', undefined, {
          statusCode: response.statusCode,
          message: response.message
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error creating net worth snapshot', error as Error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tạo bản ghi tài sản ròng'
      };
    }
  }
}

const netWorthService = new NetWorthService();
export default netWorthService; 