'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RiskProfileType } from '@/types/portfolio-management.types';
import riskProfilesService from '@/services/risk-profiles.service';

interface ProfileFormProps {
  initialData?: {
    type: RiskProfileType;
    minScore: number;
    maxScore: number;
    translations: {
      language: string;
      name: string;
      description: string;
      id?: string;
      createdAt?: string;
      updatedAt?: string;
      deletedAt?: string | null;
      riskProfileId?: string;
    }[];
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export default function ProfileForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Lưu hồ sơ',
  loading = false
}: ProfileFormProps) {
  const [formData, setFormData] = useState({
    type: 'CONSERVATIVE' as RiskProfileType,
    minScore: 0,
    maxScore: 15,
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
  
  const [profileTypes, setProfileTypes] = useState<RiskProfileType[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        minScore: initialData.minScore,
        maxScore: initialData.maxScore,
        translations: initialData.translations.map(t => ({
          language: t.language,
          name: t.name,
          description: t.description
        }))
      });
    }
    fetchProfileTypes();
  }, [initialData]);

  const fetchProfileTypes = async () => {
    try {
      const response = await riskProfilesService.getProfileTypes();
      if (response.success && response.data) {
        setProfileTypes(response.data as unknown as RiskProfileType[]);
      }
    } catch (error) {
      console.error('Error fetching profile types:', error);
      toast.error('Không thể tải danh sách loại hồ sơ');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle number inputs
    if (name === 'minScore' || name === 'maxScore') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
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
    if (!formData.type) {
      toast.error('Vui lòng chọn loại hồ sơ');
      return false;
    }
    
    if (formData.minScore >= formData.maxScore) {
      toast.error('Điểm tối thiểu phải nhỏ hơn điểm tối đa');
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
        type: formData.type,
        minScore: formData.minScore,
        maxScore: formData.maxScore,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Loại hồ sơ <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {profileTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      
        <div>
          <label htmlFor="minScore" className="block text-sm font-medium text-gray-700 mb-1">
            Điểm tối thiểu <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="minScore"
            name="minScore"
            value={formData.minScore}
            onChange={handleChange}
            min="0"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700 mb-1">
            Điểm tối đa <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="maxScore"
            name="maxScore"
            value={formData.maxScore}
            onChange={handleChange}
            min="0"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Nội dung tiếng Việt</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name-vi" className="block text-sm font-medium text-gray-700 mb-1">
              Tên hồ sơ (tiếng Việt) <span className="text-red-500">*</span>
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
              Tên hồ sơ (tiếng Anh) <span className="text-red-500">*</span>
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