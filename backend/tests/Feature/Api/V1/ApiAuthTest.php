<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_obtain_token_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'api@example.com',
        ]);

        $response = $this->postJson('/api/v1/auth/token', [
            'email' => 'api@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'token_type', 'user'])
            ->assertJson(['token_type' => 'Bearer']);
    }

    public function test_token_rejected_for_invalid_credentials()
    {
        $response = $this->postJson('/api/v1/auth/token', [
            'email' => 'wrong@example.com',
            'password' => 'wrong',
        ]);

        $response->assertStatus(422);
    }
}
