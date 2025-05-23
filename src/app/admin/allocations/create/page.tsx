'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RiskProfile, AssetClass } from '@/types/portfolio-management.types';
import assetAllocationService from '@/services/asset-allocation.service';
import AllocationForm from '@/components/allocations/AllocationForm';

export default function CreateAllocationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([]);

  useEffect(() => {
    // Fetch risk profiles and asset classes
    // This would typically come from your API
    // For now, we'll use mock data
  }, []);

  const handleSubmit = async (data: { riskProfileId: string; allocations: { assetClassId: string; percentage: number }[] }) => {
    try {
      setLoading(true);
      const response = await assetAllocationService.createOrUpdateBatchAllocations(data);
      
      if (response.success) {
        toast.success('Tạo phân bổ tài sản thành công');
        router.push('/admin/allocations');
      } else {
        toast.error('Không thể tạo phân bổ tài sản');
      }
    } catch (error) {
      console.error('Error creating allocations:', error);
      toast.error('Đã xảy ra lỗi khi tạo phân bổ tài sản');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!riskProfile || assetClasses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tạo phân bổ tài sản mới</h1>
        <p className="text-gray-600">Thiết lập tỷ trọng cho các lớp tài sản</p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6">
        <AllocationForm
          riskProfile={riskProfile}
          assetClasses={assetClasses}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
} 