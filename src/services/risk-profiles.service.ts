import { RiskProfileResponse, RiskProfileTypeResponse } from '@/types/portfolio-management.types';
import apiService from './api.service';

class RiskProfilesService {
  /**
   * Lấy danh sách hồ sơ rủi ro
   * @param params Các tham số để phân trang và filter
   * @returns Danh sách hồ sơ rủi ro và phân trang
   */
  async getProfiles(params?: { 
    page?: number; 
    limit?: number;
    types?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append('page', String(params.page));
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.types) queryParams.append('types', params.types);
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await apiService.get<RiskProfileResponse>(`/admin/portfolio-management/profiles${queryString}`);
    return response;
  }

  /**
   * Lấy danh sách các loại hồ sơ rủi ro
   * @returns Danh sách các loại hồ sơ rủi ro
   */
  async getProfileTypes() {
    return await apiService.get<RiskProfileTypeResponse>('/admin/portfolio-management/profiles/risk-profile-type');
  }

  /**
   * Tạo hồ sơ rủi ro mới
   * @param data Dữ liệu hồ sơ rủi ro mới
   * @returns Hồ sơ rủi ro đã được tạo
   */
  async createProfile(data: any) {
    return await apiService.post<RiskProfileResponse>('/admin/portfolio-management/profiles', data);
  }

  /**
   * Cập nhật hồ sơ rủi ro
   * @param id ID của hồ sơ rủi ro cần cập nhật
   * @param data Dữ liệu cập nhật
   * @returns Kết quả cập nhật
   */
  async updateProfile(id: string, data: any) {
    return await apiService.put<RiskProfileResponse>(`/admin/portfolio-management/profiles/${id}`, data);
  }

  /**
   * Xóa hồ sơ rủi ro
   * @param id ID của hồ sơ rủi ro cần xóa
   * @returns Kết quả xóa
   */
  async deleteProfile(id: string) {
    return await apiService.delete<RiskProfileResponse>(`/admin/portfolio-management/profiles/${id}`);
  }
}

export default new RiskProfilesService(); 