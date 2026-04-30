<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_number',
        'item_id',
        'supplier_id',
        'quantity_requested',
        'requested_by',
        'status',
        'notes',
        'rejection_reason',
        'requested_date',
        'completed_date',
    ];

    protected $casts = [
        'requested_date' => 'datetime',
        'completed_date' => 'datetime',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function requestedBy()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
}
