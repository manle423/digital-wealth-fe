'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { use } from 'react';
import riskAssessmentQuestionsService from '@/services/risk-assessment-questions.service';
import QuestionForm from '@/components/questions/QuestionForm';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function EditQuestionPage(props: PageProps) {
  const params = use(props.params);
  const id = params.id;
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await riskAssessmentQuestionsService.getQuestionById(id);
      if (response.success && response.data) {
        const question = response.data;
        
        // Convert option values to strings
        const formattedQuestion = {
          ...question,
          options: question.options?.map((opt: any) => ({
            ...opt,
            value: String(opt.value)
          })) || []
        };
        
        setInitialData(formattedQuestion);
      } else {
        setError('Không thể tải thông tin câu hỏi');
        toast.error('Không thể tải thông tin câu hỏi');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      setError('Đã xảy ra lỗi khi tải thông tin câu hỏi');
      toast.error('Đã xảy ra lỗi khi tải thông tin câu hỏi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const response = await riskAssessmentQuestionsService.updateQuestion(id, {
        ...formData,
        isActive: true,
        order: Number(formData.order)
      });
      
      if (response.success) {
        toast.success('Cập nhật câu hỏi thành công');
        router.push('/admin/questions');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi cập nhật câu hỏi');
      }
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.push('/admin/questions')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách câu hỏi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Chỉnh sửa câu hỏi
        </h2>
        <button 
          onClick={() => router.push('/admin/questions')}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <QuestionForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/questions')}
        loading={loading}
        submitLabel="Lưu câu hỏi"
      />
    </div>
  );
} 