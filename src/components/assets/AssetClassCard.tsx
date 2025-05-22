'use client';

import { AssetClass } from '@/types/portfolio-management.types';

interface AssetClassCardProps {
  asset: AssetClass;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AssetClassCard({
  asset,
  onEdit,
  onDelete
}: AssetClassCardProps) {
  const viTranslation = asset.translations.find(t => t.language === 'vi') || asset.translations[0];
  const enTranslation = asset.translations.find(t => t.language === 'en') || asset.translations[0];
  
  const getRiskLevelClass = (level: number) => {
    switch(level) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelText = (level: number) => {
    switch(level) {
      case 1: return 'Rất thấp';
      case 2: return 'Thấp';
      case 3: return 'Trung bình';
      case 4: return 'Cao';
      case 5: return 'Rất cao';
      default: return level.toString();
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-gray-800">{viTranslation.name}</h3>
          <span className={`px-2 py-1 text-xs rounded ${getRiskLevelClass(asset.riskLevel)}`}>
            {getRiskLevelText(asset.riskLevel)}
          </span>
        </div>
        <div className="text-sm text-gray-600">{enTranslation.name}</div>
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Lợi nhuận kỳ vọng</div>
            <div className="text-lg font-semibold text-green-600">{asset.expectedReturn}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Mức độ rủi ro</div>
            <div className="text-lg font-semibold text-orange-600">{asset.riskLevel}/5</div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{viTranslation.description}</p>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Mô tả (Tiếng Anh):</h4>
          <p className="text-sm text-gray-600">{enTranslation.description}</p>
        </div>
      </div>
      <div className="px-6 py-3 bg-gray-50 flex justify-end">
        <button 
          onClick={() => onEdit(asset.id)}
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium mr-4"
        >
          Sửa
        </button>
        <button 
          onClick={() => onDelete(asset.id)}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
        >
          Xóa
        </button>
      </div>
    </div>
  );
} 