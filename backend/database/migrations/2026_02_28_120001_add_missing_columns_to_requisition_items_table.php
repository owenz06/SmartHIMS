<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('requisition_items', function (Blueprint $table) {
            if (! Schema::hasColumn('requisition_items', 'requisition_id')) {
                $table->unsignedBigInteger('requisition_id')->after('id');
            }
            if (! Schema::hasColumn('requisition_items', 'item_id')) {
                $table->unsignedBigInteger('item_id')->after('requisition_id');
            }
            if (! Schema::hasColumn('requisition_items', 'quantity')) {
                $table->integer('quantity')->default(0)->after('item_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('requisition_items', function (Blueprint $table) {
            $columns = ['requisition_id', 'item_id', 'quantity'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('requisition_items', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
