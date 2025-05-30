'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import authService from '@/services/auth.service';
import { UserProfileData, UserDetail } from '@/types/auth.types';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    phoneNumber: '',
    occupation: '',
    annualIncome: '',
    investmentExperience: '',
    riskTolerance: '',
    monthlyExpenses: '',
    totalPortfolioValue: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getUserProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
        // Initialize form data with current profile data
        const investmentPrefs = response.data.userDetail?.investmentPreferences;
        let monthlyExpenses = '';
        
        if (investmentPrefs) {
          try {
            const prefsObj = typeof investmentPrefs === 'string' ? JSON.parse(investmentPrefs) : investmentPrefs;
            monthlyExpenses = prefsObj.monthlyExpenses?.toString() || '';
          } catch (error) {
            console.error('Error parsing investment preferences:', error);
          }
        }

        setFormData({
          name: response.data.name || '',
          dateOfBirth: formatDateForInput(response.data.userDetail?.dateOfBirth),
          phoneNumber: response.data.userDetail?.phoneNumber || '',
          occupation: response.data.userDetail?.occupation || '',
          annualIncome: response.data.userDetail?.annualIncome?.toString() || '',
          investmentExperience: response.data.userDetail?.investmentExperience || '',
          riskTolerance: response.data.userDetail?.riskTolerance?.toString() || '',
          monthlyExpenses,
          totalPortfolioValue: response.data.userDetail?.totalPortfolioValue?.toString() || ''
        });
      } else {
        toast.error('Không thể tải thông tin người dùng');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Đã xảy ra lỗi khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Create investment preferences as a JSON string
      const investmentPreferences = formData.monthlyExpenses 
        ? JSON.stringify({ monthlyExpenses: parseFloat(formData.monthlyExpenses) })
        : null;

      // Prepare the update data
      const updateData: Partial<UserProfileData> = {
        name: formData.name || undefined,
        userDetail: {
          dateOfBirth: formData.dateOfBirth || null,
          phoneNumber: formData.phoneNumber || null,
          occupation: formData.occupation || null,
          annualIncome: formData.annualIncome || null,
          investmentExperience: formData.investmentExperience || null,
          riskTolerance: formData.riskTolerance || null,
          investmentPreferences,
          totalPortfolioValue: formData.totalPortfolioValue ? parseFloat(formData.totalPortfolioValue) : null,
          // Required fields from UserDetail type
          id: profile?.userDetail?.id || '',
          createdAt: profile?.userDetail?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          userId: profile?.id || '',
          isVerified: profile?.userDetail?.isVerified || false,
          kycDetails: null
        } as UserDetail
      };

      const response = await authService.updateProfile(updateData);
      
      if (response.success) {
        toast.success('Cập nhật thông tin thành công');
        router.push('/account/profile');
      } else {
        toast.error('Không thể cập nhật thông tin: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa thông tin cá nhân</h1>
        <p className="text-gray-600 mt-2">Cập nhật thông tin profile của bạn</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Thông tin chi tiết</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thu nhập hàng năm</label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin đầu tư */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Thông tin đầu tư</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm đầu tư</label>
                <select
                  name="investmentExperience"
                  value={formData.investmentExperience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn kinh nghiệm</option>
                  <option value="BEGINNER">Người mới bắt đầu</option>
                  <option value="INTERMEDIATE">Có kinh nghiệm</option>
                  <option value="ADVANCED">Chuyên nghiệp</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khẩu vị rủi ro</label>
                <select
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn mức độ chấp nhận rủi ro</option>
                  <option value="CONSERVATIVE">Thận trọng</option>
                  <option value="MODERATE">Cân bằng</option>
                  <option value="AGGRESSIVE">Tích cực</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chi tiêu hàng tháng</label>
                <input
                  type="number"
                  name="monthlyExpenses"
                  value={formData.monthlyExpenses}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tổng giá trị danh mục</label>
                <input
                  type="number"
                  name="totalPortfolioValue"
                  value={formData.totalPortfolioValue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/account/profile')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
} 