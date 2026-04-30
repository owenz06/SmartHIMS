# Complete Role-Based Permissions System

## Overview
This document provides a complete overview of the role-based permissions system implemented for the Hospital Inventory Management System (HIMS).

---

## All Roles Summary

### 1. Super Admin
**Focus**: User management and system oversight

**Can Do**:
- ✅ Manage all users (including System Admin)
- ✅ Assign any role
- ✅ View audit logs
- ✅ View all reports
- ✅ Configure global settings
- ✅ View all operational data (read-only)

**Cannot Do**:
- ❌ Edit/delete transactions
- ❌ Create purchase orders
- ❌ Modify inventory
- ❌ Interfere in operations

---

### 2. System Admin
**Focus**: Full operational management

**Can Do**:
- ✅ Manage users (except Super Admin)
- ✅ Full inventory management
- ✅ Full purchase order management
- ✅ Full requisition management
- ✅ Full stock management
- ✅ Manage suppliers, categories, departments
- ✅ View all reports
- ✅ Configure inventory settings

**Cannot Do**:
- ❌ View/edit Super Admin accounts
- ❌ Assign super_admin role
- ❌ Configure global settings

---

### 3. Inventory Manager
**Focus**: Inventory and stock control

**Can Do**:
- ✅ Full inventory management
- ✅ Set reorder levels
- ✅ Approve stock issuance
- ✅ Full stock in/out management
- ✅ Approve requisitions
- ✅ Generate stock reports
- ✅ View purchase orders

**Cannot Do**:
- ❌ Manage users
- ❌ Create/edit purchase orders
- ❌ Create/edit suppliers
- ❌ View audit logs

---

### 4. Procurement Officer
**Focus**: Purchasing and supplier management

**Can Do**:
- ✅ Create purchase orders
- ✅ Add new suppliers
- ✅ Record received stock
- ✅ View inventory
- ✅ View requisitions
- ✅ View procurement reports

**Cannot Do**:
- ❌ Manage users
- ❌ Delete system records
- ❌ Modify stock manually
- ❌ Edit suppliers
- ❌ Approve purchase orders

---

### 5. Pharmacist/Technician
**Focus**: Dispensing and stock requests

**Can Do**:
- ✅ View inventory
- ✅ Dispense medicines
- ✅ Request stock
- ✅ View notifications

**Cannot Do**:
- ❌ Edit stock quantities
- ❌ Create purchase orders
- ❌ Manage users
- ❌ View reports
- ❌ Approve requisitions

---

## Permission Matrix

| Feature | Super Admin | System Admin | Inventory Manager | Procurement Officer | Pharmacist |
|---------|-------------|--------------|-------------------|---------------------|------------|
| **User Management** |
| View Users | ✅ All | ✅ Except SA | ❌ | ❌ | ❌ |
| Create Users | ✅ All | ✅ Except SA | ❌ | ❌ | ❌ |
| Edit Users | ✅ All | ✅ Except SA | ❌ | ❌ | ❌ |
| Delete Users | ✅ All | ✅ Except SA | ❌ | ❌ | ❌ |
| Assign Roles | ✅ All | ✅ Except SA | ❌ | ❌ | ❌ |
| **Inventory** |
| View Inventory | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Items | ❌ | ✅ | ✅ | ❌ | ❌ |
| Edit Items | ❌ | ✅ | ✅ | ❌ | ❌ |
| Delete Items | ❌ | ✅ | ✅ | ❌ | ❌ |
| Set Reorder Levels | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Purchase Orders** |
| View POs | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create POs | ❌ | ✅ | ❌ | ✅ | ❌ |
| Edit POs | ❌ | ✅ | ❌ | ❌ | ❌ |
| Delete POs | ❌ | ✅ | ❌ | ❌ | ❌ |
| Approve POs | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Requisitions** |
| View Requisitions | ✅ | ✅ | ✅ | ✅ | ✅ Own |
| Create Requisitions | ❌ | ✅ | ✅ | ❌ | ✅ |
| Edit Requisitions | ❌ | ✅ | ✅ | ❌ | ❌ |
| Delete Requisitions | ❌ | ✅ | ✅ | ❌ | ❌ |
| Approve Requisitions | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Stock In** |
| View Stock In | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create Stock In | ❌ | ✅ | ✅ | ✅ | ❌ |
| Edit Stock In | ❌ | ✅ | ✅ | ❌ | ❌ |
| Delete Stock In | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Stock Out** |
| View Stock Out | ✅ | ✅ | ✅ | ❌ | ✅ Own |
| Create Stock Out | ❌ | ✅ | ✅ | ❌ | ✅ |
| Edit Stock Out | ❌ | ✅ | ✅ | ❌ | ❌ |
| Delete Stock Out | ❌ | ✅ | ❌ | ❌ | ❌ |
| Approve Stock Out | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Suppliers** |
| View Suppliers | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create Suppliers | ❌ | ✅ | ❌ | ✅ | ❌ |
| Edit Suppliers | ❌ | ✅ | ❌ | ❌ | ❌ |
| Delete Suppliers | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Categories** |
| View Categories | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Categories | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Departments** |
| View Departments | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Departments | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Reports** |
| View All Reports | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Stock Reports | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Procurement Reports | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Audit & Settings** |
| View Audit Logs | ✅ | ✅ | ❌ | ❌ | ❌ |
| Configure Global Settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Configure Inventory Settings | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Notifications** |
| View Notifications | ✅ | ✅ | ✅ | ❌ | ✅ |
| Manage Notifications | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## Implementation Files

### Configuration
- `config/permissions.php` - Central permissions configuration

### Helpers
- `app/Helpers/PermissionHelper.php` - Permission checking methods

### Middleware
- `app/Http/Middleware/CheckPermission.php` - Route protection

### Controllers
- `app/Http/Controllers/Admin/UserManagementController.php` - User management with permissions
- All other controllers need permission checks added

### Documentation
- `PERMISSIONS_SYSTEM.md` - Complete permissions documentation
- `SUPER_ADMIN_PERMISSIONS_IMPLEMENTATION.md` - Super Admin guide
- `SYSTEM_ADMIN_PERMISSIONS.md` - System Admin guide
- `INVENTORY_MANAGER_PERMISSIONS.md` - Inventory Manager guide
- `PROCUREMENT_OFFICER_PERMISSIONS.md` - Procurement Officer guide
- `PHARMACIST_PERMISSIONS.md` - Pharmacist guide

---

## Usage Examples

### In Controllers

```php
use App\Helpers\PermissionHelper;

// Check permission
if (!PermissionHelper::can(auth()->user(), 'inventory.create')) {
    abort(403, 'You do not have permission to create inventory items.');
}

// Check restriction
if (PermissionHelper::isRestricted(auth()->user(), 'purchase_orders.delete')) {
    abort(403, 'You cannot delete purchase orders.');
}

// Check transaction ownership
if (!PermissionHelper::canEditTransaction(auth()->user(), $transaction)) {
    abort(403, 'You can only edit your own transactions.');
}

// Filter users by role
$users = PermissionHelper::getFilteredUsers(auth()->user());
```

### In Blade/Inertia

```php
return inertia('admin/inventory', [
    'items' => $items,
    'canCreate' => PermissionHelper::can(auth()->user(), 'inventory.create'),
    'canEdit' => PermissionHelper::can(auth()->user(), 'inventory.update'),
    'canDelete' => PermissionHelper::can(auth()->user(), 'inventory.delete'),
]);
```

### In React Components

```tsx
{canCreate && (
    <Button onClick={handleCreate}>
        <Plus className="h-4 w-4 mr-2" />
        Add Item
    </Button>
)}

{canEdit && (
    <Button onClick={handleEdit}>
        <Pencil className="h-4 w-4" />
    </Button>
)}
```

---

## Next Steps

### To Complete Implementation:

1. **Add Permission Checks to Controllers**
   - [ ] InventoryController
   - [ ] PurchaseOrderController
   - [ ] RequisitionController
   - [ ] StockInController
   - [ ] StockOutController
   - [ ] SupplierController
   - [ ] CategoryController
   - [ ] DepartmentController
   - [ ] ReportsController

2. **Update Frontend Components**
   - [ ] Pass permission flags from controllers
   - [ ] Hide/show buttons based on permissions
   - [ ] Display appropriate messages for restricted actions

3. **Testing**
   - [ ] Test each role's permissions
   - [ ] Verify restrictions are enforced
   - [ ] Test edge cases
   - [ ] Test role transitions

4. **Database Seeding**
   - [ ] Create test users for each role
   - [ ] Create sample data for testing

---

## Security Considerations

1. **Separation of Duties**: Each role has distinct responsibilities
2. **Least Privilege**: Users have only the permissions they need
3. **Audit Trail**: All actions are logged
4. **Transaction Ownership**: Users can only modify their own transactions
5. **Role Protection**: Super Admin role is protected
6. **Data Integrity**: Restrictions prevent unauthorized modifications

---

## Benefits

1. **Clear Responsibilities**: Each role knows what they can and cannot do
2. **Data Protection**: Sensitive data is protected from unauthorized access
3. **Compliance**: Audit trails and restrictions support compliance requirements
4. **Scalability**: Easy to add new roles or modify permissions
5. **Maintainability**: Centralized configuration makes updates easy

---

## Conclusion

The role-based permissions system provides a comprehensive framework for managing access control in the Hospital Inventory Management System. Each role has been carefully designed with appropriate permissions and restrictions to ensure data integrity, security, and operational efficiency.
