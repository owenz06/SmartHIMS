# Role-Based Permissions System

## Overview
This document outlines the permissions and restrictions for each role in the Hospital Inventory Management System (HIMS).

---

## 1. Super Admin

### ✅ Permissions
- **User Management**
  - Create, update, deactivate, and delete all users (including System Admin)
  - Assign and remove roles to/from any user
  - View all user accounts and their activities

- **System Monitoring**
  - View all system activities (Audit Logs)
  - View reports from all departments
  - Monitor system health and performance

- **System Configuration**
  - Configure global system settings
  - Manage system-wide configurations
  - Set up system parameters

- **Read-Only Access**
  - View inventory items
  - View purchase orders
  - View requisitions
  - View stock movements
  - View suppliers, categories, and departments

### ❌ Restrictions
- **Cannot edit/delete transactions created by other users**
  - Purchase orders
  - Requisitions
  - Stock in/out records
  
- **Cannot alter historical activity logs**
  - Audit logs are immutable
  - Cannot delete or modify past records

- **Cannot interfere in operational workflows**
  - Cannot create purchase orders
  - Cannot create requisitions
  - Cannot create stock movements
  - Cannot create/edit/delete inventory items
  - Cannot approve/reject operational requests

### Navigation Access
- Dashboard
- Users Management
- Audit Logs
- Reports (All Departments)
- System Settings
- Inventory (View Only)
- Purchase Orders (View Only)
- Requisitions (View Only)
- Stock Movements (View Only)
- Suppliers (View Only)
- Categories (View Only)
- Departments (View Only)

---

## 2. System Admin

### ✅ Permissions
- **User Management (Except Super Admin)**
  - Create, update, delete users (except Super Admin)
  - Assign roles (except super_admin role)
  - View all users except Super Admin accounts
  - Cannot view Super Admin account details
  
- **Full Operational Access**
  - Create, update, delete inventory items
  - Configure inventory settings (reorder points, stock levels, etc.)
  - Create, update, delete, approve purchase orders
  - Create, update, delete, approve requisitions
  - Create, update stock in/out records
  - Manage suppliers, categories, departments (Full CRUD)
  
- **Reporting & Monitoring**
  - View all reports (all departments)
  - View audit logs
  - View and manage notifications
  - Monitor system activities

### ❌ Restrictions
- **Super Admin Related**
  - Cannot create Super Admin accounts
  - Cannot delete Super Admin accounts
  - Cannot view Super Admin account details
  - Cannot edit Super Admin accounts
  - Cannot assign super_admin role to any user

- **System Configuration**
  - Cannot configure global system settings (reserved for Super Admin)

### Navigation Access
- Dashboard
- Users Management (Cannot see Super Admin users)
- Inventory (Full CRUD + Configure Settings)
- Purchase Orders (Full CRUD + Approve)
- Requisitions (Full CRUD + Approve)
- Stock In (Full CRUD)
- Stock Out (Full CRUD)
- Suppliers (Full CRUD)
- Categories (Full CRUD)
- Departments (Full CRUD)
- Reports (All)
- Audit Logs
- Notifications (View + Manage)

### Key Differences from Super Admin
1. **Cannot see or interact with Super Admin accounts**
2. **Cannot configure global system settings**
3. **Has full operational access** (unlike Super Admin who is read-only)
4. **Can create and manage transactions**
5. **Can approve operational requests**

---

## 3. Inventory Manager

### ✅ Permissions
- **Inventory Management (Full Control)**
  - View all inventory items
  - Add new inventory items
  - Update stock quantities
  - Set reorder levels
  - Configure stock alerts
  - Delete inventory items
  - Manage item details (description, unit of measurement, etc.)
  
- **Stock Management**
  - View stock in records
  - Create stock in records
  - Update stock in records
  - View stock out records
  - Create stock out records (approve stock issuance)
  - Update stock out records
  - Approve stock issuance requests
  
- **Requisitions**
  - View requisitions
  - Approve requisitions (stock issuance approval)
  - Track requisition status
  
- **Purchase Orders (View Only)**
  - View purchase orders
  - Monitor incoming stock
  - Track order status
  
- **Master Data (View Only)**
  - View categories
  - View suppliers
  - View departments
  
- **Reporting**
  - Generate stock reports
  - View department reports
  - View stock movement reports
  - View stock alerts
  
- **Notifications**
  - View stock alerts
  - View low stock notifications
  - View reorder notifications

### ❌ Restrictions
- **User Management**
  - Cannot manage users
  - Cannot view user accounts
  - Cannot assign roles

- **Procurement Records**
  - Cannot create purchase orders
  - Cannot edit purchase orders
  - Cannot delete purchase orders
  - Cannot approve purchase orders
  - Cannot create suppliers
  - Cannot edit suppliers
  - Cannot delete suppliers

- **Audit Logs**
  - Cannot view audit logs
  - Cannot delete audit logs
  - Cannot modify historical records

- **System Settings**
  - Cannot configure system settings
  - Cannot configure global parameters

- **Master Data Management**
  - Cannot create categories
  - Cannot update categories
  - Cannot delete categories
  - Cannot create departments
  - Cannot update departments
  - Cannot delete departments

### Navigation Access
- Dashboard
- Inventory (Full CRUD + Configure)
- Stock In (Full CRUD)
- Stock Out (Full CRUD + Approve)
- Requisitions (View + Approve)
- Purchase Orders (View Only)
- Categories (View Only)
- Reports (Stock Reports)
- Notifications (Stock Alerts)

### Key Responsibilities
1. **Inventory Control**: Maintain accurate stock levels and item information
2. **Stock Issuance**: Approve and process stock out requests
3. **Reorder Management**: Set and monitor reorder levels
4. **Stock Receiving**: Process incoming stock
5. **Reporting**: Generate stock reports and monitor alerts

---

## 4. Pharmacist/Technician

### ✅ Permissions
- **Inventory (View Only)**
  - View available inventory
  - View medicine stock levels
  - Check item availability
  - View item details
  
- **Dispensing (Stock Out)**
  - View stock out records
  - Dispense medicines
  - Create stock out records
  - Record usage
  - Document dispensing activities
  
- **Stock Requests (Requisitions)**
  - View requisitions
  - Create requisitions (request stock)
  - Submit stock requests
  - Track request status
  
- **Notifications**
  - View low stock notifications
  - View stock alerts
  - View system notifications

### ❌ Restrictions
- **User Management**
  - Cannot manage users
  - Cannot view user accounts
  - Cannot assign roles

- **Inventory Management**
  - Cannot create inventory items
  - Cannot edit stock quantities manually
  - Cannot delete inventory items
  - Cannot configure inventory settings
  - Cannot set reorder levels

- **Stock In**
  - Cannot create stock in records
  - Cannot edit stock in records
  - Cannot delete stock in records
  - Cannot receive stock

- **Purchase Orders**
  - Cannot view purchase orders
  - Cannot create purchase orders
  - Cannot edit purchase orders
  - Cannot delete purchase orders

- **Requisitions**
  - Cannot edit requisitions after submission
  - Cannot delete requisitions
  - Cannot approve requisitions

- **Master Data**
  - Cannot view suppliers
  - Cannot manage suppliers
  - Cannot manage categories
  - Cannot manage departments

- **Reports and Audit**
  - Cannot view reports
  - Cannot view audit logs
  - Cannot generate reports

- **Settings**
  - Cannot configure system settings

### Navigation Access
- Dashboard
- Inventory (View Only)
- Dispense (Create Stock Out)
- Request Stock (Create Requisitions)
- Notifications (Low Stock Alerts)

### Key Responsibilities
1. **Dispensing**: Dispense medicines and record usage
2. **Stock Requests**: Request stock when running low
3. **Inventory Monitoring**: Check available stock before dispensing
4. **Usage Recording**: Document all dispensing activities

### Typical Workflow
1. Check inventory for available medicines
2. Dispense medicines to patients/departments
3. Record dispensing in stock out
4. Monitor stock levels
5. Request stock when running low
6. View notifications for low stock alerts

---

## 5. Procurement Officer

### ✅ Permissions
- **Purchase Order Management**
  - View purchase orders
  - Create purchase orders
  - Submit purchase orders for approval
  - Track purchase order status
  
- **Supplier Management**
  - View suppliers
  - Add new suppliers
  - View supplier details and history
  
- **Stock Receiving**
  - View stock in records
  - Record received stock (create stock in records)
  - Verify deliveries against purchase orders
  
- **Inventory Monitoring**
  - View inventory items
  - View stock levels
  - Monitor reorder points
  
- **Requisitions**
  - View requisitions (for procurement planning)
  - Track requisition status
  
- **Reporting**
  - View procurement reports
  - View supplier performance reports
  - View purchase order reports

### ❌ Restrictions
- **User Management**
  - Cannot manage users
  - Cannot view users
  - Cannot assign roles

- **System Records**
  - Cannot delete purchase orders
  - Cannot delete suppliers
  - Cannot delete stock in records
  - Cannot delete requisitions
  - Cannot view audit logs

- **Stock Management**
  - Cannot modify stock manually (no stock out)
  - Cannot update inventory quantities directly
  - Cannot delete inventory items
  - Cannot edit inventory details

- **Approvals**
  - Cannot approve purchase orders
  - Cannot approve requisitions
  - Can only submit for approval

- **Master Data**
  - Cannot manage categories
  - Cannot manage departments
  - Cannot update existing suppliers
  - Cannot delete suppliers

- **Settings**
  - Cannot configure system settings
  - Cannot configure inventory settings

### Navigation Access
- Dashboard
- Purchase Orders (View/Create/Submit)
- Suppliers (View/Create)
- Stock In (View/Create - Record Received Stock)
- Inventory (View Only)
- Requisitions (View Only)
- Reports (Procurement Reports)

### Key Responsibilities
1. **Procurement Planning**: Create purchase orders based on requisitions and stock levels
2. **Supplier Relations**: Add new suppliers and maintain supplier information
3. **Receiving**: Record received stock and verify against purchase orders
4. **Reporting**: Monitor procurement metrics and supplier performance

---

## Implementation Details

### Permission Helper
The `PermissionHelper` class provides methods to check permissions:

```php
// Check if user has permission
PermissionHelper::can($user, 'users.create');

// Check if user is restricted
PermissionHelper::isRestricted($user, 'transactions.edit');

// Check if user can edit a transaction
PermissionHelper::canEditTransaction($user, $transaction);

// Check if user can assign a role
PermissionHelper::canAssignRole($user, 'super_admin');

// Check if user can delete another user
PermissionHelper::canDeleteUser($user, $targetUser);
```

### Configuration
Permissions are defined in `config/permissions.php` and can be easily modified.

### Middleware
The `CheckPermission` middleware can be applied to routes:

```php
Route::middleware(['auth', 'permission:users.create'])->group(function () {
    // Protected routes
});
```

### Transaction Ownership
- Users can only edit/delete transactions they created
- Super Admin cannot edit/delete any transactions
- Audit logs track all changes with user attribution

---

## Security Notes

1. **Audit Trail**: All actions are logged in the audit_logs table
2. **Immutable Logs**: Audit logs cannot be edited or deleted by anyone
3. **Role Hierarchy**: Super Admin > Admin > Manager > Pharmacist/Procurement Officer
4. **Transaction Integrity**: Transactions maintain creator ownership
5. **Settings Protection**: Only Super Admin can modify global settings
