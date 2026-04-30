<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Column already exists in base items table migration
        // This migration is kept for backwards compatibility but does nothing
    }

    public function down(): void
    {
        // No changes needed
    }
};
