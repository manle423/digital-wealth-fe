import apiService from './api.service';
import { ApiResponse } from '@/types/api.types';
import {
  Recommendation,
  RecommendationStats,
  RecommendationFeedback,
  RecommendationType,
  RecommendationStatus
} from '@/types/recommendation.types';

class RecommendationService {
  /**
   * Tạo gợi ý tài chính mới dựa trên tình hình hiện tại
   */
  async generateRecommendations(): Promise<ApiResponse<Recommendation[]>> {
    return await apiService.post('/recommendations/generate');
  }

  /**
   * Lấy danh sách gợi ý đang hoạt động
   */
  async getActiveRecommendations(): Promise<ApiResponse<Recommendation[]>> {
    return await apiService.get('/recommendations');
  }

  /**
   * Lấy gợi ý theo status
   */
  async getRecommendationsByStatus(status: RecommendationStatus): Promise<ApiResponse<Recommendation[]>> {
    return await apiService.get(`/recommendations/by-status?status=${status}`);
  }

  /**
   * Lấy gợi ý theo loại cụ thể
   */
  async getRecommendationsByType(type: RecommendationType): Promise<ApiResponse<Recommendation[]>> {
    return await apiService.get(`/recommendations/by-type?type=${type}`);
  }

  /**
   * Lấy thống kê gợi ý của người dùng
   */
  async getRecommendationStats(): Promise<ApiResponse<RecommendationStats>> {
    return await apiService.get('/recommendations/stats');
  }

  /**
   * Đánh dấu gợi ý đã được xem
   */
  async markAsViewed(id: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.put(`/recommendations/${id}/view`);
  }

  /**
   * Bỏ qua gợi ý
   */
  async dismissRecommendation(id: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.put(`/recommendations/${id}/dismiss`);
  }

  /**
   * Đánh dấu gợi ý đã hoàn thành
   */
  async markAsCompleted(id: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.put(`/recommendations/${id}/complete`);
  }

  /**
   * Gửi phản hồi về gợi ý
   */
  async submitFeedback(
    id: string,
    feedback: RecommendationFeedback
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post(`/recommendations/${id}/feedback`, feedback);
  }
}

export default new RecommendationService(); 