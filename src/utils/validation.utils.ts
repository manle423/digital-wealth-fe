/**
 * Validation utility functions
 */

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