'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import authService from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FinanceProfile } from '@/types/auth.types';

export default function RecommendationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FinanceProfile | null>(null);
  const [clearingCache, setClearingCache] = useState(false);

  useEffect(() => {
    fetchFinanceProfile();
  }, []);

  const fetchFinanceProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getFinanceProfile();
      
      if (response.success && response.data?.data) {
        setData(response.data.data);
      } else {
        toast.error('Không thể tải thông tin tài chính');
      }
    } catch (error) {
      console.error('Error fetching finance profile:', error);
      toast.error('Đã xảy ra lỗi khi tải thông tin tài chính');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setClearingCache(true);
      const response = await authService.deleteAICache();
      
      if (response.success) {
        toast.success('Đã xóa bộ nhớ đệm AI thành công');
        // Fetch new data after clearing cache
        await fetchFinanceProfile();
      } else {
        toast.error('Không thể xóa bộ nhớ đệm AI');
      }
    } catch (error) {
      console.error('Error clearing AI cache:', error);
      toast.error('Đã xảy ra lỗi khi xóa bộ nhớ đệm AI');
    } finally {
      setClearingCache(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Không có dữ liệu</CardTitle>
            <CardDescription>
              Không thể tải thông tin tài chính. Vui lòng thử lại sau.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { profile, advice, summary } = data;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gợi ý tài chính thông minh</CardTitle>
          <CardDescription>
            Phân tích và đề xuất dựa trên hồ sơ tài chính của bạn
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tài sản ròng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(summary.netWorth)}</p>
            {profile.healthMetrics.trend && (
              <p className={`text-sm mt-2 ${
                profile.healthMetrics.trend.trend === 'INCREASING' ? 'text-green-600' : 
                profile.healthMetrics.trend.trend === 'DECREASING' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {profile.healthMetrics.trend.trend === 'INCREASING' ? '↗️' : '↘️'}
                {profile.healthMetrics.trend.changePercentage}%
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thu nhập hàng tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(summary.monthlyIncome)}</p>
            <p className="text-sm text-gray-500 mt-2">
              Tiết kiệm: {formatCurrency(summary.monthlySavings)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Điểm sức khỏe tài chính</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.financialHealthScore}/100</p>
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(summary.financialHealthScore, 100)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Advice */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤖</span>
              <CardTitle>Lời khuyên từ AI</CardTitle>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Powered by Gemini
              </span>
            </div>
            <button
              onClick={handleClearCache}
              disabled={clearingCache}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {clearingCache ? 'Đang xóa...' : 'Xóa bộ nhớ đệm AI'}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <ReactMarkdown>{advice.aiGenerated}</ReactMarkdown>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Được tạo lúc: {new Date(advice.generatedAt).toLocaleString('vi-VN')}
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button 
          onClick={fetchFinanceProfile}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Cập nhật dữ liệu
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          🖨️ In báo cáo
        </button>
      </div>
    </div>
  );
} 