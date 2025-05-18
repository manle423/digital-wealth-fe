import apiService from "./api.service";
import { ApiResponse } from "@/types/api.types";
import { 
  QuestionCategory,
  QuestionCategoriesResponse,
  QuestionCategoryParams
} from "@/types/risk-assessment.types";

class QuestionCategoriesService {
  /**
   * Lấy danh sách danh mục câu hỏi đánh giá rủi ro
   * @param params Các tham số để filter, phân trang, sắp xếp
   * @returns Danh sách danh mục câu hỏi đánh giá rủi ro và phân trang
   */
  async getCategories(params?: QuestionCategoryParams): Promise<ApiResponse<QuestionCategoriesResponse>> {
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
    
    return await apiService.get(`/admin/risk-assessment/question-categories${queryString}`);
  }

  /**
   * Lấy thông tin một danh mục câu hỏi theo ID
   * @param id ID của danh mục cần lấy thông tin
   * @returns Thông tin chi tiết của danh mục
   */
  async getCategoryById(id: string): Promise<ApiResponse<QuestionCategory>> {
    return await apiService.get(`/admin/risk-assessment/question-categories/${id}`);
  }

  /**
   * Tạo danh mục câu hỏi mới
   * @param categoryData Dữ liệu danh mục mới
   * @returns Danh mục đã được tạo
   */
  async createCategory(categoryData: any): Promise<ApiResponse<any>> {
    // Wrap the category data in the required format
    const payload = {
      categories: [categoryData]
    };
    return await apiService.post('/admin/risk-assessment/question-categories', payload);
  }

  /**
   * Tạo nhiều danh mục câu hỏi cùng lúc
   * @param categories Mảng các danh mục cần tạo
   * @returns Kết quả tạo danh mục
   */
  async createCategories(categories: any[]): Promise<ApiResponse<any>> {
    return await apiService.post('/admin/risk-assessment/question-categories', { categories });
  }

  /**
   * Cập nhật danh mục câu hỏi
   * @param id ID của danh mục cần cập nhật
   * @param data Dữ liệu cập nhật
   * @returns Kết quả cập nhật
   */
  async updateCategory(id: string, data: any): Promise<ApiResponse<any>> {
    // Format the payload according to the API requirements
    const payload = {
      categories: [
        {
          id: id,
          data: data
        }
      ]
    };
    return await apiService.put(`/admin/risk-assessment/question-categories`, payload);
  }

  /**
   * Xóa nhiều danh mục câu hỏi cùng lúc
   * @param ids Mảng các ID của danh mục cần xóa
   * @returns Kết quả xóa
   */
  async deleteCategories(ids: string[]): Promise<ApiResponse<any>> {
    return await apiService.delete('/admin/risk-assessment/question-categories/', { ids });
  }
}

export default new QuestionCategoriesService(); 