'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import riskAssessmentService from '@/services/risk-assessment.service';

interface RiskAssessmentHistory {
  id: string;
  totalScore: number;
  riskProfile: string;
  createdAt: string;
  recommendedAllocation: {
    assetClass: string;
    percentage: number;
  }[];
}

export default function RiskHistoryPage() {
  const [history, setHistory] = useState<RiskAssessmentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await riskAssessmentService.getHistory();

      if (response.success) {
        setHistory(response.data);
      } else {
        toast.error('Không thể tải lịch sử đánh giá');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Đã xảy ra lỗi khi tải lịch sử đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const profileLabels: Record<string, string> = {
    'CONSERVATIVE': 'Chấp nhận rủi ro thấp',
    'MODERATELY_CONSERVATIVE': 'Chấp nhận rủi ro thấp tới trung bình',
    'MODERATE': 'Chấp nhận rủi ro trung bình',
    'MODERATELY_AGGRESSIVE': 'Chấp nhận rủi ro cao',
    'AGGRESSIVE': 'Chấp nhận rủi ro rất cao'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đánh giá khẩu vị rủi ro</h1>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Bạn chưa thực hiện đánh giá khẩu vị rủi ro nào.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((assessment) => (
            <div key={assessment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" 
                    style={{ 
                      backgroundColor: 
                        assessment.riskProfile === 'CONSERVATIVE' ? '#10B981' : 
                        assessment.riskProfile === 'MODERATELY_CONSERVATIVE' ? '#3B82F6' :
                        assessment.riskProfile === 'MODERATE' ? '#F59E0B' :
                        assessment.riskProfile === 'MODERATELY_AGGRESSIVE' ? '#F97316' :
                        '#EF4444',
                      color: 'white'
                    }}
                  >
                    {profileLabels[assessment.riskProfile]}
                  </span>
                  <p className="mt-2 text-sm text-gray-500">
                    {format(new Date(assessment.createdAt), "d MMMM yyyy 'lúc' HH:mm", { locale: vi })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Điểm số</p>
                  <p className="text-2xl font-bold">{assessment.totalScore}</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Phân bổ tài sản đề xuất</h3>
                <div className="space-y-2">
                  {assessment.recommendedAllocation.map((allocation, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-1/3 text-sm text-gray-600">{allocation.assetClass}</span>
                      <div className="w-2/3 flex items-center">
                        <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${allocation.percentage}%`,
                              backgroundColor: 
                                allocation.assetClass.includes('Cổ phiếu') ? '#F59E0B' :
                                allocation.assetClass.includes('Trái phiếu') ? '#3B82F6' :
                                '#10B981'
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">{allocation.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 