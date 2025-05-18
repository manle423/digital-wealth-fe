'use client';

import { useState } from 'react';

// Mock data cho các câu hỏi
const mockQuestions = [
  {
    id: 1,
    text: "Bạn đang tìm kiếm loại đầu tư như thế nào?",
    type: "single_choice",
    options: ["An toàn, lợi nhuận thấp", "Cân bằng giữa an toàn và tăng trưởng", "Tăng trưởng, chấp nhận rủi ro cao"],
    weight: 3
  },
  {
    id: 2,
    text: "Khoảng thời gian bạn dự định đầu tư là bao lâu?",
    type: "single_choice",
    options: ["Dưới 1 năm", "1-3 năm", "3-5 năm", "Trên 5 năm"],
    weight: 2
  },
  {
    id: 3,
    text: "Nếu khoản đầu tư của bạn giảm 20% giá trị, bạn sẽ làm gì?",
    type: "single_choice",
    options: ["Bán ngay lập tức", "Bán một phần", "Giữ nguyên và đợi", "Mua thêm"],
    weight: 4
  },
  {
    id: 4,
    text: "Tài sản nào bạn đã từng đầu tư?",
    type: "multiple_choice",
    options: ["Tiền gửi tiết kiệm", "Trái phiếu", "Cổ phiếu", "Bất động sản", "Tiền điện tử"],
    weight: 2
  },
  {
    id: 5,
    text: "Thu nhập hàng tháng của bạn là bao nhiêu?",
    type: "single_choice",
    options: ["Dưới 10 triệu", "10-20 triệu", "20-50 triệu", "Trên 50 triệu"],
    weight: 1
  }
];

export default function RiskQuestionsPage() {
  const [questions, setQuestions] = useState(mockQuestions);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý câu hỏi đánh giá rủi ro</h1>
        <p className="text-gray-600">Tạo và quản lý các câu hỏi đánh giá khẩu vị rủi ro của khách hàng</p>
      </header>

      <div className="mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Thêm câu hỏi mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Câu hỏi
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trọng số
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lựa chọn
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {question.text}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.type === 'single_choice' ? 'Một lựa chọn' : 'Nhiều lựa chọn'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.weight}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.options.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    Sửa
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 