import { Card } from '@/components/ui/card';
import { FinancialSummary } from '@/types/financial-analysis.types';
import { formatCurrency, formatPercentage } from '@/utils/format.utils';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

interface FinancialSummaryProps {
  data: FinancialSummary;
}

export default function FinancialSummaryComponent({ data }: FinancialSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT':
      case 'GOOD':
        return 'text-green-500';
      case 'FAIR':
        return 'text-yellow-500';
      case 'POOR':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'EXCELLENT':
      case 'GOOD':
        return <FiTrendingUp className="w-5 h-5" />;
      case 'FAIR':
        return <FiMinus className="w-5 h-5" />;
      case 'POOR':
        return <FiTrendingDown className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Tổng Quan</h3>
        <div className="mt-2">
          <p className="text-2xl font-semibold">{formatCurrency(data.overall.netWorth)}</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`font-medium ${getStatusColor(data.overall.status)}`}>
              {data.overall.financialHealthScore.toFixed(1)} điểm
            </span>
            <span className={getStatusColor(data.overall.status)}>
              {getStatusIcon(data.overall.status)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Sức khỏe tài chính: {data.overall.status}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Thanh Khoản</h3>
        <div className="mt-2">
          <p className="text-2xl font-semibold">{formatPercentage(data.liquidity.liquidityRatio)}</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`font-medium ${getStatusColor(data.liquidity.status)}`}>
              Quỹ dự phòng: {formatPercentage(data.liquidity.emergencyFundRatio)}
            </span>
            <span className={getStatusColor(data.liquidity.status)}>
              {getStatusIcon(data.liquidity.status)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Tình trạng: {data.liquidity.status}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Nợ</h3>
        <div className="mt-2">
          <p className="text-2xl font-semibold">{formatPercentage(data.debt.debtToAssetRatio)}</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`font-medium ${getStatusColor(data.debt.status)}`}>
              DTI: {formatPercentage(data.debt.debtToIncomeRatio)}
            </span>
            <span className={getStatusColor(data.debt.status)}>
              {getStatusIcon(data.debt.status)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Tình trạng: {data.debt.status}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">Đầu Tư</h3>
        <div className="mt-2">
          <p className="text-2xl font-semibold">{formatPercentage(data.investment.investmentRatio)}</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`font-medium ${getStatusColor(data.investment.status)}`}>
              Đa dạng hóa: {formatPercentage(data.investment.diversificationIndex)}
            </span>
            <span className={getStatusColor(data.investment.status)}>
              {getStatusIcon(data.investment.status)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Tình trạng: {data.investment.status}</p>
        </div>
      </Card>
    </div>
  );
} 