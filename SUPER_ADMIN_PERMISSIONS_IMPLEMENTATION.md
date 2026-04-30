# Super Admin Permissions Implementation

## Summary
Implemented a comprehensive role-based permissions system with specific focus on Super Admin role restrictions and capabilities.

---

## Files Created

### 1. `config/permissions.php`
Defines all permissions and restrictions for each role in the system.

**Key Features:**
- Granular permission definitions
- Clear restriction messages
- Easy to modify and extend
- Supports all 5 roles

### 2. `app/Helpers/PermissionHelper.php`
Helper class providing permission checking methods.

**Methods:**
- `can()` - Check if user has permission
- `isRestricted()` - Check if action is restricted
- `canEditTransaction()` - Check transaction ownership
- `canDeleteTransaction()` - Check transaction deletion rights
- `canManageUsers()` - Check user management permission
- `canAssignRole()` - Check role assignment permission
- `canDeleteUser()` - Check user deletion permission
- `canViewAuditLogs()` - Check audit log access
- `canViewAllReports()` - Check report access
- `canConfigureSettings()` - Check settings access

### 3. `app/Http/Middleware/CheckPermission.php`
Middleware to enforce permissions on routes.

**Usage:**
```php
Route::middleware(['auth', 'permission:users.create'])->group(function () {
    // Protected routes
});
```

### 4. `PERMISSIONS_SYSTEM.md`
Complete documentation of the permissions system.

---

## Super Admin Permissions

### ✅ What Super Admin CAN Do

1. **User Management (Full Control)**
   - Create any user (including System Admin)
   - Update any user
   - Deactivate any user
   - Delete any user (including System Admin)
   - Assign any role (including super_admin)
   - Remove roles from any user

2. **System Monitoring (Read-Only)**
   - View all audit logs
   - View all reports (all departments)
   - View all inventory items
   - View all purchase orders
   - View all requisitions
   - View all stock movements
   - View all suppliers, categories, departments

3. **System Configuration**
   - Configure global system settings
   - Manage system-wide parameters
   - Set up system configurations

### ❌ What Super Admin CANNOT Do

1. **Transaction Management**
   - ❌ Cannot create purchase orders
   - ❌ Cannot edit purchase orders (even their own)
   - ❌ Cannot delete purchase orders
   - ❌ Cannot approve/reject purchase orders
   - ❌ Cannot create requisitions
   - ❌ Cannot edit requisitions
   - ❌ Cannot delete requisitions
   - ❌ Cannot approve/reject requisitions

2. **Inventory Operations**
   - ❌ Cannot create inventory items
   - ❌ Cannot edit inventory items
   - ❌ Cannot delete inventory items
   - ❌ Cannot create stock in records
   - ❌ Cannot create stock out records

3. **Data Integrity**
   - ❌ Cannot alter audit logs
   - ❌ Cannot delete audit logs
   - ❌ Cannot modify historical records

4. **Operational Interference**
   - ❌ Cannot interfere in operational workflows
   - ❌ Cannot override operational decisions
   - ❌ Cannot modify transactions created by others

---

## Implementation in Controllers

### UserManagementController
Updated with permission checks:

```php
// Check permission before action
if (!PermissionHelper::can(auth()->user(), 'users.create')) {
    abort(403, 'You do not have permission to create users.');
}

// Check role assignment permission
if (!PermissionHelper::canAssignRole(auth()->user(), $request->role)) {
    return redirect()->back()
        ->with('error', 'You do not have permission to assign this role.');
}

// Check user deletion permission
if (!PermissionHelper::canDeleteUser(auth()->user(), $user)) {
    return redirect()->back()
        ->with('error', 'You cannot delete this user.');
}
```

---

## Next Steps

### To Apply Permissions to Other Controllers:

1. **Import PermissionHelper**
   ```php
   use App\Helpers\PermissionHelper;
   ```

2. **Add Permission Checks**
   ```php
   public function create()
   {
       if (!PermissionHelper::can(auth()->user(), 'inventory.create')) {
           abort(403, 'You do not have permission to create inventory items.');
       }
       // ... rest of method
   }
   ```

3. **Check Transaction Ownership**
   ```php
   public function update(Request $request, $id)
   {
       $purchaseOrder = PurchaseOrder::findOrFail($id);
       
       if (!PermissionHelper::canEditTransaction(auth()->user(), $purchaseOrder)) {
           abort(403, 'You can only edit your own transactions.');
       }
       // ... rest of method
   }
   ```

### Controllers to Update:
- [ ] InventoryController
- [ ] PurchaseOrderController
- [ ] RequisitionController
- [ ] StockInController
- [ ] StockOutController
- [ ] SupplierController
- [ ] CategoryController
- [ ] DepartmentController
- [ ] ReportsController

---

## Frontend Integration

### Hide/Show Buttons Based on Permissions

Pass permissions to frontend:

```php
return inertia('admin/inventory', [
    'items' => $items,
    'canCreate' => PermissionHelper::can(auth()->user(), 'inventory.create'),
    'canEdit' => PermissionHelper::can(auth()->user(), 'inventory.update'),
    'canDelete' => PermissionHelper::can(auth()->user(), 'inventory.delete'),
]);
```

Use in React components:

```tsx
{canCreate && (
    <Button onClick={handleCreate}>
        <Plus className="h-4 w-4 mr-2" />
        Add Item
    </Button>
)}
```

---

## Testing

### Test Super Admin Restrictions:

1. Login as Super Admin
2. Try to create a purchase order → Should be blocked
3. Try to edit an inventory item → Should be blocked
4. Try to create a user → Should succeed
5. Try to delete a System Admin → Should succeed
6. Try to view audit logs → Should succeed

### Test Admin Permissions:

1. Login as Admin
2. Try to create a purchase order → Should succeed
3. Try to assign super_admin role → Should be blocked
4. Try to delete a Super Admin user → Should be blocked

---

## Security Benefits

1. **Separation of Concerns**: Super Admin focuses on user management and monitoring, not operations
2. **Audit Trail**: All actions are logged and immutable
3. **Transaction Integrity**: Users can only modify their own transactions
4. **Role Protection**: Super Admin role can only be assigned by Super Admin
5. **Data Protection**: Historical data cannot be altered by anyone

---

## Configuration

All permissions are centralized in `config/permissions.php` for easy maintenance and updates.

To add a new permission:

```php
'new_role' => [
    'permissions' => [
        'new_permission.action',
    ],
    'restrictions' => [
        'restricted_action' => 'Reason for restriction',
    ],
],
```
