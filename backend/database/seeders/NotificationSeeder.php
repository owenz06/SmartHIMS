<?php

namespace Database\Seeders;

use App\Models\SystemNotification;
use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\Requisition;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing notifications
        SystemNotification::truncate();

        // Get some real data
        $lowStockItems = Item::whereColumn('quantity', '<=', 'reorder_point')->take(5)->get();
        $recentPurchaseOrders = PurchaseOrder::latest()->take(3)->get();
        $recentRequisitions = Requisition::latest()->take(3)->get();
        $users = User::all();

        // 1. Low Stock Alerts
        foreach ($lowStockItems as $item) {
            SystemNotification::create([
                'title' => 'Low Stock Alert',
                'message' => "{$item->name} is running low. Current stock: {$item->quantity}, Reorder point: {$item->reorder_point}",
                'target_role' => 'manager', // Notify all managers
                'is_read' => false,
                'created_at' => now()->subMinutes(rand(5, 120)),
            ]);
        }

        // 2. Purchase Order Notifications
        foreach ($recentPurchaseOrders as $po) {
            if ($po->status === 'approved') {
                SystemNotification::create([
                    'title' => 'Purchase Order Approved',
                    'message' => "PO #{$po->id} has been approved. Supplier: {$po->supplier->name}",
                    'target_role' => 'procurement_officer',
                    'is_read' => rand(0, 1) == 1,
                    'created_at' => $po->updated_at ?? $po->created_at,
                ]);
            } elseif ($po->status === 'received') {
                SystemNotification::create([
                    'title' => 'Purchase Order Received',
                    'message' => "PO #{$po->id} has been received and stock updated.",
                    'target_role' => 'manager',
                    'is_read' => rand(0, 1) == 1,
                    'created_at' => $po->updated_at ?? $po->created_at,
                ]);
            } else {
                SystemNotification::create([
                    'title' => 'New Purchase Order',
                    'message' => "PO #{$po->id} has been created and is pending approval.",
                    'target_role' => 'admin',
                    'is_read' => false,
                    'created_at' => $po->created_at,
                ]);
            }
        }

        // 3. Requisition Notifications
        foreach ($recentRequisitions as $req) {
            if ($req->status === 'approved') {
                SystemNotification::create([
                    'title' => 'Requisition Approved',
                    'message' => "Requisition #{$req->id} from {$req->department->name} has been approved.",
                    'user_id' => $req->user_id, // Notify specific user who created it
                    'is_read' => rand(0, 1) == 1,
                    'created_at' => $req->updated_at ?? $req->created_at,
                ]);
            } elseif ($req->status === 'fulfilled') {
                SystemNotification::create([
                    'title' => 'Requisition Fulfilled',
                    'message' => "Requisition #{$req->id} has been fulfilled. Items are ready for pickup.",
                    'user_id' => $req->user_id,
                    'is_read' => rand(0, 1) == 1,
                    'created_at' => $req->updated_at ?? $req->created_at,
                ]);
            } else {
                SystemNotification::create([
                    'title' => 'New Requisition',
                    'message' => "{$req->department->name} requested supplies. Requisition #{$req->id} is pending approval.",
                    'target_role' => 'manager',
                    'is_read' => false,
                    'created_at' => $req->created_at,
                ]);
            }
        }

        // 4. Stock Movement Notifications
        $criticalStockItems = Item::where('quantity', '<', 10)->take(3)->get();
        foreach ($criticalStockItems as $item) {
            SystemNotification::create([
                'title' => 'Critical Stock Level',
                'message' => "URGENT: {$item->name} has only {$item->quantity} units remaining!",
                'target_role' => null, // Notify everyone
                'is_read' => false,
                'created_at' => now()->subMinutes(rand(10, 60)),
            ]);
        }

        // 5. System Notifications
        SystemNotification::create([
            'title' => 'System Update',
            'message' => 'The inventory system has been updated with new features. Check out the Reports section!',
            'target_role' => null,
            'is_read' => rand(0, 1) == 1,
            'created_at' => now()->subHours(2),
        ]);

        // 6. Expiry Alerts (if you have expiry dates)
        $randomItems = Item::inRandomOrder()->take(2)->get();
        foreach ($randomItems as $item) {
            SystemNotification::create([
                'title' => 'Stock Expiry Alert',
                'message' => "{$item->name} batch is approaching expiry date. Please review inventory.",
                'target_role' => 'pharmacist',
                'is_read' => false,
                'created_at' => now()->subDays(1),
            ]);
        }

        // 7. Approval Reminders
        $pendingPOs = PurchaseOrder::where('status', 'pending')->take(2)->get();
        foreach ($pendingPOs as $po) {
            SystemNotification::create([
                'title' => 'Approval Reminder',
                'message' => "Purchase Order #{$po->id} is still pending approval. Please review.",
                'target_role' => 'admin',
                'is_read' => false,
                'created_at' => now()->subHours(rand(3, 12)),
            ]);
        }

        $this->command->info('Sample notifications created successfully!');
        $this->command->info('Total notifications: ' . SystemNotification::count());
    }
}
