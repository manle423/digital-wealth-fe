'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import questionCategoriesService from '@/services/question-categories.service';
import { QuestionCategory, RiskAssessmentPagination } from '@/types/risk-assessment.types';

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
  
  useEffect(() => {
    fetchCategories();
  }, [pagination.page]);
  
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
        limit: pagination.limit
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

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Đang hoạt động
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
        Không hoạt động
      </span>
    );
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục câu hỏi</h1>
        <p className="text-gray-600">Tạo và quản lý các danh mục cho câu hỏi đánh giá khẩu vị rủi ro</p>
      </header>

      <div className="flex justify-end mb-6">
        {selectedCategories.length > 0 && (
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mr-2"
            onClick={handleBulkDelete}
          >
            Xóa ({selectedCategories.length})
          </button>
        )}
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={handleAdd}
        >
          + Thêm danh mục
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedCategories.length > 0 && selectedCategories.length === categories.length}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên danh mục
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã danh mục
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thứ tự
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleSelectCategory(category.id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.codeName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {category.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(category.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          onClick={() => handleEdit(category.id)}
                        >
                          Sửa
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(category.id)}
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