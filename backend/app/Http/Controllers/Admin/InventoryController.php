<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\AuditHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Item;
use App\Models\Supplier;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        if (! PermissionHelper::can(auth()->user(), 'inventory.view')) {
            abort(403, 'You do not have permission to view inventory.');
        }

        $query = Item::with('category', 'supplier');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by supplier
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Filter by date added
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Order by created_at descending
        $query->orderBy('created_at', 'desc');

        $items = $query->paginate(100)->withQueryString();

        // Get filter options
        $categories = Category::all();
        $suppliers = Supplier::all();

        return inertia('admin/inventory', [
            'items' => $items,
            'categories' => $categories,
            'suppliers' => $suppliers,
            'filters' => [
                'search' => $request->search,
                'category_id' => $request->category_id,
                'supplier_id' => $request->supplier_id,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
            'canCreate' => PermissionHelper::can(auth()->user(), 'inventory.create'),
            'canEdit' => PermissionHelper::can(auth()->user(), 'inventory.update'),
            'canDelete' => PermissionHelper::can(auth()->user(), 'inventory.delete'),
            'canConfigure' => PermissionHelper::can(auth()->user(), 'inventory.configure'),
            'viewOnly' => auth()->user()->role === 'pharmacist',
        ]);
    }


    public function create()
    {
        if (! PermissionHelper::can(auth()->user(), 'inventory.create')) {
            abort(403, 'You do not have permission to add inventory items.');
        }

        $categories = Category::all();
        $suppliers = Supplier::all();

        return inertia('admin/inventory-create', [
            'categories' => $categories,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        if (! PermissionHelper::can(auth()->user(), 'inventory.create')) {
            abort(403, 'You do not have permission to add inventory items.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'unit_of_measurement' => 'required|string',
            'reorder_point' => 'required|integer|min:1',
            'quantity' => 'required|integer|min:0',
        ]);

        $item = Item::create($request->all());

        // Automatically create StockIn record if quantity > 0
        if ($request->quantity > 0) {
            \App\Models\StockIn::create([
                'item_id' => $item->id,
                'quantity_received' => $request->quantity,
                'supplier_id' => $request->supplier_id,
                'received_date' => now(),
                'notes' => 'Initial stock - Item created',
            ]);

            // Notify procurement officer that order has been delivered
            \App\Models\SystemNotification::create([
                'title' => 'Stock Delivery Confirmed',
                'message' => "Manager has received and added '{$item->name}' (Quantity: {$request->quantity}) from supplier to inventory.",
                'target_role' => 'procurement_officer',
                'is_read' => false,
            ]);
        }

        AuditHelper::log('created', $item, null, $item->toArray());

        return redirect()->route('admin.inventory.index')
            ->with('success', 'Item added successfully.');
    }


    public function edit($id)
    {
        if (! PermissionHelper::can(auth()->user(), 'inventory.update')) {
            abort(403, 'You do not have permission to edit inventory items.');
        }

        $item = Item::findOrFail($id);
        $categories = Category::all();
        $suppliers = Supplier::all();

        return inertia('admin/inventory-edit', [
            'item' => $item,
            'categories' => $categories,
            'suppliers' => $suppliers,
        ]);
    }

    public function show($id)
    {
        if (! PermissionHelper::can(auth()->user(), 'inventory.view')) {
            abort(403, 'You do not have permission to view inventory items.');
        }

        $item = Item::with('category', 'supplier')->findOrFail($id);

        return view('admin.inventory.show', compact('item'));
    }

    public function update(Request $request, $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'inventory.update')) {
            abort(403, 'You do not have permission to update inventory items.');
        }

        $item = Item::findOrFail($id);
        $oldData = $item->toArray();
        $oldQuantity = $item->quantity;

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'unit_of_measurement' => 'required|string',
            'reorder_point' => 'required|integer|min:1',
            'quantity' => 'required|integer|min:0',
        ]);

        $item->update($request->all());

        // Automatically create StockIn record if quantity increased
        $quantityDifference = $request->quantity - $oldQuantity;
        if ($quantityDifference > 0) {
            \App\Models\StockIn::create([
                'item_id' => $item->id,
                'quantity_received' => $quantityDifference,
                'supplier_id' => $request->supplier_id,
                'received_date' => now(),
                'notes' => 'Stock increased via inventory update',
            ]);

            // Notify procurement officer that additional stock has been delivered
            \App\Models\SystemNotification::create([
                'title' => 'Additional Stock Delivery Confirmed',
                'message' => "Manager has received additional stock for '{$item->name}' (Quantity: {$quantityDifference}) from supplier. New total: {$request->quantity}.",
                'target_role' => 'procurement_officer',
                'is_read' => false,
            ]);
        }

        AuditHelper::log('updated', $item, $oldData, $item->toArray());

        return redirect()->route('admin.inventory.index')
            ->with('success', 'Item updated successfully.');
    }


    public function destroy($id)
    {
        if (! PermissionHelper::can(auth()->user(), 'inventory.delete')) {
            abort(403, 'You do not have permission to delete inventory items.');
        }

        $item = Item::findOrFail($id);
        $itemData = $item->toArray();

        $item->delete();

        AuditHelper::log('deleted', $item, $itemData, null);

        return redirect()->route('admin.inventory.index')
            ->with('success', 'Item deleted successfully.');
    }

    public function exportPDF(Request $request)
    {
        if (! PermissionHelper::can(auth()->user(), 'inventory.view')) {
            abort(403, 'You do not have permission to export inventory.');
        }

        $query = Item::with('category', 'supplier');

        // Apply same filters as index method
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $items = $query->orderBy('created_at', 'desc')->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.inventory.pdf', compact('items'));

        return $pdf->download('inventory_list_' . date('Y-m-d') . '.pdf');
    }
}