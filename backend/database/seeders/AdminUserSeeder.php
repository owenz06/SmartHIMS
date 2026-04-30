<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        User::firstOrCreate(
            ['email' => 'admin@hospital.com'],
            [
                'name' => 'System Administrator',
                'email' => 'admin@hospital.com',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        // Create Admin
        User::firstOrCreate(
            ['email' => 'admin2@hospital.com'],
            [
                'name' => 'Hospital Admin',
                'email' => 'admin2@hospital.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create Manager
        User::firstOrCreate(
            ['email' => 'manager@hospital.com'],
            [
                'name' => 'Inventory Manager',
                'email' => 'manager@hospital.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'email_verified_at' => now(),
            ]
        );

        // Create Procurement Officer
        User::firstOrCreate(
            ['email' => 'procurement@hospital.com'],
            [
                'name' => 'Procurement Officer',
                'email' => 'procurement@hospital.com',
                'password' => Hash::make('procurement123'),
                'role' => 'procurement_officer',
                'email_verified_at' => now(),
            ]
        );

        // Create Pharmacist
        User::firstOrCreate(
            ['email' => 'pharmacist@hospital.com'],
            [
                'name' => 'Hospital Pharmacist',
                'email' => 'pharmacist@hospital.com',
                'password' => Hash::make('pharmacist123'),
                'role' => 'pharmacist',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Default users created successfully!');
        $this->command->info('Super Admin: admin@hospital.com / admin123');
        $this->command->info('Admin: admin2@hospital.com / admin123');
        $this->command->info('Manager: manager@hospital.com / manager123');
        $this->command->info('Procurement: procurement@hospital.com / procurement123');
        $this->command->info('Pharmacist: pharmacist@hospital.com / pharmacist123');
    }
}