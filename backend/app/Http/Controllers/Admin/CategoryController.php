<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\AuditHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        if (! PermissionHelper::can(auth()->user(), 'categories.view')) {
            abort(403, 'You do not have permission to view categories.');
        }

        $categories = Category::withCount('items')->paginate(15);

        return inertia('admin/categories', [
            'categories' => $categories,
            'canCreate' => PermissionHelper::can(auth()->user(), 'categories.create'),
            'canEdit' => PermissionHelper::can(auth()->user(), 'categories.update'),
            'canDelete' => PermissionHelper::can(auth()->user(), 'categories.delete'),
        ]);
    }

    public function create()
    {
        if (! PermissionHelper::can(auth()->user(), 'categories.create')) {
            abort(403, 'You do not have permission to create categories.');
        }

        return inertia('admin/categories-create');
    }

    public function store(Request $request)
    {
        if (! PermissionHelper::can(auth()->user(), 'categories.create')) {
            abort(403, 'You do not have permission to create categories.');
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($request->all());

        AuditHelper::log('created', $category, null, $category->toArray());

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function show(string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'categories.view')) {
            abort(403, 'You do not have permission to view categories.');
        }

        $category = Category::with('items')->findOrFail($id);

        return view('admin.categories.show', compact('category'));
    }

    public function edit(string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'categories.update')) {
            abort(403, 'You do not have permission to edit categories.');
        }

        $category = Category::findOrFail($id);

        return inertia('admin/categories-edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'categories.update')) {
            abort(403, 'You do not have permission to edit categories.');
        }

        $category = Category::findOrFail($id);
        $oldData = $category->toArray();

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,'.$id,
            'description' => 'nullable|string',
        ]);

        $category->update($request->all());

        AuditHelper::log('updated', $category, $oldData, $category->toArray());

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'categories.delete')) {
            abort(403, 'You do not have permission to delete categories.');
        }

        $category = Category::findOrFail($id);
        $oldData = $category->toArray();

        $category->delete();

        AuditHelper::log('deleted', $category, $oldData, null);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
