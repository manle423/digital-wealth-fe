import { ApiResponse } from '@/types/api.types';
import { AssetAllocation, AssetAllocationsResponse } from '@/types/portfolio-management.types';
import apiService from './api.service';

interface BatchAllocationData {
  riskProfileId: string;
  allocations: {
    assetClassId: string;
    percentage: number;
  }[];
}

class AssetAllocationService {
  /**
   * Get all asset allocations
   * @returns List of asset allocations
   */
  async getAssetAllocations(): Promise<ApiResponse<AssetAllocation[]>> {
    return await apiService.get('/admin/portfolio-management/asset-allocations');
  }

  /**
   * Get asset allocation by ID
   * @param id Asset allocation ID
   * @returns Asset allocation details
   */
  async getAssetAllocationById(id: string): Promise<ApiResponse<AssetAllocation>> {
    return await apiService.get(`/admin/portfolio-management/asset-allocations/${id}`);
  }

  /**
   * Get asset allocations by risk profile ID
   * @param riskProfileId Risk profile ID
   * @returns List of asset allocations for the risk profile
   */
  async getAssetAllocationsByRiskProfile(riskProfileId: string): Promise<ApiResponse<AssetAllocation[]>> {
    return await apiService.get(`/admin/portfolio-management/asset-allocations/risk-profile/${riskProfileId}`);
  }

  /**
   * Create or update batch allocations for a risk profile
   * @param data Batch allocation data
   * @returns Created/updated allocations
   */
  async createOrUpdateBatchAllocations(data: BatchAllocationData): Promise<ApiResponse<AssetAllocation[]>> {
    return await apiService.post('/admin/portfolio-management/asset-allocations/batch', data);
  }

  /**
   * Delete asset allocation
   * @param id Asset allocation ID
   * @returns Deletion result
   */
  async deleteAssetAllocation(id: string): Promise<ApiResponse<void>> {
    return await apiService.delete(`/admin/portfolio-management/asset-allocations/${id}`);
  }
}

export default new AssetAllocationService();
