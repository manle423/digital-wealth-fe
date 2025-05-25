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
            Back to Settings
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <FiShield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Device Management</h1>
              <p className="text-gray-600">Manage your trusted devices and security settings</p>
            </div>
          </div>
          
          {/* Security Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FiInfo className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Trusted Device Security</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• <strong>New devices</strong> are untrusted by default and can only logout themselves</p>
                  <p>• <strong>Trusted devices</strong> can manage and logout all other devices</p>
                  <p>• <strong>Trust your personal devices</strong> (phone, laptop) for better security</p>
                  <p>• <strong>Never trust public devices</strong> (internet cafes, shared computers)</p>
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