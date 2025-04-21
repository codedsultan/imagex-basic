// import { useEffect } from 'react';
// import type { Canvas } from 'fabric';
// import { generatePreview } from '../utils/canvasHelpers';

// /**
//  * Hook to switch between design and preview modes.
//  */
// export function useCanvasPreview(
//   canvas: Canvas | null,
//   view: 'design' | 'preview',
//   setImage: (url: string) => void,
//   onMode: (mode: 'design' | 'preview') => void
// ) {
//   useEffect(() => {
//     if (!canvas) return;
//     if (view === 'preview') {
//       (async () => {

//         const url = await generatePreview(canvas);
//         console.log('url',url)
//         setImage(url);
//         onMode('preview');
//       })();
//     } else {
//       onMode('design');
//     }
//   },
// //   []
// //   [canvas, view, setImage, onMode]
// [canvas, view]

// );
// }



import { useCallback, useEffect } from "react";
import type { Canvas } from "fabric";
import { useMockupEditor } from "@/contexts/MockupEditorContext";




export function useCanvasPreview(
  canvas: Canvas | null,
  view: "design" | "preview",
  setImage: (url: string) => void,
  onMode: (mode: "design" | "preview") => void
) {

    const { state, actions } = useMockupEditor();
    const { editor } = state;

    const updateCanvasState = useCallback(() => {
        if (editor.canvas) {
          const stateJSON = JSON.stringify(editor.canvas.toJSON());
          actions.saveCurrentCanvasStateForOrientation(editor.currentOrientation, stateJSON);

          const localKey = `canvasState_${editor.currentOrientation}`;
          localStorage.setItem(localKey, stateJSON);
          console.log(`Saved state for ${editor.currentOrientation} in context and localStorage.`);
        }
      }, [editor.canvas, editor.currentOrientation, actions]);

  useEffect(() => {
    if (!canvas) return;

    const handlePreview = async () => {
        console.log('view',view)
      if (view === "preview") {
        updateCanvasState();
        console.log('view',view)
        // Hide print area
        const printArea = canvas.getObjects().find(obj => (obj as any).name === "printArea");
        if (printArea) {
          printArea.visible = false;
        }

        // Render and capture
        canvas.renderAll();
        const url = canvas.toDataURL({
          format: "png",
          quality: 1,
          enableRetinaScaling: false,
          multiplier: 1,
        });

        // Restore print area
        if (printArea) {
          printArea.visible = true;
        }

        canvas.renderAll();
        setImage(url);
        onMode("preview");
      } else {
        onMode("design");
      }
    };

    handlePreview();
  }, [canvas, view]);
}
