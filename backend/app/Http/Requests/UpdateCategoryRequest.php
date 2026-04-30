<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only Manager can create/update categories
        return auth()->check() && auth()->user()->role === 'manager';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:categories,name,'.$this->category,
            'description' => 'nullable|string',
        ];
    }
}
