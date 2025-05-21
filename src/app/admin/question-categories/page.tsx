'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import questionCategoriesService from '@/services/question-categories.service';
import { QuestionCategory, RiskAssessmentPagination } from '@/types/risk-assessment.types';
import CategoryFilter from '@/components/categories/CategoryFilter';
import CategoryTable from '@/components/categories/CategoryTable';

export default function RiskQuestionCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<RiskAssessmentPagination>({
    offset: 0,
    totalItems: 0,
    page: 1,
    limit: 10
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);
  
  useEffect(() => {
    fetchCategories();
  }, [pagination.page, isActiveFilter]);
  
  useEffect(() => {
    // Reset selection when categories change
    setSelectedCategories([]);
  }, [categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await questionCategoriesService.getCategories({
        sortBy: 'order',
        sortDirection: 'ASC',
        page: pagination.page,
        limit: pagination.limit,
        isActive: isActiveFilter === null ? undefined : isActiveFilter
      });

      if (response.success && response.data) {
        setCategories(response.data.data);
        setPagination(response.data.pagination);
      } else {
        toast.error('Không thể tải danh sách danh mục');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.totalItems / pagination.limit)) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        const response = await questionCategoriesService.deleteCategories([id]);
        if (response.success) {
          toast.success('Xóa danh mục thành công');
          fetchCategories(); // Refresh list
        } else {
          toast.error(response.message || 'Không thể xóa danh mục');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Đã xảy ra lỗi khi xóa danh mục');
      }
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) {
      toast.error('Vui lòng chọn ít nhất một danh mục để xóa');
      return;
    }
    
    const confirmMessage = selectedCategories.length === 1 
      ? 'Bạn có chắc chắn muốn xóa danh mục đã chọn?' 
      : `Bạn có chắc chắn muốn xóa ${selectedCategories.length} danh mục đã chọn?`;
      
    if (window.confirm(confirmMessage)) {
      try {
        const response = await questionCategoriesService.deleteCategories(selectedCategories);
        if (response.success) {
          toast.success(
            selectedCategories.length === 1 
              ? 'Xóa danh mục thành công' 
              : `Xóa ${selectedCategories.length} danh mục thành công`
          );
          setSelectedCategories([]);
          fetchCategories(); // Refresh list
        } else {
          toast.error(response.message || 'Không thể xóa các danh mục đã chọn');
        }
      } catch (error) {
        console.error('Error deleting categories:', error);
        toast.error('Đã xảy ra lỗi khi xóa các danh mục');
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/question-categories/edit/${id}`);
  };
  
  const handleAdd = () => {
    router.push('/admin/question-categories/create');
  };
  
  const handleSelectCategory = (id: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(id)) {
        return prev.filter(catId => catId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      // If all are selected, deselect all
      setSelectedCategories([]);
    } else {
      // Otherwise, select all
      setSelectedCategories(categories.map(c => c.id));
    }
  };

  const handleActiveStatusChange = (status: boolean | null) => {
    setIsActiveFilter(status);
  };

  const handleClearFilters = () => {
    setIsActiveFilter(null);
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục câu hỏi</h1>
        <p className="text-gray-600">Tạo và quản lý các danh mục cho câu hỏi đánh giá khẩu vị rủi ro</p>
      </header>

      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        isActiveFilter={isActiveFilter}
        onSelectCategory={handleSelectCategory}
        onSelectAll={handleSelectAll}
        onBulkDelete={handleBulkDelete}
        onActiveStatusChange={handleActiveStatusChange}
        onClearFilters={handleClearFilters}
        onAdd={handleAdd}
      />

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <CategoryTable
            categories={categories}
            selectedCategories={selectedCategories}
            onSelectCategory={handleSelectCategory}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {pagination.totalItems > 0 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến {Math.min(pagination.page * pagination.limit, pagination.totalItems)} trong {pagination.totalItems} danh mục
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded ${
                    pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Trước
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= Math.ceil(pagination.totalItems / pagination.limit)}
                  className={`px-3 py-1 rounded ${
                    pagination.page >= Math.ceil(pagination.totalItems / pagination.limit)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}