import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Design {
  id: number;
  name: string;
  image_path: string;
  preview_url: string;
  full_image_url: string;
  watermarked_text: string;
  // This comes from an accessor in the model.
}

interface DesignShowProps {
  auth: any;
  design: Design;
}

export default function DesignShow({ auth, design }: DesignShowProps) {
  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800">Design Details</h2>}
    >
      <Head title={design.name} />

      <div className="py-12">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">{design.name}</h3>
            <div className="mb-4">
              <img
                src={design.full_image_url}
                alt={design.name}
                className="w-full h-auto object-contain"
              />
            </div>
            <div>
              <Link
                href={route('designs')}
                className="text-indigo-600 hover:text-indigo-900"
              >
                &larr; Back to Designs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
