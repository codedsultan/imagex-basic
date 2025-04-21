import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Trash2, Pencil, Share2, Copy, Maximize, Info, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useSwipeable } from 'react-swipeable';
import { Design } from '@/types';
import ZoomableImage from "@/components/ui/ZoomableImage";


interface DesignShowProps {
    auth: any;
    design: Design;
    designs: Design[]; // Added to enable gallery navigation
}

export default function DesignShow({ auth, design, designs }: DesignShowProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);
    // const [currentIndex, setCurrentIndex] = useState(designs?.findIndex(d => d.id === design.id));
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
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleNavigate('next'),
        onSwipedRight: () => handleNavigate('prev'),
        trackMouse: true
    });

    const [currentIndex, setCurrentIndex] = useState<number>(-1);

    useEffect(() => {
      if (design && designs?.length > 0) {
        const index = designs?.findIndex((d) => d.id === design.id);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
    }, [design, designs]);

    console.log('current index',currentIndex);
    console.log("design.id:", design?.id);
    console.log("designs map:", designs?.map(d => d.id));
    console.log("designs:", designs);

    const handleNavigate = (direction: 'prev' | 'next') => {
        const newIndex = direction === 'prev'
            ? currentIndex > 0 ? currentIndex - 1 : designs?.length - 1
            : currentIndex < designs?.length - 1 ? currentIndex + 1 : 0;

        router.visit(route('designs.show', designs[newIndex]?.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setCurrentIndex(newIndex)
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') handleNavigate('prev');
        if (e.key === 'ArrowRight') handleNavigate('next');
        if (e.key === 'Escape') setGalleryOpen(false);
    };

    // Keep other existing functions (copyShareLink, handleDownload, handleDelete)

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
            {/* Existing header content */}

            <div className="py-4">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="relative">
                            <div className="flex items-center justify-between">
                                {/* Existing header content */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setGalleryOpen(true)}
                                    className="absolute right-4 top-4"
                                >
                                    <Maximize className="h-4 w-4" />
                                </Button>
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
                                    <div {...swipeHandlers} className="relative group cursor-pointer">
                                        <img
                                            src={design.full_image_url}
                                            alt={design.title}
                                            className="w-full h-auto max-h-[70vh] object-contain rounded-lg border"
                                        />
                                        {/* <ZoomableImage
                                            src={design.full_image_url}
                                            alt={design.title}
                                            enableZoomToggle
                                            className="max-h-full max-w-full object-contain"
                                            // className="w-full h-auto max-h-[70vh] object-contain rounded-lg border"
                                        /> */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleNavigate('prev')}
                                                className="backdrop-blur-sm bg-white/50"
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-2" />
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleNavigate('next')}
                                                className="backdrop-blur-sm bg-white/50"
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
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
                          <a href={design.preview_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View preview
                          </a>
                        </p>
                      </div>

                      {/* {design.watermarked_text && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Watermark</h4>
                          <p className="mt-1 text-sm">{design.watermarked_text}</p>
                        </div>
                      )} */}

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">ID</h4>
                        <p className="mt-1 text-sm">{design.id}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>

            <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
                <DialogContent
                    // className="max-w-[95vw] h-[95vh] flex flex-col p-0 bg-transparent border-none"
                    className="w-screen h-screen p-0 bg-black/90 backdrop-blur-lg flex items-center justify-center"
                    onKeyDown={handleKeyDown}
                >
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-lg" />
                    <div className="relative z-50 flex-1 flex items-center justify-between p-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-16 w-16 text-white hover:bg-white/10"
                            onClick={() => handleNavigate('prev')}
                        >
                            <ChevronLeft className="h-10 w-10" />
                        </Button>

                        <div className="relative h-full w-full flex items-center justify-center">
                            {/* <img
                                src={design.full_image_url}
                                alt={design.title}
                                className="max-h-full max-w-full object-contain"
                            /> */}
                            <ZoomableImage
                                src={design.full_image_url}
                                alt={design.title}
                                enableZoomToggle
                                className="max-h-full max-w-full object-contain"
                            />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                                {currentIndex + 1} of {designs?.length}
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-16 w-16 text-white hover:bg-white/10"
                            onClick={() => handleNavigate('next')}
                        >
                            <ChevronRight className="h-10 w-10" />
                        </Button>
                    </div>

                    <div className="absolute right-4 top-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setGalleryOpen(false)}
                            className="text-white hover:bg-white/10 rounded-full h-12 w-12"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Existing delete dialog and other components */}
        </AuthenticatedLayout>
    );
}