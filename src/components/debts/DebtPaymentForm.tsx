'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FiArrowLeft, FiDollarSign, FiCreditCard, FiCalendar } from 'react-icons/fi';
import { Debt, UpdateBalanceRequest } from '@/types/debt-management.types';
import debtManagementService from '@/services/debt-management.service';
import { formatCurrency } from '@/utils/format.utils';

interface DebtPaymentFormProps {
  debtId: string;
}

export default function DebtPaymentForm({ debtId }: DebtPaymentFormProps) {
  const router = useRouter();
  
  const [debt, setDebt] = useState<Debt | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState<UpdateBalanceRequest>({
    currentBalance: 0,
    lastPaymentDate: new Date().toISOString().split('T')[0],
    paymentAmount: 0,
    notes: ''
  });

  useEffect(() => {
    fetchDebt();
  }, [debtId]);

  const fetchDebt = async () => {
    try {
      setLoading(true);
      const response = await debtManagementService.getDebtById(debtId);
      
      if (response.success && response.data) {
        const debtData = response.data;
        setDebt(debtData);
        setPaymentData(prev => ({
          ...prev,
          currentBalance: debtData.currentBalance
        }));
      } else {
        toast.error(response.message);
        router.push('/account/debts');
      }
    } catch (error) {
      console.error('Error fetching debt:', error);
      toast.error('Không thể tải thông tin khoản nợ');
      router.push('/account/debts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'paymentAmount') {
      const amount = parseFloat(value) || 0;
      const newBalance = Math.max(0, (debt?.currentBalance || 0) - amount);
      
      setPaymentData(prev => ({
        ...prev,
        paymentAmount: amount,
        currentBalance: newBalance
      }));
    } else if (name === 'currentBalance') {
      const newBalance = parseFloat(value) || 0;
      const paymentAmount = Math.max(0, (debt?.currentBalance || 0) - newBalance);
      
      setPaymentData(prev => ({
        ...prev,
        currentBalance: newBalance,
        paymentAmount: paymentAmount
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!debt) return;

    if (paymentData.paymentAmount <= 0) {
      toast.error('Số tiền thanh toán phải lớn hơn 0');
      return;
    }

    if (paymentData.currentBalance < 0) {
      toast.error('Số dư không thể âm');
      return;
    }

    if (paymentData.currentBalance > debt.currentBalance) {
      toast.error('Số dư mới không thể lớn hơn số dư hiện tại');
      return;
    }

    try {
      setSubmitting(true);
      const response = await debtManagementService.updateDebtBalance(debtId, paymentData);
      
      if (response.success) {
        toast.success('Thanh toán thành công');
        router.push('/account/debts');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error making payment:', error);
      toast.error('Đã xảy ra lỗi khi thanh toán');
    } finally {
      setSubmitting(false);
    }
  };

  const getQuickPaymentOptions = () => {
    if (!debt) return [];
    
    const monthlyPayment = debt.monthlyPayment;
    const currentBalance = debt.currentBalance;
    
    return [
      {
        label: 'Thanh toán tối thiểu',
        amount: Math.min(monthlyPayment, currentBalance),
        description: 'Thanh toán hàng tháng'
      },
      {
        label: 'Thanh toán 50%',
        amount: Math.min(currentBalance * 0.5, currentBalance),
        description: '50% số dư hiện tại'
      },
      {
        label: 'Thanh toán toàn bộ',
        amount: currentBalance,
        description: 'Trả hết nợ'
      }
    ];
  };

  const handleQuickPayment = (amount: number) => {
    const newBalance = Math.max(0, (debt?.currentBalance || 0) - amount);
    setPaymentData(prev => ({
      ...prev,
      paymentAmount: amount,
      currentBalance: newBalance
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!debt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy khoản nợ</h1>
          <button
            onClick={() => router.push('/account/debts')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Quay lại danh sách nợ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán nợ</h1>
          <p className="text-gray-600 mt-2">{debt.name} - {debt.creditor}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Debt Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khoản nợ</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiCreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số dư hiện tại</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(debt.currentBalance)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thanh toán hàng tháng</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(debt.monthlyPayment)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày đến hạn</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(debt.dueDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số tiền gốc:</span>
                  <span className="font-medium">{formatCurrency(debt.originalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Đã thanh toán:</span>
                  <span className="font-medium">{formatCurrency(debt.totalPaid)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Lãi suất:</span>
                  <span className="font-medium">{debt.interestRate}%/năm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Payment Options */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tùy chọn thanh toán nhanh</h3>
            <div className="space-y-3">
              {getQuickPaymentOptions().map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPayment(option.amount)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    <p className="font-semibold text-blue-600">
                      {formatCurrency(option.amount)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin thanh toán</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền thanh toán (VND) *
                  </label>
                  <input
                    type="number"
                    name="paymentAmount"
                    value={paymentData.paymentAmount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max={debt.currentBalance}
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tối đa: {formatCurrency(debt.currentBalance)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số dư sau thanh toán (VND)
                  </label>
                  <input
                    type="number"
                    name="currentBalance"
                    value={paymentData.currentBalance}
                    onChange={handleInputChange}
                    min="0"
                    max={debt.currentBalance}
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày thanh toán *
                  </label>
                  <input
                    type="date"
                    name="lastPaymentDate"
                    value={paymentData.lastPaymentDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiến độ thanh toán
                  </label>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((debt.originalAmount - paymentData.currentBalance) / debt.originalAmount) * 100}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {(((debt.originalAmount - paymentData.currentBalance) / debt.originalAmount) * 100).toFixed(1)}% đã thanh toán
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú thanh toán
                </label>
                <textarea
                  name="notes"
                  value={paymentData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Ghi chú về khoản thanh toán này..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Tóm tắt thanh toán</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số dư hiện tại:</span>
                    <span className="font-medium">{formatCurrency(debt.currentBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền thanh toán:</span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(paymentData.paymentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-900 font-medium">Số dư sau thanh toán:</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(paymentData.currentBalance)}
                    </span>
                  </div>
                  {paymentData.currentBalance === 0 && (
                    <div className="text-center text-green-600 font-medium mt-2">
                      🎉 Chúc mừng! Bạn đã trả hết nợ!
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting || paymentData.paymentAmount <= 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiDollarSign className="w-4 h-4" />
                  )}
                  {submitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 