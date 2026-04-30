<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    protected $fillable = [
        'purchase_order_id',
        'item_id',
        'quantity',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
