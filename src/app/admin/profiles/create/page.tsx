'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ProfileForm from '@/components/profiles/ProfileForm';
import riskProfilesService from '@/services/risk-profiles.service';

export default function CreateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await riskProfilesService.createProfile(data);
      
      if (response.success) {
        toast.success('Tạo hồ sơ rủi ro thành công');
        router.push('/admin/profiles');
      } else {
        toast.error(response.message || 'Không thể tạo hồ sơ rủi ro');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Đã xảy ra lỗi khi tạo hồ sơ rủi ro');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/profiles');
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thêm hồ sơ rủi ro mới</h1>
        <p className="text-gray-600">Tạo một hồ sơ rủi ro mới cho khách hàng</p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ProfileForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Tạo hồ sơ"
          loading={loading}
        />
      </div>
    </div>
  );
}
