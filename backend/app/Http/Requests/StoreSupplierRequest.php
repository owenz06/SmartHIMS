<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only Procurement Officer can create/update suppliers
        return auth()->check() && auth()->user()->role === 'procurement_officer';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:suppliers',
            'email' => 'nullable|email|unique:suppliers',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
        ];
    }
}
