/**
 * Asset Management Service
 */

import apiService from './api.service';
import { ApiResponse } from '@/types/api.types';
import { logger } from '@/utils/logger.utils';
import { HTTP_STATUS } from '@/constants/app.constants';
import {
  UserAsset,
  AssetCategory,
  CreateAssetRequest,
  UpdateAssetRequest,
  UpdateAssetValueRequest,
  AssetFilters,
  AssetsResponse,
  AssetBreakdown,
  TotalValueResponse
} from '@/types/asset.types';

class AssetService {
  private baseUrl = '/asset-management';

  /**
   * Get user assets with filtering and pagination
   */
  async getAssets(filters: AssetFilters = {}): Promise<ApiResponse<AssetsResponse>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      const endpoint = `${this.baseUrl}/assets${queryString ? `?${queryString}` : ''}`;
      
      logger.debug('Fetching assets', { filters, endpoint });
      
      const response = await apiService.get<AssetsResponse>(endpoint);
      
      if (!response.success) {
        logger.error('Failed to fetch assets', undefined, { 
          filters, 
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching assets', error as Error, { filters });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải danh sách tài sản'
      };
    }
  }

  /**
   * Get asset by ID
   */
  async getAssetById(id: string): Promise<ApiResponse<UserAsset>> {
    try {
      logger.debug('Fetching asset by ID', { assetId: id });
      
      const response = await apiService.get<UserAsset>(`${this.baseUrl}/assets/${id}`);
      
      if (!response.success) {
        logger.error('Failed to fetch asset', undefined, { 
          assetId: id,
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching asset', error as Error, { assetId: id });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải thông tin tài sản'
      };
    }
  }

  /**
   * Create new asset
   */
  async createAsset(data: CreateAssetRequest): Promise<ApiResponse<UserAsset>> {
    try {
      logger.debug('Creating asset', { assetData: data });
      
      const response = await apiService.post<UserAsset, CreateAssetRequest>(
        `${this.baseUrl}/assets`,
        data
      );
      
      if (response.success) {
        logger.info('Asset created successfully', { assetId: response.data?.id });
      } else {
        logger.error('Failed to create asset', undefined, { 
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error creating asset', error as Error, { assetData: data });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tạo tài sản'
      };
    }
  }

  /**
   * Update asset
   */
  async updateAsset(id: string, data: UpdateAssetRequest): Promise<ApiResponse<UserAsset>> {
    try {
      logger.debug('Updating asset', { assetId: id, updateData: data });
      
      const response = await apiService.put<UserAsset, UpdateAssetRequest>(
        `${this.baseUrl}/assets/${id}`,
        data
      );
      
      if (response.success) {
        logger.info('Asset updated successfully', { assetId: id });
      } else {
        logger.error('Failed to update asset', undefined, { 
          assetId: id,
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error updating asset', error as Error, { assetId: id, updateData: data });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi cập nhật tài sản'
      };
    }
  }

  /**
   * Delete asset
   */
  async deleteAsset(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      logger.debug('Deleting asset', { assetId: id });
      
      const response = await apiService.delete<{ message: string }>(`${this.baseUrl}/assets/${id}`);
      
      if (response.success) {
        logger.info('Asset deleted successfully', { assetId: id });
      } else {
        logger.error('Failed to delete asset', undefined, { 
          assetId: id,
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error deleting asset', error as Error, { assetId: id });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi xóa tài sản'
      };
    }
  }

  /**
   * Update asset value quickly
   */
  async updateAssetValue(id: string, data: UpdateAssetValueRequest): Promise<ApiResponse<UserAsset>> {
    try {
      logger.debug('Updating asset value', { assetId: id, valueData: data });
      
      const response = await apiService.put<UserAsset, UpdateAssetValueRequest>(
        `${this.baseUrl}/assets/${id}/value`,
        data
      );
      
      if (response.success) {
        logger.info('Asset value updated successfully', { assetId: id, newValue: data.currentValue });
      } else {
        logger.error('Failed to update asset value', undefined, { 
          assetId: id,
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error updating asset value', error as Error, { assetId: id, valueData: data });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi cập nhật giá trị tài sản'
      };
    }
  }

  /**
   * Get total asset value
   */
  async getTotalValue(): Promise<ApiResponse<TotalValueResponse>> {
    try {
      logger.debug('Fetching total asset value');
      
      const response = await apiService.get<TotalValueResponse>(`${this.baseUrl}/summary/total-value`);
      
      if (!response.success) {
        logger.error('Failed to fetch total value', undefined, { 
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching total value', error as Error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải tổng giá trị tài sản'
      };
    }
  }

  /**
   * Get asset breakdown by category
   */
  async getAssetBreakdown(): Promise<ApiResponse<AssetBreakdown[]>> {
    try {
      logger.debug('Fetching asset breakdown');
      
      const response = await apiService.get<AssetBreakdown[]>(`${this.baseUrl}/summary/breakdown`);
      
      if (!response.success) {
        logger.error('Failed to fetch asset breakdown', undefined, { 
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching asset breakdown', error as Error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải phân tích tài sản'
      };
    }
  }

  /**
   * Get asset categories
   */
  async getCategories(): Promise<ApiResponse<AssetCategory[]>> {
    try {
      logger.debug('Fetching asset categories');
      
      const response = await apiService.get<AssetCategory[]>(`${this.baseUrl}/categories`);
      
      if (!response.success) {
        logger.error('Failed to fetch categories', undefined, { 
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching categories', error as Error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải danh mục tài sản'
      };
    }
  }

  /**
   * Get liquid assets (high liquidity)
   */
  async getLiquidAssets(): Promise<ApiResponse<UserAsset[]>> {
    try {
      logger.debug('Fetching liquid assets');
      
      const response = await apiService.get<UserAsset[]>(`${this.baseUrl}/assets/liquid`);
      
      if (!response.success) {
        logger.error('Failed to fetch liquid assets', undefined, { 
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching liquid assets', error as Error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải tài sản thanh khoản cao'
      };
    }
  }

  /**
   * Get recently updated assets
   */
  async getRecentAssets(days: number = 30): Promise<ApiResponse<UserAsset[]>> {
    try {
      logger.debug('Fetching recent assets', { days });
      
      const response = await apiService.get<UserAsset[]>(
        `${this.baseUrl}/assets/recent?days=${days}`
      );
      
      if (!response.success) {
        logger.error('Failed to fetch recent assets', undefined, { 
          days,
          statusCode: response.statusCode,
          message: response.message 
        });
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching recent assets', error as Error, { days });
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi tải tài sản cập nhật gần đây'
      };
    }
  }
}

export const assetService = new AssetService();
export default assetService; 