'use client';

import { useState, useEffect } from 'react';
import { AssetClass, RiskProfile, AssetAllocation } from '@/types/portfolio-management.types';
import { toast } from 'sonner';

interface AllocationFormProps {
  riskProfile: RiskProfile;
  assetClasses: AssetClass[];
  initialAllocations?: AssetAllocation[];
  onSubmit: (data: { riskProfileId: string; allocations: { assetClassId: string; percentage: number }[] }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function AllocationForm({
  riskProfile,
  assetClasses,
  initialAllocations,
  onSubmit,
  onCancel,
  loading = false
}: AllocationFormProps) {
  const [allocations, setAllocations] = useState<{ assetClassId: string; percentage: number }[]>([]);

  useEffect(() => {
    if (initialAllocations) {
      setAllocations(
        initialAllocations.map(a => ({
          assetClassId: a.assetClassId,
          percentage: a.percentage
        }))
      );
    } else {
      // Initialize with all asset classes at 0%
      setAllocations(
        assetClasses.map(ac => ({
          assetClassId: ac.id,
          percentage: 0
        }))
      );
    }
  }, [initialAllocations, assetClasses]);

  const handlePercentageChange = (assetClassId: string, value: number) => {
    setAllocations(prev =>
      prev.map(a =>
        a.assetClassId === assetClassId
          ? { ...a, percentage: Math.min(100, Math.max(0, value)) }
          : a
      )
    );
  };

  const getTotalPercentage = () => {
    return allocations.reduce((sum, a) => sum + a.percentage, 0);
  };

  const validateForm = () => {
    const total = getTotalPercentage();
    if (total !== 100) {
      toast.error('Tổng tỷ trọng phải bằng 100%');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit({
        riskProfileId: riskProfile.id,
        allocations: allocations.filter(a => a.percentage > 0)
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const getAssetClassById = (id: string) => {
    return assetClasses.find(ac => ac.id === id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          {riskProfile.translations.find(t => t.language === 'vi')?.name || riskProfile.type}
        </h2>
        <p className="text-gray-600 mb-4">
          {riskProfile.translations.find(t => t.language === 'vi')?.description}
        </p>
      </div>

      <div className="space-y-4">
        {allocations.map(allocation => {
          const assetClass = getAssetClassById(allocation.assetClassId);
          if (!assetClass) return null;

          return (
            <div key={allocation.assetClassId} className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  {assetClass.translations.find(t => t.language === 'vi')?.name}
                </label>
                <div className="text-sm text-gray-500">
                  Rủi ro: {assetClass.riskLevel}/5 | Lợi nhuận kỳ vọng: {assetClass.expectedReturn}%
                </div>
              </div>
              <div className="w-32">
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={allocation.percentage}
                    onChange={(e) => handlePercentageChange(allocation.assetClassId, Number(e.target.value))}
                    className="block w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="1"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Tổng tỷ trọng:</span>
          <span className={`text-lg font-bold ${getTotalPercentage() === 100 ? 'text-green-600' : 'text-red-600'}`}>
            {getTotalPercentage()}%
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          disabled={loading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading || getTotalPercentage() !== 100}
        >
          {loading ? 'Đang lưu...' : 'Lưu phân bổ'}
        </button>
      </div>
    </form>
  );
} 