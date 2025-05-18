import apiService from "./api.service";
import { ApiResponse } from "@/types/api.types";
import { 
  RiskAssessmentQuestionsResponse, 
  RiskAssessmentQuestionParams,
  RiskAssessmentQuestion,
  CreateRiskAssessmentQuestion
} from "@/types/risk-assessment.types";

class RiskAssessmentQuestionsService {
  /**
   * Lấy danh sách câu hỏi đánh giá rủi ro
   * @param params Các tham số để filter, phân trang, sắp xếp
   * @returns Danh sách câu hỏi đánh giá rủi ro và phân trang
   */
  async getQuestions(params?: RiskAssessmentQuestionParams): Promise<ApiResponse<RiskAssessmentQuestionsResponse>> {
    // Xây dựng query string từ params
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.page) queryParams.append('page', String(params.page));
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.categories) {
        // Gửi categories như một chuỗi có dấu phẩy ngăn cách
        queryParams.append('categories', params.categories);
      }
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return await apiService.get(`/admin/risk-assessment/questions${queryString}`);
  }

  /**
   * Lấy thông tin một câu hỏi theo ID
   * @param id ID của câu hỏi cần lấy thông tin
   * @returns Thông tin chi tiết của câu hỏi
   */
  async getQuestionById(id: string): Promise<ApiResponse<RiskAssessmentQuestion>> {
    return await apiService.get(`/admin/risk-assessment/questions/${id}`);
  }

  /**
   * Tạo câu hỏi mới
   * @param data Dữ liệu câu hỏi mới
   * @returns Câu hỏi đã được tạo
   */
  async createQuestion(data: any): Promise<ApiResponse<any>> {
    // Ensure compatibility with both category and categoryId
    const preparedData = { ...data };
    if (preparedData.categoryId && !preparedData.category) {
      preparedData.category = preparedData.categoryId;
    }
    
    // Format the payload according to the API requirements
    const payload = {
      questions: [preparedData]
    };
    
    return await apiService.post('/admin/risk-assessment/questions', payload);
  }

  /**
   * Tạo nhiều câu hỏi cùng lúc
   * @param questions Mảng các câu hỏi cần tạo
   * @returns Kết quả tạo câu hỏi
   */
  async createQuestions(questions: CreateRiskAssessmentQuestion[]): Promise<ApiResponse<any>> {
    // Ensure compatibility with both category and categoryId
    const preparedQuestions = questions.map(q => {
      const prepared = { ...q } as any;
      if (prepared.categoryId && !prepared.category) {
        prepared.category = prepared.categoryId;
      }
      return prepared;
    });
    
    // Format the payload according to the API requirements
    const payload = {
      questions: preparedQuestions
    };
    
    return await apiService.post('/admin/risk-assessment/questions', payload);
  }

  /**
   * Cập nhật câu hỏi
   * @param id ID của câu hỏi cần cập nhật
   * @param data Dữ liệu cập nhật
   * @returns Kết quả cập nhật
   */
  async updateQuestion(id: string, data: any): Promise<ApiResponse<any>> {
    // Ensure compatibility with both category and categoryId
    const preparedData = { ...data };
    if (preparedData.categoryId && !preparedData.category) {
      preparedData.category = preparedData.categoryId;
    }
    
    // Format the payload according to the API requirements
    const payload = {
      questions: [
        {
          id: id,
          data: preparedData
        }
      ]
    };
    
    return await apiService.put(`/admin/risk-assessment/questions`, payload);
  }

  /**
   * Xóa nhiều câu hỏi cùng lúc
   * @param ids Mảng các ID của câu hỏi cần xóa
   * @returns Kết quả xóa
   */
  async deleteQuestions(ids: string[]): Promise<ApiResponse<any>> {
    return await apiService.delete('/admin/risk-assessment/questions/', { ids });
  }
}

export default new RiskAssessmentQuestionsService(); 