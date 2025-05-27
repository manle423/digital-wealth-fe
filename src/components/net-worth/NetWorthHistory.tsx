import { useEffect, useState } from 'react';
import { NetWorthSnapshot } from '@/types/net-worth.types';
import { formatCurrency } from '@/lib/utils';
import netWorthService from '@/services/net-worth.service';
import { toast } from 'sonner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function NetWorthHistory() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<NetWorthSnapshot[]>([]);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const chartData = {
    labels: history.map(snapshot => new Date(snapshot.snapshotDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Tài sản ròng',
        data: history.map(snapshot => snapshot.netWorth),
        borderColor: '#2563eb',
        backgroundColor: '#2563eb20',
        tension: 0.4,
      },
      {
        label: 'Tổng tài sản',
        data: history.map(snapshot => snapshot.totalAssets),
        borderColor: '#16a34a',
        backgroundColor: '#16a34a20',
        tension: 0.4,
      },
      {
        label: 'Tổng nợ',
        data: history.map(snapshot => snapshot.totalDebts),
        borderColor: '#dc2626',
        backgroundColor: '#dc262620',
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
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
      y: {
        ticks: {
          callback: function(value) {
            return formatCurrency(value as number);
          }
        }
      }
    }
  };

  return (
    <div className="h-[400px]">
      <Line options={options} data={chartData} />
    </div>
  );
} 