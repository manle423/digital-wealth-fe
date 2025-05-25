'use client';

import React from 'react';
import { DeviceSession } from '@/types/auth.types';
import { FiAlertTriangle, FiShield } from 'react-icons/fi';

interface SecurityAlertProps {
  currentDevice: DeviceSession | null;
  onTrustDevice: (device: DeviceSession) => void;
  loading: boolean;
}

const SecurityAlert: React.FC<SecurityAlertProps> = ({
  currentDevice,
  onTrustDevice,
  loading
}) => {
  if (!currentDevice) return null;

  if (!currentDevice.isTrusted) {
    return (
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <div className="flex items-start gap-3">
          <FiAlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Untrusted Device</h3>
            <p className="text-sm text-yellow-700 mt-1">
              This device is not trusted. You can only logout this device. To manage other devices, please trust this device first.
            </p>
            <button
              onClick={() => onTrustDevice(currentDevice)}
              disabled={loading}
              className="mt-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              Trust This Device
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
      <div className="flex items-center gap-2">
        <FiShield className="w-5 h-5 text-green-600" />
        <span className="text-green-800 font-medium">Trusted Device</span>
        <span className="text-sm text-green-600">- You can manage all devices</span>
      </div>
    </div>
  );
};

export default SecurityAlert; 