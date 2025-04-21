// src/hooks/useFabricCanvas.ts
import { useCallback } from 'react';
import { Canvas } from 'fabric';

/**
 * Hook that initializes and disposes a Fabric.js canvas.
 */
export function useFabricCanvas() {
  const init = useCallback((canvasEl: HTMLCanvasElement, options = {}): Canvas => {
    return new Canvas(canvasEl, options);
  }, []);

  const dispose = useCallback((canvas: Canvas | null) => {
    if (canvas && !canvas.disposed) canvas.dispose();
  }, []);

  return { init, dispose };
}
