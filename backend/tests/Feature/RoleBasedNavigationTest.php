<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleBasedNavigationTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_access_all_routes()
    {
        $user = User::factory()->create(['role' => 'super_admin']);

        $this->actingAs($user)
            ->get('/admin/inventory')
            ->assertOk();

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk();
    }

    public function test_admin_can_access_admin_routes()
    {
        $user = User::factory()->create(['role' => 'admin']);

        $this->actingAs($user)
            ->get('/admin/inventory')
            ->assertOk();
    }

    public function test_manager_can_access_manager_routes()
    {
        $user = User::factory()->create(['role' => 'manager']);

        $this->actingAs($user)
            ->get('/stock-out')
            ->assertOk();
    }

    public function test_pharmacist_cannot_access_admin_routes()
    {
        $user = User::factory()->create(['role' => 'pharmacist']);

        $this->actingAs($user)
            ->get('/admin/inventory')
            ->assertStatus(403);
    }

    public function test_procurement_officer_cannot_access_admin_routes()
    {
        $user = User::factory()->create(['role' => 'procurement_officer']);

        $this->actingAs($user)
            ->get('/admin/inventory')
            ->assertStatus(403);
    }

    public function test_user_role_is_available_in_request()
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'name' => 'Test Admin',
            'email' => 'test@example.com',
        ]);

        $this->actingAs($user);
        
        // Verify that the user role is accessible
        /** @var User $authUser */
        $authUser = auth()->user();
        $this->assertEquals('admin', $authUser->role);
        $this->assertEquals('Test Admin', $authUser->name);
        $this->assertEquals('test@example.com', $authUser->email);
    }
}
