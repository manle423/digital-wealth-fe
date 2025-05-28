'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MetricTrendPoint, MetricType } from '@/types/financial-analysis.types';
import { formatCurrency } from '@/utils/format.utils';
import financialAnalysisService from '@/services/financial-analysis.service';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import type { ChartData, ChartOptions } from 'chart.js';

// Pre-register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dynamic import for the Line component only
const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { ssr: false }
);

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) return null;

  if (loading || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  const chartData: ChartData<'line'> = {
    labels: data.map(point => new Date(point.date).toLocaleDateString()),
    datasets: [
      {
        label: title,
        data: data.map(point => point.value),
        borderColor: METRIC_COLORS[type] ?? '#6b7280',
        backgroundColor: `${METRIC_COLORS[type] ?? '#6b7280'}20`,
        tension: 0.4,
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += isPercentage
                ? `${context.parsed.y.toFixed(1)}%`
                : formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          callback: function(value) {
            return isPercentage
              ? `${(value as number).toFixed(1)}%`
              : formatCurrency(value as number);
          }
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        borderWidth: 2,
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-[300px]">
        <Line options={options} data={chartData} />
      </div>
    </Card>
  );
} 
