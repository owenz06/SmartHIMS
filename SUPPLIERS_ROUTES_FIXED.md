# Suppliers Routes and Actions Fixed

## Issues Fixed

### 1. Missing show() Method
- Added `show()` method to `SupplierController`
- Method checks permissions and returns supplier details
- Returns inertia view `admin/suppliers-show`

### 2. Route Ordering Issue
- Fixed route ordering to prevent "create" being matched as an ID
- Moved show routes AFTER create/edit routes
- Applied same fix to purchase orders and stock-in routes

### 3. Actions Already Implemented
- Edit and delete actions were already present in the suppliers page
- Both actions check permissions (canEdit, canDelete)
- Delete action includes confirmation dialog

## Route Structure (Correct Order)

```
GET    /admin/suppliers              (index - all roles)
POST   /admin/suppliers              (store - admin, super_admin, procurement_officer)
GET    /admin/suppliers/create       (create - admin, super_admin, procurement_officer)
PUT    /admin/suppliers/{id}         (update - admin, super_admin, procurement_officer)
DELETE /admin/suppliers/{id}         (destroy - admin, super_admin, procurement_officer)
GET    /admin/suppliers/{id}         (show - all roles) ← MUST come after create
GET    /admin/suppliers/{id}/edit    (edit - admin, super_admin, procurement_officer)
```

## Files Modified

1. **app/Http/Controllers/Admin/SupplierController.php**
   - Added `show()` method

2. **routes/web.php**
   - Reorganized supplier routes
   - Moved show routes to separate group after CRUD routes
   - Applied same fix to purchase orders and stock-in

## How It Works

### Route Matching Order
Laravel matches routes sequentially. When routes are defined in this order:
1. `/suppliers/{id}` (show)
2. `/suppliers/create` (create)

Laravel matches "create" as an ID parameter, causing 404 errors.

### Correct Order
1. `/suppliers/create` (specific route)
2. `/suppliers/{id}/edit` (specific route)
3. `/suppliers/{id}` (dynamic route - comes last)

This ensures specific routes are matched before dynamic ones.

## Permissions

- **View**: admin, super_admin, procurement_officer, manager
- **Create**: admin, super_admin, procurement_officer
- **Edit**: admin, super_admin, procurement_officer
- **Delete**: admin, super_admin, procurement_officer

## Testing

1. Navigate to Suppliers page
2. Click "Add Supplier" - should show create form
3. Fill form and submit - should create supplier
4. Click edit icon - should show edit form
5. Click delete icon - should show confirmation and delete
