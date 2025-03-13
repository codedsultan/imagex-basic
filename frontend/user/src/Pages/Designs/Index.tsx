import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Design {
  id: number;
  name: string;
  thumbnail: string;   // URL for the thumbnail conversion.
  image_path: string;   // original image filename.
  preview_url: string;  // (if used, but thumbnail is our main conversion here)
}

interface DesignsIndexProps {
  auth: any;
  designs: Design[];
}

export default function DesignsIndex({ auth, designs }: DesignsIndexProps) {
  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Designs</h2>}>
      <Head title="Designs" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            {designs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {designs.map(design => (
                  <Link key={design.id} href={route('designs.show', design.id)} className="block">
                    <div className="border rounded overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <img
                          src={design.thumbnail}
                          alt={design.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium">{design.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No designs found.</p>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
