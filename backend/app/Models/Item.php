<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_code',
        'name',
        'description',
        'category_id',
        'supplier_id',
        'unit_of_measurement',
        'reorder_point',
        'unit_price',
        'quantity',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(\App\Models\Supplier::class);
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    public function stockOuts()
    {
        return $this->hasMany(\App\Models\StockOut::class);
    }

    public function purchaseOrderitems()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }
}
