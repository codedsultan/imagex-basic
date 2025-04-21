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
        Schema::create('editor_templates', function (Blueprint $table) {
            // $table->uuid('id')->primary();
            $table->ulid('id')->primary();
            $table->string('name');
            $table->enum('type', ['mockup', 'design', 'packaging']);
            $table->json('layers')->nullable();
            $table->json('configuration')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            // $table->string('thumbnail_url')->nullable();
            $table->timestamps();

            // Add index for faster queries by type
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('editor_templates');
    }
};
