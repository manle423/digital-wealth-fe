'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  FiPlus, 
  FiCreditCard, 
  FiAlertTriangle, 
  FiCalendar, 
  FiTrendingUp,
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import debtManagementService from '@/services/debt-management.service';
import { 
  Debt, 
  DebtSummary, 
  DebtFilters 
} from '@/types/debt-management.types';
import { formatCurrency } from '@/utils/format.utils';

export default function DebtsList() {
  const router = useRouter();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [summary, setSummary] = useState<DebtSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DebtFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch debts and summary in parallel
      const [debtsResponse, summaryResponse] = await Promise.all([
        debtManagementService.getDebts(filters),
        debtManagementService.getDebtSummary()
      ]);

      if (debtsResponse.success && debtsResponse.data) {
        setDebts(debtsResponse.data.debts || []);
      } else {
        toast.error(debtsResponse.message);
      }

      if (summaryResponse.success && summaryResponse.data) {
        setSummary(summaryResponse.data);
      } else {
        toast.error(summaryResponse.message);
      }
    } catch (error) {
      console.error('Error fetching debt data:', error);
      toast.error('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDebt = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khoản nợ này?')) {
      return;
    }

    try {
      const response = await debtManagementService.deleteDebt(id);
      
      if (response.success) {
        toast.success('Xóa khoản nợ thành công');
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error deleting debt:', error);
      toast.error('Đã xảy ra lỗi khi xóa khoản nợ');
    }
  };

  const getStatusColor = (status: Debt['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'PAID_OFF':
        return 'bg-blue-100 text-blue-800';
      case 'DEFAULTED':
        return 'bg-red-100 text-red-800';
      case 'RESTRUCTURED':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Debt['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động';
      case 'OVERDUE':
        return 'Quá hạn';
      case 'PAID_OFF':
        return 'Đã thanh toán';
      case 'DEFAULTED':
        return 'Vỡ nợ';
      case 'RESTRUCTURED':
        return 'Tái cấu trúc';
      case 'SUSPENDED':
        return 'Tạm dừng';
      default:
        return status;
    }
  };

  const getTypeText = (type: Debt['type']) => {
    switch (type) {
      case 'CREDIT_CARD':
        return 'Thẻ tín dụng';
      case 'PERSONAL_LOAN':
        return 'Vay cá nhân';
      case 'MORTGAGE':
        return 'Vay thế chấp';
      case 'AUTO_LOAN':
        return 'Vay mua xe';
      case 'STUDENT_LOAN':
        return 'Vay học tập';
      case 'BUSINESS_LOAN':
        return 'Vay kinh doanh';
      case 'OTHER':
        return 'Khác';
      default:
        return type;
    }
  };

  const filteredDebts = debts.filter(debt =>
    debt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debt.creditor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý nợ</h1>
          <p className="text-gray-600 mt-2">Theo dõi và quản lý các khoản nợ của bạn</p>
        </div>
        <button
          onClick={() => router.push('/account/debts/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Thêm khoản nợ
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng nợ</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(summary.totalDebt)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiCreditCard className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nợ quá hạn</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {summary.overdueCount}
                </p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(summary.overdueAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiAlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Thanh toán sắp tới</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {summary.upcomingPaymentsCount}
                </p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(summary.upcomingPaymentsAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng khoản nợ</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {debts.length}
                </p>
                <p className="text-sm text-gray-500">khoản</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debt Breakdown Chart */}
      {summary && summary.breakdown.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bổ nợ theo danh mục</h3>
          <div className="space-y-4">
            {summary.breakdown.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-1/4">
                  <span className="text-sm font-medium text-gray-700">{item.categoryName}</span>
                </div>
                <div className="w-1/2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-1/4 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {item.percentage.toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(item.totalValue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc chủ nợ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <FiFilter className="w-4 h-4" />
            Bộ lọc
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="OVERDUE">Quá hạn</option>
                <option value="PAID_OFF">Đã thanh toán</option>
                <option value="DEFAULTED">Vỡ nợ</option>
              </select>

              <select
                value={filters.type || ''}
                onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả loại nợ</option>
                <option value="CREDIT_CARD">Thẻ tín dụng</option>
                <option value="PERSONAL_LOAN">Vay cá nhân</option>
                <option value="MORTGAGE">Vay thế chấp</option>
                <option value="AUTO_LOAN">Vay mua xe</option>
                <option value="STUDENT_LOAN">Vay học tập</option>
                <option value="BUSINESS_LOAN">Vay kinh doanh</option>
                <option value="OTHER">Khác</option>
              </select>

              <select
                value={filters.sortBy || ''}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sắp xếp theo</option>
                <option value="name">Tên</option>
                <option value="currentBalance">Số dư hiện tại</option>
                <option value="dueDate">Ngày đến hạn</option>
                <option value="createdAt">Ngày tạo</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Debts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredDebts.length === 0 ? (
          <div className="text-center py-12">
            <FiCreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khoản nợ nào</h3>
            <p className="text-gray-500 mb-6">Bắt đầu bằng cách thêm khoản nợ đầu tiên của bạn</p>
            <button
              onClick={() => router.push('/account/debts/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Thêm khoản nợ
            </button>
          </div>
        ) : (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số dư hiện tại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán hàng tháng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đến hạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDebts.map((debt) => (
                  <tr key={debt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{debt.name}</div>
                        <div className="text-sm text-gray-500">{debt.creditor}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{getTypeText(debt.type)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(debt.currentBalance)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Gốc: {formatCurrency(debt.originalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatCurrency(debt.monthlyPayment)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Date(debt.dueDate).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(debt.status)}`}>
                        {getStatusText(debt.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/account/debts/${debt.id}/payment`)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Thanh toán"
                        >
                          <FiDollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/account/debts/${debt.id}/edit`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Chỉnh sửa"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDebt(debt.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Xóa"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 