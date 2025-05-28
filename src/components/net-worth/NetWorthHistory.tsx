'use client';

import { useEffect, useState } from 'react';
import { NetWorthSnapshot } from '@/types/net-worth.types';
import { formatCurrency } from '@/utils/format.utils';
import netWorthService from '@/services/net-worth.service';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// Dynamic import toàn bộ chart để tránh SSR issues
const NetWorthChart = dynamic(() => import('./NetWorthChart'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

export default function NetWorthHistory() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<NetWorthSnapshot[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await netWorthService.getNetWorthHistory(12);
      if (response.success && response.data) {
        setHistory(response.data);
      } else {
        toast.error('Không thể tải dữ liệu lịch sử');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Không thể tải thông tin lịch sử');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  return <NetWorthChart history={history} />;
} 
