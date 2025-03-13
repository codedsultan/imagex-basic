<?php

namespace App\Modules\Product\Controllers;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Modules\Product\Interfaces\Services\ProductServiceInterface;

class ProductController extends Controller
{
    public function __construct(
        private ProductServiceInterface $productService
    ) {}

    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => $this->productService->getAllProducts()
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    // Other controller methods following same pattern
}