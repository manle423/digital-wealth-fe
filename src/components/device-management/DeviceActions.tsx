'use client';

import React from 'react';

interface DeviceActionsProps {
  canLogoutOthers: boolean;
  loading: boolean;
  onLogoutAllOthers: () => void;
  onLogoutAll: () => void;
  onRefresh: () => void;
}

const DeviceActions: React.FC<DeviceActionsProps> = ({
  canLogoutOthers,
  loading,
  onLogoutAllOthers,
  onLogoutAll,
  onRefresh
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <button
        onClick={onRefresh}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
      
      <button
        onClick={onLogoutAllOthers}
        disabled={loading || !canLogoutOthers}
        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        title={!canLogoutOthers ? 'Only trusted devices can logout all other devices' : ''}
      >
        Logout All Other Devices
      </button>
      
      <button
        onClick={onLogoutAll}
        disabled={loading || !canLogoutOthers}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        title={!canLogoutOthers ? 'Only trusted devices can logout all devices' : ''}
      >
        Logout All Devices
      </button>
    </div>
  );
};

export default DeviceActions; 