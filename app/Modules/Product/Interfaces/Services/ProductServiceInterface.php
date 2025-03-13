<?php

namespace App\Modules\Product\Interfaces\Services;

interface ProductServiceInterface
{
    public function getAllProducts();
    public function createProduct(array $data);
    public function getProductById(string $id);
    public function updateProduct(string $id, array $data);
    public function deleteProduct(string $id);
}