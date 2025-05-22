'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AssetClass } from '@/types/portfolio-management.types';

interface AssetClassFormProps {
  initialData?: {
    riskLevel: number;
    expectedReturn: number;
    order: number;
    icon: string;
    isActive: boolean;
    translations: {
      language: string;
      name: string;
      description: string;
      id?: string;
      createdAt?: string;
      updatedAt?: string;
      deletedAt?: string | null;
      assetClassId?: string;
    }[];
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export default function AssetClassForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Lưu lớp tài sản',
  loading = false
}: AssetClassFormProps) {
  const [formData, setFormData] = useState({
    riskLevel: 3,
    expectedReturn: 10,
    order: 1,
    icon: 'default-icon',
    isActive: true,
    translations: [
      {
        language: 'vi',
        name: '',
        description: ''
      },
      {
        language: 'en',
        name: '',
        description: ''
      }
    ]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        riskLevel: initialData.riskLevel,
        expectedReturn: initialData.expectedReturn,
        order: initialData.order,
        icon: initialData.icon,
        isActive: initialData.isActive,
        translations: initialData.translations.map(t => ({
          language: t.language,
          name: t.name,
          description: t.description
        }))
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    // Handle number inputs
    if (name === 'riskLevel' || name === 'expectedReturn' || name === 'order') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTranslationChange = (
    language: string,
    field: 'name' | 'description',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map(t =>
        t.language === language ? { ...t, [field]: value } : t
      )
    }));
  };

  const validateForm = () => {
    if (formData.riskLevel < 1 || formData.riskLevel > 5) {
      toast.error('Mức độ rủi ro phải từ 1 đến 5');
      return false;
    }
    
    if (formData.expectedReturn < 0) {
      toast.error('Lợi nhuận kỳ vọng không thể âm');
      return false;
    }
    
    const viTranslation = formData.translations.find(t => t.language === 'vi');
    const enTranslation = formData.translations.find(t => t.language === 'en');
    
    if (!viTranslation?.name || !viTranslation?.description) {
      toast.error('Vui lòng nhập đầy đủ thông tin tiếng Việt');
      return false;
    }
    
    if (!enTranslation?.name || !enTranslation?.description) {
      toast.error('Vui lòng nhập đầy đủ thông tin tiếng Anh');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Clean up the data before submission
      const cleanData = {
        riskLevel: formData.riskLevel,
        expectedReturn: formData.expectedReturn,
        order: formData.order,
        icon: formData.icon,
        isActive: formData.isActive,
        translations: formData.translations.map(t => ({
          language: t.language,
          name: t.name,
          description: t.description
        }))
      };
      
      await onSubmit(cleanData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const getRiskLevelLabel = (level: number) => {
    switch(level) {
      case 1: return 'Rất thấp';
      case 2: return 'Thấp';
      case 3: return 'Trung bình';
      case 4: return 'Cao';
      case 5: return 'Rất cao';
      default: return level.toString();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Mức độ rủi ro <span className="text-red-500">*</span>
          </label>
          <select
            id="riskLevel"
            name="riskLevel"
            value={formData.riskLevel}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {[1, 2, 3, 4, 5].map(level => (
              <option key={level} value={level}>
                {level} - {getRiskLevelLabel(level)}
              </option>
            ))}
          </select>
        </div>
      
        <div>
          <label htmlFor="expectedReturn" className="block text-sm font-medium text-gray-700 mb-1">
            Lợi nhuận kỳ vọng (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="expectedReturn"
            name="expectedReturn"
            value={formData.expectedReturn}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
            Thứ tự <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="1"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
            Icon
          </label>
          <input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="icon-name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center h-full pt-6">
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
      
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Nội dung tiếng Việt</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name-vi" className="block text-sm font-medium text-gray-700 mb-1">
              Tên lớp tài sản (tiếng Việt) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name-vi"
              value={formData.translations.find(t => t.language === 'vi')?.name || ''}
              onChange={(e) => handleTranslationChange('vi', 'name', e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="description-vi" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả (tiếng Việt) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description-vi"
              value={formData.translations.find(t => t.language === 'vi')?.description || ''}
              onChange={(e) => handleTranslationChange('vi', 'description', e.target.value)}
              required
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Nội dung tiếng Anh</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name-en" className="block text-sm font-medium text-gray-700 mb-1">
              Tên lớp tài sản (tiếng Anh) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name-en"
              value={formData.translations.find(t => t.language === 'en')?.name || ''}
              onChange={(e) => handleTranslationChange('en', 'name', e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="description-en" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả (tiếng Anh) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description-en"
              value={formData.translations.find(t => t.language === 'en')?.description || ''}
              onChange={(e) => handleTranslationChange('en', 'description', e.target.value)}
              required
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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