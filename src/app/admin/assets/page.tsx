'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import assetClassService from '@/services/asset-class.service';
import { AssetClass } from '@/types/portfolio-management.types';
import AssetClassFilter from '@/components/assets/AssetClassFilter';
import AssetClassCard from '@/components/assets/AssetClassCard';

export default function AssetClassesPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<AssetClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<number[]>([]);

  useEffect(() => {
    fetchAssets();
  }, [selectedRiskLevels]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await assetClassService.getAssetClasses({
        isActive: true,
        page: 1,
        limit: 10
      });
      
      if (response.success && response.data) {
        let filteredAssets = response.data.data;
        
        // Apply risk level filtering if any selected
        if (selectedRiskLevels.length > 0) {
          filteredAssets = filteredAssets.filter(asset => 
            selectedRiskLevels.includes(asset.riskLevel)
          );
        }
        
        setAssets(filteredAssets);
      } else {
        toast.error('Không thể tải danh sách lớp tài sản');
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách lớp tài sản');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp tài sản này?')) {
      try {
        const response = await assetClassService.deleteAssetClass(id);
        if (response.success) {
          toast.success('Xóa lớp tài sản thành công');
          fetchAssets();
        } else {
          toast.error(response.message || 'Không thể xóa lớp tài sản');
        }
      } catch (error) {
        console.error('Error deleting asset:', error);
        toast.error('Đã xảy ra lỗi khi xóa lớp tài sản');
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/assets/edit/${id}`);
  };

  const handleAdd = () => {
    router.push('/admin/assets/create');
  };

  const handleRiskLevelToggle = (level: number) => {
    setSelectedRiskLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedRiskLevels([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý lớp tài sản</h1>
        <p className="text-gray-600">Tạo và quản lý các lớp tài sản đầu tư</p>
      </header>

      <AssetClassFilter
        selectedRiskLevels={selectedRiskLevels}
        onRiskLevelToggle={handleRiskLevelToggle}
        onClearFilters={handleClearFilters}
        onAdd={handleAdd}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {assets.length > 0 ? (
          assets.map(asset => (
            <AssetClassCard
              key={asset.id}
              asset={asset}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-3 py-8 text-center text-gray-500">
            Không có lớp tài sản nào phù hợp với bộ lọc
          </div>
        )}
      </div>
    </div>
  );
} 