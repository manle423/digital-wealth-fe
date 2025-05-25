'use client';

import React from 'react';

interface DeviceStatsProps {
  stats: {
    total: number;
    trusted: number;
    active: number;
    untrusted: number;
  };
}

const DeviceStats: React.FC<DeviceStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-sm text-blue-500">Total Devices</div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-green-600">{stats.trusted}</div>
        <div className="text-sm text-green-500">Trusted</div>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">{stats.active}</div>
        <div className="text-sm text-purple-500">Active</div>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-yellow-600">{stats.untrusted}</div>
        <div className="text-sm text-yellow-500">Untrusted</div>
      </div>
    </div>
  );
};

export default DeviceStats; 