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

class StockTransactionController extends Controller
{
    /**
     * Record a stock-out (dispense) transaction.
     * POST /api/v1/stock-transactions
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity_taken' => 'required|integer|min:1',
            'dispensed_to' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:500',
        ]);

        $record = DB::transaction(function () use ($request) {
            $item = Item::whereKey($request->item_id)->lockForUpdate()->firstOrFail();

            if ($request->quantity_taken > $item->quantity) {
                abort(422, 'Not enough stock available.');
            }

            $oldQuantity = $item->quantity;

            $stockOut = StockOut::create([
                'item_id' => $item->id,
                'user_id' => Auth::id(),
                'quantity_taken' => $request->quantity_taken,
                'dispensed_to' => $request->dispensed_to,
                'notes' => $request->notes,
            ]);

            $item->quantity -= $request->quantity_taken;
            $item->save();

            AuditHelper::log('stock_dispensed', $item, ['quantity' => $oldQuantity], ['quantity' => $item->quantity]);

            return $stockOut->load(['item', 'user']);
        });

        return response()->json([
            'message' => 'Stock dispensed successfully.',
            'data' => $record,
        ], 201);
    }
}
