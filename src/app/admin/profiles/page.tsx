'use client';

import { useState } from 'react';

// Mock data cho risk profiles
const mockProfiles = [
  {
    id: 1,
    name: "Thận trọng",
    minScore: 0,
    maxScore: 20,
    description: "Nhà đầu tư thận trọng thường ưu tiên bảo toàn vốn và chấp nhận lợi nhuận thấp để đảm bảo an toàn.",
    recommendedAllocation: {
      stocks: 20,
      bonds: 50,
      cash: 25,
      alternatives: 5
    },
    totalUsers: 312
  },
  {
    id: 2,
    name: "Cân bằng thận trọng",
    minScore: 21,
    maxScore: 40,
    description: "Nhà đầu tư cân bằng thận trọng chấp nhận một số rủi ro để đạt lợi nhuận cao hơn, nhưng vẫn ưu tiên sự ổn định.",
    recommendedAllocation: {
      stocks: 35,
      bonds: 40,
      cash: 15,
      alternatives: 10
    },
    totalUsers: 495
  },
  {
    id: 3,
    name: "Cân bằng",
    minScore: 41,
    maxScore: 60,
    description: "Nhà đầu tư cân bằng tìm kiếm sự kết hợp giữa tăng trưởng và bảo toàn vốn, chấp nhận một mức độ rủi ro vừa phải.",
    recommendedAllocation: {
      stocks: 50,
      bonds: 30,
      cash: 10,
      alternatives: 10
    },
    totalUsers: 687
  },
  {
    id: 4,
    name: "Tăng trưởng",
    minScore: 61,
    maxScore: 80,
    description: "Nhà đầu tư tăng trưởng ưu tiên gia tăng giá trị danh mục và chấp nhận rủi ro đáng kể để đạt được lợi nhuận cao hơn.",
    recommendedAllocation: {
      stocks: 70,
      bonds: 15,
      cash: 5,
      alternatives: 10
    },
    totalUsers: 421
  },
  {
    id: 5,
    name: "Tăng trưởng tích cực",
    minScore: 81,
    maxScore: 100,
    description: "Nhà đầu tư tăng trưởng tích cực hướng đến lợi nhuận cao nhất và sẵn sàng chấp nhận biến động lớn.",
    recommendedAllocation: {
      stocks: 85,
      bonds: 5,
      cash: 5,
      alternatives: 5
    },
    totalUsers: 239
  }
];

export default function RiskProfilesPage() {
  const [profiles, setProfiles] = useState(mockProfiles);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý hồ sơ rủi ro</h1>
        <p className="text-gray-600">Tạo và quản lý các hồ sơ rủi ro của khách hàng</p>
      </header>

      <div className="mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Thêm hồ sơ mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{profile.name}</h3>
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                  {profile.totalUsers} người dùng
                </span>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Điểm số:</span>
                <span className="text-sm font-medium">{profile.minScore}-{profile.maxScore}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{profile.description}</p>
              
              <h4 className="text-sm font-medium mb-2">Phân bổ tài sản đề xuất:</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600">Cổ phiếu:</div>
                  <div className="flex-1 h-4 bg-gray-200 rounded">
                    <div 
                      className="h-4 bg-blue-500 rounded" 
                      style={{ width: `${profile.recommendedAllocation.stocks}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-xs text-right">{profile.recommendedAllocation.stocks}%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600">Trái phiếu:</div>
                  <div className="flex-1 h-4 bg-gray-200 rounded">
                    <div 
                      className="h-4 bg-green-500 rounded" 
                      style={{ width: `${profile.recommendedAllocation.bonds}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-xs text-right">{profile.recommendedAllocation.bonds}%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600">Tiền mặt:</div>
                  <div className="flex-1 h-4 bg-gray-200 rounded">
                    <div 
                      className="h-4 bg-yellow-500 rounded" 
                      style={{ width: `${profile.recommendedAllocation.cash}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-xs text-right">{profile.recommendedAllocation.cash}%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600">Thay thế:</div>
                  <div className="flex-1 h-4 bg-gray-200 rounded">
                    <div 
                      className="h-4 bg-purple-500 rounded" 
                      style={{ width: `${profile.recommendedAllocation.alternatives}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-xs text-right">{profile.recommendedAllocation.alternatives}%</div>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end">
              <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium mr-4">
                Sửa
              </button>
              <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 