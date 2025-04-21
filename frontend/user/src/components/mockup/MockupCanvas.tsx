import React, { useRef, useEffect } from 'react';
import { useResizeObserver } from '@/hooks/useResizeObserver';
import { useSelectionHandlers } from '@/hooks/useSelectionHandlers';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { useCanvasPreview } from '@/hooks/useCanvasPreview';
import { useFabricUploader } from '@/hooks/useFabricUploader';
import { useMockupEditor } from '@/contexts/MockupEditorContext';
import { useMockupCanvas } from '@/hooks/useMockupCanvas';
import type { Orientation } from '@/contexts/MockupEditorContext';

interface MockupCanvasProps {
  orientation: Orientation;
  onPreviewImage: (url: string) => void;
}

export function MockupCanvas({ orientation, onPreviewImage }: MockupCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, actions } = useMockupEditor();
  const { editor } = state;
  const {
    canvas,
    currentOrientation,
    orientationCanvasStates
  } = editor;

  const {
    initCanvas,
    cleanupCanvas,
    loadMockupImage,
    updatePrintAreaCentered
  } = useMockupCanvas(canvasRef, containerRef);

  const { setCanvas, setCanvasLoading, setViewMode } = actions;

  // Initialize and dispose canvas using useMockupCanvas
  useEffect(() => {
    const instance = initCanvas();
    if (instance) setCanvas(instance);
    return () => cleanupCanvas();
  }, []);

  // Resize observer
  useResizeObserver(containerRef, ({ width, height }) => {
    editor.canvas?.setDimensions({ width, height });
  });

  // Selection events
  useSelectionHandlers(
    editor.canvas,
    (obj) => actions.setSelectedObject(obj),
    () => actions.setSelectedObject(null)
  );

  // History tracking
  useCanvasHistory(
    editor.canvas,
    (stateJson) => actions.saveCurrentCanvasStateForOrientation(orientation, stateJson),
    { enabled: true, debounceTime: 500, maxSize: 50 }
  );

  // Preview rendering
  useCanvasPreview(
    editor.canvas,
    editor.viewMode,
    onPreviewImage,
    setViewMode
  );

  // Load canvas state or mockup base
  useEffect(() => {
    if (!canvas) return;

    setCanvasLoading(true);

    const stateToLoad = orientationCanvasStates[currentOrientation];
    if (stateToLoad) {
      canvas.loadFromJSON(stateToLoad, () => {
        canvas.renderAll();
        setCanvasLoading(false);
      });
    } else {
      const baseImageUrl = editor.template?.[`${currentOrientation}_config`]?.base_image_url;
      if (baseImageUrl) {
        loadMockupImage(baseImageUrl)
          .then(() => setCanvasLoading(false))
          .catch((err) => {
            console.error("Failed to load base image:", err);
            setCanvasLoading(false);
          });
      } else {
        console.warn("No base image found in template config.");
        setCanvasLoading(false);
      }
    }
  }, [canvas, currentOrientation, orientationCanvasStates]);

  // Uploader (for external use if needed)
  const { upload } = useFabricUploader(editor.canvas);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center relative overflow-hidden min-h-[400px]"
    >
      <canvas ref={canvasRef} className="border rounded w-full h-full" />
    </div>
  );
}
