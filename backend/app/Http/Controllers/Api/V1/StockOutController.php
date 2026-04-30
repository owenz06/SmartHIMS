<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\AuditHelper;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockOut;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockOutController extends Controller
{
    public function index(Request $request)
    {
        $query = StockOut::with(['item', 'user']);

        if ($request->filled('item_id')) {
            $query->where('item_id', $request->integer('item_id'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        $perPage = (int) $request->get('per_page', 25);

        return response()->json(
            $query->orderByDesc('created_at')->paginate($perPage)
        );
    }

    public function show(StockOut $stockOut)
    {
        $stockOut->load(['item', 'user']);

        return response()->json($stockOut);
    }

    public function store(Request $request): JsonResponse
    {
        // Only Manager and Pharmacist can create Stock Out records
        if (!in_array(auth()->user()->role, ['manager', 'pharmacist'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Managers and Pharmacists can dispense stock.',
            ], 403);
        }

        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity_taken' => 'required|integer|min:1',
            'dispensed_to' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:500',
        ]);

        $stockOut = DB::transaction(function () use ($validated) {
            $item = Item::whereKey($validated['item_id'])->lockForUpdate()->firstOrFail();

            if ($validated['quantity_taken'] > $item->quantity) {
                abort(422, 'Not enough stock available.');
            }

            $oldQuantity = $item->quantity;

            $stockOut = StockOut::create([
                'item_id' => $validated['item_id'],
                'user_id' => Auth::id(),
                'quantity_taken' => $validated['quantity_taken'],
                'dispensed_to' => $validated['dispensed_to'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            $item->quantity -= $validated['quantity_taken'];
            $item->save();

            AuditHelper::log('stock_dispensed', $item, ['quantity' => $oldQuantity], ['quantity' => $item->quantity]);

            return $stockOut->load(['item', 'user']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Stock dispensed successfully',
            'data' => $stockOut,
        ], 201);
    }

    public function update(Request $request, StockOut $stockOut): JsonResponse
    {
        // Only the creator (Manager) can update their own Stock Out records
        if (auth()->user()->role !== 'manager' || $stockOut->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only the Manager who created this record can update it.',
            ], 403);
        }

        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity_taken' => 'required|integer|min:1',
            'dispensed_to' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:500',
        ]);

        DB::transaction(function () use ($validated, $stockOut) {
            $item = Item::whereKey($stockOut->item_id)->lockForUpdate()->firstOrFail();
            
            // Reverse the old quantity
            $item->quantity += $stockOut->quantity_taken;
            
            // Check if new quantity is available
            if ($validated['quantity_taken'] > $item->quantity) {
                abort(422, 'Not enough stock available.');
            }
            
            // Apply the new quantity
            $item->quantity -= $validated['quantity_taken'];
            $item->save();

            $stockOut->update([
                'item_id' => $validated['item_id'],
                'quantity_taken' => $validated['quantity_taken'],
                'dispensed_to' => $validated['dispensed_to'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);
        });

        $stockOut->load(['item', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Stock out record updated successfully',
            'data' => $stockOut,
        ]);
    }

    public function destroy(StockOut $stockOut): JsonResponse
    {
        // Only the creator (Manager) can delete their own Stock Out records
        if (auth()->user()->role !== 'manager' || $stockOut->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only the Manager who created this record can delete it.',
            ], 403);
        }

        DB::transaction(function () use ($stockOut) {
            $item = Item::whereKey($stockOut->item_id)->lockForUpdate()->firstOrFail();
            
            // Reverse the stock out
            $item->quantity += $stockOut->quantity_taken;
            $item->save();

            $stockOut->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Stock out record deleted successfully',
        ]);
    }
}
