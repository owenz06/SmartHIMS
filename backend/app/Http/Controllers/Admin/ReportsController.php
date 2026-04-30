<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\PermissionHelper;
use App\Models\AuditLog;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportsController
{
    public function index()
    {
        $user = auth()->user();

        // Check view permission - Super Admin has reports.view_all, others have specific report permissions
        $canViewReports = PermissionHelper::can($user, 'reports.view_all') 
            || PermissionHelper::can($user, 'reports.view_stock')
            || PermissionHelper::can($user, 'reports.view_department')
            || PermissionHelper::can($user, 'reports.view_procurement');

        if (!$canViewReports) {
            abort(403, 'You do not have permission to view reports.');
        }

        // Monthly Usage
        $monthlyUsage = StockOut::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(quantity_taken) as total')
        )
            ->whereYear('created_at', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Most Used Items
        $mostUsed = StockOut::select('item_id', DB::raw('SUM(quantity_taken) as total_used'))
            ->groupBy('item_id')
            ->orderByDesc('total_used')
            ->with('item')
            ->take(5)
            ->get();

        // Reorder Suggestions
        $reorderSuggestions = Item::all()
            ->map(function ($item) {
                $timeframe = now()->subMonths(3);
                $monthlyUsage = StockOut::where('item_id', $item->id)
                    ->where('created_at', '>=', $timeframe)
                    ->sum('quantity_taken') / 3;

                $suggestedQuantity = max(0, ($monthlyUsage * 2) - $item->quantity);

                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'current_stock' => $item->quantity,
                    'monthly_avg' => round($monthlyUsage, 2),
                    'suggested_reorder' => round($suggestedQuantity),
                    'reorder_point' => $item->reorder_point,
                    'needs_reorder' => $item->quantity <= $item->reorder_point,
                ];
            })
            ->filter(function ($item) {
                return $item['needs_reorder'];
            })
            ->values();

        // Low Stock Items
        $lowStockItems = Item::where('quantity', '<=', DB::raw('reorder_point'))->get();

        // Recent Audit Logs - Super Admin and System Admin only
        $recentAuditLogs = collect([]);
        if (in_array($user->role, ['super_admin', 'admin'])) {
            $recentAuditLogs = AuditLog::with('user')
                ->latest()
                ->take(10)
                ->get();
        }

        return inertia('admin/reports', [
            'monthlyUsage' => $monthlyUsage,
            'mostUsed' => $mostUsed,
            'reorderSuggestions' => $reorderSuggestions,
            'lowStockItems' => $lowStockItems,
            'recentAuditLogs' => $recentAuditLogs,
            'canViewAuditLogs' => in_array($user->role, ['super_admin', 'admin']),
        ]);
    }

    public function stockMovement()
    {
        $stockIn = StockIn::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(quantity_received) as total')
        )
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->take(30)
            ->get();

        $stockOut = StockOut::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(quantity_taken) as total')
        )
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->take(30)
            ->get();

        return view('admin.reports.stock-movement', compact('stockIn', 'stockOut'));
    }

    public function auditLog()
    {
        $logs = AuditLog::with('user')
            ->latest()
            ->paginate(50);

        return view('admin.reports.audit-log', compact('logs'));
    }
}
    public function exportPDF()
    {
        $user = auth()->user();

        // Check permission
        $canViewReports = PermissionHelper::can($user, 'reports.view_all') 
            || PermissionHelper::can($user, 'reports.view_stock')
            || PermissionHelper::can($user, 'reports.view_department')
            || PermissionHelper::can($user, 'reports.view_procurement');

        if (!$canViewReports) {
            abort(403, 'You do not have permission to export reports.');
        }

        // Get the same data as index method
        $monthlyUsage = StockOut::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(quantity_taken) as total')
        )
            ->whereYear('created_at', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $mostUsed = StockOut::select('item_id', DB::raw('SUM(quantity_taken) as total_used'))
            ->groupBy('item_id')
            ->orderByDesc('total_used')
            ->with('item')
            ->take(5)
            ->get();

        $reorderSuggestions = Item::all()
            ->map(function ($item) {
                $timeframe = now()->subMonths(3);
                $monthlyAvg = StockOut::where('item_id', $item->id)
                    ->where('created_at', '>=', $timeframe)
                    ->sum('quantity_taken') / 3;

                $suggestedReorder = max(ceil($monthlyAvg * 2), $item->reorder_point);
                $needsReorder = $item->quantity <= $item->reorder_point;

                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'current_stock' => $item->quantity,
                    'monthly_avg' => round($monthlyAvg, 2),
                    'suggested_reorder' => $suggestedReorder,
                    'reorder_point' => $item->reorder_point,
                    'needs_reorder' => $needsReorder,
                ];
            })
            ->filter(fn($item) => $item['needs_reorder'])
            ->values();

        $lowStockItems = Item::where('quantity', '<=', DB::raw('reorder_point'))
            ->orderBy('quantity', 'asc')
            ->get();

        $recentAuditLogs = AuditLog::with('user')
            ->latest()
            ->take(10)
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.reports.pdf', compact(
            'monthlyUsage',
            'mostUsed', 
            'reorderSuggestions',
            'lowStockItems',
            'recentAuditLogs'
        ));

        return $pdf->download('inventory_report_' . date('Y-m-d') . '.pdf');
    }