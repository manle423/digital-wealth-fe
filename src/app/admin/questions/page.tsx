'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import riskAssessmentQuestionsService from '@/services/risk-assessment-questions.service';
import questionCategoriesService from '@/services/question-categories.service';
import { QuestionCategory, RiskAssessmentQuestion, RiskAssessmentPagination } from '@/types/risk-assessment.types';

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
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Bộ lọc</h3>
            {(selectedCategories.length > 0 || orderFilter || isActiveFilter !== undefined) && (
              <button 
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={clearCategoryFilters}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
          
          {/* Order Filter */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sắp xếp theo thứ tự</h4>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  orderFilter === 'ASC'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setOrderFilter(orderFilter === 'ASC' ? undefined : 'ASC')}
              >
                Tăng dần
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  orderFilter === 'DESC'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setOrderFilter(orderFilter === 'DESC' ? undefined : 'DESC')}
              >
                Giảm dần
              </button>
            </div>
          </div>

          {/* Active Status Filter */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Trạng thái</h4>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  isActiveFilter === true
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setIsActiveFilter(isActiveFilter === true ? undefined : true)}
              >
                Đang hoạt động
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  isActiveFilter === false
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setIsActiveFilter(isActiveFilter === false ? undefined : false)}
              >
                Không hoạt động
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Danh mục</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryMap).map(([id, name]) => (
                <div
                  key={id}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer
                    ${selectedCategories.includes(id) 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  `}
                  onClick={() => toggleCategorySelection(id)}
                >
                  <div className="flex items-center">
                    {selectedCategories.includes(id) && (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                    {name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            {selectedCategories.length > 0 && (
              <div className="bg-blue-50 p-3 flex items-center justify-between">
                <div className="flex items-center text-sm text-blue-800">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Đang lọc: {selectedCategories.map(cat => getCategoryLabel(cat)).join(', ')}
                </div>
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={clearCategoryFilters}
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedQuestions.length > 0 && selectedQuestions.length === questions.length}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Câu hỏi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thứ tự
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lựa chọn
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Không tìm thấy câu hỏi phù hợp
                      </td>
                    </tr>
                  ) : (
                    questions.map((question) => (
                      <tr key={question.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={selectedQuestions.includes(question.id)}
                              onChange={() => handleSelectQuestion(question.id)}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {question.textVi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getCategoryLabel(question.categoryId || question.category || '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {question.order}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {question.options.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => handleEdit(question.id)}
                          >
                            Sửa
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(question.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

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