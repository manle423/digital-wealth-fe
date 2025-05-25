'use client';

import React from 'react';
import { UserAsset } from '@/types/asset.types';
import { FiEdit, FiTrash2, FiTrendingUp, FiTrendingDown, FiDollarSign, FiClock } from 'react-icons/fi';
import {
  formatCurrency,
  getAssetIcon,
  getAssetTypeLabel,
  getLiquidityLabel,
  getLiquidityColor,
  calculateProfitLoss,
  getProfitLossColor,
  formatRelativeTime,
  safeToFixed
} from '@/utils/asset.utils';

interface AssetCardProps {
  asset: UserAsset;
  onEdit: (asset: UserAsset) => void;
  onDelete: (assetId: string) => void;
  onUpdateValue: (asset: UserAsset) => void;
  loading?: boolean;
}

const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onEdit,
  onDelete,
  onUpdateValue,
  loading = false
}) => {
  const profitLoss = calculateProfitLoss(asset.currentValue, asset.purchasePrice);
  const liquidityColorClass = getLiquidityColor(asset.liquidityLevel);

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài sản "${asset.name}"?`)) {
      onDelete(asset.id);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getAssetIcon(asset.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{asset.name}</h3>
            <p className="text-sm text-gray-600">{getAssetTypeLabel(asset.type)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateValue(asset)}
            disabled={loading}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
            title="Cập nhật giá trị"
          >
            <FiDollarSign className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(asset)}
            disabled={loading}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
            title="Chỉnh sửa"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            title="Xóa"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Value */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900">
          {formatCurrency(asset.currentValue, asset.currency)}
        </div>
        {asset.marketValue && asset.marketValue !== asset.currentValue && (
          <div className="text-sm text-gray-600">
            Thị trường: {formatCurrency(asset.marketValue, asset.currency)}
          </div>
        )}
      </div>

      {/* Profit/Loss */}
      {asset.purchasePrice && (
        <div className="mb-4">
          <div className={`flex items-center gap-1 text-sm ${getProfitLossColor(profitLoss.isProfit)}`}>
            {profitLoss.isProfit ? (
              <FiTrendingUp className="w-4 h-4" />
            ) : (
              <FiTrendingDown className="w-4 h-4" />
            )}
            <span>
              {profitLoss.isProfit ? '+' : ''}{formatCurrency(profitLoss.amount, asset.currency)}
            </span>
            <span>({safeToFixed(profitLoss.percentage, 2)}%)</span>
          </div>
          <div className="text-xs text-gray-500">
            Giá mua: {formatCurrency(asset.purchasePrice, asset.currency)}
          </div>
        </div>
      )}

      {/* Category & Liquidity */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          {asset.category?.name || 'Chưa phân loại'}
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${liquidityColorClass}`}>
          {getLiquidityLabel(asset.liquidityLevel)}
        </span>
      </div>

      {/* Description */}
      {asset.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{asset.description}</p>
        </div>
      )}

      {/* Additional Info */}
      {asset.additionalInfo && Object.keys(asset.additionalInfo).length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 space-y-1">
            {asset.additionalInfo.broker && (
              <div>Môi giới: {asset.additionalInfo.broker}</div>
            )}
            {asset.additionalInfo.location && (
              <div>Vị trí: {asset.additionalInfo.location}</div>
            )}
            {asset.additionalInfo.interestRate && (
              <div>Lãi suất: {asset.additionalInfo.interestRate}%</div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <FiClock className="w-3 h-3" />
          <span>Cập nhật {formatRelativeTime(asset.lastUpdated)}</span>
        </div>
        {asset.annualReturn && (
          <div className={`${Number(asset.annualReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Number(asset.annualReturn) >= 0 ? '+' : ''}{safeToFixed(asset.annualReturn, 2)}%/năm
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard; 