<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    public function index()
    {
        // Check permission
        if (! PermissionHelper::can(auth()->user(), 'users.view')) {
            abort(403, 'You do not have permission to view users.');
        }

        // Get filtered users based on role
        $users = PermissionHelper::getFilteredUsers(auth()->user());

        return inertia('admin/users', [
            'users' => $users,
            'canManageUsers' => PermissionHelper::canManageUsers(auth()->user()),
            'canCreateSuperAdmin' => auth()->user()->role === 'super_admin',
            'auth' => [
                'user' => [
                    'role' => auth()->user()->role,
                ],
            ],
        ]);
    }

    public function create()
    {
        if (! PermissionHelper::can(auth()->user(), 'users.create')) {
            abort(403, 'You do not have permission to create users.');
        }

        return inertia('admin/users-create');
    }

    public function store(Request $request)
    {
        if (! PermissionHelper::can(auth()->user(), 'users.create')) {
            abort(403, 'You do not have permission to create users.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'role' => 'required|in:super_admin,admin,manager,pharmacist,procurement_officer',
            'password' => 'required|min:6|confirmed',
        ]);

        // Check if user can create a user with this role
        if (! PermissionHelper::canCreateUserWithRole(auth()->user(), $request->role)) {
            return redirect()->back()
                ->with('error', 'You do not have permission to create users with this role.');
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back()
            ->with('success', 'User created successfully');
    }

    public function edit($id)
    {
        if (! PermissionHelper::can(auth()->user(), 'users.update')) {
            abort(403, 'You do not have permission to edit users.');
        }

        $user = User::findOrFail($id);

        // Check if user can view/edit this specific user
        if (! PermissionHelper::canEditUser(auth()->user(), $user)) {
            abort(403, 'You do not have permission to edit this user.');
        }

        return inertia('admin/users-edit', [
            'user' => $user,
            'canAssignSuperAdmin' => auth()->user()->role === 'super_admin',
        ]);
    }

    public function update(Request $request, $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'users.update')) {
            abort(403, 'You do not have permission to update users.');
        }

        $user = User::findOrFail($id);

        // Check if user can edit this specific user
        if (! PermissionHelper::canEditUser(auth()->user(), $user)) {
            abort(403, 'You do not have permission to edit this user.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$id,
            'role' => 'required|in:super_admin,admin,manager,pharmacist,procurement_officer',
        ]);

        // Check if user can assign this role
        if (! PermissionHelper::canAssignRole(auth()->user(), $request->role)) {
            return redirect()->back()
                ->with('error', 'You do not have permission to assign this role.');
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        return redirect()->back()
            ->with('success', 'User updated successfully');
    }

    public function destroy($id)
    {
        if (! PermissionHelper::can(auth()->user(), 'users.delete')) {
            abort(403, 'You do not have permission to delete users.');
        }

        $user = User::findOrFail($id);

        // Check if user can delete this specific user
        if (! PermissionHelper::canDeleteUser(auth()->user(), $user)) {
            return redirect()->back()
                ->with('error', 'You cannot delete this user.');
        }

        $user->delete();

        return redirect()->back()
            ->with('success', 'User deleted successfully');
    }
}
