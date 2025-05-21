'use client';

import { QuestionCategory } from '@/types/risk-assessment.types';

interface QuestionFilterProps {
  categories: QuestionCategory[];
  selectedCategories: string[];
  orderFilter: 'asc' | 'desc';
  isActiveFilter: boolean | null;
  onCategoryToggle: (id: string) => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
  onActiveStatusChange: (status: boolean | null) => void;
  onClearFilters: () => void;
  selectedQuestions: string[];
  onBulkDelete: () => void;
  onBulkUpdateStatus: (isActive: boolean) => void;
  onAdd: () => void;
}

export default function QuestionFilter({
  categories,
  selectedCategories,
  orderFilter,
  isActiveFilter,
  onCategoryToggle,
  onOrderChange,
  onActiveStatusChange,
  onClearFilters,
  selectedQuestions,
  onBulkDelete,
  onBulkUpdateStatus,
  onAdd
}: QuestionFilterProps) {
  const hasActiveFilters = selectedCategories.length > 0 || orderFilter !== 'asc' || isActiveFilter !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo thứ tự</label>
            <div className="flex space-x-2">
              <button
                onClick={() => onOrderChange('asc')}
                className={`px-3 py-1 rounded-md text-sm ${
                  orderFilter === 'asc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tăng dần
              </button>
              <button
                onClick={() => onOrderChange('desc')}
                className={`px-3 py-1 rounded-md text-sm ${
                  orderFilter === 'desc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Giảm dần
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <div className="flex space-x-2">
              <button
                onClick={() => onActiveStatusChange(isActiveFilter === true ? null : true)}
                className={`px-3 py-1 rounded-md text-sm ${
                  isActiveFilter === true
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Đang hoạt động
              </button>
              <button
                onClick={() => onActiveStatusChange(isActiveFilter === false ? null : false)}
                className={`px-3 py-1 rounded-md text-sm ${
                  isActiveFilter === false
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Không hoạt động
              </button>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryToggle(category.id)}
              className={`px-3 py-1 rounded-full text-sm flex items-center ${
                selectedCategories.includes(category.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              {selectedCategories.includes(category.id) && (
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {selectedQuestions.length > 0 && (
          <>
            <button
              onClick={() => onBulkUpdateStatus(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Kích hoạt ({selectedQuestions.length})
            </button>
            <button
              onClick={() => onBulkUpdateStatus(false)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Vô hiệu hóa ({selectedQuestions.length})
            </button>
            <button
              onClick={onBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Xóa ({selectedQuestions.length})
            </button>
          </>
        )}
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Thêm câu hỏi
        </button>
      </div>
    </div>
  );
} 