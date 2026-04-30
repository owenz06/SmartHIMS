<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'manage users',
            'manage items',
            'manage suppliers',
            'manage stock',
            'approve requisitions',
            'create requisitions',
            'view reports',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $admin = Role::create(['name' => 'Admin']);
        $store = Role::create(['name' => 'Store Manager']);
        $officer = Role::create(['name' => 'Department Officer']);

        $admin->givePermissionTo(Permission::all());

        $store->givePermissionTo([
            'manage items',
            'manage suppliers',
            'manage stock',
            'approve requisitions',
            'view reports',
        ]);

        $officer->givePermissionTo([
            'create requisitions',
        ]);
    }
}
