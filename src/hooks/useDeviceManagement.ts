import { useState, useEffect } from 'react';
import { DeviceSession } from '@/types/auth.types';
import authService from '@/services/auth.service';
import { getDeviceInfo } from '@/utils/device.utils';

// Transform API response to component-compatible format
const transformDeviceSession = (device: DeviceSession, currentDeviceId: string): DeviceSession => {
  return {
    ...device,
    // Create deviceInfo object for backward compatibility
    deviceInfo: {
      deviceId: device.deviceId,
      deviceType: device.deviceType,
      deviceName: device.deviceName,
      deviceModel: device.deviceModel,
      osVersion: device.osVersion,
      appVersion: device.appVersion,
    },
    // Map lastAccessAt to lastActiveAt for backward compatibility
    lastActiveAt: device.lastAccessAt,
    // Use API's isCurrentDevice field
    isCurrentSession: device.isCurrentDevice,
  };
};

export function useDeviceManagement() {
  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>('');
  const [canLogoutOthers, setCanLogoutOthers] = useState<boolean>(false);

  // Get current device ID
  useEffect(() => {
    const deviceInfo = getDeviceInfo();
    setCurrentDeviceId(deviceInfo.deviceId);
  }, []);

  // Fetch all devices
  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.getDevices();
      if (response.success && response.data) {
        const { devices: deviceList, currentDeviceCanLogoutOthers } = response.data;
        
        // Transform API data to component format
        const transformedDevices = deviceList.map(device => 
          transformDeviceSession(device, currentDeviceId)
        );
        
        setDevices(transformedDevices);
        setCanLogoutOthers(currentDeviceCanLogoutOthers);
      } else {
        setError(response.message || 'Failed to fetch devices');
      }
    } catch (err) {
      setError('An error occurred while fetching devices');
    } finally {
      setLoading(false);
    }
  };

  // Logout from a specific device
  const logoutDevice = async (deviceId: string) => {
    // Check if this is current device (always allowed) or if current device can logout others
    const targetDevice = devices.find(d => d.deviceId === deviceId);
    const isCurrentDevice = targetDevice?.isCurrentSession;
    
    // Rule: User can always logout current device, but only trusted devices can logout other devices
    if (!isCurrentDevice && !canLogoutOthers) {
      setError('Only trusted devices can logout other devices. Please trust this device first.');
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.logoutDevice(deviceId);
      if (response.success) {
        // Remove the device from the list
        setDevices(prev => prev.filter(device => device.deviceId !== deviceId));
        return true;
      } else {
        setError(response.message || 'Failed to logout device');
        return false;
      }
    } catch (err) {
      setError('An error occurred while logging out device');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout from all devices (with option to include current device)
  const logoutAllDevices = async (includeCurrentDevice: boolean = false) => {
    // Rule: Only trusted devices can logout all other devices
    if (!canLogoutOthers) {
      setError('Only trusted devices can logout all other devices. Please trust this device first.');
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.logoutAllDevices(includeCurrentDevice);
      if (response.success) {
        if (includeCurrentDevice) {
          // Clear all devices (including current)
          setDevices([]);
        } else {
          // Keep only current device (default behavior)
          setDevices(prev => prev.filter(device => device.isCurrentSession));
        }
        return true;
      } else {
        setError(response.message || 'Failed to logout all devices');
        return false;
      }
    } catch (err) {
      setError('An error occurred while logging out all devices');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Trust a device
  const trustDevice = async (deviceId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.trustDevice(deviceId);
      if (response.success) {
        // Update the device in the list
        setDevices(prev => prev.map(device => 
          device.deviceId === deviceId 
            ? { ...device, isTrusted: true, trustedAt: new Date().toISOString() }
            : device
        ));
        
        // If we just trusted the current device, update canLogoutOthers
        const trustedDevice = devices.find(d => d.deviceId === deviceId);
        if (trustedDevice?.isCurrentSession) {
          setCanLogoutOthers(true);
        }
        
        return true;
      } else {
        setError(response.message || 'Failed to trust device');
        return false;
      }
    } catch (err) {
      setError('An error occurred while trusting device');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Untrust a device
  const untrustDevice = async (deviceId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.untrustDevice(deviceId);
      if (response.success) {
        // Update the device in the list
        setDevices(prev => prev.map(device => 
          device.deviceId === deviceId 
            ? { ...device, isTrusted: false, trustedAt: null }
            : device
        ));
        
        // If we just untrusted the current device, update canLogoutOthers
        const untrustedDevice = devices.find(d => d.deviceId === deviceId);
        if (untrustedDevice?.isCurrentSession) {
          setCanLogoutOthers(false);
        }
        
        return true;
      } else {
        setError(response.message || 'Failed to untrust device');
        return false;
      }
    } catch (err) {
      setError('An error occurred while untrusting device');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get device statistics
  const getDeviceStats = () => {
    const totalDevices = devices.length;
    const trustedDevices = devices.filter(device => device.isTrusted).length;
    const activeDevices = devices.filter(device => {
      const lastActive = new Date(device.lastActiveAt || device.lastAccessAt);
      const now = new Date();
      const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
      return diffHours < 24; // Active in last 24 hours
    }).length;

    return {
      total: totalDevices,
      trusted: trustedDevices,
      active: activeDevices,
      untrusted: totalDevices - trustedDevices
    };
  };

  // Get current device info
  const getCurrentDevice = () => {
    return devices.find(device => device.isCurrentSession);
  };

  return {
    devices,
    loading,
    error,
    currentDeviceId,
    canLogoutOthers,
    fetchDevices,
    logoutDevice,
    logoutAllDevices,
    trustDevice,
    untrustDevice,
    getDeviceStats,
    getCurrentDevice,
    clearError: () => setError(null)
  };
} 