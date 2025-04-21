import type { Canvas, FabricObject } from 'fabric';

/**
 * Set up and return a cleanup for selection handlers on a Fabric canvas.
 */
export function setupSelectionHandlers(
  canvas: Canvas,
  onSelect: (obj: FabricObject | null) => void,
  onClear: () => void
): () => void {
  const handleSelect = () => onSelect(canvas.getActiveObject() || null);
  const handleClear = () => onClear();

  canvas.on('selection:created', handleSelect);
  canvas.on('selection:updated', handleSelect);
  canvas.on('selection:cleared', handleClear);

  return () => {
    canvas.off('selection:created', handleSelect);
    canvas.off('selection:updated', handleSelect);
    canvas.off('selection:cleared', handleClear);
  };
}
