'use client';

import { useState } from 'react';

// Mock data cho asset classes
const mockAssets = [
  {
    id: 1,
    name: "Cổ phiếu Việt Nam",
    type: "equity",
    riskLevel: "high",
    expectedReturn: 12.5,
    volatility: 18.2,
    description: "Cổ phiếu của các công ty niêm yết trên thị trường chứng khoán Việt Nam.",
    subClasses: ["VN30", "Midcap", "Smallcap"]
  },
  {
    id: 2,
    name: "Cổ phiếu Mỹ",
    type: "equity",
    riskLevel: "high",
    expectedReturn: 10.0,
    volatility: 16.5,
    description: "Cổ phiếu của các công ty niêm yết trên thị trường chứng khoán Mỹ.",
    subClasses: ["S&P 500", "NASDAQ", "Dow Jones"]
  },
  {
    id: 3,
    name: "Trái phiếu chính phủ",
    type: "fixed_income",
    riskLevel: "low",
    expectedReturn: 3.5,
    volatility: 4.0,
    description: "Trái phiếu do chính phủ Việt Nam phát hành.",
    subClasses: ["Ngắn hạn", "Trung hạn", "Dài hạn"]
  },
  {
    id: 4,
    name: "Trái phiếu doanh nghiệp",
    type: "fixed_income",
    riskLevel: "medium",
    expectedReturn: 7.2,
    volatility: 8.5,
    description: "Trái phiếu do các doanh nghiệp Việt Nam phát hành.",
    subClasses: ["Xếp hạng cao", "Xếp hạng trung bình", "Xếp hạng thấp"]
  },
  {
    id: 5,
    name: "Bất động sản",
    type: "alternative",
    riskLevel: "high",
    expectedReturn: 11.0,
    volatility: 15.0,
    description: "Đầu tư vào bất động sản thông qua quỹ đầu tư hoặc chứng chỉ quỹ bất động sản.",
    subClasses: ["Nhà ở", "Thương mại", "Văn phòng"]
  },
  {
    id: 6,
    name: "Tiền gửi",
    type: "cash",
    riskLevel: "very_low",
    expectedReturn: 3.0,
    volatility: 0.5,
    description: "Tiền gửi tại các ngân hàng thương mại có kỳ hạn.",
    subClasses: ["Không kỳ hạn", "Ngắn hạn", "Dài hạn"]
  },
];

export default function AssetClassesPage() {
  const [assets, setAssets] = useState(mockAssets);
  const [filter, setFilter] = useState('all');

  const getRiskLevelClass = (level: string) => {
    switch(level) {
      case 'very_low': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'very_high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch(level) {
      case 'very_low': return 'Rất thấp';
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      case 'very_high': return 'Rất cao';
      default: return level;
    }
  };

  const getTypeText = (type: string) => {
    switch(type) {
      case 'equity': return 'Cổ phiếu';
      case 'fixed_income': return 'Thu nhập cố định';
      case 'alternative': return 'Thay thế';
      case 'cash': return 'Tiền mặt';
      default: return type;
    }
  };

  const filteredAssets = filter === 'all' 
    ? assets 
    : assets.filter(asset => asset.type === filter);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý lớp tài sản</h1>
        <p className="text-gray-600">Tạo và quản lý các lớp tài sản đầu tư</p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'equity' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilter('equity')}
          >
            Cổ phiếu
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'fixed_income' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilter('fixed_income')}
          >
            Thu nhập cố định
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'alternative' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilter('alternative')}
          >
            Thay thế
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'cash' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilter('cash')}
          >
            Tiền mặt
          </button>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Thêm lớp tài sản
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold text-gray-800">{asset.name}</h3>
                <span className={`px-2 py-1 text-xs rounded ${getRiskLevelClass(asset.riskLevel)}`}>
                  {getRiskLevelText(asset.riskLevel)}
                </span>
              </div>
              <div className="text-sm text-gray-600">{getTypeText(asset.type)}</div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Lợi nhuận kỳ vọng</div>
                  <div className="text-lg font-semibold text-green-600">{asset.expectedReturn}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Biến động</div>
                  <div className="text-lg font-semibold text-orange-600">{asset.volatility}%</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Phân loại phụ:</h4>
                <div className="flex flex-wrap gap-2">
                  {asset.subClasses.map((subClass, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {subClass}
                    </span>
                  ))}
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