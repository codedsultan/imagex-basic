import { Canvas } from 'fabric';
import type { CanvasOptions } from 'fabric';

/**
 * Initialize a Fabric.js canvas on the given HTMLCanvasElement.
 */
export function initFabricCanvas(
    canvasEl: HTMLCanvasElement,
    options: Partial<CanvasOptions> = {}
  ): Canvas {
    return new Canvas(canvasEl, options);
  }

  /**
   * Dispose of a Fabric.js canvas instance to free resources.
   */
  export function disposeFabricCanvas(canvas: Canvas | null) {
    if (canvas && !canvas.disposed) {
      canvas.dispose();
    }
  }
