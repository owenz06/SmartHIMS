<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        if (! PermissionHelper::can(auth()->user(), 'suppliers.view')) {
            abort(403, 'You do not have permission to view suppliers.');
        }

        $suppliers = Supplier::all();

        return inertia('admin/suppliers', [
            'suppliers' => $suppliers,
            'canCreate' => PermissionHelper::can(auth()->user(), 'suppliers.create'),
            'canEdit' => PermissionHelper::can(auth()->user(), 'suppliers.update'),
            'canDelete' => PermissionHelper::can(auth()->user(), 'suppliers.delete'),
        ]);
    }

    public function create()
    {
        if (! PermissionHelper::can(auth()->user(), 'suppliers.create')) {
            abort(403, 'You do not have permission to add suppliers.');
        }

        return inertia('admin/suppliers-create');
    }
    public function show($id)
    {
        if (! PermissionHelper::can(auth()->user(), 'suppliers.view')) {
            abort(403, 'You do not have permission to view suppliers.');
        }

        $supplier = Supplier::findOrFail($id);

        return inertia('admin/suppliers-show', [
            'supplier' => $supplier,
        ]);
    }


    public function store(Request $request)
    {
        if (! PermissionHelper::can(auth()->user(), 'suppliers.create')) {
            abort(403, 'You do not have permission to add suppliers.');
        }

        $request->validate([
            'name' => 'required|string',
            'contact_person' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        Supplier::create($request->all());

        return redirect()->route('admin.suppliers.index')
            ->with('success', 'Supplier created successfully.');
    }

    public function edit($id)
    {
        if (! PermissionHelper::can(auth()->user(), 'suppliers.update')) {
            abort(403, 'You do not have permission to edit suppliers.');
        }

        $supplier = Supplier::findOrFail($id);

        return inertia('admin/suppliers-edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(Request $request, $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'suppliers.update')) {
            abort(403, 'You do not have permission to edit suppliers.');
        }

        $supplier = Supplier::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'contact_person' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $supplier->update($request->all());

        return redirect()->route('admin.suppliers.index')
            ->with('success', 'Supplier updated successfully.');
    }

    public function destroy($id)
    {
        if (! PermissionHelper::can(auth()->user(), 'suppliers.delete')) {
            abort(403, 'You do not have permission to delete suppliers.');
        }

        Supplier::destroy($id);

        return redirect()->route('admin.suppliers.index')
            ->with('success', 'Supplier deleted successfully.');
    }
}
