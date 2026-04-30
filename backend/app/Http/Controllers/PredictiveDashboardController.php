<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;

class PredictiveDashboardController extends Controller
{
    public function index()
    {
        try {
            // Get real statistics from database
            $totalItems = \App\Models\Item::count();
            
            // Get low stock items by checking each item individually
            $lowStockItems = 0;
            $lowStockItemsData = collect();
            
            $allItems = \App\Models\Item::with(['stock', 'category'])->get();
            
            foreach ($allItems as $item) {
                $currentStock = $item->stock->quantity ?? 0;
                $reorderPoint = $item->reorder_point ?? 0;
                
                if ($reorderPoint > 0 && $currentStock <= $reorderPoint) {
                    $lowStockItems++;
                    $lowStockItemsData->push($item);
                }
            }
            
            // Sort by urgency (lowest stock ratio first) and take top 10
            $lowStockItemsData = $lowStockItemsData->sortBy(function($item) {
                $stock = $item->stock->quantity ?? 1;
                $reorder = $item->reorder_point ?? 1;
                return $stock / max($reorder, 1);
            })->take(10);
            
            $pendingOrders = \App\Models\PurchaseOrder::where('status', 'pending')->count();
            
            $stats = [
                'totalItems' => $totalItems,
                'lowStockItems' => $lowStockItems,
                'predictedStockouts' => $lowStockItems, // Use low stock as predicted stockouts for now
                'pendingOrders' => $pendingOrders,
            ];

            // Get items with low stock for alerts (already calculated above)
            // $lowStockItemsData is already available from the statistics section

            $alerts = $lowStockItemsData->map(function($item, $index) {
                $daysUntilStockout = $this->calculateDaysUntilStockout($item);
                $severity = $this->getSeverity($daysUntilStockout);
                
                return [
                    'id' => $item->id,
                    'itemName' => $item->name,
                    'currentStock' => $item->stock->quantity ?? 0,
                    'predictedStockout' => now()->addDays($daysUntilStockout)->format('M j, Y'),
                    'daysUntilStockout' => $daysUntilStockout,
                    'severity' => $severity,
                    'recommendedAction' => $this->getRecommendedAction($item, $daysUntilStockout),
                ];
            })->toArray();

            // Add fallback message if no alerts
            if (empty($alerts)) {
                $alerts = [[
                    'id' => 0,
                    'itemName' => 'No critical items found',
                    'currentStock' => 0,
                    'predictedStockout' => 'N/A',
                    'daysUntilStockout' => 999,
                    'severity' => 'info',
                    'recommendedAction' => 'All items are currently well-stocked. Continue monitoring inventory levels.',
                ]];
            }

            // Get top items by recent usage
            $topItemsQuery = \App\Models\Item::with(['stock', 'category'])->get();
            
            $topItems = $topItemsQuery->map(function($item) {
                // Count recent usage for this item
                $recentUsage = \App\Models\StockOut::where('item_id', $item->id)
                    ->where('created_at', '>=', now()->subDays(30))
                    ->count();
                
                $demandTrend = $this->calculateDemandTrend($item);
                
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'category' => $item->category->name ?? 'Uncategorized',
                    'currentStock' => $item->stock->quantity ?? 0,
                    'reorderPoint' => $item->reorder_point ?? 0,
                    'maxStock' => ($item->reorder_point ?? 0) * 5, // Estimate max stock as 5x reorder point
                    'demandTrend' => $demandTrend,
                    'recent_usage' => $recentUsage,
                ];
            })
            ->sortByDesc('recent_usage')
            ->take(5)
            ->values()
            ->toArray();

            // Add fallback data if no items found
            if (empty($topItems)) {
                $topItems = [[
                    'id' => 0,
                    'name' => 'No items found',
                    'category' => 'System',
                    'currentStock' => 0,
                    'reorderPoint' => 0,
                    'maxStock' => 0,
                    'demandTrend' => 0,
                ]];
            }

            // Generate demand forecast based on historical data
            $demandForecast = $this->generateDemandForecast();

            return Inertia::render('predictive-dashboard-simple', [
                'stats' => $stats,
                'alerts' => $alerts,
                'topItems' => $topItems,
                'demandForecast' => $demandForecast,
            ]);
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Predictive Dashboard Error: ' . $e->getMessage());
            
            // Return with fallback data
            return Inertia::render('predictive-dashboard', [
                'stats' => [
                    'totalItems' => 0,
                    'lowStockItems' => 0,
                    'predictedStockouts' => 0,
                    'pendingOrders' => 0,
                ],
                'alerts' => [[
                    'id' => 0,
                    'itemName' => 'Error loading data',
                    'currentStock' => 0,
                    'predictedStockout' => 'N/A',
                    'daysUntilStockout' => 0,
                    'severity' => 'info',
                    'recommendedAction' => 'Please check system logs or contact administrator.',
                ]],
                'topItems' => [[
                    'id' => 0,
                    'name' => 'No data available',
                    'category' => 'System',
                    'currentStock' => 0,
                    'reorderPoint' => 0,
                    'maxStock' => 0,
                    'demandTrend' => 0,
                ]],
                'demandForecast' => [],
            ]);
        }
    }

    private function calculateDaysUntilStockout($item)
    {
        // Calculate average daily usage from last 30 days
        $totalUsage = \App\Models\StockOut::where('item_id', $item->id)
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('quantity_taken');
        
        $dailyUsage = $totalUsage / 30;
        
        if ($dailyUsage <= 0) {
            return 999; // No usage data, assume long time
        }
        
        $currentStock = $item->stock->quantity ?? 0;
        return max(1, ceil($currentStock / $dailyUsage));
    }

    private function getSeverity($daysUntilStockout)
    {
        if ($daysUntilStockout <= 7) {
            return 'critical';
        } elseif ($daysUntilStockout <= 21) {
            return 'warning';
        } else {
            return 'info';
        }
    }

    private function getRecommendedAction($item, $daysUntilStockout)
    {
        $reorderPoint = $item->reorder_point ?? 100;
        $recommendedQuantity = $reorderPoint * 2; // Order 2x reorder point
        
        if ($daysUntilStockout <= 7) {
            return "URGENT: Order {$recommendedQuantity} units immediately. Critical stock level with {$daysUntilStockout} days remaining.";
        } elseif ($daysUntilStockout <= 21) {
            return "Order {$recommendedQuantity} units. Stock level approaching critical threshold.";
        } else {
            return "Monitor closely. Consider ordering {$recommendedQuantity} units when convenient.";
        }
    }

    private function calculateDemandTrend($item)
    {
        // Compare last 15 days vs previous 15 days
        $recentUsage = \App\Models\StockOut::where('item_id', $item->id)
            ->where('created_at', '>=', now()->subDays(15))
            ->sum('quantity_taken');
        
        $previousUsage = \App\Models\StockOut::where('item_id', $item->id)
            ->whereBetween('created_at', [now()->subDays(30), now()->subDays(15)])
            ->sum('quantity_taken');
        
        if ($previousUsage == 0) {
            return $recentUsage > 0 ? 100 : 0;
        }
        
        return round((($recentUsage - $previousUsage) / $previousUsage) * 100);
    }

    private function generateDemandForecast()
    {
        $forecast = [];
        
        // Get last 7 days of actual data (Monday to Sunday)
        $startDate = now()->startOfWeek(\Carbon\Carbon::MONDAY);
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $actualUsage = \App\Models\StockOut::whereDate('created_at', $date)
                ->sum('quantity_taken');
            
            $forecast[] = [
                'date' => $date->format('M j'),
                'actual' => (int) $actualUsage,
                'predicted' => (int) $actualUsage, // For past dates, predicted = actual
            ];
        }
        
        // Generate next 5 days of predictions based on average
        $avgUsage = collect($forecast)->avg('actual') ?: 0;
        $trend = $this->calculateOverallTrend();
        
        for ($i = 1; $i <= 5; $i++) {
            $date = now()->addDays($i);
            $predicted = round($avgUsage * (1 + ($trend * $i * 0.01))); // Apply trend
            
            $forecast[] = [
                'date' => $date->format('M j'),
                'predicted' => max(0, (int) $predicted),
            ];
        }
        
        return $forecast;
    }

    private function calculateOverallTrend()
    {
        // Calculate overall system trend based on recent vs historical usage
        $recentTotal = \App\Models\StockOut::where('created_at', '>=', now()->subDays(7))
            ->sum('quantity_taken');
        
        $previousTotal = \App\Models\StockOut::whereBetween('created_at', [now()->subDays(14), now()->subDays(7)])
            ->sum('quantity_taken');
        
        if ($previousTotal == 0) {
            return 0;
        }
        
        return round((($recentTotal - $previousTotal) / $previousTotal) * 100);
    }
}