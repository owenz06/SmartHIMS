# Controllers Updated with Permissions

## Summary
All controllers and frontend pages have been updated with role-based permissions system.

---

## Controllers Updated

### ✅ Completed

1. **UserManagementController** - Fully implemented with permissions
   - Filters users based on role (hides Super Admin from System Admin)
   - Checks create/edit/delete permissions
   - Validates role assignment permissions

2. **InventoryController** - Fully implemented
   - Added permission checks for view, create, update, delete
   - Passes permission flags to frontend
   - Includes viewOnly flag for pharmacists

3. **SupplierController** - Fully implemented
   - Added permission checks for all CRUD operations
   - Passes permission flags to frontend

4. **PurchaseOrderController** - Fully implemented
   - Added permission checks for view, create, delete
   - Passes permission flags to frontend

5. **CategoryController** - Fully implemented
   - Added permission checks for all CRUD operations
   - Passes permission flags to frontend

6. **DepartmentController** - Fully implemented
   - Added permission checks for all CRUD operations
   - Passes permission flags to frontend

7. **RequisitionController** - Fully implemented
   - Added permission checks for all CRUD operations
   - Filters requisitions by user for pharmacists
   - Passes permission flags including canApprove to frontend

8. **StockInController** - Fully implemented
   - Added permission checks for all CRUD operations
   - Passes permission flags to frontend
   - Loads item and supplier relationships

9. **StockOutController** - Fully implemented
   - Added permission checks for all CRUD operations
   - Filters by user for pharmacists (only see their own records)
   - Pharmacists can only edit/delete their own records
   - Passes permission flags to frontend

10. **ReportsController** - Fully implemented
    - Added permission checks for view
    - Filters audit logs (only Super Admin and System Admin can view)
    - Passes canViewAuditLogs flag to frontend

---

## Frontend Pages Updated

### ✅ Completed

1. **inventory.tsx**
   - Added permission props (canCreate, canEdit, canDelete, viewOnly)
   - Conditionally shows/hides buttons based on permissions
   - Shows view-only message for pharmacists

2. **suppliers.tsx**
   - Added permission props (canCreate, canEdit, canDelete)
   - Conditionally shows/hides buttons based on permissions

3. **purchase-orders.tsx**
   - Added permission props (canCreate, canEdit, canDelete)
   - Conditionally shows/hides buttons based on permissions

4. **categories.tsx**
   - Added permission props (canCreate, canEdit, canDelete)
   - Conditionally shows/hides buttons based on permissions

5. **departments.tsx**
   - Added permission props (canCreate, canEdit, canDelete)
   - Conditionally shows/hides buttons based on permissions

6. **requisitions.tsx**
   - Added permission props (canCreate, canEdit, canDelete, canApprove)
   - Conditionally shows/hides buttons based on permissions

7. **stock-in.tsx**
   - Added permission props (canCreate, canEdit, canDelete)
   - Conditionally shows/hides buttons based on permissions
   - Updated to show item and supplier names instead of IDs

8. **stock-out/index.tsx**
   - Added permission props (canCreate, canEdit, canDelete)
   - Conditionally shows/hides buttons based on permissions

---

## Permission Checks Pattern

### In Controllers

```php
use App\Helpers\PermissionHelper;

public function index()
{
    // Check view permission
    if (!PermissionHelper::can(auth()->user(), 'resource.view')) {
        abort(403, 'You do not have permission to view this resource.');
    }
    
    // Get data
    $items = Resource::paginate(15);
    
    // Pass permission flags to frontend
    return inertia('admin/resource', [
        'items' => $items,
        'canCreate' => PermissionHelper::can(auth()->user(), 'resource.create'),
        'canEdit' => PermissionHelper::can(auth()->user(), 'resource.update'),
        'canDelete' => PermissionHelper::can(auth()->user(), 'resource.delete'),
    ]);
}

public function create()
{
    if (!PermissionHelper::can(auth()->user(), 'resource.create')) {
        abort(403, 'You do not have permission to create this resource.');
    }
    
    // Show create form
}

public function store(Request $request)
{
    if (!PermissionHelper::can(auth()->user(), 'resource.create')) {
        abort(403, 'You do not have permission to create this resource.');
    }
    
    // Create resource
}

public function update(Request $request, $id)
{
    if (!PermissionHelper::can(auth()->user(), 'resource.update')) {
        abort(403, 'You do not have permission to update this resource.');
    }
    
    // Update resource
}

public function destroy($id)
{
    if (!PermissionHelper::can(auth()->user(), 'resource.delete')) {
        abort(403, 'You do not have permission to delete this resource.');
    }
    
    // Delete resource
}
```

### In Frontend

```tsx
interface ResourceProps {
    items: Resource[];
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

export default function Resource({ items, canCreate, canEdit, canDelete }: ResourceProps) {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1>Resources</h1>
                {canCreate && (
                    <Button onClick={handleCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Resource
                    </Button>
                )}
            </div>
            
            <table>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>
                            {canEdit && (
                                <Button onClick={() => handleEdit(item)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}
                            {canDelete && (
                                <Button onClick={() => handleDelete(item)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
            </table>
        </>
    );
}
```

---

## Status

**Progress**: 10/10 controllers updated ✅, 8/8 frontend pages updated ✅

**All tasks completed!**

---

## Testing Checklist

### Super Admin
- [x] Can view all pages (read-only)
- [x] Can manage all users
- [x] Cannot create/edit transactions
- [x] Cannot see action buttons on operational pages

### System Admin
- [x] Can manage all operations
- [x] Cannot see Super Admin users
- [x] Can create/edit/delete all resources
- [x] All action buttons visible

### Inventory Manager
- [x] Can manage inventory fully
- [x] Can approve requisitions
- [x] Cannot create purchase orders
- [x] Cannot edit suppliers

### Procurement Officer
- [x] Can create purchase orders
- [x] Can add suppliers
- [x] Cannot edit suppliers
- [x] Cannot delete records

### Pharmacist
- [x] Can view inventory (read-only)
- [x] Can dispense medicines
- [x] Can request stock
- [x] Cannot see edit/delete buttons
- [x] View-only message displayed
- [x] Only sees their own stock out records

---

## Key Features Implemented

1. **Permission Checks**: All controllers check permissions before allowing actions
2. **Frontend Flags**: All pages receive permission flags and conditionally show/hide buttons
3. **User Filtering**: Pharmacists only see their own records in stock out
4. **Role-Based Data**: Super Admin and System Admin see audit logs, others don't
5. **Consistent Pattern**: All controllers and pages follow the same permission pattern
6. **Security**: 403 errors returned when users try to access unauthorized actions
