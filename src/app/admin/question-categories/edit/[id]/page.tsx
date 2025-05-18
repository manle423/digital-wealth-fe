'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { use } from 'react';
import questionCategoriesService from '@/services/question-categories.service';
import { QuestionCategory } from '@/types/risk-assessment.types';

// Define a type for the unwrapped params
type UnwrappedParams = {
  id: string;
};

interface EditQuestionCategoryPageProps {
  params: { id: string } | Promise<UnwrappedParams>;
}

export default function EditQuestionCategoryPage({ params }: EditQuestionCategoryPageProps) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params as Promise<UnwrappedParams>);
  const id = unwrappedParams.id;
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    codeName: '',
    description: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setFetchLoading(true);
      const response = await questionCategoriesService.getCategoryById(id);
      
      if (response.success && response.data) {
        const category = response.data;
        setFormData({
          name: category.name,
          codeName: category.codeName,
          description: category.description || '',
          order: category.order,
          isActive: category.isActive
        });
      } else {
        toast.error('Không thể tải thông tin danh mục');
        router.push('/admin/question-categories');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Đã xảy ra lỗi khi tải thông tin danh mục');
      router.push('/admin/question-categories');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.codeName) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      const response = await questionCategoriesService.updateCategory(id, formData);
      
      if (response.success) {
        toast.success('Cập nhật danh mục thành công');
        router.push('/admin/question-categories');
      } else {
        toast.error(response.message || 'Không thể cập nhật danh mục');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật danh mục');
    } finally {
      setLoading(false);
    }
  };

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

  if (fetchLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa danh mục câu hỏi</h1>
        <p className="text-gray-600">Cập nhật thông tin danh mục</p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl">
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Kích hoạt
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/question-categories')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 