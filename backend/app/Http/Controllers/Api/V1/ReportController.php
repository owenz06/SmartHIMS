<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;
use App\Models\PurchaseOrder;
use App\Models\Requisition;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Get date range from request or default to current month
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        // Monthly Usage
        $monthlyUsage = StockOut::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('YEAR(created_at) as year'),
            DB::raw('SUM(quantity_taken) as total')
        )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Most Used Items
        $mostUsed = StockOut::select('item_id', DB::raw('SUM(quantity_taken) as total_used'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('item_id')
            ->orderByDesc('total_used')
            ->with('item')
            ->take(10)
            ->get()
            ->map(function ($stockOut) {
                return [
                    'item_id' => $stockOut->item_id,
                    'item_name' => $stockOut->item->name ?? 'Unknown',
                    'total_used' => $stockOut->total_used,
                ];
            });

        // Low Stock Items
        $lowStockItems = Item::whereColumn('quantity', '<=', 'reorder_point')
            ->with('category')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'sku' => $item->item_code,
                    'quantity' => $item->quantity,
                    'reorder_point' => $item->reorder_point,
                    'category' => $item->category->name ?? 'Uncategorized',
                ];
            });

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
                    'sku' => $item->item_code,
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

        // Stock Movement Summary
        $stockInTotal = StockIn::whereBetween('created_at', [$startDate, $endDate])
            ->sum('quantity_received');
        
        $stockOutTotal = StockOut::whereBetween('created_at', [$startDate, $endDate])
            ->sum('quantity_taken');

        // Purchase Orders Summary
        $purchaseOrdersStats = [
            'total' => PurchaseOrder::whereBetween('created_at', [$startDate, $endDate])->count(),
            'pending' => PurchaseOrder::where('status', 'pending')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'approved' => PurchaseOrder::where('status', 'approved')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'received' => PurchaseOrder::where('status', 'received')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
        ];

        // Requisitions Summary
        $requisitionsStats = [
            'total' => Requisition::whereBetween('created_at', [$startDate, $endDate])->count(),
            'pending' => Requisition::where('status', 'pending')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'approved' => Requisition::where('status', 'approved')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'fulfilled' => Requisition::where('status', 'fulfilled')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'date_range' => [
                    'start' => $startDate,
                    'end' => $endDate,
                ],
                'monthly_usage' => $monthlyUsage,
                'most_used_items' => $mostUsed,
                'low_stock_items' => $lowStockItems,
                'reorder_suggestions' => $reorderSuggestions,
                'stock_movement' => [
                    'stock_in' => $stockInTotal,
                    'stock_out' => $stockOutTotal,
                    'net_change' => $stockInTotal - $stockOutTotal,
                ],
                'purchase_orders' => $purchaseOrdersStats,
                'requisitions' => $requisitionsStats,
            ],
        ]);
    }

    public function stockMovement(Request $request)
    {
        $days = $request->input('days', 30);
        $startDate = Carbon::now()->subDays($days);

        $stockIn = StockIn::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(quantity_received) as total')
        )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $stockOut = StockOut::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(quantity_taken) as total')
        )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stock_in' => $stockIn,
                'stock_out' => $stockOut,
            ],
        ]);
    }

    public function itemUsage(Request $request)
    {
        $itemId = $request->input('item_id');
        $days = $request->input('days', 90);
        $startDate = Carbon::now()->subDays($days);

        $query = StockOut::select(
            'item_id',
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(quantity_taken) as total')
        )
            ->where('created_at', '>=', $startDate)
            ->with('item');

        if ($itemId) {
            $query->where('item_id', $itemId);
        }

        $usage = $query->groupBy('item_id', 'date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $usage,
        ]);
    }
}
