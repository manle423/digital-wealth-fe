'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import riskProfilesService from '@/services/risk-profiles.service';
import { RiskProfile, RiskProfileType } from '@/types/risk-assessment.types';
import ProfileFilter from '@/components/profiles/ProfileFilter';
import ProfileCard from '@/components/profiles/ProfileCard';

export default function RiskProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<RiskProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<RiskProfileType[]>([]);
  const [profileTypes, setProfileTypes] = useState<RiskProfileType[]>([]);

  useEffect(() => {
    fetchProfiles();
    fetchProfileTypes();
  }, [selectedTypes]);

  const fetchProfileTypes = async () => {
    try {
      const response = await riskProfilesService.getProfileTypes();
      if (response.success && response?.data) {
        setProfileTypes(response?.data as unknown as RiskProfileType[]);
      }
    } catch (error) {
      console.error('Error fetching profile types:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      // Log the selected types for debugging
      console.log('Selected types:', selectedTypes);
      
      if (selectedTypes.length > 0) {
        params.types = selectedTypes.join(',');
      }
      
      console.log('Fetching profiles with params:', params);
      const response = await riskProfilesService.getProfiles(params);
      console.log('API response:', response);
      
      if (response.success && response.data?.data) {
        // Apply client-side filtering if server filter doesn't work
        // and there are selected types
        let filteredProfiles = response.data.data;
        
        if (selectedTypes.length > 0) {
          // If the server doesn't filter, do it client-side
          filteredProfiles = filteredProfiles.filter(profile => 
            selectedTypes.includes(profile.type)
          );
        }
        
        setProfiles(filteredProfiles);
      } else {
        toast.error(response.message || 'Không thể tải danh sách hồ sơ rủi ro');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách hồ sơ rủi ro');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ rủi ro này?')) {
      try {
        const response = await riskProfilesService.deleteProfile(id);
        if (response.success) {
          toast.success('Xóa hồ sơ rủi ro thành công');
          fetchProfiles();
        } else {
          toast.error(response.message || 'Không thể xóa hồ sơ rủi ro');
        }
      } catch (error) {
        console.error('Error deleting profile:', error);
        toast.error('Đã xảy ra lỗi khi xóa hồ sơ rủi ro');
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/profiles/edit/${id}`);
  };

  const handleAdd = () => {
    router.push('/admin/profiles/create');
  };

  const handleTypeToggle = (type: RiskProfileType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý hồ sơ rủi ro</h1>
        <p className="text-gray-600">Tạo và quản lý các hồ sơ rủi ro của khách hàng</p>
      </header>

      <ProfileFilter 
        profileTypes={profileTypes}
        selectedTypes={selectedTypes}
        onTypeToggle={handleTypeToggle}
        onClearFilters={handleClearFilters}
        onAdd={handleAdd}
      />

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
} 