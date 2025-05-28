'use client';

import { useEffect, useState } from 'react';
import { NetWorthSnapshot } from '@/types/net-worth.types';
import { formatCurrency } from '@/utils/format.utils';
import netWorthService from '@/services/net-worth.service';
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

export default function NetWorthHistory() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<NetWorthSnapshot[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await netWorthService.getNetWorthHistory(12); // Last 12 months
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

  if (!mounted) return null;

  if (loading || history.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const chartData: ChartData<'line'> = {
    labels: history.map(snapshot => new Date(snapshot.snapshotDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Tài sản ròng',
        data: history.map(snapshot => snapshot.netWorth),
        borderColor: '#2563eb',
        backgroundColor: '#2563eb20',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
      },
      {
        label: 'Tổng tài sản',
        data: history.map(snapshot => snapshot.totalAssets),
        borderColor: '#16a34a',
        backgroundColor: '#16a34a20',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
      },
      {
        label: 'Tổng nợ',
        data: history.map(snapshot => snapshot.totalDebts),
        borderColor: '#dc2626',
        backgroundColor: '#dc262620',
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
              label += formatCurrency(context.parsed.y);
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
            return formatCurrency(value as number);
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
    <div className="h-[400px]">
      <Line options={options} data={chartData} />
    </div>
  );
} 
