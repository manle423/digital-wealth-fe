import { Card } from '@/components/ui/card';
import { NetWorthCurrent, NetWorthTrend } from '@/types/net-worth.types';
import { FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';
import { formatCurrency } from '@/utils/format.utils';

interface NetWorthSummaryProps {
  data: NetWorthCurrent;
  trend: NetWorthTrend;
}

export default function NetWorthSummary({ data, trend }: NetWorthSummaryProps) {
  const getTrendIcon = () => {
    switch (trend.trend) {
      case 'UP':
        return <FiArrowUp className="w-6 h-6 text-green-500" />;
      case 'DOWN':
        return <FiArrowDown className="w-6 h-6 text-red-500" />;
      default:
        return <FiMinus className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend.trend) {
      case 'UP':
        return 'text-green-500';
      case 'DOWN':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Tài Sản Ròng</h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-semibold">{formatCurrency(data.netWorth)}</p>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {trend.trend === 'DOWN' ? '-' : '+'}{Math.abs(trend.changePercentage).toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {trend.trend === 'DOWN' ? '-' : '+'}{formatCurrency(Math.abs(trend.change))} so với lần ghi nhận trước
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Tổng Tài Sản</h3>
        <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.totalAssets)}</p>
        <p className="mt-2 text-sm text-gray-500">Bao gồm tất cả các loại tài sản</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Tổng Nợ</h3>
        <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.totalDebts)}</p>
        <p className="mt-2 text-sm text-gray-500">Bao gồm tất cả các khoản nợ</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Tài Sản Thanh Khoản</h3>
        <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.liquidAssets)}</p>
        <p className="mt-2 text-sm text-gray-500">Tiền mặt & tương đương</p>
      </Card>
    </div>
  );
} 