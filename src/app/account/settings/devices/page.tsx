'use client';

import React from 'react';
import DeviceManagement from '@/components/DeviceManagement';
import { FiArrowLeft, FiShield, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

export default function DevicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/account/settings" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Quay lại cài đặt
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <FiShield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý thiết bị</h1>
              <p className="text-gray-600">Quản lý các thiết bị tin cậy và cài đặt bảo mật</p>
            </div>
          </div>
          
          {/* Security Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FiInfo className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Bảo mật thiết bị tin cậy</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• <strong>Thiết bị mới</strong> mặc định không được tin cậy và chỉ có thể tự đăng xuất</p>
                  <p>• <strong>Thiết bị tin cậy</strong> có thể quản lý và đăng xuất tất cả thiết bị khác</p>
                  <p>• <strong>Tin cậy thiết bị cá nhân</strong> (điện thoại, laptop) để bảo mật tốt hơn</p>
                  <p>• <strong>Không bao giờ tin cậy thiết bị công cộng</strong> (quán net, máy tính dùng chung)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Management Component */}
        <DeviceManagement />
      </div>
    </div>
  );
} 