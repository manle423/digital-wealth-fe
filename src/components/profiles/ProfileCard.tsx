'use client';

import { RiskProfile, RiskProfileType } from '@/types/risk-assessment.types';

interface ProfileCardProps {
  profile: RiskProfile;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProfileCard({
  profile,
  onEdit,
  onDelete
}: ProfileCardProps) {
  const viTranslation = profile.translations.find(t => t.language === 'vi');
  const enTranslation = profile.translations.find(t => t.language === 'en');
  
  const getProfileTypeLabel = (type: RiskProfileType) => {
    const labels: Record<RiskProfileType, string> = {
      CONSERVATIVE: 'Chấp nhận rủi ro thấp',
      MODERATELY_CONSERVATIVE: 'Chấp nhận rủi ro thấp tới trung bình',
      MODERATE: 'Chấp nhận rủi ro trung bình',
      MODERATELY_AGGRESSIVE: 'Chấp nhận rủi ro cao',
      AGGRESSIVE: 'Chấp nhận rủi ro rất cao'
    };
    return labels[type];
  };

  const getProfileTypeColor = (type: RiskProfileType) => {
    const colors: Record<RiskProfileType, string> = {
      CONSERVATIVE: 'bg-green-100 text-green-800',
      MODERATELY_CONSERVATIVE: 'bg-blue-100 text-blue-800',
      MODERATE: 'bg-yellow-100 text-yellow-800',
      MODERATELY_AGGRESSIVE: 'bg-orange-100 text-orange-800',
      AGGRESSIVE: 'bg-red-100 text-red-800'
    };
    return colors[type];
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{viTranslation?.name}</h3>
          <span className={`px-2 py-1 text-xs rounded ${getProfileTypeColor(profile.type)}`}>
            {getProfileTypeLabel(profile.type)}
          </span>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Điểm số:</span>
          <span className="text-sm font-medium">{profile.minScore}-{profile.maxScore}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{viTranslation?.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-24 text-xs text-gray-600">Tiếng Anh:</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{enTranslation?.name}</p>
              <p className="text-xs text-gray-500">{enTranslation?.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-3 bg-gray-50 flex justify-end">
        <button 
          onClick={() => onEdit(profile.id)}
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium mr-4"
        >
          Sửa
        </button>
        <button 
          onClick={() => onDelete(profile.id)}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
        >
          Xóa
        </button>
      </div>
    </div>
  );
} 