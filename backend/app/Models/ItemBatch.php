<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemBatch extends Model
{
    public function item()
    {
        Schema::create('item_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();
            $table->string('batch_number');
            $table->integer('quantity');
            $table->date('expiry_date')->nullable();
            $table->decimal('purchase_price', 10, 2)->nullable();
            $table->timestamps();
        });
    }
}
