<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\AuditHelper;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockIn;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockInController extends Controller
{
    public function index(Request $request)
    {
        $query = StockIn::with(['item', 'supplier']);

        if ($request->filled('item_id')) {
            $query->where('item_id', $request->integer('item_id'));
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->integer('supplier_id'));
        }

        $perPage = (int) $request->get('per_page', 25);

        return response()->json(
            $query->orderByDesc('received_date')->paginate($perPage)
        );
    }

    public function show(StockIn $stockIn)
    {
        $stockIn->load(['item', 'supplier']);

        return response()->json($stockIn);
    }

    public function store(Request $request): JsonResponse
    {
        // Only Procurement Officer can create Stock In records
        if (!in_array(auth()->user()->role, ['procurement_officer'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Procurement Officers can receive stock.',
            ], 403);
        }

        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'quantity_received' => 'required|integer|min:1',
            'received_date' => 'required|date',
            'notes' => 'nullable|string|max:500',
        ]);

        $stockIn = DB::transaction(function () use ($validated) {
            $item = Item::whereKey($validated['item_id'])->lockForUpdate()->firstOrFail();
            $oldQuantity = $item->quantity;

            $stockIn = StockIn::create($validated);

            $item->quantity += $validated['quantity_received'];
            $item->save();

            AuditHelper::log('stock_received', $item, ['quantity' => $oldQuantity], ['quantity' => $item->quantity]);

            return $stockIn->load(['item', 'supplier']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Stock received successfully',
            'data' => $stockIn,
        ], 201);
    }

    public function update(Request $request, StockIn $stockIn): JsonResponse
    {
        // Stock In records are immutable for audit compliance
        return response()->json([
            'success' => false,
            'message' => 'Stock In records cannot be modified for audit compliance. Please create a new record or contact administrator.',
        ], 403);
    }

    public function destroy(StockIn $stockIn): JsonResponse
    {
        // Stock In records are immutable for audit compliance
        return response()->json([
            'success' => false,
            'message' => 'Stock In records cannot be deleted for audit compliance. Contact administrator if correction is needed.',
        ], 403);
    }
}
