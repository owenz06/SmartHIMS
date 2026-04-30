<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['category', 'supplier']);

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%');
            });
        }

        if ($request->boolean('only_low_stock')) {
            $query->whereColumn('quantity', '<=', 'reorder_point');
        }

        $perPage = (int) $request->get('per_page', 25);

        return response()->json(
            $query->paginate($perPage)
        );
    }

    public function show(Item $item)
    {
        $item->load(['category', 'supplier']);

        return response()->json($item);
    }

    public function store(Request $request)
    {
        // Only Manager can create inventory items
        if (!in_array(auth()->user()->role, ['manager'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Inventory Managers can create inventory items.',
            ], 403);
        }

        $validated = $request->validate([
            'item_code' => 'required|string|max:255|unique:items,item_code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'unit_of_measurement' => 'required|string|max:50',
            'reorder_point' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
        ]);

        $item = Item::create($validated);
        $item->load(['category', 'supplier']);

        return response()->json([
            'success' => true,
            'message' => 'Item created successfully',
            'data' => $item,
        ], 201);
    }

    public function update(Request $request, Item $item)
    {
        // Only Manager can update inventory items
        if (!in_array(auth()->user()->role, ['manager'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Inventory Managers can update inventory items.',
            ], 403);
        }

        $validated = $request->validate([
            'item_code' => 'required|string|max:255|unique:items,item_code,' . $item->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'unit_of_measurement' => 'required|string|max:50',
            'reorder_point' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
        ]);

        $item->update($validated);
        $item->load(['category', 'supplier']);

        return response()->json([
            'success' => true,
            'message' => 'Item updated successfully',
            'data' => $item,
        ]);
    }

    public function destroy(Item $item)
    {
        // Only Manager can delete inventory items
        if (!in_array(auth()->user()->role, ['manager'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Inventory Managers can delete inventory items.',
            ], 403);
        }

        // Check if item has any related records
        if ($item->purchaseOrderitems()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete item with existing purchase orders',
            ], 422);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully',
        ]);
    }
}
