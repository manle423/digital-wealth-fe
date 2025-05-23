'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import authService from '@/services/auth.service';
import { UserProfileData } from '@/types/auth.types';

export default function AccountMePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getUserProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa cập nhật';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Thông tin tài khoản</h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân của bạn</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {profile ? (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tham gia</label>
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {formatDate(profile.createdAt)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài khoản</label>
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.role === 'CUSTOMER' ? 'Khách hàng' : profile.role}
                      </div>
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
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.userDetail?.dateOfBirth ? formatDate(profile.userDetail.dateOfBirth) : 'Chưa cập nhật'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.userDetail?.phoneNumber || 'Chưa cập nhật'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp</label>
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.userDetail?.occupation || 'Chưa cập nhật'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thu nhập hàng năm</label>
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.userDetail?.annualIncome || 'Chưa cập nhật'}
                      </div>
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
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.userDetail?.investmentExperience || 'Chưa cập nhật'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Khẩu vị rủi ro</label>
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.userDetail?.riskTolerance || 'Chưa cập nhật'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ưu tiên đầu tư</label>
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.userDetail?.investmentPreferences || 'Chưa cập nhật'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tổng giá trị danh mục</label>
                      <div className="px-3 py-3 bg-gray-100 rounded-md text-gray-800">
                        {profile.userDetail?.totalPortfolioValue ? 
                          new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(profile.userDetail.totalPortfolioValue) : 
                          'Chưa cập nhật'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Xác thực KYC */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Xác thực tài khoản</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                      profile.userDetail?.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {profile.userDetail?.isVerified ? (
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {profile.userDetail?.isVerified ? 'Tài khoản đã được xác thực' : 'Tài khoản chưa được xác thực'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {profile.userDetail?.isVerified ? 
                          'Bạn đã hoàn tất quá trình xác thực tài khoản.' : 
                          'Vui lòng hoàn tất quy trình xác thực để mở khóa đầy đủ tính năng.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={fetchUserProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Làm mới thông tin
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 