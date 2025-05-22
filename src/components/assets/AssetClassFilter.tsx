'use client';

interface AssetClassFilterProps {
  selectedRiskLevels: number[];
  onRiskLevelToggle: (level: number) => void;
  onClearFilters: () => void;
  onAdd: () => void;
}

export default function AssetClassFilter({
  selectedRiskLevels,
  onRiskLevelToggle,
  onClearFilters,
  onAdd
}: AssetClassFilterProps) {
  
  const getRiskLevelLabel = (level: number) => {
    switch(level) {
      case 1: return 'Rất thấp';
      case 2: return 'Thấp';
      case 3: return 'Trung bình';
      case 4: return 'Cao';
      case 5: return 'Rất cao';
      default: return level.toString();
    }
  };

  const getRiskLevelClass = (level: number, isSelected: boolean) => {
    if (isSelected) return 'bg-blue-600 text-white';
    
    switch(level) {
      case 1: return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 2: return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 3: return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 4: return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 5: return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Available risk levels
  const riskLevels = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ rủi ro</label>
          <div className="flex flex-wrap gap-2">
            {riskLevels.map((level) => (
              <button
                key={level}
                onClick={() => onRiskLevelToggle(level)}
                className={`px-3 py-1 rounded-full text-sm flex items-center ${
                  getRiskLevelClass(level, selectedRiskLevels.includes(level))
                }`}
              >
                {getRiskLevelLabel(level)}
                {selectedRiskLevels.includes(level) && (
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedRiskLevels.length > 0 && (
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
          + Thêm lớp tài sản mới
        </button>
      </div>
    </div>
  );
} 