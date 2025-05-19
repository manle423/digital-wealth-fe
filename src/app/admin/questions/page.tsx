'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import riskAssessmentQuestionsService from '@/services/risk-assessment-questions.service';
import questionCategoriesService from '@/services/question-categories.service';
import { QuestionCategory, RiskAssessmentQuestion, RiskAssessmentPagination } from '@/types/risk-assessment.types';
import QuestionFilter from '@/components/questions/QuestionFilter';
import QuestionTable from '@/components/questions/QuestionTable';

export default function RiskQuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<RiskAssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<RiskAssessmentPagination>({
    offset: 0,
    totalItems: 0,
    page: 1,
    limit: 10
  });
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'ASC' | 'DESC' | undefined>(undefined);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  
  useEffect(() => {
    fetchCategories();
    fetchQuestions();
  }, [pagination.page, selectedCategories, orderFilter, isActiveFilter]);
  
  useEffect(() => {
    // Reset selection when questions change
    setSelectedQuestions([]);
  }, [questions]);

  const fetchCategories = async () => {
    try {
      const response = await questionCategoriesService.getCategories({
        isActive: true,
        limit: 100 // Fetch up to 100 categories to ensure we get all
      });

      if (response.success && response.data) {
        // Create a mapping of category ID to display name
        const map: Record<string, string> = {};
        response.data.data.forEach((category: QuestionCategory) => {
          // Use category ID as the key
          if (category.id) {
            map[category.id] = category.name;
          }
        });
        setCategoryMap(map);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      // For backend API compatibility
      let categoriesParam: string | undefined = undefined;
      if (selectedCategories.length === 1) {
        categoriesParam = selectedCategories[0];
      } else if (selectedCategories.length > 1) {
        // Join categories with comma for the API
        categoriesParam = selectedCategories.join(',');
      }
      
      const response = await riskAssessmentQuestionsService.getQuestions({
        isActive: isActiveFilter,
        sortBy: 'order',
        sortDirection: orderFilter || 'ASC',
        page: pagination.page,
        limit: pagination.limit,
        categories: categoriesParam
      });

      if (response.success && response.data) {
        // If the backend doesn't support multiple categories in the API,
        // we can filter client-side when multiple categories are selected
        let filteredData = response.data.data;
        
        if (selectedCategories.length > 1 && !categoriesParam) {
          filteredData = filteredData.filter(question => {
            // Get the category ID from either categoryId or category field (for backward compatibility)
            const questionCategoryId = question.categoryId || (question.category && typeof question.category === 'object' && 'id' in question.category ? (question.category as { id: string }).id : '');
            return selectedCategories.includes(questionCategoryId);
          });
        }
        
        setQuestions(filteredData);
        setPagination(response.data.pagination);
        
        // Extract unique categories from the questions
        const categories = Array.from(
          new Set(response.data.data.map(q => {
            // Handle both categoryId and category fields for backward compatibility
            const categoryValue = q.categoryId || (q.category && typeof q.category === 'object' && 'id' in q.category ? (q.category as { id: string }).id : '');
            return categoryValue || '';
          }))
        );
        setUniqueCategories(categories);
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

  const toggleCategorySelection = (categoryId: string) => {
    // Ensure categoryId is a string value
    if (typeof categoryId !== 'string') {
      console.error('Category ID must be a string:', categoryId);
      return;
    }
    
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(c => c !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  const clearCategoryFilters = () => {
    setSelectedCategories([]);
    setOrderFilter(undefined);
    setIsActiveFilter(undefined);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
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

  const getCategoryLabel = (categoryId: string | any): string => {
    // Safety check to ensure we're working with strings
    if (typeof categoryId !== 'string') {
      console.warn('Non-string category ID received:', categoryId);
      // If it's an object with an id property, use that
      if (categoryId && typeof categoryId === 'object' && 'id' in categoryId) {
        categoryId = categoryId.id;
      } else {
        // Fallback to string representation
        return String(categoryId);
      }
    }
    
    // Use the mapping from API data, or fallback to the ID if not found
    return categoryMap[categoryId] || categoryId;
  };

  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý câu hỏi đánh giá rủi ro</h1>
        <p className="text-gray-600">Tạo và quản lý các câu hỏi đánh giá khẩu vị rủi ro của khách hàng</p>
      </header>

      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            onClick={toggleFilterPanel}
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            Bộ lọc
            {selectedCategories.length > 0 && (
              <span className="ml-2 bg-white text-blue-600 rounded-full flex items-center justify-center w-6 h-6 text-sm">
                {selectedCategories.length}
              </span>
            )}
          </button>
        </div>
        <div className="flex gap-2">
          {selectedQuestions.length > 0 && (
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={handleBulkDelete}
            >
              Xóa ({selectedQuestions.length})
            </button>
          )}
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleAdd}
          >
            + Thêm câu hỏi
          </button>
        </div>
      </div>

      {showFilterPanel && (
        <QuestionFilter
          categories={categoryMap}
          selectedCategories={selectedCategories}
          orderFilter={orderFilter}
          isActiveFilter={isActiveFilter}
          onCategoryToggle={toggleCategorySelection}
          onOrderChange={setOrderFilter}
          onActiveChange={setIsActiveFilter}
          onClearFilters={clearCategoryFilters}
        />
      )}

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
            getCategoryLabel={getCategoryLabel}
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