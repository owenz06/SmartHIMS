<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class DefaultSuppliersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'MedSupply Corp',
                'contact_person' => 'John Smith',
                'email' => 'orders@medsupply.com',
                'phone' => '+1-555-0101',
                'address' => '123 Medical Plaza, Healthcare City, HC 12345',
            ],
            [
                'name' => 'PharmaCare Solutions',
                'contact_person' => 'Sarah Johnson',
                'email' => 'procurement@pharmacare.com',
                'phone' => '+1-555-0102',
                'address' => '456 Pharma Street, Medicine Town, MT 67890',
            ],
            [
                'name' => 'Surgical Instruments Ltd',
                'contact_person' => 'Dr. Michael Brown',
                'email' => 'sales@surgicalinst.com',
                'phone' => '+1-555-0103',
                'address' => '789 Surgery Ave, Instrument City, IC 11111',
            ],
            [
                'name' => 'Lab Equipment Pro',
                'contact_person' => 'Lisa Davis',
                'email' => 'orders@labequippro.com',
                'phone' => '+1-555-0104',
                'address' => '321 Laboratory Blvd, Science Park, SP 22222',
            ],
            [
                'name' => 'Emergency Medical Supplies',
                'contact_person' => 'Robert Wilson',
                'email' => 'emergency@emsupplies.com',
                'phone' => '+1-555-0105',
                'address' => '654 Emergency Lane, First Aid City, FA 33333',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::firstOrCreate(
                ['email' => $supplier['email']],
                $supplier
            );
        }

        $this->command->info('Default suppliers created successfully!');
    }
}