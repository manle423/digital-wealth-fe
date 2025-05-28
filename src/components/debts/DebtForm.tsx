import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import debtManagementService from '@/services/debt-management.service';
import { 
  CreateDebtRequest, 
  DebtCategory,
  Debt
} from '@/types/debt-management.types';
import { formatNumberInput, parseFormattedNumber } from '@/utils/format.utils';

interface DebtFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Debt>;
  debtId?: string;
}

export default function DebtForm({ mode, initialData, debtId }: DebtFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<DebtCategory[]>([]);
  const [formData, setFormData] = useState<CreateDebtRequest>({
    categoryId: initialData?.category?.id || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: initialData?.type || 'PERSONAL_LOAN',
    status: initialData?.status || 'ACTIVE',
    originalAmount: initialData?.originalAmount || 0,
    currentBalance: initialData?.currentBalance || 0,
    interestRate: initialData?.interestRate || 0,
    startDate: initialData?.startDate?.split('T')[0] || '',
    dueDate: initialData?.dueDate?.split('T')[0] || '',
    monthlyPayment: initialData?.monthlyPayment || 0,
    creditor: initialData?.creditor || '',
    currency: initialData?.currency || 'VND',
    termMonths: initialData?.termMonths || 12,
    totalPaid: initialData?.totalPaid || 0,
    totalInterest: initialData?.totalInterest || 0,
    penaltyRate: initialData?.penaltyRate || 0,
    paymentMethod: initialData?.paymentMethod || '',
    notes: initialData?.notes || ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      const formattedData = { ...formData };
      ['originalAmount', 'currentBalance', 'monthlyPayment', 'totalPaid', 'totalInterest'].forEach(field => {
        const value = formData[field as keyof CreateDebtRequest];
        if (typeof value === 'number') {
          const inputElement = document.querySelector(`input[name="${field}"]`) as HTMLInputElement;
          if (inputElement) {
            inputElement.value = formatNumberInput(value.toString());
          }
        }
      });
    }
  }, [initialData, formData]);

  const fetchCategories = async () => {
    try {
      const response = await debtManagementService.getDebtCategories();
      if (response.success) {
        setCategories(response.data as DebtCategory[]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh mục nợ');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle number formatting for financial fields
    const financialFields = ['originalAmount', 'currentBalance', 'monthlyPayment', 'totalPaid', 'totalInterest'];
    if (financialFields.includes(name)) {
      const formattedValue = formatNumberInput(value);
      e.target.value = formattedValue;
      setFormData(prev => ({
        ...prev,
        [name]: parseFormattedNumber(formattedValue)
      }));
      return;
    }
    
    // Handle other numeric fields
    const numericFields = ['interestRate', 'termMonths', 'penaltyRate'];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      toast.error('Vui lòng chọn danh mục nợ');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên khoản nợ');
      return;
    }

    if (formData.originalAmount <= 0) {
      toast.error('Số tiền gốc phải lớn hơn 0');
      return;
    }

    if (formData.currentBalance > formData.originalAmount) {
      toast.error('Số dư hiện tại không thể lớn hơn số tiền gốc');
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (mode === 'create') {
        response = await debtManagementService.createDebt(formData);
      } else {
        response = await debtManagementService.updateDebt(debtId!, formData);
      }
      
      if (response.success) {
        toast.success(mode === 'create' ? 'Tạo khoản nợ thành công' : 'Cập nhật khoản nợ thành công');
        router.push('/account/debts');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error saving debt:', error);
      toast.error(`Đã xảy ra lỗi khi ${mode === 'create' ? 'tạo' : 'cập nhật'} khoản nợ`);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'create' ? 'Thêm khoản nợ mới' : 'Chỉnh sửa khoản nợ'}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === 'create' ? 'Nhập thông tin chi tiết về khoản nợ' : 'Cập nhật thông tin chi tiết về khoản nợ'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục nợ *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại nợ *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PERSONAL_LOAN">Vay cá nhân</option>
                  <option value="CREDIT_CARD">Thẻ tín dụng</option>
                  <option value="MORTGAGE">Vay thế chấp</option>
                  <option value="AUTO_LOAN">Vay mua xe</option>
                  <option value="STUDENT_LOAN">Vay học tập</option>
                  <option value="BUSINESS_LOAN">Vay kinh doanh</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên khoản nợ *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ví dụ: Thẻ tín dụng ABC Bank"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ nợ *
                </label>
                <input
                  type="text"
                  name="creditor"
                  value={formData.creditor}
                  onChange={handleInputChange}
                  required
                  placeholder="Ví dụ: ABC Bank"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Mô tả chi tiết về khoản nợ..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài chính</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền gốc (VND) *
                </label>
                <input
                  type="text"
                  name="originalAmount"
                  defaultValue={initialData?.originalAmount ? formatNumberInput(initialData.originalAmount.toString()) : '0'}
                  onChange={handleInputChange}
                  required
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số dư hiện tại (VND) *
                </label>
                <input
                  type="text"
                  name="currentBalance"
                  defaultValue={initialData?.currentBalance ? formatNumberInput(initialData.currentBalance.toString()) : '0'}
                  onChange={handleInputChange}
                  required
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lãi suất (%/năm) *
                </label>
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thanh toán hàng tháng (VND) *
                </label>
                <input
                  type="text"
                  name="monthlyPayment"
                  defaultValue={initialData?.monthlyPayment ? formatNumberInput(initialData.monthlyPayment.toString()) : '0'}
                  onChange={handleInputChange}
                  required
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kỳ hạn (tháng)
                </label>
                <input
                  type="number"
                  name="termMonths"
                  value={formData.termMonths}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lãi suất phạt (%/năm)
                </label>
                <input
                  type="number"
                  name="penaltyRate"
                  value={formData.penaltyRate}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {mode === 'edit' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tổng đã thanh toán (VND)
                    </label>
                    <input
                      type="text"
                      name="totalPaid"
                      defaultValue={initialData?.totalPaid ? formatNumberInput(initialData.totalPaid.toString()) : '0'}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tổng lãi (VND)
                    </label>
                    <input
                      type="text"
                      name="totalInterest"
                      defaultValue={initialData?.totalInterest ? formatNumberInput(initialData.totalInterest.toString()) : '0'}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thời gian</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày bắt đầu *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày đến hạn *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <input
                  type="text"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Chuyển khoản ngân hàng"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ACTIVE">Đang hoạt động</option>
                  <option value="OVERDUE">Quá hạn</option>
                  <option value="PAID_OFF">Đã thanh toán</option>
                  <option value="DEFAULTED">Vỡ nợ</option>
                  <option value="RESTRUCTURED">Tái cấu trúc</option>
                  <option value="SUSPENDED">Tạm dừng</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Ghi chú thêm về khoản nợ..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSave className="w-4 h-4" />
              )}
              {loading ? `Đang ${mode === 'create' ? 'tạo' : 'cập nhật'}...` : `${mode === 'create' ? 'Tạo' : 'Cập nhật'} khoản nợ`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 