<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class DefaultCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Pharmaceuticals',
                'description' => 'Medicines and pharmaceutical products',
            ],
            [
                'name' => 'Medical Supplies',
                'description' => 'General medical supplies and consumables',
            ],
            [
                'name' => 'Surgical Equipment',
                'description' => 'Surgical instruments and equipment',
            ],
            [
                'name' => 'Laboratory Supplies',
                'description' => 'Laboratory testing supplies and reagents',
            ],
            [
                'name' => 'Personal Protective Equipment',
                'description' => 'PPE items including gloves, masks, gowns',
            ],
            [
                'name' => 'Cleaning Supplies',
                'description' => 'Cleaning and disinfection supplies',
            ],
            [
                'name' => 'Office Supplies',
                'description' => 'Administrative and office supplies',
            ],
            [
                'name' => 'Emergency Supplies',
                'description' => 'Emergency and first aid supplies',
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['name' => $category['name']],
                $category
            );
        }

        $this->command->info('Default categories created successfully!');
    }
}