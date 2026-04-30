# System Admin Permissions Implementation

## Overview
System Admin (admin role) has full operational access but cannot interact with Super Admin accounts or configure global system settings.

---

## System Admin Permissions

### ✅ What System Admin CAN Do

#### 1. User Management (Limited)
- ✅ Create users with roles: admin, manager, pharmacist, procurement_officer
- ✅ Update users (except Super Admin accounts)
- ✅ Delete users (except Super Admin accounts)
- ✅ Assign roles (except super_admin role)
- ✅ View all users EXCEPT Super Admin accounts
- ✅ Deactivate users (except Super Admin)

#### 2. Full Operational Access
- ✅ **Inventory Management**
  - Create, update, delete inventory items
  - Configure inventory settings (reorder points, stock levels)
  - Set up inventory parameters
  
- ✅ **Purchase Orders**
  - Create purchase orders
  - Update purchase orders
  - Delete purchase orders
  - Approve/reject purchase orders
  - Generate purchase orders from suggestions
  
- ✅ **Requisitions**
  - Create requisitions
  - Update requisitions
  - Delete requisitions
  - Approve/reject requisitions
  
- ✅ **Stock Management**
  - Create stock in records
  - Update stock in records
  - Create stock out records
  - Update stock out records
  - View all stock movements
  
- ✅ **Master Data Management**
  - Manage suppliers (Full CRUD)
  - Manage categories (Full CRUD)
  - Manage departments (Full CRUD)

#### 3. Monitoring & Reporting
- ✅ View all reports (all departments)
- ✅ View audit logs
- ✅ View notifications
- ✅ Manage notifications
- ✅ Monitor system activities

### ❌ What System Admin CANNOT Do

#### 1. Super Admin Related
- ❌ Cannot create Super Admin accounts
- ❌ Cannot view Super Admin account details
- ❌ Cannot edit Super Admin accounts
- ❌ Cannot delete Super Admin accounts
- ❌ Cannot assign super_admin role to any user
- ❌ Super Admin users are completely hidden from System Admin

#### 2. System Configuration
- ❌ Cannot configure global system settings
- ❌ Cannot modify system-wide parameters
- ❌ Cannot change core system configurations

---

## Implementation Details

### Permission Checks in Code

#### Filtering Users List
```php
// System Admin sees all users except super_admin
public static function getFilteredUsers(User $user)
{
    if ($user->role === 'super_admin') {
        return User::all();
    }
    
    if ($user->role === 'admin') {
        return User::where('role', '!=', 'super_admin')->get();
    }
    
    return collect();
}
```

#### Checking User Visibility
```php
// Check if admin can view a specific user
public static function canViewUser(User $user, User $targetUser): bool
{
    if ($user->role === 'super_admin') {
        return true;
    }
    
    // Admin cannot view super_admin accounts
    if ($user->role === 'admin' && $targetUser->role === 'super_admin') {
        return false;
    }
    
    if ($user->role === 'admin') {
        return true;
    }
    
    return false;
}
```

#### Checking User Edit Permission
```php
// Check if admin can edit a specific user
public static function canEditUser(User $user, User $targetUser): bool
{
    if ($user->role === 'super_admin') {
        return true;
    }
    
    // Admin cannot edit super_admin accounts
    if ($user->role === 'admin' && $targetUser->role === 'super_admin') {
        return false;
    }
    
    if ($user->role === 'admin') {
        return true;
    }
    
    return false;
}
```

#### Checking Role Creation Permission
```php
// Check if admin can create user with specific role
public static function canCreateUserWithRole(User $user, string $targetRole): bool
{
    if ($user->role === 'super_admin') {
        return true;
    }
    
    // Admin cannot create super_admin
    if ($user->role === 'admin' && $targetRole === 'super_admin') {
        return false;
    }
    
    if ($user->role === 'admin') {
        return true;
    }
    
    return false;
}
```

---

## Controller Implementation

### UserManagementController

#### Index Method
```php
public function index()
{
    if (!PermissionHelper::can(auth()->user(), 'users.view')) {
        abort(403, 'You do not have permission to view users.');
    }

    // Get filtered users based on role
    $users = PermissionHelper::getFilteredUsers(auth()->user());

    return inertia('admin/users', [
        'users' => $users,
        'canManageUsers' => PermissionHelper::canManageUsers(auth()->user()),
        'canCreateSuperAdmin' => auth()->user()->role === 'super_admin',
    ]);
}
```

#### Store Method
```php
public function store(Request $request)
{
    if (!PermissionHelper::can(auth()->user(), 'users.create')) {
        abort(403, 'You do not have permission to create users.');
    }

    // Check if user can create a user with this role
    if (!PermissionHelper::canCreateUserWithRole(auth()->user(), $request->role)) {
        return redirect()->back()
            ->with('error', 'You do not have permission to create users with this role.');
    }

    // Create user...
}
```

#### Edit Method
```php
public function edit($id)
{
    if (!PermissionHelper::can(auth()->user(), 'users.update')) {
        abort(403, 'You do not have permission to edit users.');
    }

    $user = User::findOrFail($id);

    // Check if user can view/edit this specific user
    if (!PermissionHelper::canEditUser(auth()->user(), $user)) {
        abort(403, 'You do not have permission to edit this user.');
    }

    return inertia('admin/users-edit', [
        'user' => $user,
        'canAssignSuperAdmin' => auth()->user()->role === 'super_admin',
    ]);
}
```

---

## Frontend Integration

### Hiding Super Admin Option

In the user create/edit forms, hide the super_admin role option for System Admin:

```tsx
<select>
    <option value="pharmacist">Pharmacist</option>
    <option value="manager">Manager</option>
    <option value="procurement_officer">Procurement Officer</option>
    <option value="admin">Admin</option>
    {canCreateSuperAdmin && (
        <option value="super_admin">Super Admin</option>
    )}
</select>
```

### Filtering Users Table

The backend automatically filters out Super Admin users when System Admin requests the users list, so no frontend filtering is needed.

---

## Configuration

### config/permissions.php

```php
'admin' => [
    'permissions' => [
        // User Management (except Super Admin)
        'users.view',
        'users.create',
        'users.update',
        'users.delete',
        'users.assign_roles',
        
        // Inventory
        'inventory.view',
        'inventory.create',
        'inventory.update',
        'inventory.delete',
        'inventory.configure',
        
        // ... other permissions
    ],
    'restrictions' => [
        // Super Admin restrictions
        'users.view_super_admin' => 'Cannot view Super Admin account details',
        'users.edit_super_admin' => 'Cannot edit Super Admin accounts',
        'users.delete_super_admin' => 'Cannot delete Super Admin accounts',
        'users.create_super_admin' => 'Cannot create Super Admin accounts',
        'users.assign_super_admin_role' => 'Cannot assign super_admin role',
        
        // System restrictions
        'settings.configure_global' => 'Cannot configure global system settings',
    ],
],
```

---

## Testing Scenarios

### Test System Admin Restrictions:

1. **Login as System Admin**
2. **Go to Users page** → Should NOT see any Super Admin users
3. **Try to create a user** → Super Admin option should not be available
4. **Try to access Super Admin user directly** (via URL) → Should get 403 error
5. **Try to edit a regular user** → Should succeed
6. **Try to assign super_admin role** → Should be blocked
7. **Create a purchase order** → Should succeed (unlike Super Admin)
8. **Configure inventory settings** → Should succeed
9. **View audit logs** → Should succeed
10. **Try to access global settings** → Should be blocked

### Test Super Admin Can Still Manage System Admin:

1. **Login as Super Admin**
2. **Go to Users page** → Should see ALL users including System Admin
3. **Edit a System Admin user** → Should succeed
4. **Delete a System Admin user** → Should succeed
5. **Create a new System Admin** → Should succeed

---

## Key Differences: Super Admin vs System Admin

| Feature | Super Admin | System Admin |
|---------|-------------|--------------|
| **View Super Admin accounts** | ✅ Yes | ❌ No |
| **Create Super Admin** | ✅ Yes | ❌ No |
| **Edit Super Admin** | ✅ Yes | ❌ No |
| **Delete Super Admin** | ✅ Yes | ❌ No |
| **Assign super_admin role** | ✅ Yes | ❌ No |
| **Configure global settings** | ✅ Yes | ❌ No |
| **Create purchase orders** | ❌ No | ✅ Yes |
| **Edit inventory** | ❌ No | ✅ Yes |
| **Approve requisitions** | ❌ No | ✅ Yes |
| **Create transactions** | ❌ No | ✅ Yes |
| **Configure inventory settings** | ✅ Yes | ✅ Yes |
| **View audit logs** | ✅ Yes | ✅ Yes |
| **View all reports** | ✅ Yes | ✅ Yes |

---

## Security Benefits

1. **Separation of Powers**: Super Admin focuses on oversight, System Admin handles operations
2. **Protected Super Admin**: System Admin cannot interfere with Super Admin accounts
3. **Audit Trail**: All actions are logged
4. **Role Protection**: super_admin role can only be assigned by Super Admin
5. **Operational Freedom**: System Admin has full operational access without system-level risks

---

## Next Steps

To fully implement System Admin permissions across the application:

1. ✅ User Management - COMPLETED
2. ⏳ Inventory Management - Add permission checks
3. ⏳ Purchase Orders - Add permission checks
4. ⏳ Requisitions - Add permission checks
5. ⏳ Stock Management - Add permission checks
6. ⏳ Master Data (Suppliers, Categories, Departments) - Add permission checks
7. ⏳ Reports - Add permission checks
8. ⏳ Settings - Create settings page with role-based access
