'use client';

import { RiskProfileType } from '@/types/risk-assessment.types';

interface ProfileFilterProps {
  profileTypes: RiskProfileType[];
  selectedTypes: RiskProfileType[];
  onTypeToggle: (type: RiskProfileType) => void;
  onClearFilters: () => void;
  onAdd: () => void;
}

export default function ProfileFilter({
  profileTypes,
  selectedTypes,
  onTypeToggle,
  onClearFilters,
  onAdd
}: ProfileFilterProps) {
  
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại hồ sơ</label>
          <div className="flex flex-wrap gap-2">
            {profileTypes.map((type) => (
              <button
                key={type}
                onClick={() => onTypeToggle(type)}
                className={`px-3 py-1 rounded-full text-sm flex items-center ${
                  selectedTypes.includes(type)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getProfileTypeLabel(type)}
                {selectedTypes.includes(type) && (
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedTypes.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Thêm hồ sơ mới
        </button>
      </div>
    </div>
  );
} 