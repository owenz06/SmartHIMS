<?php

namespace App\Http\Controllers;

use App\Helpers\PermissionHelper;
use App\Models\Item;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockOutController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Check view permission
        if (! PermissionHelper::can($user, 'stock_out.view')) {
            abort(403, 'You do not have permission to view stock out records.');
        }

        // Pharmacists only see their own records
        $query = StockOut::with('item', 'user');
        if ($user->role === 'pharmacist') {
            $query->where('user_id', $user->id);
        }

        $records = $query->latest()->paginate(15);

        return inertia('stock-out/index', [
            'records' => $records,
            'canCreate' => PermissionHelper::can($user, 'stock_out.create'),
            'canEdit' => PermissionHelper::can($user, 'stock_out.update'),
            'canDelete' => PermissionHelper::can($user, 'stock_out.delete'),
        ]);
    }

    public function create()
    {
        if (! PermissionHelper::can(auth()->user(), 'stock_out.create')) {
            abort(403, 'You do not have permission to dispense stock.');
        }

        $items = Item::with('category')->get();

        return inertia('stock-out/create', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        if (! PermissionHelper::can(auth()->user(), 'stock_out.create')) {
            abort(403, 'You do not have permission to dispense stock.');
        }

        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity_taken' => 'required|integer|min:1',
            'dispensed_to' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            $item = Item::whereKey($request->item_id)->lockForUpdate()->firstOrFail();

            // 🚨 Prevent negative stock
            if ($request->quantity_taken > $item->quantity) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'quantity_taken' => 'Not enough stock available.',
                ]);
            }

            $oldQuantity = $item->quantity;

            // Create stock out record
            StockOut::create([
                'item_id' => $item->id,
                'user_id' => Auth::id(),
                'quantity_taken' => $request->quantity_taken,
                'dispensed_to' => $request->dispensed_to,
                'notes' => $request->notes,
            ]);

            // Reduce item quantity
            $item->quantity -= $request->quantity_taken;
            $item->save();

            // Log audit
            \App\Helpers\AuditHelper::log(
                'stock_dispensed',
                $item,
                ['quantity' => $oldQuantity],
                ['quantity' => $item->quantity]
            );
        });

        return redirect()->route('stockout.index')
            ->with('success', 'Stock dispensed successfully.');
    }

    public function show($id)
    {
        $stockOut = StockOut::with('item', 'user', 'item.category', 'item.supplier')->findOrFail($id);

        return inertia('stock-out/show', [
            'stockOut' => $stockOut,
        ]);
    }

    public function edit($id)
    {
        $user = auth()->user();

        if (! PermissionHelper::can($user, 'stock_out.update')) {
            abort(403, 'You do not have permission to edit stock out records.');
        }

        $stockOut = StockOut::findOrFail($id);

        // Pharmacists can only edit their own records
        if ($user->role === 'pharmacist' && $stockOut->user_id !== $user->id) {
            abort(403, 'You can only edit your own stock out records.');
        }

        $items = Item::with('category')->get();

        return inertia('stock-out/edit', [
            'stockOut' => $stockOut,
            'items' => $items,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();

        if (! PermissionHelper::can($user, 'stock_out.update')) {
            abort(403, 'You do not have permission to update stock out records.');
        }

        $request->validate([
            'quantity_taken' => 'required|integer|min:1',
            'dispensed_to' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $id, $user) {
            $record = StockOut::findOrFail($id);

            // Pharmacists can only edit their own records
            if ($user->role === 'pharmacist' && $record->user_id !== $user->id) {
                abort(403, 'You can only edit your own stock out records.');
            }

            $item = Item::whereKey($record->item_id)->lockForUpdate()->firstOrFail();
            $oldQuantity = $item->quantity;

            // Reverse the old stock out first
            $item->quantity += $record->quantity_taken;

            // Check if new quantity is valid
            if ($request->quantity_taken > $item->quantity) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'quantity_taken' => 'Not enough stock available with this change.',
                ]);
            }

            // Apply the new quantity
            $item->quantity -= $request->quantity_taken;
            $item->save();

            $record->update([
                'quantity_taken' => $request->quantity_taken,
                'dispensed_to' => $request->dispensed_to,
                'notes' => $request->notes,
            ]);

            \App\Helpers\AuditHelper::log(
                'stock_out_updated',
                $item,
                ['quantity' => $oldQuantity],
                ['quantity' => $item->quantity]
            );
        });

        return redirect()->route('stockout.index')
            ->with('success', 'Stock out record updated successfully.');
    }

    public function destroy($id)
    {
        $user = auth()->user();

        if (! PermissionHelper::can($user, 'stock_out.delete')) {
            abort(403, 'You do not have permission to delete stock out records.');
        }

        DB::transaction(function () use ($id, $user) {
            $record = StockOut::findOrFail($id);

            // Pharmacists can only delete their own records
            if ($user->role === 'pharmacist' && $record->user_id !== $user->id) {
                abort(403, 'You can only delete your own stock out records.');
            }

            $item = Item::whereKey($record->item_id)->lockForUpdate()->firstOrFail();
            $oldQuantity = $item->quantity;

            // Reverse the stock out
            $item->quantity += $record->quantity_taken;
            $item->save();

            $record->delete();

            \App\Helpers\AuditHelper::log(
                'stock_out_deleted',
                $item,
                ['quantity' => $oldQuantity],
                ['quantity' => $item->quantity]
            );
        });

        return redirect()->route('stockout.index')
            ->with('success', 'Stock out record deleted successfully.');
    }
}
    public function exportPDF()
    {
        $records = StockOut::with(['item', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('stock_out.pdf', compact('records'));

        return $pdf->download('stock_out_records_' . date('Y-m-d') . '.pdf');
    }