'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import assetAllocationService from '@/services/asset-allocation.service';
import { AssetAllocation } from '@/types/portfolio-management.types';
import { toast } from 'sonner';

export default function AssetAllocationsPage() {
  const router = useRouter();
  const [allocations, setAllocations] = useState<AssetAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const response = await assetAllocationService.getAssetAllocations();
      if (response.success && response.data) {
        setAllocations(response.data);
      } else {
        toast.error('Không thể tải danh sách phân bổ tài sản');
      }
    } catch (error) {
      console.error('Error fetching allocations:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách phân bổ tài sản');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (riskProfileId: string) => {
    router.push(`/admin/allocations/edit/${riskProfileId}`);
  };

  const handleCreate = () => {
    router.push('/admin/allocations/create');
  };

  const groupAllocationsByRiskProfile = () => {
    const grouped = allocations.reduce((acc, allocation) => {
      const riskProfileId = allocation.riskProfileId;
      if (!acc[riskProfileId]) {
        acc[riskProfileId] = {
          riskProfile: allocation.riskProfile,
          allocations: []
        };
      }
      acc[riskProfileId].allocations.push(allocation);
      return acc;
    }, {} as Record<string, { riskProfile: AssetAllocation['riskProfile']; allocations: AssetAllocation[] }>);

    return Object.values(grouped);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const groupedAllocations = groupAllocationsByRiskProfile();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Phân bổ tài sản</h1>
          <p className="text-gray-600">Quản lý phân bổ tài sản theo hồ sơ rủi ro</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Thêm phân bổ mới
        </button>
      </header>

      <div className="space-y-8">
        {groupedAllocations.map(({ riskProfile, allocations }) => (
          <div key={riskProfile.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {riskProfile.translations.find(t => t.language === 'vi')?.name || riskProfile.type}
                </h2>
                <p className="text-gray-600">
                  {riskProfile.translations.find(t => t.language === 'vi')?.description}
                </p>
              </div>
              <button
                onClick={() => handleEdit(riskProfile.id)}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Chỉnh sửa
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lớp tài sản
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mức độ rủi ro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lợi nhuận kỳ vọng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỷ trọng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allocations
                    .sort((a, b) => b.percentage - a.percentage)
                    .map((allocation) => (
                      <tr key={allocation.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {allocation.assetClass.translations.find(t => t.language === 'vi')?.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{allocation.assetClass.riskLevel}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{allocation.assetClass.expectedReturn}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{allocation.percentage}%</div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
