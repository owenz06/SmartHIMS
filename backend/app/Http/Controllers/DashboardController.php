<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Supplier;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Super Admin & Admin Metrics
        if (in_array($user->role, ['super_admin', 'admin'])) {
            $totalUsers = User::count();
            $totalItems = Item::count();
            $totalSuppliers = Supplier::count();
            $totalDepartments = \App\Models\Department::count();
            $lowStockItems = Item::whereColumn('quantity', '<=', 'reorder_point')->count();
            $lowStockItemsList = Item::whereColumn('quantity', '<=', 'reorder_point')->with('category')->get();
            $pendingRequisitions = \App\Models\Requisition::where('status', 'Pending')->count();
            $pendingPOs = \App\Models\PurchaseOrder::where('status', 'Pending')->count();
            $todayStockOuts = \App\Models\StockOut::whereDate('created_at', now())->count();
            $recentLogs = \App\Models\AuditLog::with('user')->latest()->take(10)->get();

            // Inventory Distribution Data for 3D Pie Chart
            $totalInventoryItems = Item::count();
            $lowStockItemsCount = Item::whereColumn('quantity', '<=', 'reorder_point')->count();
            $normalStockItems = $totalInventoryItems - $lowStockItemsCount;
            $outOfStockItems = Item::where('quantity', 0)->count();
            $normalStockItems = $normalStockItems - $outOfStockItems; // Adjust normal stock
            
            $inventoryDistribution = [
                [
                    'name' => 'Normal',
                    'value' => $normalStockItems,
                    'color' => '#10b981' // Green
                ],
                [
                    'name' => 'Low Stock',
                    'value' => $lowStockItemsCount,
                    'color' => '#f59e0b' // Orange
                ],
                [
                    'name' => 'Out of Stock',
                    'value' => $outOfStockItems,
                    'color' => '#ef4444' // Red
                ]
            ];

            // Chart Data - Last 7 days (Monday to Sunday)
            $inventoryChart = [];
            $requisitionsChart = [];
            $purchaseOrdersChart = [];
            $stockOutsChart = [];
            
            // Start from Monday of current week and go back 6 days to get a full week
            $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
            
            for ($i = 0; $i < 7; $i++) {
                $date = $startDate->copy()->addDays($i);
                $dayName = $date->format('D');
                
                $inventoryChart[] = [
                    'day' => $dayName,
                    'count' => Item::whereDate('created_at', $date)->count()
                ];
                
                $requisitionsChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\Requisition::whereDate('created_at', $date)->count()
                ];
                
                $purchaseOrdersChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\PurchaseOrder::whereDate('created_at', $date)->count()
                ];
                
                $stockOutsChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\StockOut::whereDate('created_at', $date)->count()
                ];
            }

            return inertia('dashboard', compact(
                'totalUsers',
                'totalItems',
                'totalSuppliers',
                'totalDepartments',
                'lowStockItems',
                'lowStockItemsList',
                'pendingRequisitions',
                'pendingPOs',
                'todayStockOuts',
                'recentLogs',
                'inventoryDistribution',
                'inventoryChart',
                'requisitionsChart',
                'purchaseOrdersChart',
                'stockOutsChart'
            ));
        }

        // Manager Metrics
        if ($user->role === 'manager') {
            $totalItems = Item::count();
            $lowStockItems = Item::whereColumn('quantity', '<=', 'reorder_point')->count();
            $lowStockItemsList = Item::whereColumn('quantity', '<=', 'reorder_point')->with('category')->get();
            $pendingRequisitions = \App\Models\Requisition::where('status', 'Pending')->count();
            
            // Stock Requests - weekly (Monday to Sunday)
            $managerStockRequestsWeekly = \App\Models\StockRequest::whereBetween('created_at', [
                now()->startOfWeek(\Carbon\Carbon::MONDAY),
                now()->endOfWeek(\Carbon\Carbon::SUNDAY)
            ])->count();
            
            // Stock In - weekly and monthly (Monday to Sunday for weekly)
            $managerStockInWeekly = \App\Models\StockIn::whereBetween('created_at', [
                now()->startOfWeek(\Carbon\Carbon::MONDAY),
                now()->endOfWeek(\Carbon\Carbon::SUNDAY)
            ])->count();
            
            $managerStockInMonthly = \App\Models\StockIn::whereBetween('created_at', [
                now()->startOfMonth(),
                now()->endOfMonth()
            ])->count();
            
            // Stock Outs - weekly and monthly (Monday to Sunday for weekly)
            $stockOutsWeekly = \App\Models\StockOut::whereBetween('created_at', [
                now()->startOfWeek(\Carbon\Carbon::MONDAY),
                now()->endOfWeek(\Carbon\Carbon::SUNDAY)
            ])->count();
            
            $stockOutsMonthly = \App\Models\StockOut::whereBetween('created_at', [
                now()->startOfMonth(),
                now()->endOfMonth()
            ])->count();

            // Chart Data - Last 7 days for Manager (Monday to Sunday)
            $managerStockRequestsChart = [];
            $managerStockInChart = [];
            $managerStockOutsChart = [];
            $managerRequisitionsChart = [];
            
            // Start from Monday of current week
            $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
            
            for ($i = 0; $i < 7; $i++) {
                $date = $startDate->copy()->addDays($i);
                $dayName = $date->format('D');
                
                $managerStockRequestsChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\StockRequest::whereDate('created_at', $date)->count()
                ];
                
                $managerStockInChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\StockIn::whereDate('created_at', $date)->count()
                ];
                
                $managerStockOutsChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\StockOut::whereDate('created_at', $date)->count()
                ];
                
                $managerRequisitionsChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\Requisition::whereDate('created_at', $date)->count()
                ];
            }

            return inertia('dashboard', compact(
                'totalItems',
                'lowStockItems',
                'lowStockItemsList',
                'pendingRequisitions',
                'managerStockRequestsWeekly',
                'managerStockInWeekly',
                'managerStockInMonthly',
                'stockOutsWeekly',
                'stockOutsMonthly',
                'managerStockRequestsChart',
                'managerStockInChart',
                'managerStockOutsChart',
                'managerRequisitionsChart'
            ));
        }

        // Pharmacist Metrics
        if ($user->role === 'pharmacist') {
            $lowStockItems = Item::whereColumn('quantity', '<=', 'reorder_point')->count();
            $lowStockItemsList = Item::whereColumn('quantity', '<=', 'reorder_point')->with('category')->get();
            
            // Weekly dispensed (Stock Outs by this pharmacist) - Monday to Sunday
            $pharmacistDispensedWeekly = \App\Models\StockOut::where('user_id', $user->id)
                ->whereBetween('created_at', [
                    now()->startOfWeek(\Carbon\Carbon::MONDAY),
                    now()->endOfWeek(\Carbon\Carbon::SUNDAY)
                ])->count();

            // Chart Data - Last 7 days for Pharmacist (Monday to Sunday)
            $pharmacistDispensedChart = [];
            
            // Start from Monday of current week
            $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
            
            for ($i = 0; $i < 7; $i++) {
                $date = $startDate->copy()->addDays($i);
                $dayName = $date->format('D');
                
                $pharmacistDispensedChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\StockOut::where('user_id', $user->id)
                        ->whereDate('created_at', $date)
                        ->count()
                ];
            }

            return inertia('dashboard', compact(
                'lowStockItems',
                'lowStockItemsList',
                'pharmacistDispensedWeekly',
                'pharmacistDispensedChart'
            ));
        }

        // Procurement Officer Metrics
        if ($user->role === 'procurement_officer') {
            // Stock Requests - weekly and monthly (Monday to Sunday for weekly)
            $stockRequestsWeekly = \App\Models\StockRequest::whereBetween('created_at', [
                now()->startOfWeek(\Carbon\Carbon::MONDAY),
                now()->endOfWeek(\Carbon\Carbon::SUNDAY)
            ])->count();
            
            $stockRequestsMonthly = \App\Models\StockRequest::whereBetween('created_at', [
                now()->startOfMonth(),
                now()->endOfMonth()
            ])->count();
            
            // Purchase Orders - weekly and monthly (Monday to Sunday for weekly)
            $purchaseOrdersWeekly = \App\Models\PurchaseOrder::whereBetween('created_at', [
                now()->startOfWeek(\Carbon\Carbon::MONDAY),
                now()->endOfWeek(\Carbon\Carbon::SUNDAY)
            ])->count();
            
            $purchaseOrdersMonthly = \App\Models\PurchaseOrder::whereBetween('created_at', [
                now()->startOfMonth(),
                now()->endOfMonth()
            ])->count();
            
            // Total Suppliers (for procurement officer clickable card)
            $procurementSuppliers = Supplier::count();
            
            // Stock In - weekly and monthly (Monday to Sunday for weekly)
            $stockInWeekly = \App\Models\StockIn::whereBetween('created_at', [
                now()->startOfWeek(\Carbon\Carbon::MONDAY),
                now()->endOfWeek(\Carbon\Carbon::SUNDAY)
            ])->count();
            
            $stockInMonthly = \App\Models\StockIn::whereBetween('created_at', [
                now()->startOfMonth(),
                now()->endOfMonth()
            ])->count();
            
            // Recent Inventory Items (most recent 5)
            $recentInventoryItems = Item::with('category')
                ->latest()
                ->take(5)
                ->get();

            // Chart Data - Last 7 days for Stock Requests and Purchase Orders (Monday to Sunday)
            $stockRequestsChart = [];
            $purchaseOrdersChart = [];
            $stockInChart = [];
            
            // Start from Monday of current week
            $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
            
            for ($i = 0; $i < 7; $i++) {
                $date = $startDate->copy()->addDays($i);
                $dayName = $date->format('D');
                
                $stockRequestsChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\StockRequest::whereDate('created_at', $date)->count()
                ];
                
                $purchaseOrdersChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\PurchaseOrder::whereDate('created_at', $date)->count()
                ];
                
                $stockInChart[] = [
                    'day' => $dayName,
                    'count' => \App\Models\StockIn::whereDate('created_at', $date)->count()
                ];
            }
            
            // Suppliers by status (if you have a status field, otherwise just show total)
            $suppliersChart = [
                ['name' => 'Active', 'value' => Supplier::count()],
            ];

            return inertia('dashboard', compact(
                'stockRequestsWeekly',
                'stockRequestsMonthly',
                'purchaseOrdersWeekly',
                'purchaseOrdersMonthly',
                'procurementSuppliers',
                'stockInWeekly',
                'stockInMonthly',
                'recentInventoryItems',
                'stockRequestsChart',
                'purchaseOrdersChart',
                'stockInChart',
                'suppliersChart'
            ));
        }

        // Default user dashboard
        return inertia('dashboard');
    }
}
