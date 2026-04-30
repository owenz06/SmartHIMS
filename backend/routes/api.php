<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController as ApiCategoryController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DepartmentController as ApiDepartmentController;
use App\Http\Controllers\Api\V1\ItemController as ApiItemController;
use App\Http\Controllers\Api\V1\PurchaseOrderController as ApiPurchaseOrderController;
use App\Http\Controllers\Api\V1\RequisitionController as ApiRequisitionController;
use App\Http\Controllers\Api\V1\StockInController as ApiStockInController;
use App\Http\Controllers\Api\V1\StockOutController as ApiStockOutController;
use App\Http\Controllers\Api\V1\StockTransactionController;
use App\Http\Controllers\Api\V1\SupplierController as ApiSupplierController;
use App\Http\Controllers\Api\V1\UserController as ApiUserController;
use App\Http\Controllers\Api\V1\ReportController as ApiReportController;
use App\Http\Controllers\Api\V1\AuditLogController as ApiAuditLogController;
use App\Http\Controllers\Api\V1\MessageController as ApiMessageController;
use App\Http\Controllers\Api\V1\NotificationController as ApiNotificationController;
use App\Http\Controllers\Api\V1\SettingsController as ApiSettingsController;
use App\Http\Controllers\Api\V1\PredictiveAnalysisController as ApiPredictiveAnalysisController;
use App\Http\Controllers\Api\V1\StockRequestController as ApiStockRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Token-based authentication via Laravel Sanctum.
| Frontend should obtain token via POST /api/login
| Send token as: Authorization: Bearer {token}
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login'])->name('api.login');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::get('/user', [AuthController::class, 'user'])->name('api.user');

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats'])->name('api.dashboard.stats');
    Route::get('/dashboard/charts', [DashboardController::class, 'charts'])->name('api.dashboard.charts');

    // Items/Inventory
    Route::get('/items', [ApiItemController::class, 'index'])->name('api.items.index');
    Route::get('/items/{item}', [ApiItemController::class, 'show'])->name('api.items.show');
    Route::post('/items', [ApiItemController::class, 'store'])->name('api.items.store');
    Route::put('/items/{item}', [ApiItemController::class, 'update'])->name('api.items.update');
    Route::delete('/items/{item}', [ApiItemController::class, 'destroy'])->name('api.items.destroy');

    // Stock Transactions
    Route::post('/stock-transactions', [StockTransactionController::class, 'store'])->name('api.stock-transactions.store');

    // Purchase Orders
    Route::get('/purchase-orders', [ApiPurchaseOrderController::class, 'index'])->name('api.purchase-orders.index');
    Route::get('/purchase-orders/{purchaseOrder}', [ApiPurchaseOrderController::class, 'show'])->name('api.purchase-orders.show');
    Route::post('/purchase-orders', [ApiPurchaseOrderController::class, 'store'])->name('api.purchase-orders.store');
    Route::put('/purchase-orders/{purchaseOrder}', [ApiPurchaseOrderController::class, 'update'])->name('api.purchase-orders.update');
    Route::delete('/purchase-orders/{purchaseOrder}', [ApiPurchaseOrderController::class, 'destroy'])->name('api.purchase-orders.destroy');
    Route::patch('/purchase-orders/{purchaseOrder}/status', [ApiPurchaseOrderController::class, 'updateStatus'])->name('api.purchase-orders.update-status');
    Route::post('/purchase-orders/{purchaseOrder}/approve', [ApiPurchaseOrderController::class, 'approve'])->name('api.purchase-orders.approve');

    // Requisitions
    Route::get('/requisitions', [ApiRequisitionController::class, 'index'])->name('api.requisitions.index');
    Route::get('/requisitions/{requisition}', [ApiRequisitionController::class, 'show'])->name('api.requisitions.show');
    Route::post('/requisitions', [ApiRequisitionController::class, 'store'])->name('api.requisitions.store');
    Route::put('/requisitions/{requisition}', [ApiRequisitionController::class, 'update'])->name('api.requisitions.update');
    Route::delete('/requisitions/{requisition}', [ApiRequisitionController::class, 'destroy'])->name('api.requisitions.destroy');
    Route::post('/requisitions/{requisition}/approve', [ApiRequisitionController::class, 'approve'])->name('api.requisitions.approve');

    // Categories
    Route::get('/categories', [ApiCategoryController::class, 'index'])->name('api.categories.index');
    Route::get('/categories/{category}', [ApiCategoryController::class, 'show'])->name('api.categories.show');
    Route::post('/categories', [ApiCategoryController::class, 'store'])->name('api.categories.store');
    Route::put('/categories/{category}', [ApiCategoryController::class, 'update'])->name('api.categories.update');
    Route::delete('/categories/{category}', [ApiCategoryController::class, 'destroy'])->name('api.categories.destroy');

    // Suppliers
    Route::get('/suppliers', [ApiSupplierController::class, 'index'])->name('api.suppliers.index');
    Route::get('/suppliers/{supplier}', [ApiSupplierController::class, 'show'])->name('api.suppliers.show');
    Route::post('/suppliers', [ApiSupplierController::class, 'store'])->name('api.suppliers.store');
    Route::put('/suppliers/{supplier}', [ApiSupplierController::class, 'update'])->name('api.suppliers.update');
    Route::delete('/suppliers/{supplier}', [ApiSupplierController::class, 'destroy'])->name('api.suppliers.destroy');

    // Departments
    Route::get('/departments', [ApiDepartmentController::class, 'index'])->name('api.departments.index');
    Route::get('/departments/{department}', [ApiDepartmentController::class, 'show'])->name('api.departments.show');
    Route::post('/departments', [ApiDepartmentController::class, 'store'])->name('api.departments.store');
    Route::put('/departments/{department}', [ApiDepartmentController::class, 'update'])->name('api.departments.update');
    Route::delete('/departments/{department}', [ApiDepartmentController::class, 'destroy'])->name('api.departments.destroy');

    // Stock In
    Route::get('/stock-in', [ApiStockInController::class, 'index'])->name('api.stock-in.index');
    Route::get('/stock-in/{stockIn}', [ApiStockInController::class, 'show'])->name('api.stock-in.show');
    Route::post('/stock-in', [ApiStockInController::class, 'store'])->name('api.stock-in.store');
    Route::put('/stock-in/{stockIn}', [ApiStockInController::class, 'update'])->name('api.stock-in.update');
    Route::delete('/stock-in/{stockIn}', [ApiStockInController::class, 'destroy'])->name('api.stock-in.destroy');

    // Stock Out
    Route::get('/stock-out', [ApiStockOutController::class, 'index'])->name('api.stock-out.index');
    Route::get('/stock-out/{stockOut}', [ApiStockOutController::class, 'show'])->name('api.stock-out.show');
    Route::post('/stock-out', [ApiStockOutController::class, 'store'])->name('api.stock-out.store');
    Route::put('/stock-out/{stockOut}', [ApiStockOutController::class, 'update'])->name('api.stock-out.update');
    Route::delete('/stock-out/{stockOut}', [ApiStockOutController::class, 'destroy'])->name('api.stock-out.destroy');

    // Stock Requests
    Route::get('/stock-requests', [ApiStockRequestController::class, 'index'])->name('api.stock-requests.index');
    Route::get('/stock-requests/{stockRequest}', [ApiStockRequestController::class, 'show'])->name('api.stock-requests.show');
    Route::post('/stock-requests', [ApiStockRequestController::class, 'store'])->name('api.stock-requests.store');
    Route::put('/stock-requests/{stockRequest}', [ApiStockRequestController::class, 'update'])->name('api.stock-requests.update');
    Route::put('/stock-requests/{stockRequest}/status', [ApiStockRequestController::class, 'updateStatus'])->name('api.stock-requests.update-status');
    Route::delete('/stock-requests/{stockRequest}', [ApiStockRequestController::class, 'destroy'])->name('api.stock-requests.destroy');

    // Users
    Route::get('/users', [ApiUserController::class, 'index'])->name('api.users.index');
    Route::get('/users/{user}', [ApiUserController::class, 'show'])->name('api.users.show');
    Route::post('/users', [ApiUserController::class, 'store'])->name('api.users.store');
    Route::put('/users/{user}', [ApiUserController::class, 'update'])->name('api.users.update');
    Route::delete('/users/{user}', [ApiUserController::class, 'destroy'])->name('api.users.destroy');

    // Reports
    Route::get('/reports', [ApiReportController::class, 'index'])->name('api.reports.index');
    Route::get('/reports/stock-movement', [ApiReportController::class, 'stockMovement'])->name('api.reports.stock-movement');
    Route::get('/reports/item-usage', [ApiReportController::class, 'itemUsage'])->name('api.reports.item-usage');

    // Audit Logs
    Route::get('/audit-logs', [ApiAuditLogController::class, 'index'])->name('api.audit-logs.index');
    Route::get('/audit-logs/stats', [ApiAuditLogController::class, 'stats'])->name('api.audit-logs.stats');
    Route::get('/audit-logs/{auditLog}', [ApiAuditLogController::class, 'show'])->name('api.audit-logs.show');

    // Messages
    Route::get('/messages/conversations', [ApiMessageController::class, 'conversations'])->name('api.messages.conversations');
    Route::get('/messages/eligible-recipients', [ApiMessageController::class, 'eligibleRecipients'])->name('api.messages.eligible-recipients');
    Route::get('/messages/unread-count', [ApiMessageController::class, 'unreadCount'])->name('api.messages.unread-count');
    Route::get('/messages/{conversation}', [ApiMessageController::class, 'show'])->name('api.messages.show');
    Route::post('/messages', [ApiMessageController::class, 'store'])->name('api.messages.store');
    Route::post('/messages/{conversation}/mark-as-read', [ApiMessageController::class, 'markAsRead'])->name('api.messages.mark-as-read');

    // Notifications
    Route::get('/notifications', [ApiNotificationController::class, 'index'])->name('api.notifications.index');
    Route::get('/notifications/unread-count', [ApiNotificationController::class, 'unreadCount'])->name('api.notifications.unread-count');
    Route::post('/notifications/{notification}/mark-as-read', [ApiNotificationController::class, 'markAsRead'])->name('api.notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [ApiNotificationController::class, 'markAllAsRead'])->name('api.notifications.mark-all-as-read');
    Route::delete('/notifications/{notification}', [ApiNotificationController::class, 'destroy'])->name('api.notifications.destroy');
    Route::delete('/notifications/delete-all-read', [ApiNotificationController::class, 'deleteAllRead'])->name('api.notifications.delete-all-read');

    // Settings
    Route::get('/settings/preferences', [ApiSettingsController::class, 'getPreferences'])->name('api.settings.preferences');
    Route::put('/settings/preferences', [ApiSettingsController::class, 'updatePreferences'])->name('api.settings.update-preferences');
    Route::put('/settings/password', [ApiSettingsController::class, 'updatePassword'])->name('api.settings.update-password');
    Route::put('/settings/theme', [ApiSettingsController::class, 'updateTheme'])->name('api.settings.update-theme');
    Route::put('/settings/notifications', [ApiSettingsController::class, 'updateNotifications'])->name('api.settings.update-notifications');

    // Predictive Analysis
    Route::get('/predictive-analysis', [ApiPredictiveAnalysisController::class, 'getAll'])->name('api.predictive-analysis.all');
    Route::get('/predictive-analysis/predictions', [ApiPredictiveAnalysisController::class, 'getPredictions'])->name('api.predictive-analysis.predictions');
    Route::get('/predictive-analysis/demand-forecast', [ApiPredictiveAnalysisController::class, 'getDemandForecast'])->name('api.predictive-analysis.demand-forecast');
    Route::get('/predictive-analysis/stock-optimization', [ApiPredictiveAnalysisController::class, 'getStockOptimization'])->name('api.predictive-analysis.stock-optimization');
    Route::get('/predictive-analysis/seasonal-trends', [ApiPredictiveAnalysisController::class, 'getSeasonalTrends'])->name('api.predictive-analysis.seasonal-trends');
    Route::get('/predictive-analysis/insights', [ApiPredictiveAnalysisController::class, 'getInsights'])->name('api.predictive-analysis.insights');
});
