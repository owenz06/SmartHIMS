<?php

namespace Tests\Feature\Api\V1;

use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiInventoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_items_via_api()
    {
        $user = User::factory()->create();
        $token = $user->createToken('api')->plainTextToken;

        Item::create([
            'name' => 'API Test Item',
            'description' => 'For API test',
            'category_id' => null,
            'supplier_id' => null,
            'unit_of_measurement' => 'units',
            'reorder_point' => 5,
            'quantity' => 10,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/items');

        $response
            ->assertOk()
            ->assertJsonFragment([
                'name' => 'API Test Item',
            ]);
    }

    public function test_unauthenticated_request_returns_401()
    {
        $response = $this->getJson('/api/v1/items');

        $response->assertUnauthorized();
    }
}
