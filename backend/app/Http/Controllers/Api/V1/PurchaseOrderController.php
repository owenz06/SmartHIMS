<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\AuditHelper;
use App\Http\Controllers\Controller;
use App\Mail\PurchaseOrderMail;
use App\Models\PurchaseOrder;
use App\Models\StockIn;
use App\Models\SystemNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PurchaseOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'items.item']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->integer('supplier_id'));
        }

        $perPage = (int) $request->get('per_page', 25);

        return response()->json(
            $query->orderByDesc('order_date')->paginate($perPage)
        );
    }

    public function show(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['supplier', 'items.item']);

        return response()->json($purchaseOrder);
    }

    public function store(Request $request)
    {
        // Only Procurement Officer can create purchase orders
        if (!in_array(auth()->user()->role, ['procurement_officer'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Procurement Officers can create purchase orders.',
            ], 403);
        }

        $validated = $request->validate([
            'po_number' => 'required|string|max:255|unique:purchase_orders,po_number',
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'status' => 'nullable|in:Pending,Approved,Received,Cancelled',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $purchaseOrder = PurchaseOrder::create([
                'po_number' => $validated['po_number'],
                'supplier_id' => $validated['supplier_id'],
                'order_date' => $validated['order_date'],
                'status' => $validated['status'] ?? 'Pending',
            ]);

            foreach ($validated['items'] as $item) {
                $purchaseOrder->items()->create([
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            DB::commit();

            $purchaseOrder->load(['supplier', 'items.item']);

            return response()->json([
                'success' => true,
                'message' => 'Purchase order created successfully',
                'data' => $purchaseOrder,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create purchase order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        // Only Procurement Officer can update purchase orders
        if (!in_array(auth()->user()->role, ['procurement_officer'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Procurement Officers can update purchase orders.',
            ], 403);
        }

        $validated = $request->validate([
            'po_number' => 'required|string|max:255|unique:purchase_orders,po_number,' . $purchaseOrder->id,
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'status' => 'nullable|in:Pending,Approved,Received,Cancelled',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $purchaseOrder->update([
                'po_number' => $validated['po_number'],
                'supplier_id' => $validated['supplier_id'],
                'order_date' => $validated['order_date'],
                'status' => $validated['status'] ?? $purchaseOrder->status,
            ]);

            // Delete existing items and recreate
            $purchaseOrder->items()->delete();

            foreach ($validated['items'] as $item) {
                $purchaseOrder->items()->create([
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            DB::commit();

            $purchaseOrder->load(['supplier', 'items.item']);

            return response()->json([
                'success' => true,
                'message' => 'Purchase order updated successfully',
                'data' => $purchaseOrder,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchase order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(PurchaseOrder $purchaseOrder)
    {
        // Super Admin and System Admin cannot delete purchase orders
        if (in_array(auth()->user()->role, ['super_admin', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Super Admin and System Admin cannot delete purchase orders.',
            ], 403);
        }

        // Only allow deletion of pending or cancelled orders
        if (!in_array($purchaseOrder->status, ['Pending', 'Cancelled'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete approved or received purchase orders',
            ], 422);
        }

        $purchaseOrder->items()->delete();
        $purchaseOrder->delete();

        return response()->json([
            'success' => true,
            'message' => 'Purchase order deleted successfully',
        ]);
    }

    /**
     * Update purchase order status.
     * PATCH /api/v1/purchase-orders/{purchaseOrder}/status
     */
    public function updateStatus(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        // Only Manager can approve purchase orders
        if (!in_array(auth()->user()->role, ['manager'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Inventory Managers can approve purchase orders.',
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:Pending,Approved,Received,Cancelled',
        ]);

        DB::transaction(function () use ($request, $purchaseOrder) {
            $order = PurchaseOrder::with('items.item', 'supplier')->findOrFail($purchaseOrder->id);
            $previousStatus = $order->status;

            $order->status = $request->status;
            $order->save();

            if ($request->status === 'Approved' && $previousStatus !== 'Approved') {
                Mail::to($order->supplier->email)
                    ->send(new PurchaseOrderMail($order));

                SystemNotification::create([
                    'title' => 'PO Approved',
                    'message' => 'Purchase Order '.$order->po_number.' approved and sent to supplier.',
                    'target_role' => 'admin',
                ]);
            }

            if ($request->status === 'Received' && $previousStatus !== 'Received') {
                foreach ($order->items as $poItem) {
                    $item = $poItem->item;
                    $oldQuantity = $item->quantity;

                    $item->quantity += $poItem->quantity;
                    $item->save();

                    StockIn::create([
                        'item_id' => $item->id,
                        'quantity_received' => $poItem->quantity,
                        'supplier_id' => $order->supplier_id,
                    ]);

                    AuditHelper::log('stock_received', $item, ['quantity' => $oldQuantity], ['quantity' => $item->quantity]);
                }

                SystemNotification::create([
                    'title' => 'Stock Updated',
                    'message' => 'Items from '.$order->po_number.' added to inventory.',
                    'target_role' => 'admin',
                ]);
            }

            AuditHelper::log('status_updated', $order, ['status' => $previousStatus], ['status' => $order->status]);
        });

        $purchaseOrder->refresh()->load(['supplier', 'items.item']);

        return response()->json([
            'message' => 'Purchase order status updated.',
            'data' => $purchaseOrder,
        ]);
    }
}
