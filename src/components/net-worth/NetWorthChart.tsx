'use client';

import { NetWorthSnapshot } from '@/types/net-worth.types';
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

interface NetWorthChartProps {
  history: NetWorthSnapshot[];
}

export default function NetWorthChart({ history }: NetWorthChartProps) {
  // Transform data cho Recharts
  const chartData = history.map(snapshot => ({
    date: new Date(snapshot.snapshotDate).toLocaleDateString('vi-VN', {
      month: 'short',
      year: 'numeric'
    }),
    netWorth: snapshot.netWorth,
    totalAssets: snapshot.totalAssets,
    totalDebts: snapshot.totalDebts,
  }));

  // Custom tooltip để format tiền tệ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Thời gian: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom formatter cho trục Y
  const formatYAxisTick = (value: number) => {
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

  return (
    <div className="h-[400px] w-full">
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
            dataKey="netWorth"
            stroke="#2563eb"
            strokeWidth={2}
            name="Tài sản ròng"
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="totalAssets"
            stroke="#16a34a"
            strokeWidth={2}
            name="Tổng tài sản"
            dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="totalDebts"
            stroke="#dc2626"
            strokeWidth={2}
            name="Tổng nợ"
            dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 