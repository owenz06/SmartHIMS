<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Department::withCount('requisitions');

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where('name', 'like', '%'.$search.'%');
        }

        // Return all departments (not paginated) for dropdowns
        if ($request->boolean('all')) {
            return response()->json([
                'success' => true,
                'data' => $query->get(),
            ]);
        }

        // Paginated for list view
        $perPage = (int) $request->get('per_page', 25);

        return response()->json([
            'success' => true,
            'data' => $query->paginate($perPage)->items(),
            'total' => $query->count(),
        ]);
    }

    public function show(Department $department)
    {
        $department->loadCount('requisitions');

        return response()->json([
            'success' => true,
            'data' => $department,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
        ]);

        $department = Department::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Department created successfully',
            'data' => $department,
        ], 201);
    }

    public function update(Request $request, Department $department): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $department->id,
        ]);

        $department->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Department updated successfully',
            'data' => $department,
        ]);
    }

    public function destroy(Department $department): JsonResponse
    {
        // Check if department has requisitions
        if ($department->requisitions()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete department with existing requisitions',
            ], 422);
        }

        $department->delete();

        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully',
        ]);
    }
}
