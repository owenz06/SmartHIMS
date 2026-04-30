<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\AuditHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Mail\PurchaseOrderMail;
use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\StockIn;
use App\Models\Supplier;
use App\Models\SystemNotification;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        if (! PermissionHelper::can(auth()->user(), 'purchase_orders.view')) {
            abort(403, 'You do not have permission to view purchase orders.');
        }

        $orders = PurchaseOrder::with('supplier', 'items')->paginate(15);

        return inertia('admin/purchase-orders', [
            'orders' => $orders,
            'canCreate' => PermissionHelper::can(auth()->user(), 'purchase_orders.create'),
            'canEdit' => PermissionHelper::can(auth()->user(), 'purchase_orders.update'),
            'canDelete' => PermissionHelper::can(auth()->user(), 'purchase_orders.delete'),
            'canApprove' => PermissionHelper::can(auth()->user(), 'purchase_orders.approve'),
        ]);
    }

    public function create()
    {
        if (! PermissionHelper::can(auth()->user(), 'purchase_orders.create')) {
            abort(403, 'You do not have permission to create purchase orders.');
        }

        $suppliers = Supplier::all();
        $items = Item::all();

        return inertia('admin/purchase-orders-create', [
            'suppliers' => $suppliers,
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        if (! PermissionHelper::can(auth()->user(), 'purchase_orders.create')) {
            abort(403, 'You do not have permission to create purchase orders.');
        }

        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'items' => 'required|array',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request) {
            $po = PurchaseOrder::create([
                'po_number' => 'PO-'.strtoupper(Str::random(6)),
                'supplier_id' => $request->supplier_id,
                'order_date' => now(),
                'status' => 'Pending',
            ]);

            foreach ($request->items as $item) {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            SystemNotification::create([
                'title' => 'Purchase Order Created',
                'message' => 'New PO '.$po->po_number.' has been created.',
                'target_role' => 'admin',
            ]);

            AuditHelper::log('created', $po, null, $po->toArray());
        });

        return redirect()->route('admin.purchase-orders.index')
            ->with('success', 'Purchase Order created successfully!');
    }

    public function show($id)
    {
        $order = PurchaseOrder::with(['supplier', 'items.item'])->findOrFail($id);

        return view('admin.purchase_orders.show', compact('order'));
    }

    public function edit($id)
    {
        $order = PurchaseOrder::with('items')->findOrFail($id);
        $suppliers = Supplier::all();
        $items = Item::all();

        return inertia('admin/purchase-orders-edit', [
            'order' => $order,
            'suppliers' => $suppliers,
            'items' => $items,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'items' => 'required|array',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request, $id) {
            $order = PurchaseOrder::with('items')->findOrFail($id);
            $oldData = $order->toArray();

            $order->supplier_id = $request->supplier_id;
            $order->save();

            // Delete old items
            $order->items()->delete();

            // Add new items
            foreach ($request->items as $item) {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $order->id,
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            AuditHelper::log('updated', $order, $oldData, $order->toArray());
        });

        return redirect()->route('admin.purchase-orders.index')
            ->with('success', 'Purchase Order updated successfully!');
    }

    public function destroy($id)
    {
        if (! PermissionHelper::can(auth()->user(), 'purchase_orders.delete')) {
            abort(403, 'You do not have permission to delete purchase orders.');
        }

        DB::transaction(function () use ($id) {
            $order = PurchaseOrder::with('items')->findOrFail($id);
            $oldData = $order->toArray();

            $order->items()->delete();
            $order->delete();

            AuditHelper::log('deleted', $order, $oldData, null);
        });

        return redirect()->route('admin.purchase-orders.index')
            ->with('success', 'Purchase Order deleted successfully!');
    }

    public function generateFromSuggestions()
    {
        $lowStockItems = Item::where('quantity', '<=', \DB::raw('reorder_point'))->get();

        if ($lowStockItems->isEmpty()) {
            return back()->with('info', 'No items require reordering at this time.');
        }

        $createdOrders = DB::transaction(function () use ($lowStockItems) {
            // Group items by supplier
            $itemsBySupplier = $lowStockItems->groupBy('supplier_id');

            $created = [];

            foreach ($itemsBySupplier as $supplierId => $items) {
                $supplier = Supplier::find($supplierId);

                if (! $supplier) {
                    continue;
                }

                $po = PurchaseOrder::create([
                    'po_number' => 'PO-'.strtoupper(Str::random(6)),
                    'supplier_id' => $supplierId,
                    'order_date' => now(),
                    'status' => 'Pending',
                ]);

                foreach ($items as $item) {
                    $monthlyAverage = $item->stockOuts()
                        ->whereDate('created_at', '>=', now()->subMonths(3))
                        ->sum('quantity') / 3;

                    $suggested = max(0, ($monthlyAverage * 2) - $item->quantity);

                    if ($suggested > 0) {
                        PurchaseOrderItem::create([
                            'purchase_order_id' => $po->id,
                            'item_id' => $item->id,
                            'quantity' => round($suggested),
                        ]);
                    }
                }

                $created[] = $po;

                SystemNotification::create([
                    'title' => 'Purchase Order Created',
                    'message' => 'New PO '.$po->po_number.' has been generated for reordering.',
                    'target_role' => 'admin',
                ]);

                AuditHelper::log('created', $po, null, $po->toArray());
            }

            return $created;
        });

        if (empty($createdOrders)) {
            return back()->with('info', 'No suggested items to order.');
        }

        return back()->with('success', count($createdOrders).' Purchase Order(s) generated successfully!');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Approved,Received,Cancelled',
        ]);

        DB::transaction(function () use ($request, $id) {
            $order = PurchaseOrder::with('items.item', 'supplier')->findOrFail($id);
            $previousStatus = $order->status;
            $oldData = $order->toArray();

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

            // If received, then update stock automatically
            if ($request->status === 'Received' && $previousStatus !== 'Received') {
                foreach ($order->items as $poItem) {
                    $item = $poItem->item;
                    $oldQuantity = $item->quantity;

                    $item->quantity += $poItem->quantity;
                    $item->save();

                    // Log stock-in record
                    StockIn::create([
                        'item_id' => $item->id,
                        'quantity_received' => $poItem->quantity,
                        'supplier_id' => $order->supplier_id,
                    ]);

                    AuditHelper::log(
                        'stock_received',
                        $item,
                        ['quantity' => $oldQuantity],
                        ['quantity' => $item->quantity]
                    );
                }

                SystemNotification::create([
                    'title' => 'Stock Updated',
                    'message' => 'Items from '.$order->po_number.' added to inventory.',
                    'target_role' => 'admin',
                ]);
            }

            AuditHelper::log(
                'status_updated',
                $order,
                ['status' => $previousStatus],
                ['status' => $order->status]
            );
        });

        return back()->with('success', 'Purchase Order status updated successfully!');
    }

    public function generatePDF($id)
    {
        $order = PurchaseOrder::with(['supplier', 'items.item'])->findOrFail($id);
        $pdf = Pdf::loadView('admin.purchase_orders.pdf', compact('order'));

        return $pdf->download($order->po_number.'.pdf');
    }

    public function exportListPDF()
    {
        $orders = PurchaseOrder::with(['supplier', 'items.item'])
            ->orderBy('created_at', 'desc')
            ->get();

        $pdf = Pdf::loadView('admin.purchase_orders.list_pdf', compact('orders'));
        
        return $pdf->download('purchase_orders_list_' . date('Y-m-d') . '.pdf');
    }
}
