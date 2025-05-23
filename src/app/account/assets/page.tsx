'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { toast } from 'sonner';
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
  currency: string;
  change: number;
  lastUpdated: string;
}

interface AssetSummary {
  totalValue: number;
  totalChange: number;
  assetsByType: {
    type: string;
    value: number;
    percentage: number;
  }[];
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [summary, setSummary] = useState<AssetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/assets');
      const data = await response.json();

      if (data.success) {
        setAssets(data.data.assets);
        setSummary(data.data.summary);
      } else {
        toast.error('Không thể tải thông tin tài sản');
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('Đã xảy ra lỗi khi tải thông tin tài sản');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
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
      <h1 className="text-2xl font-bold mb-6">Tổng quan tài sản</h1>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng giá trị tài sản</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalValue)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FiDollarSign className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thay đổi</p>
                <p className={`text-2xl font-bold mt-1 ${summary.totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.totalChange >= 0 ? '+' : ''}{summary.totalChange.toFixed(2)}%
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                summary.totalChange >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {summary.totalChange >= 0 ? (
                  <FiTrendingUp className={`text-2xl ${summary.totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                ) : (
                  <FiTrendingDown className="text-2xl text-red-600" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-4">Phân bổ theo loại tài sản</p>
            <div className="space-y-2">
              {summary.assetsByType.map((type, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-1/3 text-sm text-gray-600">{type.type}</span>
                  <div className="w-2/3 flex items-center">
                    <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${type.percentage}%`,
                          backgroundColor: 
                            type.type.includes('Cổ phiếu') ? '#F59E0B' :
                            type.type.includes('Trái phiếu') ? '#3B82F6' :
                            '#10B981'
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{type.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assets List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tài sản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thay đổi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cập nhật lần cuối
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{asset.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(asset.value)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      asset.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {asset.change >= 0 ? '+' : ''}{asset.change}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(asset.lastUpdated).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 