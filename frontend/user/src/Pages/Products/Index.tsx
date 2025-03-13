import React from 'react';
import { Head, Link ,usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  media: any[];
}

interface PageProps {
  auth: any;
  products: Product[];
}

export default function ProductList({ auth, products }: PageProps) {

  return (
    <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                Products
            </h2>
        }
    >
      <Head title="Products" />
      {/* <ul>
        {products.map(product => (
          <li key={product.id} className="mb-2 p-4 border rounded">
            <Link href={`/products/${product.slug}`} className="text-lg font-semibold">
              {product.name}
            </Link>
            <p className="text-gray-600">{product.description}</p>
            <span className="text-green-600 font-bold">${product.price}</span>
          </li>
        ))}
      </ul> */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
            {/* <h1 className="text-2xl font-bold">Products</h1> */}
            <Link 
            href="/products/create"
            className="btn btn-primary"
            >
            Create New Product
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
            <div key={product.id} className="card bg-base-100 shadow-xl">
                <figure>
                <img 
                    src={product.media[0]?.original_url} 
                    alt={product.name}
                    className="h-48 w-full object-cover"
                />
                </figure>
                <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p>{product.description}</p>
                <div className="card-actions justify-end">
                    <Link 
                    href={`/products/${product.id}`}
                    className="btn btn-ghost"
                    >
                    View Details
                    </Link>
                </div>
                </div>
            </div>
            ))}
        </div>
     </div>
    </AuthenticatedLayout>
  );
};

