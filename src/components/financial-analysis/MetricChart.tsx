'use client';

import { MetricTrendPoint } from '@/types/financial-analysis.types';
import { formatCurrency } from '@/utils/format.utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MetricChartProps {
  data: MetricTrendPoint[];
  title: string;
  color: string;
  isPercentage?: boolean;
}

export default function MetricChart({ data, title, color, isPercentage = false }: MetricChartProps) {
  console.log('MetricChart received props:', {
    dataLength: data?.length,
    title,
    color,
    isPercentage,
    sampleData: data?.[0]
  });

  // Transform data cho Recharts
  const chartData = data.map(point => {
    const formattedDate = new Date(point.date).toLocaleDateString('vi-VN', {
      month: 'short',
      year: 'numeric'
    });

    console.log('Formatting point:', {
      original: point,
      formatted: { date: formattedDate, value: point.value }
    });

    return {
      date: formattedDate,
      value: point.value,
    };
  });

  console.log('Transformed chart data:', {
    originalLength: data?.length,
    transformedLength: chartData.length,
    sample: chartData[0]
  });

  // Custom tooltip để format giá trị
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Thời gian: ${label}`}</p>
          <p style={{ color: payload[0].color }}>
            {`${title}: ${isPercentage ? `${value.toFixed(1)}%` : formatCurrency(value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom formatter cho trục Y
  const formatYAxisTick = (value: number) => {
    if (isPercentage) {
      return `${value.toFixed(1)}%`;
    }
    
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  // If no data, show empty state
  if (!data || data.length === 0) {
    console.log('No valid chart data to display');
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickFormatter={formatYAxisTick}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            name={title}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 