<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Columns already exist in base items table migration
        // This migration is kept for backwards compatibility but does nothing
    }

    public function down()
    {
        // No changes needed
    }
};
