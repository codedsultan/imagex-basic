import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UppyUploader } from "@/components/UppyUploader";
import DesignCanvas from '@/components/DesignCanvas';
import axios from 'axios';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,

  } from "@/components/ui/tooltip"; // assuming you're using a wrapped version


interface CreateDesignProps {
  auth: any;
  suggestedName: string;
}

// Extend the form data with extra fields for scenario 2 (Text Design)
interface DesignFormData {
    title: string;
    description: string;
    design_data: string;
    // thumbnail: File | string | null;
    file: File | string | null;
    ai_prompt: string;
    style_color: string;
    style_shape: string;
    style_font: string;
    style_shape_size: 200,  // default shape size (e.g., 200px)
    style_shape_color: "#eeeeee", // default background shape color
    [key: string]: any; // Allow arbitrary keys
  }

export default function CreateDesign({ auth,suggestedName }: CreateDesignProps) {
  const { toast } = useToast();
  const { data, setData, post, processing, errors } = useForm<DesignFormData>({
    title: suggestedName,
    description: "",
    design_data: "",
    file: null,
    ai_prompt: "",
    style_color: "#000000", // default color (black)
    style_shape: "",
    style_font: "",
    style_shape_size: 200,
    style_shape_color: "#eeeeee",
  });

  const [generatingAI, setGeneratingAI] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const generateThumbnail = async () => {
    try {
      setGeneratingThumbnail(true);
      const response = await axios.post('/api/designs/generate-thumbnail', {
        design_data: data.design_data
      });

      setData('thumbnail', response.data.thumbnail);
      toast({
        title: "Preview Generated",
        description: "Thumbnail preview created successfully",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate preview",
        variant: "destructive",
      });
    } finally {
      setGeneratingThumbnail(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route("designs.store"), {
      onSuccess: () => {
        toast({
          title: "Design Created",
          description: "Your design has been successfully saved.",
        });
      },
      onError: (errors) => {
        // Only show toast if it's a server error, not a validation error
        if (!errors.title && !errors.file && !errors.description) {
          toast({
            title: "Something went wrong",
            description: "Could not save your design. Please try again.",
            variant: "destructive",
          });
        }
        // else: validation errors will show inline — no toast needed
      },
    });
  };

  // Generates design via AI. The "type" can be "text" or "image".
  const generateAIDesign = async (type: "text" | "image") => {
    try {
      setGeneratingAI(true);
      const response = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          prompt: data.ai_prompt,
          // For text-design, send style parameters:
          style: {
            color: data.style_color,
            shape: data.style_shape,
            font: data.style_font,
          },
          // For image-to-design, send the thumbnail URL if available.
          thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : null,
        }),
      });
      const result = await response.json();
      setData("design_data", JSON.stringify(result.design));
      toast({
        title: "Design Generated",
        description: "AI has generated your design!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingAI(false);
    }
  };

  // Callback for the UppyUploader in the "Image to Design" tab.
  const handleUppyComplete = (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const fileData = result.successful[0];
      const fileUrl =
        (fileData.response &&
          fileData.response.body &&
          fileData.response.body.fileUrl) ||
        fileData.uploadURL ||
        "";
      if (fileUrl) {
        setData("file", fileUrl);
        setPreviewImage(fileUrl);
        // Automatically trigger AI generation for image-to-design.
        generateAIDesign("image");
      }
    }
  };

  // Delete the uploaded file (from backend if already uploaded or simply clear preview)
  const handleDeleteUpload = async () => {
    if (data.thumbnail && typeof data.thumbnail === "string") {
      try {
        const response = await fetch("/api/designs/media", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl: data.thumbnail }),
        });
        if (response.ok) {
          setData("file", null);
          setPreviewImage(null);
          toast({
            title: "File Deleted",
            description: "The uploaded file has been removed.",
          });
        } else {
          toast({
            title: "Deletion Failed",
            description: "File could not be deleted.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Deletion Error",
          description: "An error occurred while deleting the file.",
          variant: "destructive",
        });
      }
    } else {
      // For files not yet uploaded, just clear the preview.
      setData("file", null);
      setPreviewImage(null);
    }
  };

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Create Design</h2>}>
      <Head title="Create Design" />
      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Design</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="direct-upload" className="w-full">
              <TabsList>
                <TabsTrigger value="direct-upload">Direct Upload</TabsTrigger>

                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <TabsTrigger
                        value="text-design"
                        className="pointer-events-none opacity-50"
                        disabled
                        >
                        Text Design
                        </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                        Coming Soon
                    </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                    <TooltipTrigger asChild>
                        <TabsTrigger
                        value="ai-generated"
                        className="pointer-events-none opacity-50"
                        disabled
                        >
                        AI Generated
                        </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                        Coming Soon
                    </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                    <TooltipTrigger asChild>
                        <TabsTrigger
                        value="image-to-design"
                        className="pointer-events-none opacity-50"
                        disabled
                        >
                        Image to Design
                        </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                        Coming Soon
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
              </TabsList>


                <form >
                  {/* Scenario 1: Direct Upload */}
                  <TabsContent value="direct-upload">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <label htmlFor="designName" className="block text-sm font-medium">
                          Design Name
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Input
                          id="designName"
                          value={data.title}
                          onChange={(e) => setData("title", e.target.value)}
                          required
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="description" className="block text-sm font-medium">
                          Description
                        </label>
                        <Textarea
                          id="description"
                          placeholder={`Describe your design...\nYou can mention colors, themes, or inspiration.`}
                          value={data.description}
                          onChange={(e) => setData("description", e.target.value)}
                          className="whitespace-pre-line placeholder:italic"

                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Upload Design
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <FileDropzone
                          onDrop={(files) => {
                            setData("file", files[0]);
                            setPreviewImage(URL.createObjectURL(files[0]));
                          }}
                        />
                        {previewImage && (
                          <div className="relative">
                            <img src={previewImage} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-md" />
                            <button
                              type="button"
                              onClick={handleDeleteUpload}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              title="Remove file"
                            >
                              &times;
                            </button>
                          </div>
                        )}
                        {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Scenario 2: Text Design (choose styles and optionally an AI prompt) */}

                <TabsContent value="text-design">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <label htmlFor="designNameText" className="block text-sm font-medium">
                          Design Name
                        </label>
                        <Input
                          id="designNameText"
                          value={data.title}
                          onChange={(e) => setData("title", e.target.value)}
                          required
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="descriptionText" className="block text-sm font-medium">
                          Description
                        </label>
                        <Textarea
                          id="descriptionText"
                          value={data.description}
                          placeholder="Describe your design (optional)"
                          onChange={(e) => setData("description", e.target.value)}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                        {/* <TooltipProvider> */}
                          <DesignCanvas
                            initialData={data.design_data}
                            onUpdate={(json) => setData("design_data", json)}
                            style={{
                              color: data.style_color,
                              shape: data.style_shape as "circle" | "rectangle" | "triangle",
                              // must be "circle" | "rectangle" | "triangle"
                              font: data.style_font,
                              shapeSize: data.style_shape_size,
                              shapeColor: data.style_shape_color,
                            }}
                          />
                        {/* </TooltipProvider> */}
                        </div>
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <label className="block text-sm font-medium">Preview</label>
                            <div className="border rounded-lg p-4 h-64 flex items-center justify-center">
                              {data.design_data ? (
                                <img
                                  src={`data:image/png;base64,${data.thumbnail}`}
                                  className="max-h-full"
                                  alt="Design preview"
                                />
                              ) : (
                                <span className="text-gray-400">Preview will appear here</span>
                              )}
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <label className="block text-sm font-medium">Generate Thumbnail</label>
                            <Button type="button" onClick={() => {/* generate thumbnail logic */}} disabled={!data.design_data}>
                              {generatingAI ? "Generating..." : "Generate Preview"}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="styleColor" className="block text-sm font-medium">
                          Text Color
                        </label>
                        <Input
                          id="styleColor"
                          type="color"
                          value={data.style_color}
                          onChange={(e) => setData("style_color", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="styleShape" className="block text-sm font-medium">
                          Background Shape
                        </label>
                        <select
                          id="styleShape"
                          value={data.style_shape}
                          onChange={(e) => setData("style_shape", e.target.value as "circle" | "rectangle" | "triangle")}
                          className="border rounded p-2"
                        >
                          <option value="">Select a shape</option>
                          <option value="rectangle">Rectangle</option>
                          <option value="circle">Circle</option>
                          <option value="triangle">Triangle</option>
                        </select>
                      </div>
                      {/* <div className="grid gap-2">
                        <label htmlFor="styleShapeSize" className="block text-sm font-medium">
                          Shape Size (px)
                        </label>
                        <Input
                          id="styleShapeSize"
                          type="number"
                          value={data.style_shape_size}
                          onChange={(e) => setData("style_shape_size", parseInt(e.target.value, 10))}
                          min={50}
                        />
                      </div> */}
                      {/* <div className="grid gap-2">
                        <label htmlFor="styleShapeColor" className="block text-sm font-medium">
                          Shape Color
                        </label>
                        <Input
                          id="styleShapeColor"
                          type="color"
                          value={data.style_shape_color}
                          onChange={(e) => setData("style_shape_color", e.target.value)}
                        />
                      </div> */}
                      <div className="grid gap-2">
                        <label htmlFor="styleFont" className="block text-sm font-medium">
                          Font
                        </label>
                        <select
                          id="styleFont"
                          value={data.style_font}
                          onChange={(e) => setData("style_font", e.target.value)}
                          className="border rounded p-2"
                        >
                          <option value="">Select a font</option>
                          <option value="arial">Arial</option>
                          <option value="times">Times New Roman</option>
                          <option value="roboto">Roboto</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="aiPromptText" className="block text-sm font-medium">
                          Optional AI Prompt
                        </label>
                        <Textarea
                          id="aiPromptText"
                          value={data.ai_prompt}
                          onChange={(e) => setData("ai_prompt", e.target.value)}
                          placeholder="Enter an optional prompt to further refine your design..."
                        />
                      </div>
                      <Button type="button" onClick={() => generateAIDesign("text")} disabled={generatingAI}>
                        {generatingAI ? "Generating..." : "Generate Text Design"}
                      </Button>
                      {generatingAI && <Skeleton className="h-[200px] w-full rounded-md" />}
                    </div>
                  </TabsContent>

                  {/* Scenario 3: AI Generated Design */}
                  <TabsContent value="ai-generated">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <label htmlFor="aiPromptPure" className="block text-sm font-medium">
                          AI Prompt
                        </label>
                        <Textarea
                          id="aiPromptPure"
                          value={data.ai_prompt}
                          onChange={(e) => setData("ai_prompt", e.target.value)}
                          placeholder="Enter prompt for AI generation..."
                        />
                      </div>
                      <Button type="button" onClick={() => generateAIDesign("text")} disabled={generatingAI}>
                        {generatingAI ? "Generating..." : "Generate AI Design"}
                      </Button>
                      {generatingAI && <Skeleton className="h-[200px] w-full rounded-md" />}
                    </div>
                  </TabsContent>

                  {/* Scenario 4: Image to Design */}
                  <TabsContent value="image-to-design">
                    <div className="space-y-4">
                      <UppyUploader mode="laravel" laravelEndpoint="/api/upload" onComplete={handleUppyComplete} />
                      {previewImage && (
                        <div className="relative">
                          <img src={previewImage} alt="Uploaded Preview" className="mt-2 h-32 w-32 object-cover rounded-md" />
                          <button
                            type="button"
                            onClick={handleDeleteUpload}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            title="Remove file"
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <div className="mt-6">
                    <Button type="button" onClick={handleSubmit} disabled={processing} className="w-full">
                      {processing ? "Creating..." : "Create Design"}
                    </Button>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
