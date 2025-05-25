'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useAssets } from '@/hooks/useAssets';
import { AssetFilters, UserAsset, AssetType, LiquidityLevel, SortDirection, CreateAssetRequest, UpdateAssetRequest, UpdateAssetValueRequest } from '@/types/asset.types';
import { FiPlus, FiSearch, FiFilter, FiRefreshCw, FiGrid, FiList, FiX } from 'react-icons/fi';
import { UI_CONSTANTS, ASSET_CONSTANTS } from '@/constants/app.constants';
import { withErrorHandling } from '@/utils/error.utils';
import { filterAssetsBySearch, sortAssets } from '@/utils/asset.utils';
import dynamic from 'next/dynamic';

// Components
import AssetCard from '@/components/assets/AssetCard';
import AssetSummary from '@/components/assets/AssetSummary';

// Dynamic imports with suspense
const CreateAssetModal = dynamic(() => import('@/components/assets/CreateAssetModal'), {
  loading: () => <div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>,
  ssr: false
});

const EditAssetModal = dynamic(() => import('@/components/assets/EditAssetModal'), {
  loading: () => <div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>,
  ssr: false
});

const UpdateValueModal = dynamic(() => import('@/components/assets/UpdateValueModal'), {
  loading: () => <div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>,
  ssr: false
});

const AssetsPage: React.FC = () => {
  // Hooks
  const {
    assets,
    categories,
    summary,
    totalValue,
    loading,
    error,
    fetchAssets,
    createAsset,
    updateAsset,
    updateAssetValue,
    deleteAsset,
    clearError,
    refreshAll
  } = useAssets();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AssetFilters>({
    page: 1,
    limit: ASSET_CONSTANTS.DEFAULT_PAGE_SIZE
  });
  const [sortBy, setSortBy] = useState<string>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpdateValueModal, setShowUpdateValueModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<UserAsset | null>(null);

  // Computed values
  const filteredAndSortedAssets = useMemo(() => {
    let result = filterAssetsBySearch(assets, searchTerm);
    result = sortAssets(result, sortBy, sortDirection);
    return result;
  }, [assets, searchTerm, sortBy, sortDirection]);

  // Event handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (newFilters: Partial<AssetFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchAssets({ ...filters, ...newFilters });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC);
    } else {
      setSortBy(field);
      setSortDirection(SortDirection.DESC);
    }
  };

  const handleDeleteAsset = withErrorHandling(async (assetId: string) => {
    await deleteAsset(assetId);
  }, { component: 'AssetsPage', action: 'deleteAsset' });

  const handleEditAsset = (asset: UserAsset) => {
    setSelectedAsset(asset);
    setShowEditModal(true);
  };

  const handleEditAssetSubmit = async (id: string, data: UpdateAssetRequest): Promise<boolean> => {
    const success = await updateAsset(id, data);
    if (success) {
      setShowEditModal(false);
      setSelectedAsset(null);
    }
    return success;
  };

  const handleUpdateValue = (asset: UserAsset) => {
    setSelectedAsset(asset);
    setShowUpdateValueModal(true);
  };

  const handleUpdateValueSubmit = async (id: string, data: UpdateAssetValueRequest): Promise<boolean> => {
    const success = await updateAssetValue(id, data);
    if (success) {
      setShowUpdateValueModal(false);
      setSelectedAsset(null);
    }
    return success;
  };

  const handleCreateAsset = () => {
    setShowCreateModal(true);
  };

  const handleCreateAssetSubmit = async (data: CreateAssetRequest): Promise<boolean> => {
    const success = await createAsset(data);
    if (success) {
      setShowCreateModal(false);
    }
    return success;
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: ASSET_CONSTANTS.DEFAULT_PAGE_SIZE
    });
    setSearchTerm('');
    setSortBy('lastUpdated');
    setSortDirection(SortDirection.DESC);
    fetchAssets();
  };

  // Loading skeleton
  if (loading && assets.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: UI_CONSTANTS.LOADING_SKELETON_ITEMS }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tài sản của tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi tài sản cá nhân</p>
        </div>
        <button
          onClick={handleCreateAsset}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Thêm tài sản
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm tài sản..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FiFilter className="w-4 h-4" />
            Bộ lọc
          </button>
          
          <button
            onClick={refreshAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  value={filters.categoryId || ''}
                  onChange={(e) => handleFilterChange({ categoryId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại tài sản
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange({ type: e.target.value as AssetType || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả loại</option>
                  {Object.values(AssetType).map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Liquidity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tính thanh khoản
                </label>
                <select
                  value={filters.liquidityLevel || ''}
                  onChange={(e) => handleFilterChange({ liquidityLevel: e.target.value as LiquidityLevel || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả mức độ</option>
                  {Object.values(LiquidityLevel).map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sắp xếp theo
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="lastUpdated">Cập nhật gần nhất</option>
                  <option value="currentValue">Giá trị</option>
                  <option value="name">Tên</option>
                  <option value="createdAt">Ngày tạo</option>
                  <option value="profitLoss">Lãi/Lỗ</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Assets List */}
        <div className="lg:col-span-3">
          {filteredAndSortedAssets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có tài sản nào
              </h3>
              <p className="text-gray-600 mb-4">
                Bắt đầu thêm tài sản để theo dõi danh mục đầu tư của bạn
              </p>
              <button
                onClick={handleCreateAsset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Thêm tài sản đầu tiên
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredAndSortedAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onEdit={handleEditAsset}
                  onDelete={handleDeleteAsset}
                  onUpdateValue={handleUpdateValue}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          {summary && (
            <AssetSummary
              summary={summary}
              totalValue={totalValue}
            />
          )}
        </div>
      </div>

      {/* Create Asset Modal */}
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>}>
        <CreateAssetModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAssetSubmit}
          categories={categories}
          loading={loading}
        />
      </Suspense>

      {/* Edit Asset Modal */}
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>}>
        <EditAssetModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAsset(null);
          }}
          onSubmit={handleEditAssetSubmit}
          asset={selectedAsset}
          categories={categories}
          loading={loading}
        />
      </Suspense>

      {/* Update Value Modal */}
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>}>
        <UpdateValueModal
          isOpen={showUpdateValueModal}
          onClose={() => {
            setShowUpdateValueModal(false);
            setSelectedAsset(null);
          }}
          onSubmit={handleUpdateValueSubmit}
          asset={selectedAsset}
          loading={loading}
        />
      </Suspense>
    </div>
  );
};

export default AssetsPage; 