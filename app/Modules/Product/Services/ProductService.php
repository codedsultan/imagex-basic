<?php

namespace App\Modules\Product\Services;

use App\Modules\Product\Interfaces\Repositories\ProductRepositoryInterface;
use App\Modules\Product\Interfaces\Services\ProductServiceInterface;

class ProductService implements ProductServiceInterface
{
    public function __construct(
        private ProductRepositoryInterface $productRepository
    ) {}

    public function getAllProducts()
    {
        return $this->productRepository->getAllProducts();
    }

    public function createProduct(array $data)
    {
        return $this->productRepository->createProduct($data);
    }

    public function getProductById(string $id)
    {
        return $this->productRepository->getProductById($id);
    }

    public function updateProduct(string $id, array $data)
    {
        return $this->productRepository->updateProduct($id, $data);
    }

    public function deleteProduct(string $id)
    {
        return $this->productRepository->deleteProduct($id);
    }
}