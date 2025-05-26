'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FiX, FiSave, FiDollarSign, FiCalendar, FiTag, FiFileText } from 'react-icons/fi';
import { toast } from 'sonner';
import { CreateAssetRequest, AssetType, LiquidityLevel, AssetCategory } from '@/types/asset.types';
import { validateAssetData, getAssetIcon, getAssetTypeLabel, formatNumberInput, parseFormattedNumber } from '@/utils/asset.utils';
import { ASSET_CONSTANTS, ASSET_TYPE_LABELS, LIQUIDITY_LABELS } from '@/constants/app.constants';
import { logger } from '@/utils/logger.utils';

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssetRequest) => Promise<boolean>;
  categories: AssetCategory[];
  loading?: boolean;
}

interface FormData extends CreateAssetRequest {
  purchaseDate?: string;
  valuationDate?: string;
}

const CreateAssetModal: React.FC<CreateAssetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  loading = false
}) => {
  const [selectedType, setSelectedType] = useState<AssetType>(AssetType.OTHER);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      type: AssetType.OTHER,
      currency: ASSET_CONSTANTS.DEFAULT_CURRENCY,
      liquidityLevel: LiquidityLevel.MEDIUM,
      additionalInfo: {}
    }
  });

  const watchedType = watch('type');

  // Update selected type when form type changes
  useEffect(() => {
    if (watchedType) {
      setSelectedType(watchedType);
    }
  }, [watchedType]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        type: AssetType.OTHER,
        currency: ASSET_CONSTANTS.DEFAULT_CURRENCY,
        liquidityLevel: LiquidityLevel.MEDIUM,
        additionalInfo: {}
      });
      setSelectedType(AssetType.OTHER);
      setShowAdditionalInfo(false);
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: FormData) => {
    try {
      logger.debug('Submitting create asset form', { data });

      // Validate data
      const validation = validateAssetData(data);
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        return;
      }

      // Prepare submission data
      const submitData: CreateAssetRequest = {
        ...data,
        currentValue: Number(data.currentValue),
        purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : undefined,
        marketValue: data.marketValue ? Number(data.marketValue) : undefined,
        annualReturn: data.annualReturn ? Number(data.annualReturn) : undefined,
        purchaseDate: data.purchaseDate || undefined,
        valuationDate: data.valuationDate || undefined,
      };

      const success = await onSubmit(submitData);
      
      if (success) {
        logger.info('Asset created successfully');
        onClose();
        reset();
      }
    } catch (error) {
      logger.error('Error submitting create asset form', error as Error);
      toast.error('Đã xảy ra lỗi khi tạo tài sản');
    }
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    fieldName: keyof Pick<FormData, 'currentValue' | 'purchasePrice' | 'marketValue'>
  ) => {
    const formattedValue = formatNumberInput(e.target.value);
    e.target.value = formattedValue;
    setValue(fieldName, parseFormattedNumber(formattedValue));
  };

  const getAdditionalInfoFields = () => {
    const commonFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vị trí
            </label>
            <input
              {...register('additionalInfo.location')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Vị trí tài sản"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tình trạng
            </label>
            <select
              {...register('additionalInfo.condition')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn tình trạng</option>
              <option value="excellent">Tuyệt vời</option>
              <option value="good">Tốt</option>
              <option value="fair">Khá</option>
              <option value="poor">Kém</option>
            </select>
          </div>
        </div>
      </>
    );

    switch (selectedType) {
      case AssetType.STOCK:
      case AssetType.BOND:
      case AssetType.MUTUAL_FUND:
      case AssetType.ETF:
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Môi giới
                </label>
                <input
                  {...register('additionalInfo.broker')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tên công ty môi giới"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tài khoản
                </label>
                <input
                  {...register('additionalInfo.accountNumber')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Số tài khoản giao dịch"
                />
              </div>
            </div>
            {(selectedType === AssetType.STOCK || selectedType === AssetType.ETF) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tỷ suất cổ tức (%)
                </label>
                <input
                  {...register('additionalInfo.dividendYield')}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            )}
          </>
        );

      case AssetType.BANK_DEPOSIT:
      case AssetType.SAVINGS_ACCOUNT:
      case AssetType.CERTIFICATE_OF_DEPOSIT:
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lãi suất (%)
                </label>
                <input
                  {...register('additionalInfo.interestRate')}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày đáo hạn
                </label>
                <input
                  {...register('additionalInfo.maturityDate')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </>
        );

      case AssetType.VEHICLE:
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số seri/VIN
              </label>
              <input
                {...register('additionalInfo.serialNumber')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Số khung xe"
              />
            </div>
          </>
        );

      default:
        return commonFields;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Thêm tài sản mới
                </h3>
                <p className="text-sm text-gray-600">
                  Nhập thông tin chi tiết về tài sản của bạn
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

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tài sản <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { 
                    required: 'Tên tài sản là bắt buộc',
                    minLength: { value: 2, message: 'Tên tài sản phải có ít nhất 2 ký tự' }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nhập tên tài sản"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('categoryId', { required: 'Vui lòng chọn danh mục' })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.categoryId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                )}
              </div>
            </div>

            {/* Asset Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Loại tài sản
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Object.values(AssetType).map(type => (
                  <label
                    key={type}
                    className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      {...register('type', {
                        onChange: (e) => setSelectedType(e.target.value as AssetType)
                      })}
                      type="radio"
                      value={type}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-1">{getAssetIcon(type)}</span>
                    <span className="text-xs text-center font-medium">
                      {ASSET_TYPE_LABELS[type]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị hiện tại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
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

              {/* Purchase Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá mua
                </label>
                <input
                  type="text"
                  onChange={(e) => handleNumberInputChange(e, 'purchasePrice')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Market Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị thị trường
                </label>
                <input
                  type="text"
                  onChange={(e) => handleNumberInputChange(e, 'marketValue')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị tiền tệ
                </label>
                <select
                  {...register('currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>

            {/* Dates and Liquidity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày mua
                </label>
                <input
                  {...register('purchaseDate')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Annual Return */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lợi nhuận hàng năm (%)
                </label>
                <input
                  {...register('annualReturn')}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Liquidity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tính thanh khoản
                </label>
                <select
                  {...register('liquidityLevel')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.values(LiquidityLevel).map(level => (
                    <option key={level} value={level}>
                      {LIQUIDITY_LABELS[level]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả chi tiết về tài sản..."
              />
            </div>

            {/* Additional Information Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <FiTag className="w-4 h-4" />
                {showAdditionalInfo ? 'Ẩn thông tin bổ sung' : 'Hiển thị thông tin bổ sung'}
              </button>
            </div>

            {/* Additional Information */}
            {showAdditionalInfo && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-900">Thông tin bổ sung</h4>
                {getAdditionalInfoFields()}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ghi chú thêm..."
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                {isSubmitting || loading ? 'Đang lưu...' : 'Lưu tài sản'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssetModal; 