'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { toast } from 'sonner';
import { FiCreditCard, FiAlertCircle, FiCalendar } from 'react-icons/fi';

interface Liability {
  id: string;
  name: string;
  type: string;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  dueDate: string;
  status: 'GOOD' | 'WARNING' | 'OVERDUE';
}

interface LiabilitySummary {
  totalDebt: number;
  totalMonthlyPayment: number;
  debtToIncomeRatio: number;
  debtByType: {
    type: string;
    amount: number;
    percentage: number;
  }[];
}

export default function LiabilitiesPage() {
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [summary, setSummary] = useState<LiabilitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLiabilities();
  }, []);

  const fetchLiabilities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/liabilities');
      const data = await response.json();

      if (data.success) {
        setLiabilities(data.data.liabilities);
        setSummary(data.data.summary);
      } else {
        toast.error('Không thể tải thông tin nợ');
      }
    } catch (error) {
      console.error('Error fetching liabilities:', error);
      toast.error('Đã xảy ra lỗi khi tải thông tin nợ');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const getStatusColor = (status: Liability['status']) => {
    switch (status) {
      case 'GOOD':
        return 'bg-green-100 text-green-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Liability['status']) => {
    switch (status) {
      case 'GOOD':
        return 'Tốt';
      case 'WARNING':
        return 'Cảnh báo';
      case 'OVERDUE':
        return 'Quá hạn';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tổng quan nợ</h1>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng dư nợ</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalDebt)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FiCreditCard className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng trả hàng tháng</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalMonthlyPayment)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FiCalendar className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ nợ/thu nhập</p>
                <p className={`text-2xl font-bold mt-1 ${
                  summary.debtToIncomeRatio > 0.5 ? 'text-red-600' : 
                  summary.debtToIncomeRatio > 0.3 ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {(summary.debtToIncomeRatio * 100).toFixed(1)}%
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                summary.debtToIncomeRatio > 0.5 ? 'bg-red-100' : 
                summary.debtToIncomeRatio > 0.3 ? 'bg-yellow-100' : 
                'bg-green-100'
              }`}>
                <FiAlertCircle className={`text-2xl ${
                  summary.debtToIncomeRatio > 0.5 ? 'text-red-600' : 
                  summary.debtToIncomeRatio > 0.3 ? 'text-yellow-600' : 
                  'text-green-600'
                }`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debt Distribution */}
      {summary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Phân bổ nợ theo loại</h2>
          <div className="space-y-4">
            {summary.debtByType.map((type, index) => (
              <div key={index} className="flex items-center">
                <span className="w-1/4 text-sm text-gray-600">{type.type}</span>
                <div className="w-3/4 flex items-center">
                  <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${type.percentage}%`,
                        backgroundColor: 
                          type.type.includes('Thế chấp') ? '#3B82F6' :
                          type.type.includes('Tín dụng') ? '#F59E0B' :
                          type.type.includes('Vay') ? '#10B981' :
                          '#6B7280'
                      }}
                    ></div>
                  </div>
                  <div className="ml-4 w-32 flex justify-between">
                    <span className="text-sm font-medium">{type.percentage}%</span>
                    <span className="text-sm text-gray-500">{formatCurrency(type.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liabilities List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khoản nợ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số dư
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lãi suất
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đến hạn
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {liabilities.map((liability) => (
                <tr key={liability.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{liability.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{liability.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(liability.remainingAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{liability.interestRate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(liability.status)}`}>
                      {getStatusText(liability.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(liability.dueDate).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}