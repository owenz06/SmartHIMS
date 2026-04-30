<?php

namespace Tests\Feature\Api\V1;

use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiStockTransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_dispense_stock_via_api()
    {
        $user = User::factory()->create();
        $token = $user->createToken('api')->plainTextToken;

        $item = Item::create([
            'name' => 'Dispensable Item',
            'description' => 'For API dispense test',
            'category_id' => null,
            'supplier_id' => null,
            'unit_of_measurement' => 'units',
            'reorder_point' => 5,
            'quantity' => 20,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/stock-transactions', [
                'item_id' => $item->id,
                'quantity_taken' => 7,
                'dispensed_to' => 'Ward A',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.item_id', $item->id)
            ->assertJsonPath('data.quantity_taken', 7);

        $this->assertDatabaseHas('items', [
            'id' => $item->id,
            'quantity' => 13,
        ]);
    }

    public function test_dispense_fails_when_insufficient_stock()
    {
        $user = User::factory()->create();
        $token = $user->createToken('api')->plainTextToken;

        $item = Item::create([
            'name' => 'Low Stock Item',
            'description' => 'Test',
            'category_id' => null,
            'supplier_id' => null,
            'unit_of_measurement' => 'units',
            'reorder_point' => 5,
            'quantity' => 3,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/stock-transactions', [
                'item_id' => $item->id,
                'quantity_taken' => 10,
            ]);

        $response->assertStatus(422);
    }
}
