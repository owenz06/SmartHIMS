<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\AuditHelper;
use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    /**
     * Get all suppliers
     * GET /api/suppliers
     */
    public function index(Request $request): JsonResponse
    {
        $query = Supplier::query();

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'name');
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 15);
        $suppliers = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $suppliers->items(),
            'meta' => [
                'current_page' => $suppliers->currentPage(),
                'last_page' => $suppliers->lastPage(),
                'per_page' => $suppliers->perPage(),
                'total' => $suppliers->total(),
            ],
        ]);
    }

    /**
     * Get a single supplier
     * GET /api/suppliers/{id}
     */
    public function show(string $id): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $supplier,
        ]);
    }

    /**
     * Create a new supplier
     * POST /api/suppliers
     */
    public function store(Request $request): JsonResponse
    {
        // Only Procurement Officer can create suppliers
        if (!in_array(auth()->user()->role, ['procurement_officer'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Procurement Officers can create suppliers.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
        ]);

        $supplier = Supplier::create($validated);

        AuditHelper::log('created', $supplier, null, $supplier->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Supplier created successfully',
            'data' => $supplier,
        ], 201);
    }

    /**
     * Update a supplier
     * PUT /api/suppliers/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // Only Procurement Officer can update suppliers
        if (!in_array(auth()->user()->role, ['procurement_officer'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Procurement Officers can update suppliers.',
            ], 403);
        }

        $supplier = Supplier::findOrFail($id);
        $oldData = $supplier->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
        ]);

        $supplier->update($validated);

        AuditHelper::log('updated', $supplier, $oldData, $supplier->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Supplier updated successfully',
            'data' => $supplier,
        ]);
    }

    /**
     * Delete a supplier
     * DELETE /api/suppliers/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        // Only Procurement Officer can delete suppliers
        if (!in_array(auth()->user()->role, ['procurement_officer'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Procurement Officers can delete suppliers.',
            ], 403);
        }

        $supplier = Supplier::findOrFail($id);
        
        // Check if supplier has purchase orders
        if ($supplier->purchaseOrders()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete supplier with existing purchase orders.',
            ], 422);
        }

        $oldData = $supplier->toArray();
        $supplier->delete();

        AuditHelper::log('deleted', $supplier, $oldData, null);

        return response()->json([
            'success' => true,
            'message' => 'Supplier deleted successfully',
        ]);
    }
}
