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
        Schema::create('mockup_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mockup_id')->constrained()->onDelete('cascade');
            $table->string('version_number')->default('1.0');
            $table->json('layers')->nullable();
            $table->json('configuration')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mockup_versions');
    }
};
