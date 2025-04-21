import type { FabricObject } from 'fabric';

/**
 * Apply properties to a Fabric object and re-render its canvas.
 */
export function applyPropsAndRender(
  obj: FabricObject,
  props: Partial<Record<string, any>>
): void {
  obj.set(props);
  obj.canvas?.renderAll();
}
