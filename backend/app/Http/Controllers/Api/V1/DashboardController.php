<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\Requisition;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     * GET /api/dashboard/stats
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role;

        // Role-specific stats
        switch ($role) {
            case 'super_admin':
            case 'admin':
                $stats = $this->getAdminStats($user);
                break;
            case 'manager':
                $stats = $this->getManagerStats($user);
                break;
            case 'pharmacist':
                $stats = $this->getPharmacistStats($user);
                break;
            case 'procurement_officer':
                $stats = $this->getProcurementStats($user);
                break;
            default:
                $stats = $this->getDefaultStats();
                break;
        }

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get stats for Super Admin and System Admin
     */
    private function getAdminStats($user): array
    {
        $stats = [
            'inventory' => [
                'total_items' => Item::count(),
                'low_stock_items' => Item::whereColumn('quantity', '<=', 'reorder_point')->count(),
                'out_of_stock_items' => Item::where('quantity', 0)->count(),
                'total_value' => Item::sum(DB::raw('quantity * COALESCE(unit_price, 0)')),
            ],
            'purchase_orders' => [
                'total' => PurchaseOrder::count(),
                'pending' => PurchaseOrder::where('status', 'Pending')->count(),
                'approved' => PurchaseOrder::where('status', 'Approved')->count(),
                'received' => PurchaseOrder::where('status', 'Received')->count(),
            ],
            'requisitions' => [
                'total' => Requisition::count(),
                'pending' => Requisition::where('status', 'Pending')->count(),
                'approved' => Requisition::where('status', 'Approved')->count(),
                'fulfilled' => Requisition::where('status', 'Fulfilled')->count(),
            ],
            'stock_requests' => [
                'total' => \App\Models\StockRequest::count(),
                'pending' => \App\Models\StockRequest::where('status', 'Pending')->count(),
                'approved' => \App\Models\StockRequest::where('status', 'Approved')->count(),
                'rejected' => \App\Models\StockRequest::where('status', 'Rejected')->count(),
            ],
        ];

        // User stats
        if ($user->role === 'super_admin') {
            $stats['users'] = [
                'total' => User::count(),
                'active' => User::whereNotNull('email_verified_at')->count(),
                'by_role' => User::select('role', DB::raw('count(*) as count'))
                    ->groupBy('role')
                    ->pluck('count', 'role')
                    ->toArray(),
            ];
        } else {
            // System Admin cannot see Super Admin users
            $stats['users'] = [
                'total' => User::where('role', '!=', 'super_admin')->count(),
                'active' => User::where('role', '!=', 'super_admin')->whereNotNull('email_verified_at')->count(),
                'by_role' => User::where('role', '!=', 'super_admin')
                    ->select('role', DB::raw('count(*) as count'))
                    ->groupBy('role')
                    ->pluck('count', 'role')
                    ->toArray(),
            ];
        }

        return $stats;
    }

    /**
     * Get stats for Manager
     */
    private function getManagerStats($user): array
    {
        return [
            'inventory' => [
                'total_items' => Item::count(),
                'low_stock_items' => Item::whereColumn('quantity', '<=', 'reorder_point')->count(),
                'out_of_stock_items' => Item::where('quantity', 0)->count(),
                'total_value' => Item::sum(DB::raw('quantity * COALESCE(unit_price, 0)')),
            ],
            'requisitions' => [
                'total' => Requisition::count(),
                'pending' => Requisition::where('status', 'Pending')->count(),
                'approved' => Requisition::where('status', 'Approved')->count(),
                'fulfilled' => Requisition::where('status', 'Fulfilled')->count(),
            ],
            'stock_requests' => [
                'total' => \App\Models\StockRequest::where('requested_by', $user->id)->count(),
                'pending' => \App\Models\StockRequest::where('requested_by', $user->id)->where('status', 'Pending')->count(),
                'approved' => \App\Models\StockRequest::where('requested_by', $user->id)->where('status', 'Approved')->count(),
                'rejected' => \App\Models\StockRequest::where('requested_by', $user->id)->where('status', 'Rejected')->count(),
            ],
            'stock_movements' => [
                'stock_in_weekly' => \App\Models\StockIn::whereBetween('created_at', [
                    now()->startOfWeek(\Carbon\Carbon::MONDAY),
                    now()->endOfWeek(\Carbon\Carbon::SUNDAY)
                ])->count(),
                'stock_out_weekly' => \App\Models\StockOut::whereBetween('created_at', [
                    now()->startOfWeek(\Carbon\Carbon::MONDAY),
                    now()->endOfWeek(\Carbon\Carbon::SUNDAY)
                ])->count(),
            ],
            'categories' => [
                'total' => \App\Models\Category::count(),
            ],
        ];
    }

    /**
     * Get stats for Pharmacist
     */
    private function getPharmacistStats($user): array
    {
        return [
            'inventory' => [
                'total_items' => Item::count(),
                'low_stock_items' => Item::whereColumn('quantity', '<=', 'reorder_point')->count(),
                'out_of_stock_items' => Item::where('quantity', 0)->count(),
            ],
            'requisitions' => [
                'total' => Requisition::where('user_id', $user->id)->count(),
                'pending' => Requisition::where('user_id', $user->id)->where('status', 'Pending')->count(),
                'approved' => Requisition::where('user_id', $user->id)->where('status', 'Approved')->count(),
                'fulfilled' => Requisition::where('user_id', $user->id)->where('status', 'Fulfilled')->count(),
            ],
            'dispensing' => [
                'weekly' => \App\Models\StockOut::where('user_id', $user->id)
                    ->whereBetween('created_at', [
                        now()->startOfWeek(\Carbon\Carbon::MONDAY),
                        now()->endOfWeek(\Carbon\Carbon::SUNDAY)
                    ])->count(),
                'monthly' => \App\Models\StockOut::where('user_id', $user->id)
                    ->whereBetween('created_at', [
                        now()->startOfMonth(),
                        now()->endOfMonth()
                    ])->count(),
            ],
        ];
    }

    /**
     * Get stats for Procurement Officer
     */
    private function getProcurementStats($user): array
    {
        return [
            'purchase_orders' => [
                'total' => PurchaseOrder::count(),
                'pending' => PurchaseOrder::where('status', 'Pending')->count(),
                'approved' => PurchaseOrder::where('status', 'Approved')->count(),
                'received' => PurchaseOrder::where('status', 'Received')->count(),
            ],
            'stock_requests' => [
                'total' => \App\Models\StockRequest::count(),
                'pending' => \App\Models\StockRequest::where('status', 'Pending')->count(),
                'approved' => \App\Models\StockRequest::where('status', 'Approved')->count(),
                'rejected' => \App\Models\StockRequest::where('status', 'Rejected')->count(),
            ],
            'suppliers' => [
                'total' => \App\Models\Supplier::count(),
                'active' => \App\Models\Supplier::count(), // All suppliers are considered active since there's no status column
            ],
            'stock_movements' => [
                'stock_in_weekly' => \App\Models\StockIn::whereBetween('created_at', [
                    now()->startOfWeek(\Carbon\Carbon::MONDAY),
                    now()->endOfWeek(\Carbon\Carbon::SUNDAY)
                ])->count(),
                'stock_in_monthly' => \App\Models\StockIn::whereBetween('created_at', [
                    now()->startOfMonth(),
                    now()->endOfMonth()
                ])->count(),
            ],
            'inventory' => [
                'total_items' => Item::count(),
                'low_stock_items' => Item::whereColumn('quantity', '<=', 'reorder_point')->count(),
            ],
        ];
    }

    /**
     * Get default stats
     */
    private function getDefaultStats(): array
    {
        return [
            'inventory' => [
                'total_items' => Item::count(),
            ],
        ];
    }

    /**
     * Get dashboard charts data
     * GET /api/dashboard/charts
     */
    public function charts(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role;
        
        // Base charts for all roles
        $charts = [
            'stock_trend' => $this->getStockTrendChart(),
            'low_stock_items' => $this->getLowStockItems(),
        ];

        // Role-specific charts
        switch ($role) {
            case 'super_admin':
            case 'admin':
                $charts['category_distribution'] = $this->getCategoryDistributionChart();
                $charts['department_usage'] = $this->getDepartmentUsageChart();
                $charts['recent_activity'] = $this->getRecentActivity();
                $charts['inventory_chart'] = $this->getInventoryChart();
                $charts['requisitions_chart'] = $this->getRequisitionsChart();
                $charts['purchase_orders_chart'] = $this->getPurchaseOrdersChart();
                $charts['stock_outs_chart'] = $this->getStockOutsChart();
                break;
            
            case 'manager':
                $charts['category_distribution'] = $this->getCategoryDistributionChart();
                $charts['department_usage'] = $this->getDepartmentUsageChart();
                $charts['recent_activity'] = $this->getRecentActivity();
                $charts['requisitions_chart'] = $this->getRequisitionsChart();
                break;
            
            case 'pharmacist':
                $charts['dispensing_chart'] = $this->getDispensingChart($user);
                $charts['requisitions_chart'] = $this->getPharmacistRequisitionsChart($user);
                break;
            
            case 'procurement_officer':
                $charts['purchase_orders_chart'] = $this->getPurchaseOrdersChart();
                $charts['stock_in_chart'] = $this->getStockInChart();
                $charts['stock_requests_chart'] = $this->getStockRequestsChart();
                $charts['recent_activity'] = $this->getRecentActivity();
                break;
        }

        return response()->json([
            'success' => true,
            'data' => $charts,
        ]);
    }

    private function getStockTrendChart(): array
    {
        $data = [];
        $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dayName = $date->format('D');
            
            $stockIn = \App\Models\StockIn::whereDate('created_at', $date)->count();
            $stockOut = \App\Models\StockOut::whereDate('created_at', $date)->count();
            
            $data[] = [
                'day' => $dayName,
                'stockIn' => $stockIn,
                'stockOut' => $stockOut,
            ];
        }
        
        return $data;
    }

    private function getCategoryDistributionChart(): array
    {
        $categories = \App\Models\Category::withCount('items')->get();
        
        return $categories->map(function ($category) {
            return [
                'name' => $category->name,
                'value' => $category->items_count,
            ];
        })->toArray();
    }

    private function getDepartmentUsageChart(): array
    {
        // Get top 5 departments by requisition count
        $departments = \App\Models\Department::select('departments.id', 'departments.name')
            ->leftJoin('requisitions', 'departments.id', '=', 'requisitions.department_id')
            ->groupBy('departments.id', 'departments.name')
            ->orderByRaw('COUNT(requisitions.id) DESC')
            ->limit(5)
            ->get()
            ->map(function ($dept) {
                return [
                    'department' => $dept->name,
                    'usage' => \App\Models\Requisition::where('department_id', $dept->id)->count(),
                ];
            });
        
        return $departments->toArray();
    }

    private function getRecentActivity(): array
    {
        $activities = \App\Models\AuditLog::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description ?? $this->formatActivityDescription($log),
                    'user' => $log->user ? $log->user->name : 'System',
                    'created_at' => $log->created_at->diffForHumans(),
                    'type' => $this->getActivityType($log->action),
                ];
            });
        
        return $activities->toArray();
    }

    private function getLowStockItems(): array
    {
        $items = Item::whereColumn('quantity', '<=', 'reorder_point')
            ->with('category')
            ->orderBy('quantity', 'asc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'current_quantity' => $item->quantity,
                    'reorder_point' => $item->reorder_point,
                    'category' => $item->category ? $item->category->name : 'Uncategorized',
                ];
            });
        
        return $items->toArray();
    }

    private function getInventoryChart(): array
    {
        $data = [];
        $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dayName = $date->format('D');
            
            $data[] = [
                'day' => $dayName,
                'count' => Item::whereDate('created_at', $date)->count(),
            ];
        }
        
        return $data;
    }

    private function getRequisitionsChart(): array
    {
        $data = [];
        $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dayName = $date->format('D');
            
            $data[] = [
                'day' => $dayName,
                'count' => Requisition::whereDate('created_at', $date)->count(),
            ];
        }
        
        return $data;
    }

    private function getPurchaseOrdersChart(): array
    {
        $data = [];
        $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dayName = $date->format('D');
            
            $data[] = [
                'day' => $dayName,
                'count' => PurchaseOrder::whereDate('created_at', $date)->count(),
            ];
        }
        
        return $data;
    }

    private function getStockOutsChart(): array
    {
        $data = [];
        $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dayName = $date->format('D');
            
            $data[] = [
                'day' => $dayName,
                'count' => \App\Models\StockOut::whereDate('created_at', $date)->count(),
            ];
        }
        
        return $data;
    }

    private function formatActivityDescription($log): string
    {
        $action = ucfirst(str_replace('_', ' ', $log->action));
        $model = class_basename($log->model_type ?? 'Item');
        
        return "{$action} {$model}";
    }

    private function getActivityType($action): string
    {
        $typeMap = [
            'created' => 'success',
            'updated' => 'info',
            'deleted' => 'error',
            'approved' => 'success',
            'rejected' => 'error',
            'stock_in' => 'success',
            'stock_out' => 'warning',
        ];
        
        return $typeMap[$action] ?? 'info';
    }

    /**
     * Get dispensing chart for pharmacist
     */
    private function getDispensingChart($user): array
    {
        $data = [];
        $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dayName = $date->format('D');
            
            $data[] = [
                'day' => $dayName,
                'count' => \App\Models\StockOut::where('user_id', $user->id)
                    ->whereDate('created_at', $date)
                    ->count(),
            ];
        }
        
        return $data;
    }

    /**
     * Get requisitions chart for pharmacist
     */
    private function getPharmacistRequisitionsChart($user): array
    {
        $data = [];
        $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dayName = $date->format('D');
            
            $data[] = [
                'day' => $dayName,
                'count' => Requisition::where('user_id', $user->id)
                    ->whereDate('created_at', $date)
                    ->count(),
            ];
        }
        
        return $data;
    }

    /**
     * Get stock in chart
     */
    private function getStockInChart(): array
    {
        $data = [];
        $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dayName = $date->format('D');
            
            $data[] = [
                'day' => $dayName,
                'count' => \App\Models\StockIn::whereDate('created_at', $date)->count(),
            ];
        }
        
        return $data;
    }

    /**
     * Get stock requests chart
     */
    private function getStockRequestsChart(): array
    {
        $data = [];
        $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dayName = $date->format('D');
            
            $data[] = [
                'day' => $dayName,
                'count' => \App\Models\StockRequest::whereDate('created_at', $date)->count(),
            ];
        }
        
        return $data;
    }
}
