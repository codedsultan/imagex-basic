import { Link } from '@inertiajs/react';
// import { useProductStore } from '@/stores/productStore';

export default function ProductIndex() {
  const { products } = {products:[]};
  
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
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
  );
}