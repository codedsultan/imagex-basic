import { useState, useEffect, useCallback, useRef } from "react";
import * as fabric from "fabric";
import { useMockupEditor } from "@/contexts/MockupEditorContext";
import { Orientation } from "@/contexts/MockupEditorContext";

// Define type for print area coordinates.
type PrintAreaCoordinates = {
  left: number;
  top: number;
  width: number;
  height: number;
};

// Define custom fabric object types that may include a name property.
interface CustomFabricObject extends fabric.Object {
  name?: string;
}

interface CustomFabricImage extends fabric.Image {
  name?: string;
}

export const useMockupCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const { state, actions } = useMockupEditor();
  const { editor } = state;
  const { setCanvas } = actions;

  const [isInitialized, setIsInitialized] = useState(false);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const loadingImage = useRef(false);

  // Helper: returns whether the canvas is ready to be used.
  const isCanvasReady = useCallback(() => {
    const canvas = canvasInstanceRef.current;
    return !!canvas && !canvas.disposed && !editor.isCanvasLoading;
  }, [editor.isCanvasLoading]);

  // --- Canvas Initialization ---
  const initCanvas = useCallback((): fabric.Canvas | null => {
    if (!canvasRef.current || canvasInstanceRef.current) return canvasInstanceRef.current;
    try {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#f0f0f0",
        selection: true,
        preserveObjectStacking: true,
      });
      canvasInstanceRef.current = fabricCanvas;
      setCanvas(fabricCanvas);
      console.log("Fabric Canvas Initialized (v6.6.1)");
      setIsInitialized(true);
      return fabricCanvas;
    } catch (error) {
      console.error("Canvas initialization error:", error);
      return null;
    }
  }, [canvasRef, setCanvas]);

  // --- Cleanup Function ---
  const cleanupCanvas = useCallback(() => {
    if (resizeObserverRef.current && containerRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
      console.log("ResizeObserver disconnected");
    }
    const currentCanvas = canvasInstanceRef.current;
    if (currentCanvas && !currentCanvas.disposed) {
      console.log("Disposing Fabric canvas instance...");
      currentCanvas.dispose();
      canvasInstanceRef.current = null;
    }
    setCanvas(null);
    setIsInitialized(false);
    loadingImage.current = false;
  }, [containerRef, setCanvas]);

  // --- Print Area Logic ---
  const getPrintAreaCoordinates = useCallback((): PrintAreaCoordinates | null => {
    const canvas = canvasInstanceRef.current;
    if (!canvas || !isCanvasReady()) return null;

    const baseImg = canvas.getObjects().find((obj): obj is CustomFabricImage =>
      (obj as CustomFabricObject).name === "mockupBase"
    );
    if (
      !baseImg ||
      !baseImg.width ||
      !baseImg.height ||
      baseImg.scaleX === undefined ||
      baseImg.scaleY === undefined ||
      baseImg.left === undefined ||
      baseImg.top === undefined
    ) {
      console.warn("Base image not found or invalid for print area calculation.");
      return null;
    }

    const { left, top, width, height, scaleX, scaleY } = baseImg;
    const orientation: Orientation = editor.currentOrientation;
    const templateConfig = editor.template?.[`${orientation}_config`];
    const paConfig = templateConfig?.print_areas?.main_print_area;

    if (!paConfig) {
      console.warn(`Print area configuration not found for orientation: ${orientation}.`);
      return null;
    }

    const baseLeft = left - (width * scaleX / 2);
    const baseTop = top - (height * scaleY / 2);
    return {
      left: baseLeft + (paConfig.x * width * scaleX),
      top: baseTop + (paConfig.y * height * scaleY),
      width: paConfig.width * width * scaleX,
      height: paConfig.height * height * scaleY,
    };
  }, [editor.currentOrientation, editor.template, isCanvasReady]);

  const updatePrintArea = useCallback(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas || !isCanvasReady()) return;

    const coords = getPrintAreaCoordinates();
    let printArea = canvas.getObjects().find(
      (obj) => (obj as CustomFabricObject).name === "printArea"
    ) as fabric.Rect | undefined;

    if (!coords) {
      if (printArea) {
        canvas.remove(printArea);
        canvas.requestRenderAll();
        console.log("Print area removed; coordinates unavailable.");
      }
      return;
    }

    if (printArea) {
      printArea.set(coords);
      printArea.setCoords();
    } else {
      printArea = new fabric.Rect({
        ...coords,
        originX: "left",
        originY: "top",
        fill: "rgba(255, 0, 0, 0.1)",
        stroke: "red",
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      });
      (printArea as CustomFabricObject).name = "printArea";
      canvas.add(printArea);
    //   canvas.sendObjectToBack(printArea);
    }
    canvas.requestRenderAll();
  }, [getPrintAreaCoordinates, isCanvasReady]);

  // Example function to update (or create) the print area so it is centered on the base image.
 const updatePrintAreaCentered = useCallback((canvas: fabric.Canvas, desiredWidth: number, desiredHeight: number) => {
    // Locate the base image (must have been assigned a name "mockupBase" when added)
    const baseImage = canvas.getObjects().find((obj) => (obj as CustomFabricObject).name === "mockupBase");
    if (!baseImage) {
      console.warn("Base image not found. Cannot update print area position.");
      return;
    }

    // Get the bounding rectangle of the base image.
    // Note: getBoundingRect() accounts for any scaling or positioning.
    const rect = baseImage.getBoundingRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Try to find an existing print area.
    let printArea = canvas.getObjects().find((obj) => (obj as CustomFabricObject).name === "printArea") as fabric.Rect | undefined;

    if (!printArea) {
      // If no print area exists, create one with the desired size and center it.
      printArea = new fabric.Rect({
        left: centerX,
        top: centerY,
        width: desiredWidth,
        height: desiredHeight,
        originX: "center",
        originY: "center",
        fill: "rgba(255, 0, 0, 0.1)",
        stroke: "red",
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      });
      // Assign a name property so we can locate it later.
      printArea.set("name", "printArea");
      canvas.add(printArea);
      // Optionally, move it behind other objects.
    //   canvas.sendObjectToBack(printArea);
    } else {
      // If print area already exists, simply update its position.
      printArea.set({
        left: centerX,
        top: centerY,
        originX: "center",
        originY: "center",
      });
      printArea.setCoords();
    }

    canvas.renderAll();
  },[]);
  // --- Center Base Image ---
  const centerMockupImage = useCallback(() => {
    const coords = getPrintAreaCoordinates();
    const canvas = canvasInstanceRef.current;
    if (!canvas || canvas.disposed) return;

    const baseImg = canvas.getObjects().find(
      (obj) => (obj as CustomFabricObject).name === "mockupBase"
    );
    if (baseImg && canvas.width && canvas.height) {
      baseImg.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
      });
      baseImg.setCoords();

    }
    //   updatePrintAreaCentered(canvas, 300, 200);
    updatePrintAreaCentered(canvas, coords?.width ?? 100, coords?.height ?? 200);

    //   updatePrintArea();
    // } else {
    // //   updatePrintArea();
    //   updatePrintAreaCentered(canvas, coords?.width ?? 100, coords?.height ?? 200);

  }, [updatePrintArea, updatePrintAreaCentered]);
//   [updatePrintArea]);

  // --- Responsive Setup ---
  const setupResponsiveBehavior = useCallback((canvas: fabric.Canvas) => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry?.contentRect || canvas.disposed) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        canvas.setDimensions({ width, height });
        centerMockupImage();
      }
    });
    observer.observe(containerRef.current);
    resizeObserverRef.current = observer;
    // Set initial dimensions.
    const { width, height } = containerRef.current.getBoundingClientRect();
    if (width > 0 && height > 0 && !canvas.disposed) {
      canvas.setDimensions({ width, height });
      centerMockupImage();
    }
  }, [containerRef, centerMockupImage]);

  // --- Load Mockup Image ---
  const loadMockupImage = useCallback(async (imageUrl: string) => {
    const canvas = canvasInstanceRef.current;
    if (!canvas || !isCanvasReady() || loadingImage.current) return;
    loadingImage.current = true;
    try {
      // Remove existing base image and print area objects.
      const existingObjects = canvas.getObjects().filter((obj) =>
        (obj as CustomFabricObject).name === "mockupBase" ||
        (obj as CustomFabricObject).name === "printArea"
      );
      existingObjects.forEach(obj => canvas.remove(obj));
      canvas.requestRenderAll();

      console.log(`Loading image from URL: ${imageUrl}`);
      const img = await fabric.FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" });
      console.log("Image loaded successfully");
      if (!canvasInstanceRef.current || canvasInstanceRef.current.disposed) {
        console.warn("Canvas disposed before image could be added.");
        loadingImage.current = false;
        return;
      }

      let scale = 1;
      const canvasWidth = canvas.width || 0;
      const canvasHeight = canvas.height || 0;
      if (img.width && img.height && canvasWidth && canvasHeight) {
        scale = Math.min(canvasWidth / img.width * 0.9, canvasHeight / img.height * 0.9);
      } else {
        console.warn("Missing dimensions; cannot calculate scale.");
      }

      img.scale(scale);
      img.set({
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        originX: "center",
        originY: "center",
      });
      (img as CustomFabricImage).name = "mockupBase";
      canvas.add(img);
      canvas.sendObjectToBack(img);
      centerMockupImage();
    } catch (error) {
      console.error("Error loading mockup image:", error);
      if (canvas && !canvas.disposed) {
        canvas.getObjects().forEach(obj => {
          if ((obj as CustomFabricObject).name === "mockupBase" || (obj as CustomFabricObject).name === "printArea") {
            canvas.remove(obj);
          }
        });
        canvas.requestRenderAll();
      }
    } finally {
      loadingImage.current = false;
    }
  }, [isCanvasReady, centerMockupImage]);

  // --- Setup Canvas Events ---
  const setupCanvasEvents = useCallback((canvas: fabric.Canvas) => {
    type SelectionEvent = fabric.TEvent<Event> & {
      target?: fabric.Object;
      selected?: fabric.Object[];
    };

    const handleSelection = (options: SelectionEvent) => {
      if ((options.target as CustomFabricObject)?.name === "printArea") {
        canvas.discardActiveObject();
        actions.setSelectedObject(null);
        canvas.requestRenderAll();
        return;
      }
      actions.setSelectedObject(canvas.getActiveObject() || null);
    };

    const handleClear = () => {
      actions.setSelectedObject(null);
    };

    canvas.on("selection:created", handleSelection as any);
    canvas.on("selection:updated", handleSelection as any);
    canvas.on("selection:cleared", handleClear);
    console.log("Canvas events attached");

    return () => {
      if (canvas && !canvas.disposed) {
        canvas.off("selection:created", handleSelection as any);
        canvas.off("selection:updated", handleSelection as any);
        canvas.off("selection:cleared", handleClear);
        console.log("Canvas events detached");
      }
    };
  }, [actions]);

  // --- Initialization & Cleanup Effect ---
  // IMPORTANT: Use an empty dependency array so that this effect runs only on mount/unmount.
  useEffect(() => {
    let detachEvents: (() => void) | undefined;
    if (canvasRef.current && !canvasInstanceRef.current) {
      const canvas = initCanvas();
      if (canvas) {
        detachEvents = setupCanvasEvents(canvas);
        setupResponsiveBehavior(canvas);
      }
    }
    return () => {
      detachEvents?.();
    //   cleanupCanvas();
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      const currentCanvas = canvasInstanceRef.current;
      if (currentCanvas && !currentCanvas.disposed) {
        currentCanvas.dispose();
        canvasInstanceRef.current = null;
      }
      setIsInitialized(false);
      loadingImage.current = false;
    };
  }, []); // Run only once on mount/unmount
  const constrainToPrintArea = useCallback((obj: fabric.FabricObject) => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    obj.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false });

    obj.on("moving", () => {
      const pa = getPrintAreaCoordinates();
      if (!pa) return;
      const objWidth = obj.getScaledWidth();
      const objHeight = obj.getScaledHeight();

      obj.set({
        left: Math.max(pa.left + objWidth / 2, Math.min(obj.left!, pa.left + pa.width - objWidth / 2)),
        top: Math.max(pa.top + objHeight / 2, Math.min(obj.top!, pa.top + pa.height - objHeight / 2)),
      });
      canvas.renderAll();
    });

    obj.on("scaling", () => {
      const pa = getPrintAreaCoordinates();
      if (!pa) return;
      const objAspectRatio = obj.width! / obj.height!;
      const boundAspectRatio = pa.width / pa.height;
      const maxScale = objAspectRatio > boundAspectRatio
        ? pa.width / obj.width!
        : pa.height / obj.height!;

      obj.scaleX = Math.min(obj.scaleX!, maxScale);
      obj.scaleY = Math.min(obj.scaleY!, maxScale);

      obj.set({
        left: pa.left + pa.width / 2,
        top: pa.top + pa.height / 2,
      });
      canvas.renderAll();
    });
  }, [getPrintAreaCoordinates]);

  return {
    initCanvas,
    cleanupCanvas,
    loadMockupImage,
    updatePrintArea,
    updatePrintAreaCentered,
    getPrintAreaCoordinates,
    constrainToPrintArea,
    togglePrintAreaVisibility: useCallback((visible: boolean) => {
      const canvas = canvasInstanceRef.current;
      if (canvas && isCanvasReady()) {
        const printArea = canvas.getObjects().find(
          (obj) => (obj as CustomFabricObject).name === "printArea"
        );
        if (printArea) {
          printArea.visible = visible;
          canvas.requestRenderAll();
        }
      }
    }, [isCanvasReady]),
    isInitialized,
  };
};
