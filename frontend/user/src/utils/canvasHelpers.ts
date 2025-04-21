import { useMockupCanvas } from "@/hooks/useMockupCanvas";
import { Canvas,FabricObject, FabricImage } from "fabric";
import * as  fabric  from 'fabric';

// Define custom fabric object types that may include a name property.
interface CustomFabricObject extends FabricObject {
  name?: string;
}

interface CustomFabricImage extends FabricImage {
  name?: string;
}

export interface Bounds {
    left: number;
    top: number;
    width: number;
    height: number;
  }
  export interface TextOptions {
    text?: string;
    fontFamily?: string;
    fill?: string;
    fontSize?: number;
  }
  export interface PrintAreaConfig {
    x: number;
    y: number;
    width: number;
    height: number;
  }

export function withHiddenPrintArea<T>(
    canvas: Canvas,
    fn: () => Promise<T>
  ): Promise<T> {
    // Hide any printArea
    canvas.getObjects().forEach(raw => {
      const obj = raw as CustomFabricObject;
      if (obj.name === "printArea") {
        obj.visible = false;
      }
    });
    canvas.renderAll();

    // Run your async work, then restore visibility
    return fn().finally(() => {
      canvas.getObjects().forEach(raw => {
        const obj = raw as CustomFabricObject;
        if (obj.name === "printArea") {
          obj.visible = true;
        }
      });
      canvas.renderAll();
    });
  }


/**
 * Read the printArea rect and return its bounds
 */
export function getPrintAreaBounds(canvas: Canvas): Bounds | null {
    const obj = canvas.getObjects().find(o => (o as any).name === 'printArea');
    if (!obj) return null;
    const rect = obj.getBoundingRect();
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  }

  /**
   * Add a delete control button to an object
   */
  export function addDeleteControl(
    obj: FabricObject,
    onDelete: (target: FabricObject) => void
  ) {
    obj.controls = obj.controls || {};
    obj.controls.deleteControl = new fabric.Control({
      x: 0.5, y: -0.5,
      offsetY: -16, offsetX: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: (_e, transform) => {
        if (transform?.target) onDelete(transform.target);
        return true;
      },
      render: (ctx, left, top) => {
        const size = 24;
        ctx.save();
        ctx.translate(left, top);
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, 2*Math.PI);
        ctx.fill(); ctx.stroke();
        ctx.restore();
        return true;
      }
    });
  }

  /**
   * Constrain an object within the current print area
   */
//   const {
//     loadMockupImage,
//     constrainToPrintArea,
//     ...
//   } = useMockupCanvas(canvasRef, containerRef);

//   export function constrainToPrintArea(canvas: Canvas, obj: FabricObject) {
//     const bounds = getPrintAreaBounds(canvas);
//     if (!bounds) return;
//     obj.on('moving', () => {
//       const w = obj.getScaledWidth(), h = obj.getScaledHeight();
//       obj.set({
//         left: Math.max(bounds.left + w/2, Math.min(obj.left!, bounds.left + bounds.width - w/2)),
//         top:  Math.max(bounds.top  + h/2, Math.min(obj.top!,  bounds.top  + bounds.height - h/2)),
//       });
//       canvas.requestRenderAll();
//     });
//     obj.on('scaling', () => {
//       const aspect = obj.width!/obj.height!;
//       const boundAR = bounds.width/bounds.height;
//       const maxScale = aspect > boundAR ? bounds.width/obj.width! : bounds.height/obj.height!;
//       if (obj.scaleX! > maxScale) obj.scaleX = obj.scaleY = maxScale;
//       obj.set({ left: bounds.left + bounds.width/2, top: bounds.top + bounds.height/2 });
//       canvas.requestRenderAll();
//     });
//   }

  /**
   * Create a new text object in the print area, centered
   */
  export function createTextInPrintArea(
    canvas: Canvas,
    options: TextOptions = {}
  ): fabric.IText | null {
    const b = getPrintAreaBounds(canvas);
    if (!b) return null;
    const text = new fabric.IText(options.text ?? 'New Text', {
      left: b.left + b.width/2,
      top:  b.top  + b.height/2,
      originX: 'center', originY: 'center',
      fontFamily: options.fontFamily || 'Arial',
      fill: options.fill || '#000', fontSize: options.fontSize || 20,
    });
    canvas.add(text);
    return text;
  }


export async function loadImageIntoPrintArea(
    canvas: Canvas,
    dataUrl: string
  ): Promise<fabric.Image | null> {
    const b = getPrintAreaBounds(canvas);
    if (!b) return null;

    try {
      const img = await FabricImage.fromURL(dataUrl, { crossOrigin: "anonymous" });
      const scale = Math.min(b.width / img.width!, b.height / img.height!);

      img.set({
        left: b.left + b.width / 2,
        top: b.top + b.height / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
      });

      img.set("name", "uploadedImage");
    //   constrainToPrintArea(img);

      canvas.add(img);
    //   constrainToPrintArea(img);
      return img;
    } catch (err) {
      console.error("Failed to load image:", err);
      return null;
    }
  }


  /**
   * Update or create the red-outlined print area from template config
   */
  export function updatePrintAreaFromConfig(
    canvas: Canvas,
    config: PrintAreaConfig,
    baseImage: fabric.Image
  ) {
    const bImgRect = baseImage.getBoundingRect();
    const left = bImgRect.left + config.x * bImgRect.width;
    const top  = bImgRect.top  + config.y * bImgRect.height;
    const width  = config.width  * bImgRect.width;
    const height = config.height * bImgRect.height;

    let pa = canvas.getObjects().find(o => (o as any).name === 'printArea') as fabric.Rect;
    if (pa) {
      pa.set({ left, top, width, height });
    } else {
      pa = new fabric.Rect({
        left, top, width, height,
        fill: 'rgba(255,0,0,0.1)', stroke:'red', strokeDashArray:[5,5],
        selectable:false, evented:false
      });
      (pa as any).name = 'printArea';
      canvas.add(pa);
      canvas.sendObjectToBack(pa);
    }
  }

  /**
   * Clone the canvas, hide named layers, and return a PNG data URL
   */
  export async function generatePreview(
    canvas: Canvas,
    hideNames: string[] = ['printArea']
  ): Promise<string> {
    const clone: Canvas = await canvas.clone([]);
    clone.getObjects().forEach(o => {
      if (hideNames.includes((o as any).name)) o.visible = false;
    });
    clone.renderAll();
    const dataUrl = clone.toDataURL({ format:'png', quality:1, multiplier:1 });
    clone.dispose();
    return dataUrl;
  }

  /**
   * Toggle visibility of all objects by name
   */
  export function toggleNamedObjects(
    canvas: Canvas,
    name: string,
    visible: boolean
  ) {
    canvas.getObjects().forEach(o => {
      if ((o as any).name === name) o.visible = visible;
    });
    canvas.requestRenderAll();
  }
