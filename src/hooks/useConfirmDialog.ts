import { useCallback } from 'react';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const useConfirmDialog = () => {
  const confirm = useCallback(async (options: ConfirmOptions): Promise<boolean> => {
    const { message } = options;
    
    // For now, use native confirm dialog
    // In the future, this can be replaced with a custom modal component
    return window.confirm(message);
  }, []);

  return { confirm };
}; 