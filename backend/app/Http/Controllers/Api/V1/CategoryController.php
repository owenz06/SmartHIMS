<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\AuditHelper;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Get all categories
     * GET /api/categories
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::withCount('items');

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'name');
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 15);
        $categories = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $categories->items(),
            'meta' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ],
        ]);
    }

    /**
     * Get a single category
     * GET /api/categories/{id}
     */
    public function show(string $id): JsonResponse
    {
        $category = Category::with('items')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    /**
     * Create a new category
     * POST /api/categories
     */
    public function store(Request $request): JsonResponse
    {
        // Only Manager can create categories
        if (!in_array(auth()->user()->role, ['manager'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Inventory Managers can create categories.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated);

        AuditHelper::log('created', $category, null, $category->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }

    /**
     * Update a category
     * PUT /api/categories/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // Only Manager can update categories
        if (!in_array(auth()->user()->role, ['manager'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Inventory Managers can update categories.',
            ], 403);
        }

        $category = Category::findOrFail($id);
        $oldData = $category->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        AuditHelper::log('updated', $category, $oldData, $category->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category,
        ]);
    }

    /**
     * Delete a category
     * DELETE /api/categories/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        // Only Manager can delete categories
        if (!in_array(auth()->user()->role, ['manager'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Inventory Managers can delete categories.',
            ], 403);
        }

        $category = Category::findOrFail($id);
        
        // Check if category has items
        if ($category->items()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with existing items. Please reassign or delete items first.',
            ], 422);
        }

        $oldData = $category->toArray();
        $category->delete();

        AuditHelper::log('deleted', $category, $oldData, null);

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }
}
