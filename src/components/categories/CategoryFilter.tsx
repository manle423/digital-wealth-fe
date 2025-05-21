'use client';

import { QuestionCategory } from '@/types/risk-assessment.types';

interface CategoryFilterProps {
  categories: QuestionCategory[];
  selectedCategories: string[];
  isActiveFilter: boolean | null;
  onSelectCategory: (id: string) => void;
  onSelectAll: () => void;
  onBulkDelete: () => void;
  onActiveStatusChange: (status: boolean | null) => void;
  onClearFilters: () => void;
  onAdd: () => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  isActiveFilter,
  onSelectCategory,
  onSelectAll,
  onBulkDelete,
  onActiveStatusChange,
  onClearFilters,
  onAdd
}: CategoryFilterProps) {
  const hasActiveFilters = isActiveFilter !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-4">
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

      <div className="flex justify-end space-x-2">
        {selectedCategories.length > 0 && (
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={onBulkDelete}
          >
            Xóa ({selectedCategories.length})
          </button>
        )}
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={onAdd}
        >
          + Thêm danh mục
        </button>
      </div>
    </div>
  );
} 