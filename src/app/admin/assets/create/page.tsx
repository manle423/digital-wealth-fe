'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AssetClassForm from '@/components/assets/AssetClassForm';
import assetClassService from '@/services/asset-class.service';

export default function CreateAssetClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await assetClassService.createAssetClass(data);
      
      if (response.success) {
        toast.success('Tạo lớp tài sản thành công');
        router.push('/admin/assets');
      } else {
        toast.error(response.message || 'Không thể tạo lớp tài sản');
      }
    } catch (error) {
      console.error('Error creating asset class:', error);
      toast.error('Đã xảy ra lỗi khi tạo lớp tài sản');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/assets');
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thêm lớp tài sản mới</h1>
        <p className="text-gray-600">Tạo một lớp tài sản đầu tư mới</p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6">
        <AssetClassForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Tạo lớp tài sản"
          loading={loading}
        />
      </div>
    </div>
  );
}
