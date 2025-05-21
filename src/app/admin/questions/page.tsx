'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import riskAssessmentQuestionsService from '@/services/risk-assessment-questions.service';
import questionCategoriesService from '@/services/question-categories.service';
import { QuestionCategory, RiskAssessmentPagination } from '@/types/risk-assessment.types';
import QuestionFilter from '@/components/questions/QuestionFilter';
import QuestionTable from '@/components/questions/QuestionTable';

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<RiskAssessmentPagination>({
    offset: 0,
    totalItems: 0,
    page: 1,
    limit: 10
  });
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [orderFilter, setOrderFilter] = useState<'asc' | 'desc'>('asc');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  
  useEffect(() => {
    fetchQuestions();
    fetchCategories();
  }, [pagination.page, orderFilter, isActiveFilter, selectedCategories]);
  
  useEffect(() => {
    // Reset selection when questions change
    setSelectedQuestions([]);
  }, [questions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await riskAssessmentQuestionsService.getQuestions({
        sortBy: 'order',
        sortDirection: orderFilter === 'asc' ? 'ASC' : 'DESC',
        page: pagination.page,
        limit: pagination.limit,
        isActive: isActiveFilter === null ? undefined : isActiveFilter,
        categories: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined
      });

      if (response.success && response.data) {
        setQuestions(response.data.data);
        setPagination(response.data.pagination);
      } else {
        toast.error('Không thể tải danh sách câu hỏi');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await questionCategoriesService.getCategories({
        isActive: true,
        limit: 100
      });

      if (response.success && response.data) {
        setCategories(response.data.data);
        const map: Record<string, string> = {};
        response.data.data.forEach((category: QuestionCategory) => {
          map[category.id] = category.name;
        });
        setCategoryMap(map);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh mục câu hỏi');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.totalItems / pagination.limit)) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        const response = await riskAssessmentQuestionsService.deleteQuestions([id]);
        if (response.success) {
          toast.success('Xóa câu hỏi thành công');
          fetchQuestions(); // Refresh list
        } else {
          toast.error(response.message || 'Không thể xóa câu hỏi');
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        toast.error('Đã xảy ra lỗi khi xóa câu hỏi');
      }
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Vui lòng chọn ít nhất một câu hỏi để xóa');
      return;
    }
    
    const confirmMessage = selectedQuestions.length === 1 
      ? 'Bạn có chắc chắn muốn xóa câu hỏi đã chọn?' 
      : `Bạn có chắc chắn muốn xóa ${selectedQuestions.length} câu hỏi đã chọn?`;
      
    if (window.confirm(confirmMessage)) {
      try {
        const response = await riskAssessmentQuestionsService.deleteQuestions(selectedQuestions);
        if (response.success) {
          toast.success(
            selectedQuestions.length === 1 
              ? 'Xóa câu hỏi thành công' 
              : `Xóa ${selectedQuestions.length} câu hỏi thành công`
          );
          setSelectedQuestions([]);
          fetchQuestions(); // Refresh list
        } else {
          toast.error(response.message || 'Không thể xóa các câu hỏi đã chọn');
        }
      } catch (error) {
        console.error('Error deleting questions:', error);
        toast.error('Đã xảy ra lỗi khi xóa các câu hỏi');
      }
    }
  };

  const handleBulkUpdateStatus = async (isActive: boolean) => {
    if (selectedQuestions.length === 0) {
      toast.error('Vui lòng chọn ít nhất một câu hỏi');
      return;
    }

    const confirmMessage = `Bạn có chắc chắn muốn ${isActive ? 'kích hoạt' : 'vô hiệu hóa'} ${selectedQuestions.length} câu hỏi đã chọn?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await riskAssessmentQuestionsService.updateQuestion(selectedQuestions[0], { isActive });
        if (response.success) {
          toast.success(
            selectedQuestions.length === 1 
              ? `Cập nhật trạng thái câu hỏi thành công` 
              : `Cập nhật trạng thái ${selectedQuestions.length} câu hỏi thành công`
          );
          setSelectedQuestions([]);
          fetchQuestions(); // Refresh list
        } else {
          toast.error(response.message || 'Không thể cập nhật trạng thái các câu hỏi đã chọn');
        }
      } catch (error) {
        console.error('Error updating questions status:', error);
        toast.error('Đã xảy ra lỗi khi cập nhật trạng thái các câu hỏi');
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/questions/edit/${id}`);
  };
  
  const handleAdd = () => {
    router.push('/admin/questions/create');
  };
  
  const handleSelectQuestion = (id: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(id)) {
        return prev.filter(qId => qId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedQuestions.length === questions.length) {
      // If all are selected, deselect all
      setSelectedQuestions([]);
    } else {
      // Otherwise, select all
      setSelectedQuestions(questions.map(q => q.id));
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleOrderChange = (order: 'asc' | 'desc') => {
    setOrderFilter(order);
  };

  const handleActiveStatusChange = (status: boolean | null) => {
    setIsActiveFilter(status);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setOrderFilter('asc');
    setIsActiveFilter(null);
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý câu hỏi</h1>
        <p className="text-gray-600">Tạo và quản lý các câu hỏi đánh giá khẩu vị rủi ro</p>
      </header>

      <QuestionFilter
        categories={categories}
        selectedCategories={selectedCategories}
        orderFilter={orderFilter}
        isActiveFilter={isActiveFilter}
        onCategoryToggle={handleCategoryToggle}
        onOrderChange={handleOrderChange}
        onActiveStatusChange={handleActiveStatusChange}
        onClearFilters={handleClearFilters}
        selectedQuestions={selectedQuestions}
        onBulkDelete={handleBulkDelete}
        onBulkUpdateStatus={handleBulkUpdateStatus}
        onAdd={handleAdd}
      />

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <QuestionTable
            questions={questions}
            selectedQuestions={selectedQuestions}
            categoryMap={categoryMap}
            onSelectQuestion={handleSelectQuestion}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getCategoryLabel={(categoryId: string) => categoryMap[categoryId] || categoryId}
          />

          {/* Pagination */}
          {pagination.totalItems > 0 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến {Math.min(pagination.page * pagination.limit, pagination.totalItems)} trong {pagination.totalItems} câu hỏi
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