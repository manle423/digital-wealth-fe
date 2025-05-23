import apiService from "./api.service";
import { ApiResponse } from "@/types/api.types";

class RiskAssessmentService {
  async getHistory(): Promise<ApiResponse<any>> {
    return await apiService.get('/risk-assessment/history');
  }

  async submitAssessment(answers: Array<{ questionId: string; answerId: string }>): Promise<ApiResponse<any>> {
    return await apiService.post('/risk-assessment/submit', { answers });
  }
}

const riskAssessmentService = new RiskAssessmentService();
export default riskAssessmentService; 