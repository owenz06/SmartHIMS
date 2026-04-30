<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DefaultDepartmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Emergency Department',
                'description' => 'Emergency and trauma care',
            ],
            [
                'name' => 'Pharmacy',
                'description' => 'Hospital pharmacy services',
            ],
            [
                'name' => 'Surgery',
                'description' => 'Surgical department',
            ],
            [
                'name' => 'Internal Medicine',
                'description' => 'Internal medicine ward',
            ],
            [
                'name' => 'Pediatrics',
                'description' => 'Children\'s healthcare department',
            ],
            [
                'name' => 'Obstetrics & Gynecology',
                'description' => 'Women\'s health and maternity',
            ],
            [
                'name' => 'Laboratory',
                'description' => 'Medical laboratory services',
            ],
            [
                'name' => 'Radiology',
                'description' => 'Medical imaging department',
            ],
            [
                'name' => 'Intensive Care Unit',
                'description' => 'Critical care unit',
            ],
            [
                'name' => 'Outpatient Clinic',
                'description' => 'Outpatient services',
            ],
        ];

        foreach ($departments as $department) {
            Department::firstOrCreate(
                ['name' => $department['name']],
                $department
            );
        }

        $this->command->info('Default departments created successfully!');
    }
}