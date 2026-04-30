<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This backend now serves as a pure API.
| All web routes have been moved to the React frontend.
| The frontend handles all UI routing via React Router.
|
*/

// Health check endpoint
Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'Hospital Inventory Management System API',
        'version' => '1.0.0',
        'endpoints' => [
            'api' => url('/api'),
            'documentation' => 'See README.md for API documentation',
        ],
    ]);
});

// API documentation endpoint
Route::get('/api', function () {
    return response()->json([
        'success' => true,
        'message' => 'Hospital Inventory Management System API',
        'version' => '1.0.0',
        'authentication' => 'Bearer Token (Laravel Sanctum)',
        'endpoints' => [
            'auth' => [
                'POST /api/login' => 'Login and get token',
                'POST /api/logout' => 'Logout (requires auth)',
                'GET /api/user' => 'Get authenticated user',
            ],
            'dashboard' => [
                'GET /api/dashboard/stats' => 'Get dashboard statistics',
                'GET /api/dashboard/charts' => 'Get chart data',
            ],
            'inventory' => [
                'GET /api/items' => 'List all items',
                'POST /api/items' => 'Create item',
                'GET /api/items/{id}' => 'Get single item',
                'PUT /api/items/{id}' => 'Update item',
                'DELETE /api/items/{id}' => 'Delete item',
            ],
            'purchase_orders' => [
                'GET /api/purchase-orders' => 'List purchase orders',
                'POST /api/purchase-orders' => 'Create purchase order',
                'POST /api/purchase-orders/{id}/approve' => 'Approve purchase order',
            ],
            'requisitions' => [
                'GET /api/requisitions' => 'List requisitions',
                'POST /api/requisitions' => 'Create requisition',
                'POST /api/requisitions/{id}/approve' => 'Approve requisition',
            ],
        ],
        'frontend' => env('FRONTEND_URL', 'http://localhost:3000'),
    ]);
});

// Catch-all route - redirect to API documentation
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Route not found. This is an API-only backend.',
        'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
        'api_documentation' => url('/api'),
    ], 404);
});

