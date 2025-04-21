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
        Schema::create('mockups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // added slug
            // $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('design_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignUlid('template_id')->nullable()->constrained('mockup_templates')->onDelete('cascade');

            $table->enum('status', ['draft', 'completed'])->default('draft');
            $table->string('type')->default('t-shirt');
            // $table->json('layers')->nullable(); // Stores Fabric.js design layers
            // $table->json('configuration')->nullable(); // Should we split this into separate fields?
            $table->json('layer_configurations')->nullable();
            // 'json_data' => 'array',
            $table->json('json_data')->nullable();
            $table->json('print_areas')->nullable();
            $table->json('front_canvas_state')->nullable();
            $table->json('back_canvas_state')->nullable();

            $table->json('metadata')->nullable();
            $table->enum('current_view', ['front', 'back'])->default('front');
            $table->index(['user_id', 'updated_at']);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mockups');
    }
};
