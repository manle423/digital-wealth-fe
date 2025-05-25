import { DeviceInfo, DeviceType } from "@/types/auth.types";

/**
 * Generate a unique device fingerprint for web browsers
 */
function generateWebDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server-side-' + Math.random().toString(36).substring(2, 15);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.maxTouchPoints || 0,
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return 'web_' + Math.abs(hash).toString(36);
}

/**
 * Detect device type based on user agent and screen size
 */
function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') {
    return 'web';
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = screen.width;

  // Mobile detection
  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    // Tablet detection (larger screens)
    if (screenWidth >= 768 || /ipad/i.test(userAgent)) {
      return 'tablet';
    }
    return 'mobile';
  }

  // Desktop detection
  if (screenWidth >= 1024) {
    return 'desktop';
  }

  return 'web';
}

/**
 * Get device name based on user agent
 */
function getDeviceName(): string {
  if (typeof window === 'undefined') {
    return 'Server';
  }

  const userAgent = navigator.userAgent;
  
  // iOS devices
  if (/iPhone/i.test(userAgent)) {
    return 'iPhone';
  }
  if (/iPad/i.test(userAgent)) {
    return 'iPad';
  }
  
  // Android devices
  if (/Android/i.test(userAgent)) {
    const match = userAgent.match(/Android.*?;\s*(.*?)\s*Build/);
    if (match && match[1]) {
      return match[1].trim();
    }
    return 'Android Device';
  }
  
  // Desktop browsers
  const platform = navigator.platform;
  if (/Win/i.test(platform)) {
    return 'Windows PC';
  }
  if (/Mac/i.test(platform)) {
    return 'Mac';
  }
  if (/Linux/i.test(platform)) {
    return 'Linux PC';
  }
  
  return 'Unknown Device';
}

/**
 * Get OS version
 */
function getOSVersion(): string {
  if (typeof window === 'undefined') {
    return 'Unknown';
  }

  const userAgent = navigator.userAgent;
  
  // iOS
  const iosMatch = userAgent.match(/OS (\d+_\d+_?\d*)/);
  if (iosMatch) {
    return 'iOS ' + iosMatch[1].replace(/_/g, '.');
  }
  
  // Android
  const androidMatch = userAgent.match(/Android (\d+\.?\d*\.?\d*)/);
  if (androidMatch) {
    return 'Android ' + androidMatch[1];
  }
  
  // Windows
  if (/Windows NT/i.test(userAgent)) {
    const winMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (winMatch) {
      const version = winMatch[1];
      const windowsVersions: { [key: string]: string } = {
        '10.0': 'Windows 11/10',
        '6.3': 'Windows 8.1',
        '6.2': 'Windows 8',
        '6.1': 'Windows 7'
      };
      return windowsVersions[version] || 'Windows ' + version;
    }
    return 'Windows';
  }
  
  // macOS
  const macMatch = userAgent.match(/Mac OS X (\d+_\d+_?\d*)/);
  if (macMatch) {
    return 'macOS ' + macMatch[1].replace(/_/g, '.');
  }
  
  return navigator.platform || 'Unknown';
}

/**
 * Get current app version (you should replace this with your actual app version)
 */
function getAppVersion(): string {
  // In a real app, this would come from your build process or package.json
  return process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
}

/**
 * Generate complete device information
 */
export function generateDeviceInfo(): DeviceInfo {
  const deviceType = detectDeviceType();
  
  return {
    deviceId: generateWebDeviceFingerprint(),
    deviceType,
    deviceName: getDeviceName(),
    deviceModel: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
    osVersion: getOSVersion(),
    appVersion: getAppVersion()
  };
}

/**
 * Store device info in localStorage for persistence
 */
export function storeDeviceInfo(deviceInfo: DeviceInfo): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
  }
}

/**
 * Get stored device info from localStorage
 */
export function getStoredDeviceInfo(): DeviceInfo | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const stored = localStorage.getItem('deviceInfo');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Get or generate device info (with caching)
 */
export function getDeviceInfo(): DeviceInfo {
  // Try to get from localStorage first
  const stored = getStoredDeviceInfo();
  if (stored) {
    return stored;
  }
  
  // Generate new device info
  const deviceInfo = generateDeviceInfo();
  storeDeviceInfo(deviceInfo);
  
  return deviceInfo;
} 