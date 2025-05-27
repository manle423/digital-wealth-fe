'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import NetWorthSummary from '@/components/net-worth/NetWorthSummary';
import NetWorthBreakdown from '@/components/net-worth/NetWorthBreakdown';
import NetWorthHistory from '@/components/net-worth/NetWorthHistory';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import netWorthService from '@/services/net-worth.service';

export default function NetWorthPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchNetWorthSummary();
  }, []);

  const fetchNetWorthSummary = async () => {
    try {
      setLoading(true);
      const response = await netWorthService.getNetWorthSummary();
      if (response.success && response.data) {
        setSummary(response.data);
      } else {
        toast.error('Không thể tải dữ liệu tài sản ròng');
      }
    } catch (error) {
      console.error('Error fetching net worth:', error);
      toast.error('Không thể tải thông tin tài sản ròng');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnapshot = async () => {
    try {
      const response = await netWorthService.createSnapshot();
      if (response.success) {
        toast.success('Đã tạo bản ghi tài sản ròng thành công');
        fetchNetWorthSummary();
      } else {
        toast.error('Không thể tạo bản ghi');
      }
    } catch (error) {
      console.error('Error creating snapshot:', error);
      toast.error('Không thể tạo bản ghi');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tổng Quan Tài Sản Ròng</h1>
        <Button onClick={handleCreateSnapshot}>Tạo Bản Ghi</Button>
      </div>

      {summary && (
        <>
          <NetWorthSummary data={summary.current} trend={summary.trend} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Phân Tích Tài Sản</h2>
              <NetWorthBreakdown data={summary.breakdown.assets} type="assets" />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Phân Tích Nợ</h2>
              <NetWorthBreakdown data={summary.breakdown.debts} type="debts" />
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lịch Sử Tài Sản Ròng</h2>
            <NetWorthHistory />
          </Card>
        </>
      )}
    </div>
  );
} 