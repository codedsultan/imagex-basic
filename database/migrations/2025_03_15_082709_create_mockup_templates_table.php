<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Schema::create('mockup_templates', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('slug')->unique(); // added slug
        //     $table->foreignId('category_id')->constrained();
        //     $table->text('description')->nullable();
        //     $table->enum('view_angle', ['front', 'back', 'left', 'right', '3d'])->default('front');
        //     $table->string('color_code');
        //     $table->enum('model_type', ['male', 'female', 'unisex', 'child', 'flat'])->default('unisex');
        //     $table->string('template_path');
        //     $table->json('design_area')->comment('JSON with x, y, width, height, rotation values');
        //     $table->boolean('is_active')->default(true);

        //     $table->timestamps();
        // });


        Schema::create('mockup_templates', function (Blueprint $table) {
            // $table->id();
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique(); // URL-friendly identifier
            $table->foreignId('category_id')->nullable()->constrained();

            $table->text('description')->nullable();
            $table->enum('view_angle', ['front', 'back', 'left', 'right', '3d'])->default('front');
            $table->string('color_code')->nullable()->comment('HEX color code');

            $table->enum('model_type', ['male', 'female', 'unisex', 'child', 'flat'])->default('unisex');
            $table->enum('type', ['tshirt'])->default('tshirt');
            $table->json('front_config')->nullable();
            $table->json('back_config')->nullable();
            $table->json('shared_config')->nullable();

            // $table->string('template_path')->nullable(); // Path to the template file
            $table->enum('file_type', ['svg', 'png', 'jpeg'])->default('svg'); // Added file type

            // $table->json('design_area')->nullable()->comment('JSON with x, y, width, height, rotation values');
            // $table->json('layers')->nullable()->comment('Stores Fabric.js objects (images, text, etc.)'); // ✅ New column
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mockup_templates');
    }
};
