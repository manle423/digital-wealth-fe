'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { use } from 'react';
import questionCategoriesService from '@/services/question-categories.service';
import CategoryForm from '@/components/categories/CategoryForm';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function EditQuestionCategoryPage(props: PageProps) {
  const params = use(props.params);
  const id = params.id;
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setFetchLoading(true);
      const response = await questionCategoriesService.getCategoryById(id);
      
      if (response.success && response.data) {
        setInitialData(response.data);
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

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
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
        <CategoryForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/question-categories')}
          loading={loading}
          submitLabel="Cập nhật"
        />
      </div>
    </div>
  );
} 