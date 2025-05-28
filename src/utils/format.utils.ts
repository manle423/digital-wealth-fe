/**
 * Formatting utility functions
 */

/**
 * Format currency with Vietnamese locale
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
    // Fallback for errors
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
 * Format percentage with fixed decimal places
 */
export const formatPercentage = (value: number | string, decimals: number = 1): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numericValue.toFixed(decimals)}%`;
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
 * Format large numbers with dot separators
 */
export const formatLargeNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(value);
};

/**
 * Safe number formatting with toFixed
 */
export const safeToFixed = (value: any, decimals: number = 2): string => {
  const num = Number(value);
  if (isNaN(num)) return '0.00';
  return num.toFixed(decimals);
};

/**
 * Format number while typing (add thousand separators)
 */
export const formatNumberInput = (value: string): string => {
  // Remove all non-digit characters except decimal point
  const number = value.replace(/[^\d.]/g, '');
  
  // Split number into integer and decimal parts
  const [integerPart, decimalPart] = number.split('.');
  
  // Format integer part with thousand separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Return formatted number with decimal part if exists
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

/**
 * Parse formatted number back to number type
 */
export const parseFormattedNumber = (value: string): number => {
  // Remove thousand separators but keep decimal point
  const number = value.replace(/,/g, '');
  return parseFloat(number) || 0;
}; 