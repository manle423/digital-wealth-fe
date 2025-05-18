'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Risk Management System',
    logoUrl: '',
    contactEmail: 'admin@example.com',
    enableRegistration: true,
    requireEmailVerification: true,
    defaultRiskProfile: 'moderate'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    newUserAlert: true,
    riskAssessmentCompleted: true,
    profileChanges: true,
    securityAlerts: true,
    marketUpdates: false
  });
  
  const [apiSettings, setApiSettings] = useState({
    apiKey: 'sk_test_123456789abcdef',
    webhookUrl: 'https://example.com/webhook',
    enableLogging: true,
    rateLimitPerMinute: 60,
    timeoutSeconds: 30
  });
  
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h1>
        <p className="text-gray-600">Quản lý cài đặt và cấu hình hệ thống</p>
      </header>
      
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'general' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('general')}
          >
            Chung
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'notifications' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('notifications')}
          >
            Thông báo
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'api' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('api')}
          >
            API
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'security' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('security')}
          >
            Bảo mật
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'backup' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('backup')}
          >
            Sao lưu & Phục hồi
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-800">Cài đặt chung</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên hệ thống
                  </label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Logo
                  </label>
                  <input
                    type="text"
                    value={generalSettings.logoUrl}
                    onChange={(e) => setGeneralSettings({...generalSettings, logoUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hồ sơ rủi ro mặc định
                  </label>
                  <select
                    value={generalSettings.defaultRiskProfile}
                    onChange={(e) => setGeneralSettings({...generalSettings, defaultRiskProfile: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="conservative">Thận trọng</option>
                    <option value="moderate">Cân bằng</option>
                    <option value="aggressive">Tăng trưởng</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="enableRegistration"
                      checked={generalSettings.enableRegistration}
                      onChange={(e) => setGeneralSettings({...generalSettings, enableRegistration: e.target.checked})}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="enableRegistration" className="text-sm text-gray-700">
                      Cho phép đăng ký người dùng mới
                    </label>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="requireEmailVerification"
                      checked={generalSettings.requireEmailVerification}
                      onChange={(e) => setGeneralSettings({...generalSettings, requireEmailVerification: e.target.checked})}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="requireEmailVerification" className="text-sm text-gray-700">
                      Yêu cầu xác minh email
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Lưu cài đặt
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-800">Cài đặt thông báo</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Kích hoạt thông báo email</h3>
                    <p className="text-xs text-gray-500">Cho phép hệ thống gửi email thông báo</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="enableEmailNotifications"
                      id="enableEmailNotifications"
                      checked={notificationSettings.enableEmailNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, enableEmailNotifications: e.target.checked})}
                      className="sr-only"
                    />
                    <label
                      htmlFor="enableEmailNotifications"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${notificationSettings.enableEmailNotifications ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${notificationSettings.enableEmailNotifications ? 'translate-x-4' : 'translate-x-0'}`}></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Thông báo người dùng mới</h3>
                    <p className="text-xs text-gray-500">Nhận thông báo khi có người dùng mới đăng ký</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="newUserAlert"
                      id="newUserAlert"
                      checked={notificationSettings.newUserAlert}
                      onChange={(e) => setNotificationSettings({...notificationSettings, newUserAlert: e.target.checked})}
                      className="sr-only"
                    />
                    <label
                      htmlFor="newUserAlert"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${notificationSettings.newUserAlert ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${notificationSettings.newUserAlert ? 'translate-x-4' : 'translate-x-0'}`}></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Đánh giá rủi ro hoàn thành</h3>
                    <p className="text-xs text-gray-500">Nhận thông báo khi có đánh giá rủi ro mới</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="riskAssessmentCompleted"
                      id="riskAssessmentCompleted"
                      checked={notificationSettings.riskAssessmentCompleted}
                      onChange={(e) => setNotificationSettings({...notificationSettings, riskAssessmentCompleted: e.target.checked})}
                      className="sr-only"
                    />
                    <label
                      htmlFor="riskAssessmentCompleted"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${notificationSettings.riskAssessmentCompleted ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${notificationSettings.riskAssessmentCompleted ? 'translate-x-4' : 'translate-x-0'}`}></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Lưu cài đặt
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-800">Cài đặt API</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key (Chỉ hiển thị một lần)
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={apiSettings.apiKey}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300">
                      Sao chép
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="text"
                    value={apiSettings.webhookUrl}
                    onChange={(e) => setApiSettings({...apiSettings, webhookUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới hạn yêu cầu/phút
                  </label>
                  <input
                    type="number"
                    value={apiSettings.rateLimitPerMinute}
                    onChange={(e) => setApiSettings({...apiSettings, rateLimitPerMinute: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian chờ (giây)
                  </label>
                  <input
                    type="number"
                    value={apiSettings.timeoutSeconds}
                    onChange={(e) => setApiSettings({...apiSettings, timeoutSeconds: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Lưu cài đặt
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-800">Cài đặt bảo mật</h2>
              <p className="text-gray-600">Đang phát triển</p>
            </div>
          )}
          
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-800">Sao lưu & Phục hồi</h2>
              <p className="text-gray-600">Đang phát triển</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 