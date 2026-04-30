<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only Super Admin and System Admin can create/update departments
        return auth()->check() && in_array(auth()->user()->role, ['super_admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:departments,name,'.$this->department,
            'description' => 'nullable|string',
        ];
    }
}
