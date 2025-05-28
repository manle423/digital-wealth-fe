'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MetricTrendPoint, MetricType } from '@/types/financial-analysis.types';
import { formatCurrency } from '@/utils/format.utils';
import financialAnalysisService from '@/services/financial-analysis.service';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// Dynamic import chart component
const MetricChart = dynamic(() => import('./MetricChart'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

interface MetricTrendProps {
  type: MetricType;
  title: string;
  isPercentage?: boolean;
  months?: number;
}

const METRIC_COLORS: Partial<Record<MetricType, string>> = {
  LIQUIDITY_RATIO: '#3b82f6',
  EMERGENCY_FUND_RATIO: '#10b981',
  DEBT_TO_ASSET_RATIO: '#ef4444',
  DEBT_TO_INCOME_RATIO: '#f97316',
  INVESTMENT_RATIO: '#8b5cf6',
  DIVERSIFICATION_INDEX: '#06b6d4',
  NET_WORTH: '#2563eb',
  FINANCIAL_INDEPENDENCE_RATIO: '#059669',
};

export default function MetricTrend({ type, title, isPercentage = false, months = 12 }: MetricTrendProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MetricTrendPoint[]>([]);

  useEffect(() => {
    fetchTrendData();
  }, [type, months]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      const response = await financialAnalysisService.getMetricTrend(type, months);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        toast.error('Không thể tải dữ liệu xu hướng');
      }
    } catch (error) {
      console.error('Error fetching trend data:', error);
      toast.error('Không thể tải dữ liệu xu hướng');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <MetricChart 
        data={data}
        title={title}
        color={METRIC_COLORS[type] ?? '#6b7280'}
        isPercentage={isPercentage}
      />
    </Card>
  );
} 
