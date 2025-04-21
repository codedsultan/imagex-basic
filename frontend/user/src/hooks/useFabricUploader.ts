import { useCallback } from 'react';
import { useFileToDataURL } from './useFileToDataURL';
import { loadImageIntoPrintArea } from '../utils/canvasHelpers';
import type { Canvas } from 'fabric';

/**
 * Hook to upload a File onto a Fabric.js canvas print area.
 */
export function useFabricUploader(canvas: Canvas | null) {
  const { toDataUrl } = useFileToDataURL();
  const upload = useCallback(async (file: File) => {
    if (!canvas) return;
    const dataUrl = await toDataUrl(file);
    await loadImageIntoPrintArea(canvas, dataUrl);
  }, [canvas, toDataUrl]);

  return { upload };
}
