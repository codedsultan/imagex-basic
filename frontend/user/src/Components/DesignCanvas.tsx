import {
    Canvas,
    Textbox,
    Rect,
    Circle,
    Triangle,
    FabricObject,
    TPointerEvent,
    ObjectEvents,
    TEvent
  } from 'fabric';
  import { useEffect, useRef, useState } from 'react';
  import { Button } from '@/components/ui/button';
  import { Skeleton } from '@/components/ui/skeleton';
//   import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
  import { Text, Square, Circle as CircleIcon, Triangle as TriangleIcon, Trash2, Loader2 } from 'lucide-react';

  interface DesignCanvasProps {
    initialData?: string;
    onUpdate: (json: string) => void;
    style: {
      color: string;                  // Text color
      shape: 'rectangle' | 'circle' | 'triangle' | '';
      font: string;
      shapeSize: number;
      shapeColor: string;             // Shape fill color
    };
  }

  export default function DesignCanvas({ initialData, onUpdate, style }: DesignCanvasProps) {
    const canvasRef = useRef<Canvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });
    const [isLoading, setIsLoading] = useState(true);

    const handleCanvasEvent = (event: { e: TPointerEvent; target: FabricObject<any> }) => {
        console.log('[handleCanvasEvent] Object changed:', event.target);
        exportCanvas();
      };


    // Create a background shape based on the selected style.
    const createBackgroundShape = (): FabricObject | null => {
      if (!canvasRef.current || !style.shape) return null;

      const size = style.shapeSize;
      const left = (canvasSize.width - size) / 2;
      const top = (canvasSize.height - size) / 2;

      // Provide a default shape color if none is set.
      const shapeFill = style.shapeColor || '#FFAAAA';

      const commonProps = {
        left,
        top,
        fill: shapeFill,
        selectable: false,
        evented: false,
        opacity: 0.7,
      };

      console.log('[createBackgroundShape] Creating shape:', style.shape, 'size:', size, 'fill:', shapeFill);

      switch (style.shape) {
        case 'rectangle':
          return new Rect({ ...commonProps, width: size, height: size });
        case 'circle':
          return new Circle({ ...commonProps, radius: size / 2 });
        case 'triangle':
          return new Triangle({ ...commonProps, width: size, height: size });
        default:
          return null;
      }
    };

    // Update the background shape if one is specified in the style.
    const updateBackgroundShape = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;

      // Remove the first object if it's unselectable (treated as the background).
      const objects = canvas.getObjects();
      if (objects.length && !objects[0].selectable) {
        console.log('[updateBackgroundShape] Removing old background shape at index 0.');
        canvas.remove(objects[0]);
      }

      // Create and add a new background shape if style.shape is set.
      const newShape = createBackgroundShape();
      if (newShape) {
        canvas.add(newShape);
        // Move the new shape to the bottom of the stack.
        // canvas.moveTo(newShape, 0);
        (canvas as any).sendToBack(newShape);

        console.log('[updateBackgroundShape] Added new background shape:', newShape);
      }

      canvas.renderAll();
      exportCanvas();
    };

    // Initialize the canvas.
    useEffect(() => {
      if (!containerRef.current) return;

      console.log('[useEffect] Initializing canvas with size:', canvasSize);
      setIsLoading(true);

      const canvas = new Canvas('design-canvas', {
        width: canvasSize.width,
        height: canvasSize.height,
        selection: true,
        backgroundColor: '#000000',
      });
      canvasRef.current = canvas;

      // Add event listeners.
      canvas.on('object:modified', handleCanvasEvent);
      canvas.on('object:added', handleCanvasEvent);
      canvas.on('object:removed', handleCanvasEvent);

      const testRect = new Rect({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
        fill: 'red',
      });
      canvas.add(testRect);
      canvas.renderAll();
      // Load initial data (if any) using the callback-based loadFromJSON.
      const loadInitialData = () => {
        if (initialData) {
          console.log('[loadInitialData] Loading JSON:', initialData);
          try {
            canvas.loadFromJSON(JSON.parse(initialData), () => {
              console.log('[loadInitialData] JSON loaded. Objects on canvas:', canvas.getObjects());
              updateBackgroundShape();
              setIsLoading(false);
            });
          } catch (error) {
            console.error('Error loading canvas data:', error);
            updateBackgroundShape();
            setIsLoading(false);
          }
        } else {
          console.log('[loadInitialData] No initial data. Creating new background shape.');
          updateBackgroundShape();
          setIsLoading(false);
        }
      };

      loadInitialData();
      window.addEventListener('resize', handleResize);

      return () => {
        console.log('[useEffect cleanup] Disposing canvas.');
        canvas.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    // Delete the currently selected object.
    const deleteSelectedObject = () => {
      if (!canvasRef.current) return;
      const activeObject = canvasRef.current.getActiveObject();
      if (activeObject) {
        console.log('[deleteSelectedObject] Removing object:', activeObject);
        canvasRef.current.remove(activeObject);
        exportCanvas();
      }
    };

    // Export the canvas state.
    const exportCanvas = () => {
      if (!canvasRef.current) return;
      const json = canvasRef.current.toJSON();
      console.log('[exportCanvas] Exporting canvas JSON:', json);
      onUpdate(JSON.stringify(json));
    };

    // Handle responsive resizing.
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const newSize = Math.min(containerWidth, 800);
      console.log('[handleResize] Container width:', containerWidth, 'New size:', newSize);
      setCanvasSize({ width: newSize, height: newSize });
      canvasRef.current.setDimensions({ width: newSize, height: newSize });
      updateBackgroundShape();
    };

    // Add a text element to the canvas.
    const addTextElement = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const textColor = style.color || '#000000';
      console.log('[addTextElement] Adding text with color:', textColor);

      const text = new Textbox('Your Text', {
        left: canvas.getWidth() / 2 - 100,
        top: canvas.getHeight() / 2 - 12,
        width: 200,
        fontSize: 24,
        fill: textColor,
        fontFamily: style.font,
        textAlign: 'center',
        borderColor: 'hsl(var(--primary))',
        cornerColor: 'hsl(var(--primary))',
        cornerSize: 8,
        transparentCorners: false,
        backgroundColor: '#FFFFCC',
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      text.enterEditing();
      exportCanvas();
    };

    // Add a shape element to the canvas.
    const addShapeElement = (shapeType: 'rectangle' | 'circle' | 'triangle') => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const size = 100;
      const centerX = canvas.getWidth() / 2 - size / 2;
      const centerY = canvas.getHeight() / 2 - size / 2;
      const shapeFill = style.color || '#FFAAAA';

      console.log('[addShapeElement] Adding shape:', shapeType, 'at', centerX, centerY, 'fill:', shapeFill);

      const shapeProps = {
        left: centerX,
        top: centerY,
        fill: shapeFill,
        strokeWidth: 2,
        stroke: 'hsl(var(--border))',
      };

      let shape;
      switch (shapeType) {
        case 'rectangle':
          shape = new Rect({ ...shapeProps, width: size, height: size });
          break;
        case 'circle':
          shape = new Circle({ ...shapeProps, radius: size / 2 });
          break;
        case 'triangle':
          shape = new Triangle({ ...shapeProps, width: size, height: size });
          break;
        default:
          return;
      }
      canvas.add(shape);
      canvas.setActiveObject(shape);
      exportCanvas();
    };

    return (
      <div className="border rounded-lg p-4 bg-background">
        <div ref={containerRef} className="relative group">
          {isLoading && (
            <Skeleton className="absolute inset-0 z-10 flex items-center justify-center h-[500px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </Skeleton>
          )}
          <canvas
            id="design-canvas"
            className="rounded-md border bg-background"
            aria-label="Design canvas"
          />
          {/* <div className="absolute top-2 right-2 flex gap-2 bg-background/90 p-2 rounded-lg shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" type="button" onClick={addTextElement}>
                  <Text className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Text</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" type="button" onClick={() => addShapeElement('rectangle')}>
                  <Square className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Rectangle</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" type="button" onClick={() => addShapeElement('circle')}>
                  <CircleIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Circle</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" type="button" onClick={() => addShapeElement('triangle')}>
                  <TriangleIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Triangle</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" onClick={deleteSelectedObject}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Selected</TooltipContent>
            </Tooltip>
          </div> */}
        </div>
      </div>
    );
  }
