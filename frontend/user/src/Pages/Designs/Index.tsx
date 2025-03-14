import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle, Image as ImageIcon } from "lucide-react";

interface Design {
    id: number;
    title: string;
    thumbnail: string;
    image_path: string;
    preview_url: string;
}

interface DesignsIndexProps {
    auth: any;
    designs: Design[];
}

export default function DesignsIndex({ auth, designs }: DesignsIndexProps) {
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
                        {designs.map(design => (
                        <Link key={design.id} href={route('designs.show', design.id)} className="block">
                            <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
                            <div className="p-2 w-full h-48  flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                {design.thumbnail ? (
                                    <img
                                        src={design.thumbnail}
                                        alt={design.title}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                <div className="flex  h-48 w-full items-center justify-center text-gray-400">
                                    <ImageIcon className="h-12 w-12" />
                                </div>
                                )}
                            </div>
                            <CardFooter className="p-4 h-16 group">
                                <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:line-clamp-none overflow-hidden text-ellipsis">
                                    {design.title ?? 'N/A'}
                                </h3>
                            </CardFooter>
                            </Card>
                        </Link>
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
        </AuthenticatedLayout>
    );
}