/**
 * Calculation utility functions
 */

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
 * Calculate portfolio statistics
 */
export const calculatePortfolioStats = (assets: any[]) => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalPurchasePrice = assets.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0);
  
  const profitLoss = totalValue - totalPurchasePrice;
  const profitLossPercentage = totalPurchasePrice > 0 ? (profitLoss / totalPurchasePrice) * 100 : 0;
  
  const liquidAssets = assets.filter(asset => asset.liquidityLevel === 'HIGH');
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