/**
 * Asset utility functions
 */

import { AssetType, LiquidityLevel, UserAsset } from '@/types/asset.types';
import { ASSET_TYPE_LABELS, LIQUIDITY_LABELS } from '@/constants/app.constants';

/**
 * Format currency value
 */
export const formatCurrency = (
  value: number, 
  currency: string = 'VND',
  locale: string = 'vi-VN'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    // Fallback for unsupported currencies
    return `${value.toLocaleString(locale)} ${currency}`;
  }
};

/**
 * Format large numbers with K, M, B suffixes
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Get asset type label in Vietnamese
 */
export const getAssetTypeLabel = (type: AssetType): string => {
  return ASSET_TYPE_LABELS[type] || type;
};

/**
 * Get liquidity level label in Vietnamese
 */
export const getLiquidityLabel = (level: LiquidityLevel): string => {
  return LIQUIDITY_LABELS[level] || level;
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (
  currentValue: number,
  previousValue: number
): number => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

/**
 * Calculate profit/loss
 */
export const calculateProfitLoss = (
  currentValue: number,
  purchasePrice?: number
): { amount: number; percentage: number; isProfit: boolean } => {
  if (!purchasePrice || purchasePrice === 0) {
    return { amount: 0, percentage: 0, isProfit: true };
  }

  const amount = currentValue - purchasePrice;
  const percentage = (amount / purchasePrice) * 100;
  const isProfit = amount >= 0;

  return { amount, percentage, isProfit };
};

/**
 * Get asset icon based on type
 */
export const getAssetIcon = (type: AssetType): string => {
  const iconMap: Record<AssetType, string> = {
    // Financial Assets
    STOCK: '📈',
    BOND: '📊',
    MUTUAL_FUND: '📋',
    ETF: '📊',
    CRYPTO: '₿',
    BANK_DEPOSIT: '🏦',
    SAVINGS_ACCOUNT: '💰',
    CERTIFICATE_OF_DEPOSIT: '📜',
    
    // Real Estate
    REAL_ESTATE: '🏠',
    LAND: '🌍',
    
    // Personal Assets
    VEHICLE: '🚗',
    JEWELRY: '💎',
    ART: '🎨',
    COLLECTIBLES: '🏺',
    
    // Business Assets
    BUSINESS: '🏢',
    EQUIPMENT: '⚙️',
    
    // Insurance & Retirement
    INSURANCE: '🛡️',
    PENSION: '👴',
    
    // Others
    CASH: '💵',
    COMMODITY: '📦',
    FOREX: '💱',
    OTHER: '📄'
  };

  return iconMap[type] || '📄';
};

/**
 * Get liquidity level color
 */
export const getLiquidityColor = (level: LiquidityLevel): string => {
  const colorMap: Record<LiquidityLevel, string> = {
    HIGH: 'text-green-600 bg-green-50',
    MEDIUM: 'text-yellow-600 bg-yellow-50',
    LOW: 'text-red-600 bg-red-50'
  };

  return colorMap[level] || 'text-gray-600 bg-gray-50';
};

/**
 * Get profit/loss color classes
 */
export const getProfitLossColor = (isProfit: boolean): string => {
  return isProfit ? 'text-green-600' : 'text-red-600';
};

/**
 * Sort assets by various criteria
 */
export const sortAssets = (
  assets: UserAsset[],
  sortBy: string,
  direction: 'ASC' | 'DESC' = 'DESC'
): UserAsset[] => {
  const sorted = [...assets].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'currentValue':
        aValue = a.currentValue;
        bValue = b.currentValue;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'lastUpdated':
        aValue = new Date(a.lastUpdated);
        bValue = new Date(b.lastUpdated);
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'profitLoss':
        aValue = a.purchasePrice ? a.currentValue - a.purchasePrice : 0;
        bValue = b.purchasePrice ? b.currentValue - b.purchasePrice : 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return direction === 'ASC' ? -1 : 1;
    if (aValue > bValue) return direction === 'ASC' ? 1 : -1;
    return 0;
  });

  return sorted;
};

/**
 * Filter assets by search term
 */
export const filterAssetsBySearch = (
  assets: UserAsset[],
  searchTerm: string
): UserAsset[] => {
  if (!searchTerm.trim()) return assets;

  const term = searchTerm.toLowerCase();
  
  return assets.filter(asset => 
    asset.name.toLowerCase().includes(term) ||
    asset.description?.toLowerCase().includes(term) ||
    getAssetTypeLabel(asset.type).toLowerCase().includes(term) ||
    asset.category?.name.toLowerCase().includes(term)
  );
};

/**
 * Group assets by category
 */
export const groupAssetsByCategory = (assets: UserAsset[]): Record<string, UserAsset[]> => {
  return assets.reduce((groups, asset) => {
    const categoryName = asset.category?.name || 'Khác';
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(asset);
    return groups;
  }, {} as Record<string, UserAsset[]>);
};

/**
 * Group assets by type
 */
export const groupAssetsByType = (assets: UserAsset[]): Record<AssetType, UserAsset[]> => {
  return assets.reduce((groups, asset) => {
    if (!groups[asset.type]) {
      groups[asset.type] = [];
    }
    groups[asset.type].push(asset);
    return groups;
  }, {} as Record<AssetType, UserAsset[]>);
};

/**
 * Calculate portfolio statistics
 */
export const calculatePortfolioStats = (assets: UserAsset[]) => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalPurchasePrice = assets.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0);
  
  const profitLoss = totalValue - totalPurchasePrice;
  const profitLossPercentage = totalPurchasePrice > 0 ? (profitLoss / totalPurchasePrice) * 100 : 0;
  
  const liquidAssets = assets.filter(asset => asset.liquidityLevel === LiquidityLevel.HIGH);
  const liquidValue = liquidAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  
  return {
    totalAssets: assets.length,
    totalValue,
    totalPurchasePrice,
    profitLoss,
    profitLossPercentage,
    liquidAssets: liquidAssets.length,
    liquidValue,
    liquidityPercentage: totalValue > 0 ? (liquidValue / totalValue) * 100 : 0
  };
};

/**
 * Validate asset data
 */
export const validateAssetData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Tên tài sản là bắt buộc');
  }

  if (!data.categoryId) {
    errors.push('Danh mục tài sản là bắt buộc');
  }

  if (!data.currentValue || data.currentValue <= 0) {
    errors.push('Giá trị hiện tại phải lớn hơn 0');
  }

  if (data.purchasePrice && data.purchasePrice < 0) {
    errors.push('Giá mua không được âm');
  }

  if (data.annualReturn && (data.annualReturn < -100 || data.annualReturn > 1000)) {
    errors.push('Lợi nhuận hàng năm phải từ -100% đến 1000%');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Format relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  return `${Math.floor(diffDays / 365)} năm trước`;
};

/**
 * Safe number formatting with toFixed
 */
export const safeToFixed = (value: any, decimals: number = 2): string => {
  const num = Number(value);
  if (isNaN(num)) return '0.00';
  return num.toFixed(decimals);
}; 