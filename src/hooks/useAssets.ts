/**
 * Custom hook for asset management
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import assetService from '@/services/asset.service';
import { withErrorHandling } from '@/utils/error.utils';
import { logger } from '@/utils/logger.utils';
import { SUCCESS_MESSAGES } from '@/constants/app.constants';
import {
  UserAsset,
  AssetCategory,
  CreateAssetRequest,
  UpdateAssetRequest,
  UpdateAssetValueRequest,
  AssetFilters,
  AssetSummary,
  AssetBreakdown,
  TotalValueResponse
} from '@/types/asset.types';

interface UseAssetsReturn {
  // State
  assets: UserAsset[];
  categories: AssetCategory[];
  summary: AssetSummary | null;
  totalValue: number;
  breakdown: AssetBreakdown[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchAssets: (filters?: AssetFilters) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTotalValue: () => Promise<void>;
  fetchBreakdown: () => Promise<void>;
  createAsset: (data: CreateAssetRequest) => Promise<boolean>;
  updateAsset: (id: string, data: UpdateAssetRequest) => Promise<boolean>;
  deleteAsset: (id: string) => Promise<boolean>;
  updateAssetValue: (id: string, data: UpdateAssetValueRequest) => Promise<boolean>;
  clearError: () => void;
  refreshAll: () => Promise<void>;
}

export const useAssets: (initialFilters?: AssetFilters) => UseAssetsReturn = (initialFilters: AssetFilters = {}) => {
  // State
  const [assets, setAssets] = useState<UserAsset[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [summary, setSummary] = useState<AssetSummary | null>(null);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<AssetBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch assets with filters
  const fetchAssets = useCallback(async (filters: AssetFilters = initialFilters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await assetService.getAssets(filters);
      
      if (response.success && response.data) {
        setAssets(response.data.assets);
        setSummary(response.data.summary);
        logger.debug('Assets fetched successfully', { 
          count: response.data.assets.length,
          total: response.data.total 
        });
      } else {
        setError(response.message || 'Không thể tải danh sách tài sản');
        logger.error('Failed to fetch assets', undefined, { 
          filters,
          message: response.message 
        });
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi tải danh sách tài sản');
      logger.error('Error fetching assets', error as Error, { filters });
    }
  }, [initialFilters]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await assetService.getCategories();
      
      if (response.success && response.data) {
        setCategories(response.data);
        logger.debug('Categories fetched successfully', { count: response.data.length });
      } else {
        setError(response.message || 'Không thể tải danh mục tài sản');
        logger.error('Failed to fetch categories', undefined, { message: response.message });
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi tải danh mục tài sản');
      logger.error('Error fetching categories', error as Error);
    }
  }, []);

  // Fetch total value
  const fetchTotalValue = useCallback(async () => {
    try {
      const response = await assetService.getTotalValue();
      
      if (response.success && response.data) {
        setTotalValue(response.data.totalValue);
        logger.debug('Total value fetched successfully', { totalValue: response.data.totalValue });
      } else {
        setError(response.message || 'Không thể tải tổng giá trị tài sản');
        logger.error('Failed to fetch total value', undefined, { message: response.message });
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi tải tổng giá trị tài sản');
      logger.error('Error fetching total value', error as Error);
    }
  }, []);

  // Fetch breakdown
  const fetchBreakdown = useCallback(async () => {
    try {
      const response = await assetService.getAssetBreakdown();
      
      if (response.success && response.data) {
        setBreakdown(response.data);
        logger.debug('Breakdown fetched successfully', { count: response.data.length });
      } else {
        setError(response.message || 'Không thể tải phân tích tài sản');
        logger.error('Failed to fetch breakdown', undefined, { message: response.message });
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi tải phân tích tài sản');
      logger.error('Error fetching breakdown', error as Error);
    }
  }, []);

  // Create asset
  const createAsset = useCallback(async (data: CreateAssetRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await assetService.createAsset(data);
      
      if (response.success && response.data) {
        // Add new asset to the list
        setAssets(prev => [response.data!, ...prev]);
        toast.success(SUCCESS_MESSAGES.SAVE_SUCCESS);
        logger.info('Asset created successfully', { assetId: response.data.id });
        
        // Refresh summary data
        await Promise.all([fetchTotalValue(), fetchBreakdown()]);
        
        return true;
      } else {
        setError(response.message || 'Không thể tạo tài sản');
        toast.error(response.message || 'Không thể tạo tài sản');
        return false;
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi tạo tài sản');
      toast.error('Đã xảy ra lỗi khi tạo tài sản');
      logger.error('Error creating asset', error as Error, { data });
      return false;
    }
  }, [fetchTotalValue, fetchBreakdown]);

  // Update asset
  const updateAsset = useCallback(async (id: string, data: UpdateAssetRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await assetService.updateAsset(id, data);
      
      if (response.success && response.data) {
        // Update asset in the list
        setAssets(prev => prev.map(asset => 
          asset.id === id ? response.data! : asset
        ));
        toast.success(SUCCESS_MESSAGES.UPDATE_SUCCESS);
        logger.info('Asset updated successfully', { assetId: id });
        
        // Refresh summary data
        await Promise.all([fetchTotalValue(), fetchBreakdown()]);
        
        return true;
      } else {
        setError(response.message || 'Không thể cập nhật tài sản');
        toast.error(response.message || 'Không thể cập nhật tài sản');
        return false;
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi cập nhật tài sản');
      toast.error('Đã xảy ra lỗi khi cập nhật tài sản');
      logger.error('Error updating asset', error as Error, { id, data });
      return false;
    }
  }, [fetchTotalValue, fetchBreakdown]);

  // Delete asset
  const deleteAsset = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await assetService.deleteAsset(id);
      
      if (response.success) {
        // Remove asset from the list
        setAssets(prev => prev.filter(asset => asset.id !== id));
        toast.success(SUCCESS_MESSAGES.DELETE_SUCCESS);
        logger.info('Asset deleted successfully', { assetId: id });
        
        // Refresh summary data
        await Promise.all([fetchTotalValue(), fetchBreakdown()]);
        
        return true;
      } else {
        setError(response.message || 'Không thể xóa tài sản');
        toast.error(response.message || 'Không thể xóa tài sản');
        return false;
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi xóa tài sản');
      toast.error('Đã xảy ra lỗi khi xóa tài sản');
      logger.error('Error deleting asset', error as Error, { id });
      return false;
    }
  }, [fetchTotalValue, fetchBreakdown]);

  // Update asset value
  const updateAssetValue = useCallback(async (id: string, data: UpdateAssetValueRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await assetService.updateAssetValue(id, data);
      
      if (response.success && response.data) {
        // Update asset in the list
        setAssets(prev => prev.map(asset => 
          asset.id === id ? response.data! : asset
        ));
        toast.success('Cập nhật giá trị thành công');
        logger.info('Asset value updated successfully', { assetId: id, newValue: data.currentValue });
        
        // Refresh summary data
        await Promise.all([fetchTotalValue(), fetchBreakdown()]);
        
        return true;
      } else {
        setError(response.message || 'Không thể cập nhật giá trị tài sản');
        toast.error(response.message || 'Không thể cập nhật giá trị tài sản');
        return false;
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi cập nhật giá trị tài sản');
      toast.error('Đã xảy ra lỗi khi cập nhật giá trị tài sản');
      logger.error('Error updating asset value', error as Error, { id, data });
      return false;
    }
  }, [fetchTotalValue, fetchBreakdown]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchAssets(),
      fetchCategories(),
      fetchTotalValue(),
      fetchBreakdown()
    ]);
  }, [fetchAssets, fetchCategories, fetchTotalValue, fetchBreakdown]);

  // Initial data fetch
  useEffect(() => {
    refreshAll();
  }, []);

  // Always set loading to false after operations
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [assets, categories, summary, totalValue, breakdown]);

  return {
    // State
    assets,
    categories,
    summary,
    totalValue,
    breakdown,
    loading,
    error,
    
    // Actions
    fetchAssets,
    fetchCategories,
    fetchTotalValue,
    fetchBreakdown,
    createAsset,
    updateAsset,
    deleteAsset,
    updateAssetValue,
    clearError,
    refreshAll
  };
}; 