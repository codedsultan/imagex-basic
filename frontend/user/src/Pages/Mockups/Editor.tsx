import React, { useState ,useEffect} from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MockupCanvas } from '@/components/mockup/MockupCanvas';
import { SidePanel } from '@/components/mockup/SidePanel';
import { EditorProvider, useMockupEditor } from '@/contexts/MockupEditorContext';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FlipHorizontal } from 'lucide-react';

interface EditorProps {
  suggestedName: string;
  mockup_id: number;
  template_id: string;
}

export default function Editor({ suggestedName, mockup_id, template_id }: EditorProps) {
  return (
    <AuthenticatedLayout header={<h2>{`Mockup Editor - ${suggestedName}`}</h2>}>
      <Head title={suggestedName} />
      <EditorProvider templateId={template_id} mockupId={mockup_id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MockupEditorLayout />
      </div>
      </EditorProvider>
    </AuthenticatedLayout>
  );
}

export function MockupEditorLayout() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { state, actions } = useMockupEditor();
  const { editor } = state;

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col">

        {/* <Tabs value={view} onValueChange={setView} className="sticky top-0 z-10"> */}
        {/* <Tabs value={editor.viewMode} onValueChange={(value: string) => setView(value as "design" | "preview")} className="sticky top-0 z-10"> */}
        <Tabs value={editor.viewMode} onValueChange={(value: string) => actions.setViewMode(value as "design" | "preview")} className="sticky top-0 z-10 m-2">
          <TabsList>
            <TabsTrigger value="design"><FlipHorizontal /> Design</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs value={editor.viewMode}>
            <div className="flex-1 relative">
            <TabsContent value="design">
                <MockupCanvas
                    orientation={editor.currentOrientation}
                    onPreviewImage={setPreviewImage}
                />
            </TabsContent>
            <TabsContent value="preview">
                {previewImage && (
                <img
                    src={previewImage}
                    alt="Design Preview"
                    className="w-full h-auto"
                />
                )}
            </TabsContent>
            </div>
        </Tabs>
        <div className="flex justify-center p-2 gap-2">
          <Button
            variant={editor.currentOrientation === 'front' ? 'default' : 'outline'}
            onClick={() => actions.setOrientation('front')}
          >
            Front
          </Button>
          <Button
            variant={editor.currentOrientation === 'back' ? 'default' : 'outline'}
            onClick={() => actions.setOrientation('back')}
          >
            Back
          </Button>

        </div>
      </div>
      <SidePanel />
    </div>
  );
}
