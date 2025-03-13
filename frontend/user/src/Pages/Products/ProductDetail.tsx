import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
}

interface PageProps {
  auth: any;
  product: Product;
}

export default function ProductDetail({ auth, product }: PageProps) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {product.name}
        </h2>
      }
    >
      <Head title={product.name} />
      <div className="p-4 border rounded">
        <p className="text-gray-600">{product.description}</p>
        <div className="mt-2 text-lg font-bold">Price: ${product.price}</div>
      </div>
    </AuthenticatedLayout>
  );
}
