<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockOutFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_stock_out_reduces_item_quantity_and_prevents_negative_stock()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $this->withoutMiddleware();

        $item = Item::create([
            'name' => 'Test Item',
            'description' => 'Test',
            'category_id' => null,
            'supplier_id' => null,
            'unit_of_measurement' => 'units',
            'reorder_point' => 5,
            'quantity' => 10,
        ]);

        // Successful stock out
        $response = $this->post(route('stockout.store'), [
            'item_id' => $item->id,
            'quantity_taken' => 3,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('items', [
            'id' => $item->id,
            'quantity' => 7,
        ]);

        // Attempt to take more than available should fail
        $response = $this->post(route('stockout.store'), [
            'item_id' => $item->id,
            'quantity_taken' => 100,
        ]);

        $response->assertStatus(302);
    }
}
