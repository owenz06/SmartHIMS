<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseOrderReceiveTest extends TestCase
{
    use RefreshDatabase;

    public function test_receiving_a_purchase_order_updates_stock_and_creates_stock_in_records()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $this->withoutMiddleware();

        $supplier = Supplier::create([
            'name' => 'Test Supplier',
            'contact_person' => 'John Doe',
            'email' => 'supplier@example.com',
            'phone' => '123456789',
            'address' => 'Test Address',
        ]);

        $item = Item::create([
            'name' => 'Test Item',
            'description' => 'Test',
            'category_id' => null,
            'supplier_id' => $supplier->id,
            'unit_of_measurement' => 'units',
            'reorder_point' => 10,
            'quantity' => 5,
        ]);

        $po = PurchaseOrder::create([
            'po_number' => 'PO-TEST',
            'supplier_id' => $supplier->id,
            'order_date' => now(),
            'status' => 'Pending',
        ]);

        PurchaseOrderItem::create([
            'purchase_order_id' => $po->id,
            'item_id' => $item->id,
            'quantity' => 10,
        ]);

        $response = $this->post(route('admin.purchase-orders.update-status', $po->id), [
            'status' => 'Received',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('items', [
            'id' => $item->id,
            'quantity' => 15,
        ]);

        $this->assertDatabaseHas('stock_ins', [
            'item_id' => $item->id,
            'supplier_id' => $supplier->id,
            'quantity_received' => 10,
        ]);
    }
}
