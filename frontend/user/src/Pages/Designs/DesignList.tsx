import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Design {
  id: number;
  title: string;
  slug: string;
  description?: string;
}

interface PageProps {
  auth: any;
  designs: Design[];
}

export default function DesignList({ auth, designs }: PageProps) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Designs
        </h2>
      }
    >
      <Head title="Designs" />
      <ul>
        {designs.map(design => (
          <li key={design.id} className="mb-2 p-4 border rounded">
            <Link href={`/designs/${design.slug}`} className="text-lg font-semibold">
              {design.title}
            </Link>
            {design.description && <p className="text-gray-600">{design.description}</p>}
          </li>
        ))}
      </ul>
    </AuthenticatedLayout>
  );
}
