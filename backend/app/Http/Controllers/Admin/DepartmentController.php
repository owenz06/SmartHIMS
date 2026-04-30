<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\AuditHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        if (! PermissionHelper::can(auth()->user(), 'departments.view')) {
            abort(403, 'You do not have permission to view departments.');
        }

        $departments = Department::paginate(15);

        return inertia('admin/departments', [
            'departments' => $departments,
            'canCreate' => PermissionHelper::can(auth()->user(), 'departments.create'),
            'canEdit' => PermissionHelper::can(auth()->user(), 'departments.update'),
            'canDelete' => PermissionHelper::can(auth()->user(), 'departments.delete'),
        ]);
    }

    public function create()
    {
        if (! PermissionHelper::can(auth()->user(), 'departments.create')) {
            abort(403, 'You do not have permission to create departments.');
        }

        return inertia('admin/departments-create');
    }

    public function store(Request $request)
    {
        if (! PermissionHelper::can(auth()->user(), 'departments.create')) {
            abort(403, 'You do not have permission to create departments.');
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:departments',
            'description' => 'nullable|string',
        ]);

        $department = Department::create($request->all());

        AuditHelper::log('created', $department, null, $department->toArray());

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department created successfully.');
    }

    public function show(string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'departments.view')) {
            abort(403, 'You do not have permission to view departments.');
        }

        $department = Department::findOrFail($id);

        return view('admin.departments.show', compact('department'));
    }

    public function edit(string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'departments.update')) {
            abort(403, 'You do not have permission to edit departments.');
        }

        $department = Department::findOrFail($id);

        return inertia('admin/departments-edit', [
            'department' => $department,
        ]);
    }

    public function update(Request $request, string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'departments.update')) {
            abort(403, 'You do not have permission to edit departments.');
        }

        $department = Department::findOrFail($id);
        $oldData = $department->toArray();

        $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,'.$id,
            'description' => 'nullable|string',
        ]);

        $department->update($request->all());

        AuditHelper::log('updated', $department, $oldData, $department->toArray());

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department updated successfully.');
    }

    public function destroy(string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'departments.delete')) {
            abort(403, 'You do not have permission to delete departments.');
        }

        $department = Department::findOrFail($id);
        $oldData = $department->toArray();

        $department->delete();

        AuditHelper::log('deleted', $department, $oldData, null);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department deleted successfully.');
    }
}
