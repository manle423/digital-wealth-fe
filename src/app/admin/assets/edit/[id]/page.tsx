'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import AssetClassForm from '@/components/assets/AssetClassForm';
import assetClassService from '@/services/asset-class.service';
import { AssetClass } from '@/types/portfolio-management.types';

export default function EditAssetClassPage() {
  const router = useRouter();
  const params = useParams();
  const assetClassId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [assetClass, setAssetClass] = useState<AssetClass | null>(null);
  const [formLoading, setFormLoading] = useState(true);

  useEffect(() => {
    fetchAssetClass();
  }, [assetClassId]);

  const fetchAssetClass = async () => {
    try {
      setFormLoading(true);
      const response = await assetClassService.getAssetClassById(assetClassId);
      
      if (response.success && response.data) {
        setAssetClass(response.data);
      } else {
        toast.error('Không tìm thấy lớp tài sản');
        router.push('/admin/assets');
      }
    } catch (error) {
      console.error('Error fetching asset class:', error);
      toast.error('Đã xảy ra lỗi khi tải lớp tài sản');
      router.push('/admin/assets');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await assetClassService.updateAssetClass(assetClassId, data);
      
      if (response.success) {
        toast.success('Cập nhật lớp tài sản thành công');
        router.push('/admin/assets');
      } else {
        toast.error(response.message || 'Không thể cập nhật lớp tài sản');
      }
    } catch (error) {
      console.error('Error updating asset class:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật lớp tài sản');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/assets');
  };

  // Prepare initial data for the form if asset class data exists
  const getInitialData = () => {
    if (!assetClass) return undefined;
    
    return {
      riskLevel: assetClass.riskLevel,
      expectedReturn: assetClass.expectedReturn,
      order: assetClass.order,
      icon: assetClass.icon || 'default-icon',
      isActive: assetClass.isActive,
      translations: assetClass.translations
    };
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa lớp tài sản</h1>
        <p className="text-gray-600">Cập nhật thông tin lớp tài sản</p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6">
        {formLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <AssetClassForm
            initialData={getInitialData()}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Cập nhật lớp tài sản"
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
