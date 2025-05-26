'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiSave, FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { toast } from 'sonner';
import { UserAsset, UpdateAssetValueRequest } from '@/types/asset.types';
import { 
  formatCurrency, 
  calculateProfitLoss, 
  getProfitLossColor,
  getAssetIcon,
  getAssetTypeLabel,
  safeToFixed,
  formatNumberInput,
  parseFormattedNumber
} from '@/utils/asset.utils';
import { logger } from '@/utils/logger.utils';

interface UpdateValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateAssetValueRequest) => Promise<boolean>;
  asset: UserAsset | null;
  loading?: boolean;
}

interface FormData {
  currentValue: number;
  marketValue?: number;
  notes?: string;
}

const UpdateValueModal: React.FC<UpdateValueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  asset,
  loading = false
}) => {
  const [profitLoss, setProfitLoss] = useState({ amount: 0, percentage: 0, isProfit: true });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  const watchedCurrentValue = watch('currentValue');

  // Calculate profit/loss when current value changes
  useEffect(() => {
    if (watchedCurrentValue && asset?.purchasePrice) {
      const newProfitLoss = calculateProfitLoss(Number(watchedCurrentValue), asset.purchasePrice);
      setProfitLoss(newProfitLoss);
    }
  }, [watchedCurrentValue, asset?.purchasePrice]);

  // Reset form when modal opens or asset changes
  useEffect(() => {
    if (isOpen && asset) {
      reset({
        currentValue: asset.currentValue,
        marketValue: asset.marketValue || undefined,
        notes: ''
      });
      
      if (asset.purchasePrice) {
        const initialProfitLoss = calculateProfitLoss(asset.currentValue, asset.purchasePrice);
        setProfitLoss(initialProfitLoss);
      }
    }
  }, [isOpen, asset, reset]);

  const handleFormSubmit = async (data: FormData) => {
    if (!asset) return;

    try {
      logger.debug('Submitting update value form', { assetId: asset.id, data });

      // Validate current value
      if (!data.currentValue || data.currentValue <= 0) {
        toast.error('Giá trị hiện tại phải lớn hơn 0');
        return;
      }

      const submitData: UpdateAssetValueRequest = {
        currentValue: Number(data.currentValue),
        marketValue: data.marketValue ? Number(data.marketValue) : undefined,
        notes: data.notes || undefined
      };

      const success = await onSubmit(asset.id, submitData);
      
      if (success) {
        logger.info('Asset value updated successfully', { assetId: asset.id });
        onClose();
        reset();
      }
    } catch (error) {
      logger.error('Error submitting update value form', error as Error);
      toast.error('Đã xảy ra lỗi khi cập nhật giá trị');
    }
  };

  const handleQuickUpdate = (percentage: number) => {
    if (!asset) return;
    
    const newValue = asset.currentValue * (1 + percentage / 100);
    setValue('currentValue', Math.round(newValue));
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    fieldName: keyof Pick<FormData, 'currentValue' | 'marketValue'>
  ) => {
    const formattedValue = formatNumberInput(e.target.value);
    e.target.value = formattedValue;
    const numericValue = parseFormattedNumber(formattedValue);
    setValue(fieldName, numericValue);

    // Update profit/loss calculation for currentValue changes
    if (fieldName === 'currentValue' && asset?.purchasePrice) {
      const newProfitLoss = calculateProfitLoss(numericValue, asset.purchasePrice);
      setProfitLoss(newProfitLoss);
    }
  };

  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cập nhật giá trị tài sản
                </h3>
                <p className="text-sm text-gray-600">
                  {asset.name} • {getAssetTypeLabel(asset.type)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Asset Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{getAssetIcon(asset.type)}</span>
              <div>
                <h4 className="font-medium text-gray-900">{asset.name}</h4>
                <p className="text-sm text-gray-600">{asset.category?.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Giá trị hiện tại:</span>
                <div className="font-semibold text-gray-900">
                  {formatCurrency(asset.currentValue, asset.currency)}
                </div>
              </div>
              {asset.purchasePrice && (
                <div>
                  <span className="text-gray-600">Giá mua:</span>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(asset.purchasePrice, asset.currency)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Quick Update Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cập nhật nhanh
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[-10, -5, 5, 10].map(percentage => (
                  <button
                    key={percentage}
                    type="button"
                    onClick={() => handleQuickUpdate(percentage)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      percentage < 0
                        ? 'border-red-300 text-red-700 hover:bg-red-50'
                        : 'border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {percentage > 0 ? '+' : ''}{percentage}%
                  </button>
                ))}
              </div>
            </div>

            {/* Current Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị hiện tại mới <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={asset.currentValue}
                onChange={(e) => handleNumberInputChange(e, 'currentValue')}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.currentValue ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.currentValue && (
                <p className="mt-1 text-sm text-red-600">{errors.currentValue.message}</p>
              )}
            </div>

            {/* Market Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị thị trường (tùy chọn)
              </label>
              <input
                type="text"
                defaultValue={asset.marketValue}
                onChange={(e) => handleNumberInputChange(e, 'marketValue')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Giá trị thị trường hiện tại nếu khác với giá trị đánh giá
              </p>
            </div>

            {/* Profit/Loss Preview */}
            {asset.purchasePrice && watchedCurrentValue && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Lãi/Lỗ dự kiến</h4>
                <div className={`flex items-center gap-2 ${getProfitLossColor(profitLoss.isProfit)}`}>
                  {profitLoss.isProfit ? (
                    <FiTrendingUp className="w-4 h-4" />
                  ) : (
                    <FiTrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-semibold">
                    {profitLoss.isProfit ? '+' : ''}{formatCurrency(profitLoss.amount, asset.currency)}
                  </span>
                  <span>({safeToFixed(profitLoss.percentage, 2)}%)</span>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú về thay đổi
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Lý do thay đổi giá trị, nguồn thông tin..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting || loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                {isSubmitting || loading ? 'Đang cập nhật...' : 'Cập nhật giá trị'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateValueModal; 