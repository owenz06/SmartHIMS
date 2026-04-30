<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only Manager can create/update items
        return auth()->check() && auth()->user()->role === 'manager';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:items',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'unit_of_measurement' => 'required|string|max:50',
            'reorder_point' => 'required|integer|min:0',
            'quantity' => 'required|integer|min:0',
        ];
    }
}
