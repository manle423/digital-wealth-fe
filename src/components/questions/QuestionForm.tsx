'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RiskAssessmentOption, QuestionCategory } from '@/types/risk-assessment.types';
import questionCategoriesService from '@/services/question-categories.service';

interface QuestionFormProps {
  initialData?: {
    textVi: string;
    textEn: string;
    order: number;
    categoryId: string;
    isActive: boolean;
    options: RiskAssessmentOption[];
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export default function QuestionForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Lưu câu hỏi',
  loading = false
}: QuestionFormProps) {
  const [formData, setFormData] = useState({
    textVi: '',
    textEn: '',
    order: 1,
    categoryId: '',
    isActive: true,
    options: [
      { textVi: '', textEn: '', value: '1' },
      { textVi: '', textEn: '', value: '2' },
      { textVi: '', textEn: '', value: '3' },
      { textVi: '', textEn: '', value: '4' },
    ]
  });
  const [categories, setCategories] = useState<QuestionCategory[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        options: initialData.options.map(opt => ({
          ...opt,
          value: String(opt.value)
        }))
      });
    }
    fetchCategories();
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const response = await questionCategoriesService.getCategories({
        isActive: true,
        limit: 100
      });

      if (response.success && response.data) {
        setCategories(response.data.data);
        
        if (response.success && response.data && response.data.data.length > 0 && !initialData) {
          setFormData(prev => ({
            ...prev,
            categoryId: response.data!.data[0].id
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh mục câu hỏi');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
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
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
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
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <div className="flex items-center h-[42px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {formData.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
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
          onClick={onCancel}
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
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
} 