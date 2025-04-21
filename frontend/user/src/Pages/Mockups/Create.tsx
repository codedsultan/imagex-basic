import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// import { EditorTemplate } from "@/types/editor";
import { MockupTemplate } from "@/types";

// Sample design gallery
const designs = [
  { id: 1, name: "Abstract Art", image: "/images/design1.png" },
  { id: 2, name: "Typography", image: "/images/design2.png" },
];

interface CreateMockupProps {
    // auth: any;
    templates: MockupTemplate[];
}
export default function CreateMockup ({ templates }: CreateMockupProps) {

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);
  const [uploadedDesign, setUploadedDesign] = useState<File | null>(null);

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Create Mockup</h2>}>
        <Head title="Create Mockup" />
        <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Create a New Mockup</h1>

        {/* Step 1: Select a Template */}
        <Card>
            <CardHeader>
            <CardTitle>Select a Template</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4">
            {templates.map((template) => (
                <div
                key={template.id}
                className={`border p-4 rounded-lg cursor-pointer ${
                    selectedTemplate === template.id ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedTemplate(template.id)}
                >
                <img src={template.thumbnail} alt={template.name} className="w-full h-32 object-contain rounded" />
                <p className="text-center mt-2">{template.name}</p>
                </div>
            ))}
            </CardContent>
        </Card>

        {/* Proceed to Editor */}
        <div className="flex justify-center mt-6">
            <Link
            href={`/mockups/editor?template=${selectedTemplate}&design=${selectedDesign || "uploaded"}`}
            className="w-full"
            >
            <Button disabled={!selectedTemplate} className="w-full">
                Proceed to Editor
            </Button>
            </Link>
        </div>
        </div>
    </AuthenticatedLayout>
  );
};

