import { AssetClass, AssetClassesResponse, AssetClassParams } from "@/types/portfolio-management.types";
import apiService from "./api.service";
import { ApiResponse } from "@/types/api.types";

class AssetClassService {
  /**
   * Lấy danh sách lớp tài sản
   * @param params Các tham số để filter, phân trang, sắp xếp
   * @returns Danh sách lớp tài sản và phân trang
   */
  async getAssetClasses(params?: AssetClassParams): Promise<ApiResponse<AssetClassesResponse>> {
    // Xây dựng query string từ params
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.page) queryParams.append('page', String(params.page));
      if (params.limit) queryParams.append('limit', String(params.limit));
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return await apiService.get(`/admin/portfolio-management/asset-classes${queryString}`);
  }

  /**
   * Lấy thông tin một lớp tài sản theo ID
   * @param id ID của lớp tài sản cần lấy thông tin
   * @returns Thông tin chi tiết của lớp tài sản
   */
  async getAssetClassById(id: string): Promise<ApiResponse<AssetClass>> {
    return await apiService.get(`/admin/portfolio-management/asset-classes/${id}`);
  }

  /**
   * Tạo lớp tài sản mới
   * @param data Dữ liệu lớp tài sản mới
   * @returns Lớp tài sản đã được tạo
   */
  async createAssetClass(data: Partial<AssetClass>): Promise<ApiResponse<AssetClass>> {
    const payload = {
      assetClasses: [data]
    };
    return await apiService.post('/admin/portfolio-management/asset-classes', payload);
  }

  /**
   * Cập nhật lớp tài sản
   * @param id ID của lớp tài sản cần cập nhật
   * @param data Dữ liệu cập nhật
   * @returns Kết quả cập nhật
   */
  async updateAssetClass(id: string, data: Partial<AssetClass>): Promise<ApiResponse<AssetClass>> {
    // Remove unnecessary fields
    const { 
      id: _, 
      createdAt, 
      updatedAt, 
      deletedAt,
      ...cleanData 
    } = data as any;
    
    // Send the clean data directly as payload
    return await apiService.put(`/admin/portfolio-management/asset-classes/${id}`, cleanData);
  }

  /**
   * Xóa lớp tài sản
   * @param id ID của lớp tài sản cần xóa
   * @returns Kết quả xóa
   */
  async deleteAssetClass(id: string): Promise<ApiResponse<any>> {
    return await apiService.delete(`/admin/portfolio-management/asset-classes/${id}`);
  }

  /**
   * Xóa nhiều lớp tài sản cùng lúc
   * @param ids Mảng các ID của lớp tài sản cần xóa
   * @returns Kết quả xóa
   */
  async deleteManyAssetClasses(ids: string[]): Promise<ApiResponse<any>> {
    return await apiService.delete('/admin/portfolio-management/asset-classes', { ids });
  }
}

export default new AssetClassService(); 