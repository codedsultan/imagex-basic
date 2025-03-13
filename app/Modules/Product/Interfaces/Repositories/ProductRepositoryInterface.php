<?php

namespace App\Modules\Product\Interfaces\Repositories;

interface ProductRepositoryInterface
{
    public function getAllProducts();
    public function getProductById(string $id);
    public function deleteProduct(string $id);
    public function createProduct(array $attributes);
    public function updateProduct(string $id, array $attributes);
}