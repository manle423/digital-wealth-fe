'use client';

import { QuestionCategory } from '@/types/risk-assessment.types';

interface CategoryTableProps {
  categories: QuestionCategory[];
  selectedCategories: string[];
  onSelectCategory: (id: string) => void;
  onSelectAll: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CategoryTable({
  categories,
  selectedCategories,
  onSelectCategory,
  onSelectAll,
  onEdit,
  onDelete
}: CategoryTableProps) {
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
                    onChange={onSelectAll}
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
                      onChange={() => onSelectCategory(category.id)}
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
                    onClick={() => onEdit(category.id)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => onDelete(category.id)}
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
  );
} 