<?php

namespace App\Console\Commands;

use App\Models\SystemNotification;
use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\Requisition;
use Illuminate\Console\Command;

class GenerateSampleNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:generate {--clear : Clear existing notifications first}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate sample notifications with real data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('clear')) {
            SystemNotification::truncate();
            $this->info('Existing notifications cleared.');
        }

        $count = 0;

        // 1. Low Stock Alerts
        $lowStockItems = Item::whereColumn('quantity', '<=', 'reorder_point')->get();
        if ($lowStockItems->count() > 0) {
            foreach ($lowStockItems->take(5) as $item) {
                SystemNotification::create([
                    'title' => 'Low Stock Alert',
                    'message' => "{$item->name} is running low. Current stock: {$item->quantity}, Reorder point: {$item->reorder_point}",
                    'target_role' => 'manager',
                    'is_read' => false,
                    'created_at' => now()->subMinutes(rand(5, 120)),
                ]);
                $count++;
            }
            $this->info("Created {$lowStockItems->take(5)->count()} low stock alerts");
        }

        // 2. Critical Stock Alerts
        $criticalItems = Item::where('quantity', '<', 10)->get();
        if ($criticalItems->count() > 0) {
            foreach ($criticalItems->take(3) as $item) {
                SystemNotification::create([
                    'title' => 'Critical Stock Level',
                    'message' => "URGENT: {$item->name} has only {$item->quantity} units remaining!",
                    'target_role' => null,
                    'is_read' => false,
                    'created_at' => now()->subMinutes(rand(10, 60)),
                ]);
                $count++;
            }
            $this->info("Created {$criticalItems->take(3)->count()} critical stock alerts");
        }

        // 3. Purchase Order Notifications
        $recentPOs = PurchaseOrder::latest()->take(5)->get();
        foreach ($recentPOs as $po) {
            $status = $po->status;
            $title = match($status) {
                'approved' => 'Purchase Order Approved',
                'received' => 'Purchase Order Received',
                default => 'New Purchase Order',
            };
            
            $message = match($status) {
                'approved' => "PO #{$po->id} has been approved. Supplier: {$po->supplier->name}",
                'received' => "PO #{$po->id} has been received and stock updated.",
                default => "PO #{$po->id} has been created and is pending approval.",
            };

            $targetRole = match($status) {
                'approved' => 'procurement_officer',
                'received' => 'manager',
                default => 'admin',
            };

            SystemNotification::create([
                'title' => $title,
                'message' => $message,
                'target_role' => $targetRole,
                'is_read' => $status === 'received' ? true : false,
                'created_at' => $po->updated_at ?? $po->created_at,
            ]);
            $count++;
        }
        if ($recentPOs->count() > 0) {
            $this->info("Created {$recentPOs->count()} purchase order notifications");
        }

        // 4. Requisition Notifications
        $recentReqs = Requisition::latest()->take(5)->get();
        foreach ($recentReqs as $req) {
            $status = $req->status;
            $title = match($status) {
                'approved' => 'Requisition Approved',
                'fulfilled' => 'Requisition Fulfilled',
                'rejected' => 'Requisition Rejected',
                default => 'New Requisition',
            };
            
            $message = match($status) {
                'approved' => "Requisition #{$req->id} from {$req->department->name} has been approved.",
                'fulfilled' => "Requisition #{$req->id} has been fulfilled. Items are ready for pickup.",
                'rejected' => "Requisition #{$req->id} has been rejected. Please review.",
                default => "{$req->department->name} requested supplies. Requisition #{$req->id} is pending approval.",
            };

            SystemNotification::create([
                'title' => $title,
                'message' => $message,
                'user_id' => $status !== 'pending' ? $req->user_id : null,
                'target_role' => $status === 'pending' ? 'manager' : null,
                'is_read' => $status === 'fulfilled' ? true : false,
                'created_at' => $req->updated_at ?? $req->created_at,
            ]);
            $count++;
        }
        if ($recentReqs->count() > 0) {
            $this->info("Created {$recentReqs->count()} requisition notifications");
        }

        // 5. General System Notifications
        SystemNotification::create([
            'title' => 'System Update',
            'message' => 'The inventory system has been updated with new features. Check out the Reports and Audit Logs sections!',
            'target_role' => null,
            'is_read' => false,
            'created_at' => now()->subHours(2),
        ]);
        $count++;

        SystemNotification::create([
            'title' => 'Weekly Inventory Review',
            'message' => 'Time for your weekly inventory review. Please check stock levels and reorder as needed.',
            'target_role' => 'manager',
            'is_read' => false,
            'created_at' => now()->subHours(6),
        ]);
        $count++;

        $this->info("Created 2 system notifications");

        $this->newLine();
        $this->info("✅ Total notifications created: {$count}");
        $this->info("📊 Total notifications in database: " . SystemNotification::count());
    }
}
