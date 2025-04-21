import { useCallback } from 'react';

/**
 * Hook to convert a File into a DataURL string.
 */
export function useFileToDataURL() {
  const toDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('FileReader result is not a string'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  return { toDataUrl };
}
