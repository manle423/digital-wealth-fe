'use client';

import React, { useEffect } from 'react';
import { useDeviceManagement } from '@/hooks/useDeviceManagement';
import { DeviceSession } from '@/types/auth.types';
import { FiX } from 'react-icons/fi';
import { UI_CONSTANTS } from '@/constants/app.constants';
import { withErrorHandling } from '@/utils/error.utils';

// Sub-components
import DeviceCard from './device-management/DeviceCard';
import DeviceStats from './device-management/DeviceStats';
import SecurityAlert from './device-management/SecurityAlert';
import DeviceActions from './device-management/DeviceActions';

interface DeviceManagementProps {
  className?: string;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ className = '' }) => {
  const {
    devices,
    loading,
    error,
    canLogoutOthers,
    fetchDevices,
    logoutDevice,
    logoutAllDevices,
    trustDevice,
    untrustDevice,
    getDeviceStats,
    getCurrentDevice,
    clearError
  } = useDeviceManagement();

  useEffect(() => {
    fetchDevices();
  }, []);

  // Event handlers with error handling
  const handleLogoutDevice = withErrorHandling(async (deviceId: string) => {
    const targetDevice = devices.find(d => d.deviceId === deviceId);
    const isCurrentDevice = targetDevice?.isCurrentSession;
    
    if (!isCurrentDevice && !canLogoutOthers) {
      alert('Only trusted devices can logout other devices. Please trust this device first.');
      return;
    }

    const confirmMessage = isCurrentDevice 
      ? 'Are you sure you want to logout this device? You will be signed out.'
      : 'Are you sure you want to logout this device?';

    if (window.confirm(confirmMessage)) {
      await logoutDevice(deviceId);
    }
  }, { component: 'DeviceManagement', action: 'logoutDevice' });

  const handleLogoutAllOthers = withErrorHandling(async () => {
    if (!canLogoutOthers) {
      alert('Only trusted devices can logout all other devices. Please trust this device first.');
      return;
    }

    if (window.confirm('Are you sure you want to logout all other devices?')) {
      await logoutAllDevices(false);
    }
  }, { component: 'DeviceManagement', action: 'logoutAllOthers' });

  const handleLogoutAll = withErrorHandling(async () => {
    if (!canLogoutOthers) {
      alert('Only trusted devices can logout all devices. Please trust this device first.');
      return;
    }

    if (window.confirm('Are you sure you want to logout ALL devices including this one? You will be signed out.')) {
      await logoutAllDevices(true);
    }
  }, { component: 'DeviceManagement', action: 'logoutAll' });

  const handleTrustToggle = withErrorHandling(async (device: DeviceSession) => {
    if (device.isTrusted) {
      if (device.isCurrentSession) {
        if (!window.confirm('Untrusting this device will prevent you from managing other devices. Continue?')) {
          return;
        }
      }
      await untrustDevice(device.deviceId);
    } else {
      await trustDevice(device.deviceId);
    }
  }, { component: 'DeviceManagement', action: 'trustToggle' });

  // Computed values
  const stats = getDeviceStats();
  const currentDevice = getCurrentDevice();

  // Loading skeleton
  if (loading && devices.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: UI_CONSTANTS.LOADING_SKELETON_ITEMS }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Device Management</h2>
      </div>

      {/* Security Alert */}
      <SecurityAlert
        currentDevice={currentDevice || null}
        onTrustDevice={handleTrustToggle}
        loading={loading}
      />

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <DeviceStats stats={stats} />

      {/* Action Buttons */}
      <DeviceActions
        canLogoutOthers={canLogoutOthers}
        loading={loading}
        onLogoutAllOthers={handleLogoutAllOthers}
        onLogoutAll={handleLogoutAll}
        onRefresh={fetchDevices}
      />

      {/* Device List */}
      <div className="space-y-3">
        {devices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No devices found
          </div>
        ) : (
          devices.map((device) => (
            <DeviceCard
              key={device.deviceId}
              device={device}
              canLogoutOthers={canLogoutOthers}
              onLogout={handleLogoutDevice}
              onTrustToggle={handleTrustToggle}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DeviceManagement; 