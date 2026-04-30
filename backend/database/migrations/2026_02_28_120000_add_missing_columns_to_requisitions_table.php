<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('requisitions', function (Blueprint $table) {
            if (! Schema::hasColumn('requisitions', 'requisition_number')) {
                $table->string('requisition_number')->nullable()->after('id');
            }
            if (! Schema::hasColumn('requisitions', 'department_id')) {
                $table->unsignedBigInteger('department_id')->nullable()->after('requisition_number');
            }
            if (! Schema::hasColumn('requisitions', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('department_id');
            }
            if (! Schema::hasColumn('requisitions', 'status')) {
                $table->string('status')->default('Pending')->after('user_id');
            }
            if (! Schema::hasColumn('requisitions', 'requested_date')) {
                $table->timestamp('requested_date')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('requisitions', function (Blueprint $table) {
            $columns = ['requisition_number', 'department_id', 'user_id', 'status', 'requested_date'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('requisitions', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
