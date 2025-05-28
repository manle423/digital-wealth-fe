'use client';

import { useEffect, useState } from 'react';
import { MetricTrendPoint } from '@/types/financial-analysis.types';
import { formatCurrency } from '@/utils/format.utils';

interface MetricChartProps {
  data: MetricTrendPoint[];
  title: string;
  color: string;
  isPercentage?: boolean;
}

export default function MetricChart({ data, title, color, isPercentage = false }: MetricChartProps) {
  const [Chart, setChart] = useState<any>(null);
  const [chartComponents, setChartComponents] = useState<any>(null);

  useEffect(() => {
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
      <div className="h-[300px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(point => new Date(point.date).toLocaleDateString()),
    datasets: [
      {
        label: title,
        data: data.map(point => point.value),
        borderColor: color,
        backgroundColor: `${color}20`,
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
          callback: function(value: any) {
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
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <div className="h-[300px]">
      <Chart options={options} data={chartData} />
    </div>
  );
} 