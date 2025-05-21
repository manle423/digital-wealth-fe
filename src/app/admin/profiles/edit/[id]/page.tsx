'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import ProfileForm from '@/components/profiles/ProfileForm';
import riskProfilesService from '@/services/risk-profiles.service';
import { RiskProfile } from '@/types/risk-assessment.types';

export default function EditProfilePage() {
  const router = useRouter();
  const params = useParams();
  const profileId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<RiskProfile | null>(null);
  const [formLoading, setFormLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      setFormLoading(true);
      // Fetch the profile by ID - this will need to be implemented in the service
      // For now, we'll use getProfiles and filter
      const response = await riskProfilesService.getProfiles();
      
      if (response.success && response.data?.data) {
        const foundProfile = response.data.data.find(p => p.id === profileId);
        if (foundProfile) {
          setProfile(foundProfile);
        } else {
          toast.error('Không tìm thấy hồ sơ rủi ro');
          router.push('/admin/profiles');
        }
      } else {
        toast.error('Không thể tải hồ sơ rủi ro');
        router.push('/admin/profiles');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Đã xảy ra lỗi khi tải hồ sơ rủi ro');
      router.push('/admin/profiles');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await riskProfilesService.updateProfile(profileId, data);
      
      if (response.success) {
        toast.success('Cập nhật hồ sơ rủi ro thành công');
        router.push('/admin/profiles');
      } else {
        toast.error(response.message || 'Không thể cập nhật hồ sơ rủi ro');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật hồ sơ rủi ro');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/profiles');
  };

  // Prepare initial data for the form if profile data exists
  const getInitialData = () => {
    if (!profile) return undefined;
    
    return {
      type: profile.type,
      minScore: profile.minScore,
      maxScore: profile.maxScore,
      translations: profile.translations
    };
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa hồ sơ rủi ro</h1>
        <p className="text-gray-600">Cập nhật thông tin hồ sơ rủi ro</p>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6">
        {formLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ProfileForm
            initialData={getInitialData()}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Cập nhật hồ sơ"
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
