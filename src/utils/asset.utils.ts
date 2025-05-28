/**
 * Asset utility functions
 */

import { AssetType, LiquidityLevel, UserAsset } from '@/types/asset.types';
import { ASSET_TYPE_LABELS, LIQUIDITY_LABELS } from '@/constants/app.constants';

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