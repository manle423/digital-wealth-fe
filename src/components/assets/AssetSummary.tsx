'use client';

import React from 'react';
import { AssetSummary as AssetSummaryType } from '@/types/asset.types';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart } from 'react-icons/fi';
import { formatCurrency, formatCompactNumber, safeToFixed } from '@/utils/asset.utils';

interface AssetSummaryProps {
  summary: AssetSummaryType;
  totalValue: number;
  className?: string;
}

const AssetSummary: React.FC<AssetSummaryProps> = ({
  summary,
  totalValue,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Tổng quan tài sản</h2>
      
      {/* Total Value */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FiDollarSign className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-600">Tổng giá trị</span>
        </div>
        <div className="text-3xl font-bold text-gray-900">
          {formatCurrency(totalValue)}
        </div>
        <div className="text-sm text-gray-500">
          {summary.totalAssets} tài sản
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiPieChart className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-gray-600">Phân bổ theo danh mục</span>
        </div>
        
        <div className="space-y-3">
          {summary.byCategory.map((category) => (
            <div key={category.categoryId} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {category.categoryName}
                  </span>
                  <span className="text-sm text-gray-600">
                    {safeToFixed(category.percentage, 1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {category.assetCount} tài sản
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {formatCompactNumber(category.totalValue)} VND
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Type Breakdown */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-gray-600">Top loại tài sản</span>
        </div>
        
        <div className="space-y-2">
          {summary.byType
            .sort((a, b) => b.totalValue - a.totalValue)
            .slice(0, 5)
            .map((type) => (
              <div key={type.type} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">{type.type}</span>
                  <span className="text-xs text-gray-500">({type.assetCount})</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatCompactNumber(type.totalValue)} VND
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AssetSummary; 