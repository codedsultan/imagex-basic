import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle, Image as ImageIcon, Maximize, ChevronLeft, ChevronRight, X, Info } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSwipeable } from 'react-swipeable';
import { Design } from '@/types';
import ZoomableImage from "@/components/ui/ZoomableImage";

interface DesignsIndexProps {
    auth: any;
    designs: Design[];
}

export default function DesignsIndex({ auth, designs }: DesignsIndexProps) {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenGallery = (index: number) => {
        setSelectedIndex(index);
        setIsDialogOpen(true);
    };

    const handleNavigate = (direction: 'prev' | 'next') => {
        setSelectedIndex(prev => {
            if (direction === 'prev') return prev > 0 ? prev - 1 : designs.length - 1;
            return prev < designs.length - 1 ? prev + 1 : 0;
        });
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleNavigate('next'),
        onSwipedRight: () => handleNavigate('prev'),
        trackMouse: true
    });

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') handleNavigate('prev');
        if (e.key === 'ArrowRight') handleNavigate('next');
        if (e.key === 'Escape') setIsDialogOpen(false);
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Designs</h2>
                <Button asChild>
                    <Link href={route('designs.create')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Design
                    </Link>
                </Button>
            </div>
        }>
            <Head title="Designs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <ScrollArea className="h-full w-full">
                        {designs.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {designs.map((design, index) => (
                                    <Card key={design.id} className="group relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
                                        <div className="relative aspect-square">
                                            <button
                                                onClick={() => handleOpenGallery(index)}
                                                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Maximize className="h-8 w-8 text-white" />
                                            </button>
                                            {design.thumbnail ? (
                                                <img
                                                    src={design.thumbnail}
                                                    alt={design.title}
                                                    className="w-full h-full object-cover"
                                                />


                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                    <ImageIcon className="h-12 w-12 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <CardFooter className="p-4 h-16 group">
                                            <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                                                {design.title ?? 'Untitled Design'}
                                            </h3>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                                asChild
                                            >
                                                <Link href={route('designs.show', design.id)}>
                                                    <span className="sr-only">View Details</span>
                                                    <Info className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="border-dashed p-6">
                                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                    <ImageIcon className="mb-4 h-12 w-12 text-gray-400" />
                                    <h3 className="mb-2 text-xl font-medium">No designs found</h3>
                                    <p className="mb-4 text-sm text-gray-500">Get started by creating your first design</p>
                                    <Button asChild>
                                        <Link href={route('designs.create')}>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Create Design
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </ScrollArea>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

                        <div {...swipeHandlers} className="relative h-full w-full flex items-center justify-center">
                            {selectedIndex > -1 && (
                                // <img
                                //     src={designs[selectedIndex].full_image_url}
                                //     alt={designs[selectedIndex].title}
                                //     className="max-h-full max-w-full object-contain"
                                //     loading="eager"
                                // />
                                <ZoomableImage
                                    src={designs[selectedIndex].full_image_url}
                                    alt={designs[selectedIndex].title}
                                    enableZoomToggle
                                    className="w-full h-full"
                                />
                            )}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                                {selectedIndex + 1} of {designs.length}
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
                            onClick={() => setIsDialogOpen(false)}
                            className="text-white hover:bg-white/10 rounded-full h-12 w-12"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}