'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiUser, 
  FiShield, 
  FiSmartphone, 
  FiBell, 
  FiLock, 
  FiSettings,
  FiChevronRight,
  FiArrowLeft 
} from 'react-icons/fi';

export default function SettingsPage() {
  const settingsItems = [
    {
      title: 'Cài đặt hồ sơ',
      description: 'Cập nhật thông tin cá nhân và tùy chọn',
      icon: <FiUser className="w-6 h-6" />,
      href: '/account/profile',
      color: 'text-blue-600'
    },
    {
      title: 'Quản lý thiết bị',
      description: 'Quản lý các thiết bị đăng nhập và bảo mật',
      icon: <FiSmartphone className="w-6 h-6" />,
      href: '/account/settings/devices',
      color: 'text-green-600'
    },
    {
      title: 'Cài đặt bảo mật (Sắp ra mắt)',
      description: 'Mật khẩu, xác thực hai lớp và bảo mật',
      icon: <FiShield className="w-6 h-6" />,
      href: '/account/settings/security',
      color: 'text-red-600'
    },
    {
      title: 'Thông báo (Sắp ra mắt)',
      description: 'Cấu hình tùy chọn thông báo của bạn',
      icon: <FiBell className="w-6 h-6" />,
      href: '/account/settings/notifications',
      color: 'text-yellow-600'
    },
    {
      title: 'Cài đặt quyền riêng tư (Sắp ra mắt)',
      description: 'Kiểm soát quyền riêng tư và tùy chọn chia sẻ dữ liệu',
      icon: <FiLock className="w-6 h-6" />,
      href: '/account/settings/privacy',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/account/profile" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Quay lại tài khoản
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiSettings className="w-8 h-8" />
            Cài đặt
          </h1>
          <p className="mt-2 text-gray-600">
            Quản lý cài đặt và tùy chọn tài khoản của bạn
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {settingsItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className={`${item.color} group-hover:scale-110 transition-transform duration-200`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/account/settings/devices"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiSmartphone className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Xem thiết bị</span>
              </div>
            </Link>
            <Link
              href="/account/settings/security"
              className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiShield className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-900">Kiểm tra bảo mật</span>
              </div>
            </Link>
            <Link
              href="/account/profile"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiUser className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Chỉnh sửa hồ sơ</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 