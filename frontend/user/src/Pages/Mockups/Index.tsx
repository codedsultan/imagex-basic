import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Mockup, PaginatedResponse } from "@/types";
import { ImageIcon, Eye, Trash2  } from "lucide-react";
import { formatDate } from '@/utils/dateFormatter';
import { useState } from "react";
import MockupPreviewModal from "@/components/mockup/MockupPreviewModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";



interface MockupIndexProps {
    mockups: PaginatedResponse<Mockup>;
}
export default function Index({ mockups }: MockupIndexProps) {

    const [previewMockup, setPreviewMockup] = useState<Mockup | null>(null);


    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Mockups</h2>}>
            <Head title="Mockups" />
            <div className="max-w-4xl mx-auto py-10">
                {/* <h1 className="text-3xl font-bold text-center mb-6">Mockup Generator</h1> */}
                {/* Create Mockup & Gallery Buttons */}
                <div className="flex justify-center gap-4 mb-6">
                    <Link href="/mockups/create">
                        <Button>Create Mockup</Button>
                    </Link>
                    {/* <Link href="/mockups/gallery">
                        <Button variant="outline">View Gallery</Button>
                    </Link> */}
                </div>
                {/* Tabs for Recent & Popular Mockups */}
                <Tabs defaultValue="recent">
                    <TabsList className="flex justify-center">
                        <TabsTrigger value="recent">Recent Mockups</TabsTrigger>
                        <TabsTrigger value="popular">Popular Mockups</TabsTrigger>
                    </TabsList>

                    <TabsContent value="recent">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Mockups</CardTitle>
                            </CardHeader>
                            <CardContent className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-20">Preview</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockups.data.map((mockup:Mockup) => (
                                            <TableRow key={mockup.id} className="hover:bg-muted/50 transition">
                                                <TableCell>
                                                    {mockup.thumbnail ? (
                                                        <img
                                                            src={mockup.thumbnail}
                                                            alt={mockup.name}
                                                            className="w-14 h-14 object-cover rounded-md border"
                                                        />
                                                    ) : (
                                                        <div className="flex w-14 h-14 items-center justify-center bg-muted rounded-md border text-gray-400">
                                                            <ImageIcon className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{mockup.name}</TableCell>
                                                <TableCell>{'T-Shirt'}</TableCell>

                                                <TableCell>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full
                                                        ${mockup.status === 'completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : mockup.status === 'draft'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {mockup.status?.charAt(0).toUpperCase() + mockup.status?.slice(1)}
                                                    </span>
                                                </TableCell>

                                                <TableCell>{formatDate(mockup.updated_at)}</TableCell>

                                                <TableCell className="text-right space-x-2">

                                                    <MockupPreviewModal
                                                        mockup={mockup}
                                                        trigger={
                                                            <Button variant="outline" size="sm" aria-label="Preview">
                                                              <Eye className="h-4 w-4" />
                                                            </Button>
                                                          }
                                                    />


                                                    {/* <Link href={route('mockups.editor',{mockup:mockup.id})} className="text-sm">
                                                        <Button variant="secondary" size="sm">Edit</Button>
                                                    </Link> */}
                                                    <ConfirmModal
                                                        trigger={
                                                            <Button variant="destructive" size="sm" aria-label="Delete">
                                                              <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                          }
                                                        title="Delete this item?"
                                                        description="This will permanently delete the item. Are you sure?"
                                                        confirmText="Delete"
                                                        onConfirm={() => {
                                                            // Call delete action (Inertia.post / form.submit)
                                                            console.log("Confirmed!");
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="popular">
                        <Card>
                            <CardHeader>
                                <CardTitle>Most Popular Mockups</CardTitle>
                            </CardHeader>
                            <CardContent>Coming Soon...</CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                <Pagination links={mockups.links} />
            </div>

        </AuthenticatedLayout>
    );
};

