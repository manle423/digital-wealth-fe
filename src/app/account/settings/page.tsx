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
      title: 'Profile Settings',
      description: 'Update your personal information and preferences',
      icon: <FiUser className="w-6 h-6" />,
      href: '/account/profile',
      color: 'text-blue-600'
    },
    {
      title: 'Device Management',
      description: 'Manage your logged-in devices and security',
      icon: <FiSmartphone className="w-6 h-6" />,
      href: '/account/settings/devices',
      color: 'text-green-600'
    },
    {
      title: 'Security Settings (Coming Soon)',
      description: 'Password, two-factor authentication, and security',
      icon: <FiShield className="w-6 h-6" />,
      href: '/account/settings/security',
      color: 'text-red-600'
    },
    {
      title: 'Notifications (Coming Soon)',
      description: 'Configure your notification preferences',
      icon: <FiBell className="w-6 h-6" />,
      href: '/account/settings/notifications',
      color: 'text-yellow-600'
    },
    {
      title: 'Privacy Settings (Coming Soon)',
      description: 'Control your privacy and data sharing preferences',
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
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiSettings className="w-8 h-8" />
            Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/account/settings/devices"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiSmartphone className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">View Devices</span>
              </div>
            </Link>
            <Link
              href="/account/settings/security"
              className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiShield className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-900">Security Check</span>
              </div>
            </Link>
            <Link
              href="/account/profile"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiUser className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Edit Profile</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 