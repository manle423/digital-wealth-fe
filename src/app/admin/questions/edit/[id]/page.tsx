'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RiskAssessmentOption, QuestionCategory } from '@/types/risk-assessment.types';
import riskAssessmentQuestionsService from '@/services/risk-assessment-questions.service';
import questionCategoriesService from '@/services/question-categories.service';
import { use } from 'react';

// Define a type for the unwrapped params
type UnwrappedParams = {
  id: string;
};

export default function EditQuestionPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Unwrap params using React.use() to handle it as a Promise
  const unwrappedParams = use(params as Promise<UnwrappedParams>);
  const questionId = unwrappedParams.id;
  
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [originalQuestion, setOriginalQuestion] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
    fetchQuestion();
  }, [questionId]);

  useEffect(() => {
    if (originalQuestion && categories.length > 0) {
      console.log("Both question and categories are loaded, syncing data");
      
      // Get category value from different possible sources
      let questionCategoryId: string | null = null;
      
      // Try to extract the category identifier in various possible formats
      if (originalQuestion.categoryId) {
        questionCategoryId = originalQuestion.categoryId;
        console.log("Using categoryId from question:", questionCategoryId);
      } else if (originalQuestion.category) {
        if (typeof originalQuestion.category === 'string') {
          questionCategoryId = originalQuestion.category;
          console.log("Using category string from question:", questionCategoryId);
        } else if (typeof originalQuestion.category === 'object' && originalQuestion.category !== null) {
          const categoryObj = originalQuestion.category as Record<string, any>;
          questionCategoryId = categoryObj.codeName || categoryObj.id;
          console.log("Using category from object:", questionCategoryId);
        }
      }
      
      console.log("Original question category identification:", questionCategoryId);
      
      if (!questionCategoryId) {
        console.log("No category identification found in question data");
        return;
      }
      
      // Try to find the matching category from the categories list
      let matchingCategory = null;
      
      // Log all available categories for debugging
      console.log("Available categories:", categories.map(c => `${c.codeName} (${c.id})`));
      
      // First try to match by ID
      matchingCategory = categories.find(c => c.id === questionCategoryId);
      if (matchingCategory) {
        console.log("Found matching category by ID:", matchingCategory.id);
      }
      
      // If not found, try to match by codeName
      if (!matchingCategory) {
        matchingCategory = categories.find(c => c.codeName === questionCategoryId);
        if (matchingCategory) {
          console.log("Found matching category by codeName:", matchingCategory.codeName);
        }
      }
      
      if (matchingCategory) {
        console.log("Final matched category:", matchingCategory.name);
        
        setFormData(prev => ({
          ...prev,
          categoryId: matchingCategory.id
        }));
      } else {
        console.warn("Could not find a matching category for:", questionCategoryId);
      }
    }
  }, [originalQuestion, categories]);

  const fetchCategories = async () => {
    try {
      const response = await questionCategoriesService.getCategories({
        isActive: true,
        limit: 100 // Fetch up to 100 categories
      });

      if (response.success && response.data) {
        console.log("Loaded categories:", response.data.data);
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh mục câu hỏi');
    }
  };

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await riskAssessmentQuestionsService.getQuestionById(questionId);
      if (response.success && response.data) {
        const question = response.data;
        
        // Log the entire question for debugging
        console.log("Loaded question data:", JSON.stringify(question, null, 2));
        
        // Store the original question for later reference
        setOriginalQuestion(question);
        
        // Try to get the category value from multiple possible sources
        let categoryValue = '';
        
        // Debug every possible field containing category information
        if (question.categoryId) console.log("Found categoryId:", question.categoryId);
        if (question.category) console.log("Found category:", question.category);
        if (typeof question.category === 'object' && question.category !== null) {
          console.log("Category is an object:", question.category);
          // Use type assertion to avoid TypeScript errors
          const categoryObj = question.category as Record<string, any>;
          if (categoryObj.id) console.log("Category object has id:", categoryObj.id);
          if (categoryObj.codeName) console.log("Category object has codeName:", categoryObj.codeName);
        }
        
        // Try to determine the category value from the available data
        if (question.categoryId) {
          categoryValue = question.categoryId;
        } else if (question.category) {
          if (typeof question.category === 'string') {
            categoryValue = question.category;
          } else if (typeof question.category === 'object' && question.category !== null) {
            // If category is an object, try to get codeName or id
            // Use type assertion to avoid TypeScript errors
            const categoryObj = question.category as Record<string, any>;
            categoryValue = categoryObj.codeName || categoryObj.id || '';
          }
        }
        
        console.log("Final selected category value:", categoryValue);
        
        setFormData({
          textVi: question.textVi || '',
          textEn: question.textEn || '',
          order: question.order || 1,
          categoryId: categoryValue,
          options: question.options?.map((opt: RiskAssessmentOption) => ({
            textVi: opt.textVi || '',
            textEn: opt.textEn || '',
            value: String(opt.value) || ''
          })) || [
            { textVi: '', textEn: '', value: '1' },
            { textVi: '', textEn: '', value: '2' },
            { textVi: '', textEn: '', value: '3' },
            { textVi: '', textEn: '', value: '4' },
          ]
        });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, field: keyof RiskAssessmentOption, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        { textVi: '', textEn: '', value: String(prev.options.length + 1) }
      ]
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) {
      toast.error('Cần ít nhất 2 lựa chọn cho một câu hỏi');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.textVi || !formData.textEn) {
      toast.error('Vui lòng nhập nội dung câu hỏi');
      return false;
    }
    
    if (!formData.categoryId) {
      toast.error('Vui lòng chọn danh mục');
      return false;
    }
    
    if (formData.options.some(opt => !opt.textVi || !opt.textEn)) {
      toast.error('Vui lòng nhập đầy đủ nội dung cho tất cả các lựa chọn');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Prepare data for API
      const apiData = {
        ...formData,
        isActive: true,
        order: Number(formData.order)
      };
      
      const response = await riskAssessmentQuestionsService.updateQuestion(questionId, apiData);
      
      if (response.success) {
        toast.success('Cập nhật câu hỏi thành công');
        router.push('/admin/questions');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi cập nhật câu hỏi');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Đã xảy ra lỗi khi lưu câu hỏi');
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
      
      <div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung câu hỏi (Tiếng Việt) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="textVi"
                  value={formData.textVi}
                  onChange={handleChange}
                  required
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
                  value={formData.textEn}
                  onChange={handleChange}
                  required
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
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => {
                    // Log each category option for debugging
                    console.log(`Category option: ${category.codeName} (${category.name})${category.codeName === formData.categoryId ? ' - MATCHED!' : ''}`);
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thứ tự <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-800">Các lựa chọn</h3>
                <button
                  type="button"
                  onClick={addOption}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  + Thêm lựa chọn
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.options.map((option, index) => (
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
                          required
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
                          required
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
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/questions')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang lưu...
                </>
              ) : (
                'Lưu câu hỏi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 