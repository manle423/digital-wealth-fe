'use client';

import React from 'react';
import { DeviceSession } from '@/types/auth.types';
import { FiSmartphone, FiMonitor, FiTablet, FiGlobe, FiShield, FiShieldOff, FiLogOut, FiClock } from 'react-icons/fi';
import { DEVICE_CONSTANTS } from '@/constants/app.constants';

interface DeviceCardProps {
  device: DeviceSession;
  canLogoutOthers: boolean;
  onLogout: (deviceId: string) => void;
  onTrustToggle: (device: DeviceSession) => void;
  loading: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  canLogoutOthers,
  onLogout,
  onTrustToggle,
  loading
}) => {
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <FiSmartphone className="w-5 h-5" />;
      case 'tablet':
        return <FiTablet className="w-5 h-5" />;
      case 'desktop':
        return <FiMonitor className="w-5 h-5" />;
      case 'web':
      default:
        return <FiGlobe className="w-5 h-5" />;
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < DEVICE_CONSTANTS.LAST_ACTIVE_THRESHOLDS.NOW) {
      return 'Active now';
    } else if (diffHours < DEVICE_CONSTANTS.LAST_ACTIVE_THRESHOLDS.RECENT) {
      return `${diffHours} hours ago`;
    } else if (diffDays < DEVICE_CONSTANTS.LAST_ACTIVE_THRESHOLDS.WEEK / 24) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const canLogoutDevice = device.isCurrentSession || canLogoutOthers;

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-gray-600 mt-1">
            {getDeviceIcon(device.deviceType)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 truncate">
                {device.deviceName}
              </h3>
              {device.isCurrentSession && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Current
                </span>
              )}
              {device.isTrusted ? (
                <FiShield className="w-4 h-4 text-green-500" title="Trusted Device" />
              ) : (
                <FiShieldOff className="w-4 h-4 text-yellow-500" title="Untrusted Device" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {device.deviceModel} • {device.osVersion}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FiClock className="w-3 h-3" />
              <span>{formatLastActive(device.lastActiveAt || device.lastAccessAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {/* Trust/Untrust Button */}
          <button
            onClick={() => onTrustToggle(device)}
            disabled={loading}
            className={`px-3 py-1 text-xs rounded-md transition-colors disabled:opacity-50 ${
              device.isTrusted
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            {device.isTrusted ? 'Trusted' : 'Trust'}
          </button>
          
          {/* Logout Button */}
          <button
            onClick={() => onLogout(device.deviceId)}
            disabled={loading || !canLogoutDevice}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              !canLogoutDevice 
                ? 'Only trusted devices can logout other devices'
                : device.isCurrentSession 
                  ? 'Logout this device'
                  : 'Logout device'
            }
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard; 