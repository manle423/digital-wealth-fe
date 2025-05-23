'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RiskProfile, AssetClass, AssetAllocation } from '@/types/portfolio-management.types';
import assetAllocationService from '@/services/asset-allocation.service';
import AllocationForm from '@/components/allocations/AllocationForm';

interface EditAllocationPageProps {
  params: Promise<{
    riskProfileId: string;
  }>;
}

export default function EditAllocationPage({ params }: EditAllocationPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([]);
  const [allocations, setAllocations] = useState<AssetAllocation[]>([]);
  const unwrappedParams = use(params);

  useEffect(() => {
    fetchData();
  }, [unwrappedParams.riskProfileId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await assetAllocationService.getAssetAllocationsByRiskProfile(unwrappedParams.riskProfileId);
      
      if (response.success && response.data) {
        setAllocations(response.data);
        if (response.data.length > 0) {
          setRiskProfile(response.data[0].riskProfile);
          // Extract unique asset classes from allocations
          const uniqueAssetClasses = Array.from(
            new Map(response.data.map(item => [item.assetClass.id, item.assetClass])).values()
          );
          setAssetClasses(uniqueAssetClasses);
        }
      } else {
        toast.error('Không thể tải thông tin phân bổ tài sản');
      }
    } catch (error) {
      console.error('Error fetching allocations:', error);
      toast.error('Đã xảy ra lỗi khi tải thông tin phân bổ tài sản');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: { riskProfileId: string; allocations: { assetClassId: string; percentage: number }[] }) => {
    try {
      setLoading(true);
      const response = await assetAllocationService.createOrUpdateBatchAllocations(data);
      
      if (response.success) {
        toast.success('Cập nhật phân bổ tài sản thành công');
        router.push('/admin/allocations');
      } else {
        toast.error('Không thể cập nhật phân bổ tài sản');
      }
    } catch (error) {
      console.error('Error updating allocations:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật phân bổ tài sản');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!riskProfile || !assetClasses.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Không tìm thấy thông tin phân bổ tài sản</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa phân bổ tài sản</h1>
        <p className="text-gray-600">Điều chỉnh tỷ trọng cho các lớp tài sản</p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6">
        <AllocationForm
          riskProfile={riskProfile}
          assetClasses={assetClasses}
          initialAllocations={allocations}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
} 