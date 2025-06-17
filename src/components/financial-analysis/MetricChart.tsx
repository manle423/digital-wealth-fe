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
  // Transform và validate data cho Recharts
  const chartData = data
    .filter(point => point && point.date && typeof point.value === 'number' && !isNaN(point.value))
    .map(point => ({
      date: new Date(point.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      value: Number(point.value) || 0,
    }));

  // Custom tooltip để format giá trị
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      // Validate value before using toFixed
      const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Thời gian: ${label}`}</p>
          <p style={{ color: payload[0].color }}>
            {`${title}: ${isPercentage ? `${safeValue.toFixed(1)}%` : formatCurrency(safeValue)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom formatter cho trục Y
  const formatYAxisTick = (value: number) => {
    // Validate value before formatting
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    if (isPercentage) {
      return `${safeValue.toFixed(1)}%`;
    }
    
    if (safeValue >= 1000000000) {
      return `${(safeValue / 1000000000).toFixed(1)}B`;
    }
    if (safeValue >= 1000000) {
      return `${(safeValue / 1000000).toFixed(1)}M`;
    }
    if (safeValue >= 1000) {
      return `${(safeValue / 1000).toFixed(0)}K`;
    }
    return safeValue.toString();
  };

  // If no valid data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-gray-500">Không có dữ liệu hợp lệ để hiển thị</p>
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
            angle={-45}
            textAnchor="end"
            height={60}
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