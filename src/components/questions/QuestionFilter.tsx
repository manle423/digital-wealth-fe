'use client';

import { QuestionCategory } from '@/types/risk-assessment.types';

interface QuestionFilterProps {
  categories: Record<string, string>;
  selectedCategories: string[];
  orderFilter: 'ASC' | 'DESC' | undefined;
  isActiveFilter: boolean | undefined;
  onCategoryToggle: (categoryId: string) => void;
  onOrderChange: (order: 'ASC' | 'DESC' | undefined) => void;
  onActiveChange: (isActive: boolean | undefined) => void;
  onClearFilters: () => void;
}

export default function QuestionFilter({
  categories,
  selectedCategories,
  orderFilter,
  isActiveFilter,
  onCategoryToggle,
  onOrderChange,
  onActiveChange,
  onClearFilters
}: QuestionFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Bộ lọc</h3>
        {(selectedCategories.length > 0 || orderFilter || isActiveFilter !== undefined) && (
          <button 
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={onClearFilters}
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
            onClick={() => onOrderChange(orderFilter === 'ASC' ? undefined : 'ASC')}
          >
            Tăng dần
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              orderFilter === 'DESC'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => onOrderChange(orderFilter === 'DESC' ? undefined : 'DESC')}
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
            onClick={() => onActiveChange(isActiveFilter === true ? undefined : true)}
          >
            Đang hoạt động
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              isActiveFilter === false
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => onActiveChange(isActiveFilter === false ? undefined : false)}
          >
            Không hoạt động
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Danh mục</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([id, name]) => (
            <div
              key={id}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer
                ${selectedCategories.includes(id) 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
              onClick={() => onCategoryToggle(id)}
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
  );
} 