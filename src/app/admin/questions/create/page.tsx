'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import riskAssessmentQuestionsService from '@/services/risk-assessment-questions.service';
import questionCategoriesService from '@/services/question-categories.service';
import { RiskAssessmentOption, CreateRiskAssessmentQuestion, QuestionCategory } from '@/types/risk-assessment.types';

type Option = RiskAssessmentOption;
type Question = CreateRiskAssessmentQuestion;

export default function CreateQuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    textVi: '',
    textEn: '',
    order: 1,
    categoryId: '',
    options: [
      { textVi: '', textEn: '', value: '1' },
      { textVi: '', textEn: '', value: '2' },
      { textVi: '', textEn: '', value: '3' },
      { textVi: '', textEn: '', value: '4' },
    ]
  });
  const [categories, setCategories] = useState<QuestionCategory[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await questionCategoriesService.getCategories({
        isActive: true,
        limit: 100 // Fetch up to 100 categories
      });

      if (response.success && response.data) {
        setCategories(response.data.data);
        
        // If we have categories, set the first one as default
        if (response.data.data.length > 0) {
          setCurrentQuestion(prev => ({
            ...prev,
            categoryId: response?.data?.data[0]?.id || ''
          }));
        }
      } else {
        toast.error('Không thể tải danh mục câu hỏi');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Đã xảy ra lỗi khi tải danh mục câu hỏi');
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
  };

  const handleOptionChange = (index: number, field: keyof Option, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [
        ...prev.options,
        { textVi: '', textEn: '', value: String(prev.options.length + 1) }
      ]
    }));
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options.length <= 2) {
      toast.error('Cần ít nhất 2 lựa chọn cho một câu hỏi');
      return;
    }
    
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const validateQuestion = () => {
    if (!currentQuestion.textVi || !currentQuestion.textEn) {
      toast.error('Vui lòng nhập nội dung câu hỏi');
      return false;
    }
    
    if (!currentQuestion.categoryId) {
      toast.error('Vui lòng chọn danh mục câu hỏi');
      return false;
    }
    
    if (currentQuestion.options.some(opt => !opt.textVi || !opt.textEn)) {
      toast.error('Vui lòng nhập đầy đủ nội dung cho tất cả các lựa chọn');
      return false;
    }

    return true;
  };

  const addQuestion = () => {
    if (!validateQuestion()) return;
    
    setQuestions(prev => [...prev, { ...currentQuestion }]);
    
    // Reset current question
    setCurrentQuestion({
      textVi: '',
      textEn: '',
      order: questions.length + 2, // Increment order for next question
      categoryId: categories.length > 0 ? categories[0].id : '',
      options: [
        { textVi: '', textEn: '', value: '1' },
        { textVi: '', textEn: '', value: '2' },
        { textVi: '', textEn: '', value: '3' },
        { textVi: '', textEn: '', value: '4' },
      ]
    });
    
    toast.success('Đã thêm câu hỏi vào danh sách');
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    toast.success('Đã xóa câu hỏi khỏi danh sách');
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      if (validateQuestion()) {
        // If no questions added yet but current question is valid, add it
        setQuestions([{ ...currentQuestion }]);
      } else {
        toast.error('Vui lòng thêm ít nhất một câu hỏi');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const questionsToSubmit = questions.length > 0 ? questions : [currentQuestion];
      const response = await riskAssessmentQuestionsService.createQuestions(questionsToSubmit);
      
      if (response.success) {
        toast.success(`Đã tạo thành công ${questionsToSubmit.length} câu hỏi`);
        router.push('/admin/questions');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tạo câu hỏi');
      }
    } catch (error) {
      console.error('Error creating questions:', error);
      toast.error('Đã xảy ra lỗi khi tạo câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
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
      
      {/* Danh sách câu hỏi đã thêm */}
      {questions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách câu hỏi ({questions.length})</h3>
          <div className="overflow-y-auto max-h-[300px] border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Câu hỏi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thứ tự
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((question, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {question.textVi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryLabel(question.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {question.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => removeQuestion(index)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Form thêm câu hỏi mới */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Thêm câu hỏi mới</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung câu hỏi (Tiếng Việt) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="textVi"
                value={currentQuestion.textVi}
                onChange={handleQuestionChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung câu hỏi (Tiếng Anh) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="textEn"
                value={currentQuestion.textEn}
                onChange={handleQuestionChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={currentQuestion.categoryId}
                onChange={handleQuestionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thứ tự <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="order"
                value={currentQuestion.order}
                onChange={handleQuestionChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium text-gray-800">Các lựa chọn</h4>
              <button
                type="button"
                onClick={addOption}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                + Thêm lựa chọn
              </button>
            </div>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-medium">Lựa chọn {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá trị <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nội dung (Tiếng Việt) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={option.textVi}
                        onChange={(e) => handleOptionChange(index, 'textVi', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nội dung (Tiếng Anh) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={option.textEn}
                        onChange={(e) => handleOptionChange(index, 'textEn', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Thêm vào danh sách
          </button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => router.push('/admin/questions')}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          disabled={loading}
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            'Lưu tất cả câu hỏi'
          )}
        </button>
      </div>
    </div>
  );
} 