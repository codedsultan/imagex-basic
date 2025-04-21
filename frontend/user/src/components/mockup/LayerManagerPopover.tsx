// src/components/mockup/LayerManagerPopover.tsx
import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Pencil,
} from 'lucide-react';
import { useMockupEditor } from '@/contexts/MockupEditorContext';
import { useMockupLayers } from '@/hooks/useMockupLayers';
import { cn } from '@/lib/utils';
import type { FabricObject } from 'fabric';

// Extend FabricObject with optional 'name'
type CustomFabricObject = FabricObject & { name?: string };

export function LayerManagerPopover() {
  const { state, actions } = useMockupEditor();
  const { editor } = state;
  const { canvas, selectedObject } = editor;
  const { getLayers, removeLayer, moveLayer, toggleLayerVisibility, toggleLayerLock } = useMockupLayers();
  const [open, setOpen] = useState(false);
  const [editingLayerIndex, setEditingLayerIndex] = useState<number | null>(null);
  const [layerNames, setLayerNames] = useState<Record<number, string>>({});

  const layers = getLayers();
  if (!canvas) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="flex gap-2 items-center">
          <Layers size={16} /> Layers
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        avoidCollisions={false}
        className="w-[340px] p-2 shadow-md bg-white border z-50 max-h-[300px] overflow-y-auto"
      >
        {layers.map((obj, index) => {
          const typedObj = obj as CustomFabricObject;
          const isSelected = obj === selectedObject;
          const isLocked = !obj.selectable;
          const isHidden = !obj.visible;
          const name = layerNames[index] || `Layer ${index + 1}`;

          return (
            <div
              key={index}
              className={cn(
                'group border-b last:border-b-0 px-2 py-2 hover:bg-muted transition-colors',
                isSelected && 'bg-blue-50'
              )}
            >
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1">
                  {editingLayerIndex === index ? (
                    <Input
                      value={layerNames[index] || ''}
                      onChange={(e) =>
                        setLayerNames((prev) => ({
                          ...prev,
                          [index]: e.target.value,
                        }))
                      }
                      onBlur={() => {
                        const newName = layerNames[index] || `Layer ${index + 1}`;
                        typedObj.set('name', newName);
                        canvas.renderAll();
                        setEditingLayerIndex(null);
                      }}
                      autoFocus
                      className="text-sm h-8"
                    />
                  ) : (
                    <div
                      className="text-sm font-medium flex items-center gap-1 cursor-pointer"
                      onClick={() => setEditingLayerIndex(index)}
                    >
                      <Pencil size={14} className="text-muted-foreground" />
                      <span className="truncate max-w-[160px]">{name}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1 flex-wrap">
                  <IconBtn onClick={() => toggleLayerVisibility(obj)} icon={isHidden ? <EyeOff size={16}/> : <Eye size={16}/>}/>
                  <IconBtn onClick={() => toggleLayerLock(obj)} icon={isLocked ? <Lock size={16}/> : <Unlock size={16}/>}/>
                  <IconBtn onClick={() => moveLayer(obj, true)} icon={<ArrowUp size={16}/>}/>
                  <IconBtn onClick={() => moveLayer(obj, false)} icon={<ArrowDown size={16}/>}/>
                  <IconBtn onClick={() => { actions.setSelectedObject(obj); canvas.renderAll(); }} icon={<span>🔍</span>}/>
                  <IconBtn onClick={() => removeLayer(obj)} icon={<Trash2 size={16} className="text-red-500"/>}/>
                </div>
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

function IconBtn({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) {
  return (
    <Button size="icon" variant="ghost" className="h-8 w-8 p-0" onClick={onClick}>
      {icon}
    </Button>
  );
}
