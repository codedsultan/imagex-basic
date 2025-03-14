import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Trash2,
  Pencil,
  Share2,
  Copy,
  Maximize,
  Info
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Design {
  id: number;
  title: string;
  image_path: string;
  preview_url: string;
  full_image_url: string;
  watermarked_text: string;
}

interface DesignShowProps {
  auth: any;
  design: Design;
}

export default function DesignShow({ auth, design }: DesignShowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fullscreenView, setFullscreenView] = useState(false);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "The link to this design has been copied to your clipboard.",
      duration: 3000,
    });
  };

  const handleDownload = () => {
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = design.full_image_url;
    link.download = design.title || 'design';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your design is being downloaded.",
      duration: 3000,
    });
  };

  const handleDelete = () => {
    router.delete(route('designs.destroy', design.id), {
      onSuccess: () => {
        toast({
          title: "Design deleted",
          description: "The design has been successfully deleted.",
          duration: 3000,
        });
      }
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={route('designs')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Design Details
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={copyShareLink}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share design</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download design</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={route('designs.edit', design.id)}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit design</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete design</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      }
    >
      <Head title={design.title} />
      <Toaster />

      <div className="py-12">
        <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">{design.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {design.watermarked_text && design.watermarked_text}
                </Badge>
              </div>
            </CardHeader>

            <Tabs defaultValue="preview">
              <div className="px-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="preview" className="mt-4">
                <CardContent>
                  <Dialog open={fullscreenView} onOpenChange={setFullscreenView}>
                    <DialogTrigger asChild>
                      <div className="group relative cursor-pointer overflow-hidden rounded-lg border">
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                          <Maximize className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <img
                          src={design.full_image_url}
                          alt={design.title}
                          className="h-auto w-full object-contain"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl">
                      <div className="h-full w-full">
                        <img
                          src={design.full_image_url}
                          alt={design.title}
                          className="h-auto max-h-[80vh] w-full object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </TabsContent>

              <TabsContent value="details">
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">File Path</h4>
                        <p className="mt-1 flex items-center text-sm">
                          {design.image_path}
                          <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0" onClick={() => {
                            navigator.clipboard.writeText(design.image_path);
                            toast({
                              title: "Path copied",
                              description: "File path copied to clipboard",
                              duration: 2000,
                            });
                          }}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Preview URL</h4>
                        <p className="mt-1 flex items-center text-sm">
                        {design.preview_url}
                          <a href={design.preview_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View preview
                          </a>
                        </p>
                      </div>

                      {design.watermarked_text && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Watermark</h4>
                          <p className="mt-1 text-sm">{design.watermarked_text}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">ID</h4>
                        <p className="mt-1 text-sm">{design.id}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>

            <CardFooter className="border-t bg-gray-50 p-4 dark:bg-gray-800">
              <div className="flex w-full items-center justify-between">
                <Button variant="outline" asChild>
                  <Link href={route('designs')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Designs
                  </Link>
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the design "{design.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}