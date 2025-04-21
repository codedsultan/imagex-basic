import React, { useState, useCallback } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { Bold, Italic, Underline, FlipHorizontal, FlipVertical, Trash2, Settings } from 'lucide-react';
import { useMockupEditor } from '@/contexts/MockupEditorContext';
import { IText } from 'fabric';
import { Input } from '@/components/ui/input';
import { applyPropsAndRender } from '@/utils/objectHelpers';

export function EnhancedPropertyBar() {
  const { state, actions } = useMockupEditor();
  const { canvas, selectedObject } = state.editor;
  const [open, setOpen] = useState(false);
  if (!selectedObject) return null;

  const isText = selectedObject.type === 'i-text' || selectedObject.type === 'textbox';

  const updateProps = useCallback((props: Record<string, any>) => {
    applyPropsAndRender(selectedObject, props);
  }, [selectedObject]);

  const handleFlip = useCallback((dir: 'x' | 'y') => {
    updateProps({
      flipX: dir === 'x' ? !selectedObject.flipX : selectedObject.flipX,
      flipY: dir === 'y' ? !selectedObject.flipY : selectedObject.flipY,
    });
  }, [selectedObject, updateProps]);

  const handleFontChange = useCallback((font: string) => {
    if (isText) updateProps({ fontFamily: font });
  }, [isText, updateProps]);

  const handleDelete = useCallback(() => {
    canvas?.remove(selectedObject);
    actions.setSelectedObject(null);
    canvas?.renderAll();
  }, [canvas, selectedObject, actions]);

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="flex items-center gap-2 text-sm">
            <Settings size={16} /> Properties
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] max-h-[360px] overflow-y-auto p-4 bg-white border shadow-md">
          {isText && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label>Font</label>
                <Select onValueChange={handleFontChange}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Font" /></SelectTrigger>
                  <SelectContent>
                    {['Arial','Georgia','Courier New','Times New Roman'].map(f => (
                      <SelectItem value={f} key={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Toggle pressed={!!(selectedObject as IText).fontWeight} onPressedChange={p => updateProps({ fontWeight: p ? 'bold' : 'normal' })}><Bold/></Toggle>
                <Toggle pressed={!!(selectedObject as IText).fontStyle} onPressedChange={p => updateProps({ fontStyle: p ? 'italic' : 'normal' })}><Italic/></Toggle>
                <Toggle pressed={!!(selectedObject as IText).underline} onPressedChange={p => updateProps({ underline: p })}><Underline/></Toggle>
              </div>
              <div className="space-y-1">
                <label>Text Color</label>
                <ColorPicker value={selectedObject.fill as string} onChange={c => updateProps({ fill: c })} />
              </div>
              <div className="space-y-1">
                <label>Background</label>
                <ColorPicker value={selectedObject.backgroundColor as string} onChange={c => updateProps({ backgroundColor: c })} />
              </div>
              <div className="flex items-center justify-between">
                <label>Shadow</label>
                <Toggle pressed={!!selectedObject.shadow} onPressedChange={p => updateProps({ shadow: p ? { color:'rgba(0,0,0,0.3)', blur:4, offsetX:2, offsetY:2 } : null })} />
              </div>
            </div>
          )}
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-1">
              <label>Opacity</label>
              <Input type="number" defaultValue={selectedObject.opacity} onChange={e => updateProps({ opacity: parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-1">
              <label>Rotation (°)</label>
              <Input type="number" defaultValue={selectedObject.angle} onChange={e => updateProps({ angle: parseFloat(e.target.value) })} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleFlip('x')}><FlipHorizontal/></Button>
              <Button size="sm" variant="outline" onClick={() => handleFlip('y')}><FlipVertical/></Button>
            </div>
            <Button variant="destructive" size="sm" className="w-full" onClick={handleDelete}><Trash2 className="mr-2"/>Delete</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
