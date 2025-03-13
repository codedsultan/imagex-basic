<?php

namespace App\Modules\Product\Repositories;

use App\Modules\Product\Interfaces\Repositories\ProductRepositoryInterface;
use App\Modules\Product\Models\Product;

class EloquentProductRepository implements ProductRepositoryInterface
{
    public function getAllProducts()
    {
        return Product::with(['media', 'category'])->get();
    }

    public function getProductById(string $id)
    {
        return Product::with(['media', 'category'])->findOrFail($id);
    }

    public function deleteProduct(string $id)
    {
        return Product::destroy($id);
    }

    public function createProduct(array $attributes)
    {
        return Product::create($attributes);
    }

    public function updateProduct(string $id, array $attributes)
    {
        $product = Product::findOrFail($id);
        $product->update($attributes);
        return $product;
    }
}