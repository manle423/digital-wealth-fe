'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { QuestionCategory } from '@/types/risk-assessment.types';

interface CategoryFormProps {
  initialData?: {
    name: string;
    codeName: string;
    description: string;
    order: number;
    isActive: boolean;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Lưu danh mục',
  loading = false
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    codeName: '',
    description: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
      return;
    }
    
    // Handle number
    if (name === 'order') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
      return;
    }
    
    // Handle other inputs
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.codeName) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
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
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Tên danh mục <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="codeName" className="block text-sm font-medium text-gray-700 mb-1">
            Mã danh mục <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="codeName"
            name="codeName"
            value={formData.codeName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="VD: ABILITY_TO_TAKE_RISK"
          />
          <p className="mt-1 text-sm text-gray-500">
            Sử dụng chữ in hoa và gạch dưới, không dấu cách (VD: ABILITY_TO_TAKE_RISK)
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="0"
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
                  onChange={handleChange}
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

      <div className="flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
} 