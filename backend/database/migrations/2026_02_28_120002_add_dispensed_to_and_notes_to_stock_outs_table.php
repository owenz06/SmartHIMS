<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_outs', function (Blueprint $table) {
            if (! Schema::hasColumn('stock_outs', 'dispensed_to')) {
                $table->string('dispensed_to')->nullable()->after('quantity_taken');
            }
            if (! Schema::hasColumn('stock_outs', 'notes')) {
                $table->text('notes')->nullable()->after('dispensed_to');
            }
        });
    }

    public function down(): void
    {
        Schema::table('stock_outs', function (Blueprint $table) {
            if (Schema::hasColumn('stock_outs', 'dispensed_to')) {
                $table->dropColumn('dispensed_to');
            }
            if (Schema::hasColumn('stock_outs', 'notes')) {
                $table->dropColumn('notes');
            }
        });
    }
};
