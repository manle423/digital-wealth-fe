'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import riskAssessmentQuestionsService from '@/services/risk-assessment-questions.service';
import QuestionForm from '@/components/questions/QuestionForm';

export default function CreateQuestionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const response = await riskAssessmentQuestionsService.createQuestions([formData]);
      
      if (response.success) {
        toast.success('Tạo câu hỏi thành công');
        router.push('/admin/questions');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tạo câu hỏi');
      }
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Đã xảy ra lỗi khi tạo câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Tạo câu hỏi
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
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/questions')}
        loading={loading}
        submitLabel="Tạo câu hỏi"
      />
    </div>
  );
} 