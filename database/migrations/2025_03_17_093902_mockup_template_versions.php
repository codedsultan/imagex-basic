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
        Schema::create('mockup_template_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('template_id')->constrained('mockup_templates')->onDelete('cascade');
            $table->string('name');
            $table->string('slug'); // Not unique since versions can have the same slug
            $table->foreignId('category_id')->constrained();
            $table->enum('view_angle', ['front', 'back', 'left', 'right', '3d'])->default('front');
            $table->string('color_code');
            $table->enum('model_type', ['male', 'female', 'unisex', 'child', 'flat'])->default('unisex');
            $table->string('template_path');
            $table->json('design_area')->comment('JSON with x, y, width, height, rotation values');
            $table->json('layers')->nullable()->comment('Stored layer data for Fabric.js');
            $table->json('configuration')->nullable()->comment('Additional configuration settings');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
