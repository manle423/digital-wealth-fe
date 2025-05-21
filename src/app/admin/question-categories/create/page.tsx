'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import questionCategoriesService from '@/services/question-categories.service';
import CategoryForm from '@/components/categories/CategoryForm';

export default function CreateQuestionCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const response = await questionCategoriesService.createCategory(formData);
      
      if (response.success) {
        toast.success('Tạo danh mục thành công');
        router.push('/admin/question-categories');
      } else {
        toast.error(response.message || 'Không thể tạo danh mục');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Đã xảy ra lỗi khi tạo danh mục');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tạo danh mục câu hỏi mới</h1>
        <p className="text-gray-600">Điền thông tin để tạo danh mục câu hỏi mới</p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl">
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/question-categories')}
          loading={loading}
          submitLabel="Tạo danh mục"
        />
      </div>
    </div>
  );
} 