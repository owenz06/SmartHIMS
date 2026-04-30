<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockIn extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'supplier_id',
        'quantity_received',
        'received_date',
        'notes',
    ];

    public function item()
    {
        return $this->belongsTo(\App\Models\Item::class);
    }

    public function supplier()
    {
        return $this->belongsTo(\App\Models\Supplier::class);
    }
}
