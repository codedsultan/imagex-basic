import { useCallback } from 'react';
import { useFileToDataURL } from '@/utils/fileUtils';
import { loadImageIntoPrintArea } from '@/utils/canvasHelpers';
import type { Canvas } from 'fabric';

/**
 * Hook to handle file -> Fabric.Image upload into the print area.
 */
export function useFabricUploader(canvas: Canvas | null) {
  const { toDataUrl } = useFileToDataURL();

  const uploadImage = useCallback(
    async (file: File) => {
      if (!canvas) return;
      const dataUrl = await toDataUrl(file);
      await loadImageIntoPrintArea(canvas, dataUrl);
    },
    [canvas, toDataUrl]
  );

  return { uploadImage };
}
