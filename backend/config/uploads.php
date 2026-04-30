<?php

return [
    /*
    |--------------------------------------------------------------------------
    | File Upload Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for file uploads in the application.
    |
    */

    'max_size' => env('MAX_UPLOAD_SIZE', 10240), // KB (10MB default)
    
    'allowed_types' => [
        'images' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        'documents' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
        'all' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
    ],

    'paths' => [
        'items' => 'uploads/items',
        'purchase_orders' => 'uploads/purchase_orders',
        'documents' => 'uploads/documents',
        'temp' => 'uploads/temp',
    ],

    'image_sizes' => [
        'thumbnail' => [150, 150],
        'medium' => [300, 300],
        'large' => [800, 600],
    ],
];