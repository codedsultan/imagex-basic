import type { Canvas,  FabricObject } from 'fabric';
import { useEffect } from 'react';

/**
 * Hook to attach and cleanup selection events on a Fabric.js canvas.
 */
export function useSelectionHandlers(
  canvas: Canvas | null,
  onSelect: (obj: FabricObject | null) => void,
  onClear: () => void
) {
  useEffect(() => {
    if (!canvas) return;
    const selectHandler = () => onSelect(canvas.getActiveObject() || null);
    const clearHandler = () => onClear();
    canvas.on('selection:created', selectHandler);
    canvas.on('selection:updated', selectHandler);
    canvas.on('selection:cleared', clearHandler);
    return () => {
      canvas.off('selection:created', selectHandler);
      canvas.off('selection:updated', selectHandler);
      canvas.off('selection:cleared', clearHandler);
    };
  }, []);
//   [canvas, onSelect, onClear]);
}
