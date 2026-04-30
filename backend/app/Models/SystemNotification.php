<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'target_role',
        'user_id',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    protected $attributes = [
        'is_read' => false,
    ];
}
