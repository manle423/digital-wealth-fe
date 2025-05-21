'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import riskAssessmentQuestionsService from '@/services/risk-assessment-questions.service';
import { RiskAssessmentQuestion } from '@/types/risk-assessment.types';

export default function PublicRiskAssessmentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<RiskAssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [profileResult, setProfileResult] = useState<any | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await riskAssessmentQuestionsService.getQuestionsPublic({
        isActive: true,
        sortBy: 'order',
        sortDirection: 'ASC',
        limit: 100
      });

      if (response.success && response.data?.data) {
        setQuestions(response.data.data);
      } else {
        console.error('Failed to fetch questions:', response);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Move to next question if not the last one
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const numericValue = parseInt(answer, 10);
      if (!isNaN(numericValue)) {
        totalScore += numericValue;
      }
    });
    
    return totalScore;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const calculatedScore = calculateScore();
      setScore(calculatedScore);
      
      // Here you would typically send the answers and score to your backend
      // For now, we'll just display the score
      
      // Mock profile result based on score ranges
      let resultType = '';
      if (calculatedScore <= 15) {
        resultType = 'CONSERVATIVE';
      } else if (calculatedScore <= 22) {
        resultType = 'MODERATELY_CONSERVATIVE';
      } else if (calculatedScore <= 30) {
        resultType = 'MODERATE';
      } else if (calculatedScore <= 37) {
        resultType = 'MODERATELY_AGGRESSIVE';
      } else {
        resultType = 'AGGRESSIVE';
      }
      
      setProfileResult({
        type: resultType,
        score: calculatedScore
      });
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScore(null);
    setProfileResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show result if available
  if (profileResult) {
    const profileLabels: Record<string, string> = {
      'CONSERVATIVE': 'Chấp nhận rủi ro thấp',
      'MODERATELY_CONSERVATIVE': 'Chấp nhận rủi ro thấp tới trung bình',
      'MODERATE': 'Chấp nhận rủi ro trung bình',
      'MODERATELY_AGGRESSIVE': 'Chấp nhận rủi ro cao',
      'AGGRESSIVE': 'Chấp nhận rủi ro rất cao'
    };
    
    const profileDescriptions: Record<string, string> = {
      'CONSERVATIVE': 'Bạn ưu tiên bảo toàn vốn và chấp nhận lợi nhuận thấp để đảm bảo an toàn.',
      'MODERATELY_CONSERVATIVE': 'Bạn muốn giữ an toàn nhưng vẫn sẵn sàng chấp nhận một số rủi ro để tăng lợi nhuận.',
      'MODERATE': 'Bạn cân bằng giữa bảo toàn vốn và tăng trưởng, có thể chấp nhận lỗ trong ngắn hạn.',
      'MODERATELY_AGGRESSIVE': 'Bạn ưu tiên tăng trưởng và sẵn sàng chấp nhận rủi ro cao để đạt được lợi nhuận lớn hơn.',
      'AGGRESSIVE': 'Bạn tìm kiếm lợi nhuận tối đa và có khả năng chịu đựng biến động mạnh trong danh mục đầu tư.'
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Kết quả đánh giá khẩu vị rủi ro</h1>
            
            <div className="mb-6 p-6 bg-blue-50 rounded-lg">
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-2 rounded-full text-white font-semibold" 
                  style={{ 
                    backgroundColor: 
                      profileResult.type === 'CONSERVATIVE' ? '#10B981' : 
                      profileResult.type === 'MODERATELY_CONSERVATIVE' ? '#3B82F6' :
                      profileResult.type === 'MODERATE' ? '#F59E0B' :
                      profileResult.type === 'MODERATELY_AGGRESSIVE' ? '#F97316' :
                      '#EF4444'
                  }}
                >
                  {profileLabels[profileResult.type]}
                </span>
              </div>
              
              <p className="text-gray-700 text-center mb-4">Điểm số của bạn: <span className="font-bold">{profileResult.score}</span></p>
              
              <p className="text-gray-700">{profileDescriptions[profileResult.type]}</p>
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={resetAssessment}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Làm lại trắc nghiệm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Trắc nghiệm khẩu vị đầu tư</h1>
          
          {questions.length > 0 ? (
            <>
              <div className="mb-6 flex justify-between items-center">
                <span className="text-sm text-gray-500">Câu hỏi {currentQuestionIndex + 1}/{questions.length}</span>
                <div className="w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-800 mb-6">{currentQuestion.textVi}</h2>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={`${currentQuestion.id}-option-${index}`}
                      onClick={() => handleAnswer(currentQuestion.id, String(option.value))}
                      className={`w-full p-4 border text-left rounded-lg transition-colors ${
                        answers[currentQuestion.id] === String(option.value)
                          ? 'bg-blue-100 border-blue-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option.textVi}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2 rounded-lg ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Quay lại
                </button>
                
                {currentQuestionIndex === questions.length - 1 && (
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length < questions.length || submitting}
                    className={`px-6 py-2 rounded-lg ${
                      Object.keys(answers).length < questions.length || submitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <span className="inline-block animate-spin mr-2">&#9696;</span>
                        Đang xử lý...
                      </>
                    ) : (
                      'Hoàn thành'
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">Không có câu hỏi nào.</p>
          )}
        </div>
      </div>
    </div>
  );
} 