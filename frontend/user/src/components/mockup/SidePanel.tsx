// src/components/mockup/SidePanel.tsx
import React, { useRef, useState, useCallback } from 'react';
import { useMockupEditor } from '@/contexts/MockupEditorContext';
import { useMockupLayers } from '@/hooks/useMockupLayers';
import { useFabricUploader } from '@/hooks/useFabricUploader';
import { useToast } from '@/hooks/use-toast';
import { buildMockupPayload, saveMockup } from '@/utils/api';
import { toggleNamedObjects, createTextInPrintArea} from '@/utils/canvasHelpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Type, RefreshCw } from 'lucide-react';
import { EnhancedPropertyBar } from "./EnhancedPropertyBar";
import { LayerManagerPopover } from "./LayerManagerPopover";
import axios from 'axios';
import { useMockupCanvas } from '@/hooks/useMockupCanvas';
import { FabricObject } from 'fabric';


type CustomFabricObject = FabricObject & { name?: string };

export function SidePanel() {
  const { state, actions } = useMockupEditor();
  const { editor } = state;
  const { addLayer, removeLayer } = useMockupLayers();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mockupId, setMockupId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
//   const {
//     loadMockupImage,
//     constrainToPrintArea,
//   } = useMockupCanvas(canvasRef, containerRef);

const getPrintArea = useCallback(() => {
    const canvas = editor.canvas;
    if (!canvas) return null;

    // Find the object with a custom property "name" equal to "printArea"
    const printArea = canvas.getObjects().find((obj) => (obj as any).name === "printArea");

    if (printArea) {
      // getBoundingRect(true, true) accounts for object transformations.
      const boundingRect = printArea.getBoundingRect();
      return {
        left: boundingRect.left,
        top: boundingRect.top,
        width: boundingRect.width,
        height: boundingRect.height,
      };
    }
    return null;
  }, [editor.canvas]);
const constrainToPrintArea = useCallback((obj: CustomFabricObject) => {
    const canvas = editor.canvas;
    if (!canvas) return;
    // Disable skew controls.
    obj.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false });
    // Add delete control.
    // addDeleteControl(obj);
    // On moving, ensure the object's center stays within the print area.
    obj.on("moving", () => {
      const pa = getPrintArea();
      if (!pa) return;
      const objWidth = obj.getScaledWidth();
      const objHeight = obj.getScaledHeight();
      obj.set({
        left: Math.max(pa.left + objWidth / 2, Math.min(obj.left!, pa.left + pa.width - objWidth / 2)),
        top: Math.max(pa.top + objHeight / 2, Math.min(obj.top!, pa.top + pa.height - objHeight / 2)),
      });
      canvas.renderAll();
    });
    // On scaling, keep the object from growing beyond the print area.
    obj.on("scaling", () => {
      if (!canvas) return;
      const pa = getPrintArea();
      if (!pa) return;
      const objAspectRatio = obj.width! / obj.height!;
      const boundAspectRatio = pa.width / pa.height;
      const maxScale = objAspectRatio > boundAspectRatio
        ? pa.width / obj.width!
        : pa.height / obj.height!;
      if (obj.scaleX! > maxScale) {
        obj.scaleX = maxScale;
        obj.scaleY = maxScale;
      }
      // Keep object centered in print area.
      obj.set({
        left: pa.left + pa.width / 2,
        top: pa.top + pa.height / 2,
      });
      canvas.renderAll();
    });
  }, [editor.canvas, getPrintArea]);
  // File upload
  const { upload } = useFabricUploader(editor.canvas);
  const handleAddImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await upload(file);
    const img = editor.canvas!.getObjects().find(obj => (obj as CustomFabricObject).name === "uploadedImage");
    console.log('img',img)
    // editor.canvas.getObjects().find(o => o.name === 'uploadedImage') as fabric.Image;
    constrainToPrintArea(img!);
    e.target.value = '';
  }, [upload]);

  // Add text
  const handleAddText = useCallback(() => {
    if (!editor.canvas) return;
    const text = createTextInPrintArea(editor.canvas, { text: 'New Text' });
    if (text) {
    //   constrainToPrintArea(editor.canvas, text);
      constrainToPrintArea(text);
      addLayer(text);
    }
  }, [editor.canvas, addLayer]);

  // Save design
  const saveDesign = useCallback(async () => {
    const canvas = editor.canvas;
    if (!canvas) return;
    setSaving(true);
    toggleNamedObjects(canvas, 'printArea', false);
    // const jsonData = JSON.stringify(canvas.toJSON());
    const jsonData = JSON.stringify({ front: canvas.toJSON() });
    const image = canvas.toDataURL({ format: 'png', quality: 1 } as any);//canvas.toDataURL({ format: 'png', quality: 1 });
    try {
      const payload = buildMockupPayload({
        design_id: 1,
        product_id: 1,
        template_id: editor.template.id,
        name: editor.mockup.name,
        json_data: jsonData,
        front_image: image,
        print_areas: editor.printAreas,
        mockupId: mockupId || undefined,
      });
      const res = mockupId ? await saveMockup(mockupId, payload) : await saveMockup(null, payload);
      if (!mockupId) setMockupId(res.data.mockup.id);
    } catch (err) {
      console.error(err);
    } finally {
      toast({ title: 'Saved', description: 'Mockup saved successfully', variant: 'success' });
      toggleNamedObjects(canvas, 'printArea', true);
      canvas.renderAll();
      setSaving(false);
    }
  }, [editor.canvas, editor.template.id, editor.mockup.name, editor.printAreas, mockupId, toast]);

  return (
    <Card className="w-[500px] h-full m-2 flex flex-col">
      <CardHeader>
        <CardTitle>Design Controls</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 space-y-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAddImage}
          className="hidden"
        />
        <div className="flex gap-4">
          <Button onClick={() => fileInputRef.current?.click()}><ImageIcon /> Add Image</Button>
          <Button onClick={handleAddText}><Type /> Add Text</Button>
          <Button variant="secondary" onClick={() => removeLayer(editor.selectedObject!)} disabled={!editor.selectedObject}><RefreshCw /> Reset</Button>
        </div>
        {editor.viewMode === 'design' && editor.selectedObject && (
            <div className="border-t border-b p-4">
                <div className="flex gap-2 items-center">
                    <EnhancedPropertyBar />
                    {/* <LayerManagerPopover /> */}
                </div>
            </div>
        )}
        <div className="mt-auto">
          <Button className="w-full" onClick={saveDesign} disabled={saving}>
            <RefreshCw className="mr-2" /> {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
