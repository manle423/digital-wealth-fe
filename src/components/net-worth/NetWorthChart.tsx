'use client';

import { useEffect, useState } from 'react';
import { NetWorthSnapshot } from '@/types/net-worth.types';
import { formatCurrency } from '@/utils/format.utils';

interface NetWorthChartProps {
  history: NetWorthSnapshot[];
}

export default function NetWorthChart({ history }: NetWorthChartProps) {
  const [Chart, setChart] = useState<any>(null);
  const [chartComponents, setChartComponents] = useState<any>(null);

  useEffect(() => {
    // Dynamic import Chart.js và react-chartjs-2 sau khi component mount
    const importChart = async () => {
      try {
        const [
          { Chart: ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend },
          { Line }
        ] = await Promise.all([
          import('chart.js'),
          import('react-chartjs-2')
        ]);

        // Register components
        ChartJS.register(
          CategoryScale,
          LinearScale,
          PointElement,
          LineElement,
          Title,
          Tooltip,
          Legend
        );

        setChart(Line);
        setChartComponents({ ChartJS });
      } catch (error) {
        console.error('Error loading chart:', error);
      }
    };

    importChart();
  }, []);

  if (!Chart || !chartComponents) {
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

  const options = {
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
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
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
          callback: function(value: any) {
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
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <div className="h-[400px]">
      <Chart options={options} data={chartData} />
    </div>
  );
} 