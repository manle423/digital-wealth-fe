import { NetWorthBreakdownItem } from '@/types/net-worth.types';
import { formatCurrency } from '@/utils/format.utils';

interface NetWorthBreakdownProps {
  data: NetWorthBreakdownItem[];
  type: 'assets' | 'debts';
}

export default function NetWorthBreakdown({ data, type }: NetWorthBreakdownProps) {
  const getBarColor = (index: number) => {
    const colors = type === 'assets' 
      ? ['bg-blue-500', 'bg-green-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500']
      : ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-rose-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.categoryId} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.categoryName}</span>
            <span className="text-gray-500">
              {formatCurrency(item.totalValue)} ({item.percentage.toFixed(1)}%)
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(index)} transition-all duration-500`}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {type === 'assets' ? item.assetCount : item.count} {type === 'assets' ? 'assets' : 'debts'}
          </p>
        </div>
      ))}
    </div>
  );
} 