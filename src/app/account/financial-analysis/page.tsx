'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FinancialSummary } from '@/types/financial-analysis.types';
import financialAnalysisService from '@/services/financial-analysis.service';
import FinancialSummaryComponent from '@/components/financial-analysis/FinancialSummary';
import MetricTrend from '@/components/financial-analysis/MetricTrend';

export default function FinancialAnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);

  useEffect(() => {
    fetchFinancialSummary();
  }, []);

  const fetchFinancialSummary = async () => {
    try {
      setLoading(true);
      const response = await financialAnalysisService.getFinancialSummary();
      if (response.success && response.data) {
        setSummary(response.data);
      } else {
        toast.error('Không thể tải thông tin phân tích tài chính');
      }
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      toast.error('Không thể tải thông tin phân tích tài chính');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateMetrics = async () => {
    try {
      const response = await financialAnalysisService.calculateAllMetrics();
      if (response.success) {
        toast.success('Đã tính toán lại các chỉ số tài chính');
        fetchFinancialSummary();
      } else {
        toast.error('Không thể tính toán chỉ số tài chính');
      }
    } catch (error) {
      console.error('Error calculating metrics:', error);
      toast.error('Không thể tính toán chỉ số tài chính');
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
        <h1 className="text-2xl font-bold">Phân Tích Tài Chính</h1>
        <Button onClick={handleCalculateMetrics}>Tính Toán Lại</Button>
      </div>

      {summary && <FinancialSummaryComponent data={summary} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricTrend
          type="LIQUIDITY_RATIO"
          title="Tỷ Lệ Thanh Khoản"
          isPercentage
        />
        <MetricTrend
          type="EMERGENCY_FUND_RATIO"
          title="Quỹ Dự Phòng"
          isPercentage
        />
        <MetricTrend
          type="DEBT_TO_ASSET_RATIO"
          title="Tỷ Lệ Nợ/Tài Sản"
          isPercentage
        />
        <MetricTrend
          type="INVESTMENT_RATIO"
          title="Tỷ Lệ Đầu Tư"
          isPercentage
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <MetricTrend
          type="NET_WORTH"
          title="Tài Sản Ròng"
        />
        <MetricTrend
          type="FINANCIAL_INDEPENDENCE_RATIO"
          title="Tự Do Tài Chính"
          isPercentage
        />
      </div>
    </div>
  );
} 