# Hospital Inventory Management System
# User Operational Hierarchy, Permissions & Actions

## 📊 Complete User Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN                              │
│              (Highest Authority Level)                      │
│  • Complete System Oversight & Monitoring                   │
│  • User Management (Create System Admins ONLY)             │
│  • READ-ONLY Access to All Operations                      │
│  • Cannot Modify Transactions (Audit Compliance)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   SYSTEM ADMIN (admin)                      │
│              (Administrative Level)                         │
│  • User Management (Cannot manage Super Admins)            │
│  • System Monitoring & Reporting                           │
│  • READ-ONLY Access to Operations                          │
│  • Cannot Perform Operational Actions                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────────────┐    ┌──────────────────────────┐
│   INVENTORY MANAGER      │    │  PROCUREMENT OFFICER     │
│   (Operational Level)    │    │  (Procurement Level)     │
│  • Full Inventory CRUD   │    │  • Purchase Orders       │
│  • Stock Management      │    │  • Supplier Management   │
│  • Approve Requisitions  │    │  • Stock Receiving       │
│  • Category Management   │    │  • Procurement Reports   │
└──────────────────────────┘    └──────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      PHARMACIST                             │
│              (Dispensing Level - Most Restricted)           │
│  • View Inventory (Read-Only)                              │
│  • Dispense Stock (Stock Out)                              │
│  • Create Requisitions (Request Stock)                     │
│  • View Notifications                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Detailed Role Permissions & Restrictions

### 1. SUPER ADMIN (super_admin)

**Philosophy**: *"Oversight without interference"* - Complete visibility with intentional operational restrictions to maintain audit integrity.

#### ✅ **ALLOWED PERMISSIONS**

**User Management** (Restricted Scope)
- ✓ View all users
- ✓ Create users (ONLY System Admin role)
- ✓ Update user information
- ✓ Deactivate/Delete users
- ✓ Assign roles (ONLY 'admin' role)

**System Access & Monitoring**
- ✓ View audit logs (complete system history)
- ✓ View all reports (system-wide analytics)
- ✓ Configure system settings
- ✓ View all notifications

**Operational Visibility (READ-ONLY)**
- ✓ View inventory items
- ✓ View purchase orders
- ✓ View requisitions
- ✓ View stock movements
- ✓ View stock in/out records
- ✓ View suppliers
- ✓ View categories
- ✓ View departments

**Department Management**
- ✓ Create departments
- ✓ Update departments
- ✓ Delete departments

**Communication**
- ✓ View all messages
- ✓ Send messages to anyone
- ✓ Broadcast messages

#### ❌ **RESTRICTIONS** (Cannot Perform)

**Transaction Modifications** (Audit Compliance)
- ✗ Edit transactions created by other users
- ✗ Delete transactions created by other users
- ✗ Alter historical activity logs
- ✗ Delete audit logs

**Operational Actions** (Separation of Duties)
- ✗ Create/Edit/Delete inventory items
- ✗ Create/Edit/Delete purchase orders
- ✗ Create/Edit/Delete requisitions
- ✗ Create/Edit/Delete stock in records
- ✗ Create/Edit/Delete stock out records
- ✗ Create/Edit/Delete suppliers
- ✗ Create/Edit/Delete categories

**Rationale**: Super Admin is designed for oversight, not day-to-day operations. This prevents conflicts of interest and maintains audit trail integrity.

---

### 2. SYSTEM ADMIN (admin)

**Philosophy**: *"Monitor and manage, but don't operate"* - Administrative control without operational interference.

#### ✅ **ALLOWED PERMISSIONS**

**User Management** (Excluding Super Admins)
- ✓ View users (except Super Admins)
- ✓ Create users (manager, pharmacist, procurement_officer)
- ✓ Update user information (except Super Admins)
- ✓ Delete users (except Super Admins)
- ✓ Assign operational roles (manager, pharmacist, procurement_officer)

**System Monitoring**
- ✓ View audit logs
- ✓ View all reports
- ✓ View system settings
- ✓ View and manage notifications

**Operational Visibility (READ-ONLY)**
- ✓ View inventory items
- ✓ View purchase orders
- ✓ View requisitions
- ✓ View stock movements
- ✓ View stock in/out records
- ✓ View suppliers
- ✓ View categories
- ✓ View departments

**Department Management**
- ✓ Create departments
- ✓ Update departments
- ✓ Delete departments

**Communication**
- ✓ View all messages
- ✓ Send messages to anyone
- ✓ Broadcast messages

#### ❌ **RESTRICTIONS**

**Super Admin Management**
- ✗ View Super Admin account details
- ✗ Edit Super Admin accounts
- ✗ Delete Super Admin accounts
- ✗ Create Super Admin accounts
- ✗ Assign super_admin role

**Operational Actions** (Same as Super Admin)
- ✗ Create/Edit/Delete inventory items
- ✗ Create/Edit/Delete purchase orders
- ✗ Approve purchase orders
- ✗ Create/Edit/Delete requisitions
- ✗ Approve requisitions
- ✗ Create/Edit/Delete stock in/out records
- ✗ Create/Edit/Delete suppliers
- ✗ Create/Edit/Delete categories
- ✗ Configure inventory settings

**Audit & System**
- ✗ Alter historical activity logs
- ✗ Delete audit logs
- ✗ Configure global system settings

**Rationale**: System Admin manages users and monitors operations but cannot interfere with operational workflows or Super Admin accounts.

---

### 3. INVENTORY MANAGER (manager)

**Philosophy**: *"Full control of inventory operations"* - Complete inventory lifecycle management.

#### ✅ **ALLOWED PERMISSIONS**

**Inventory Management** (FULL CRUD)
- ✓ View inventory items
- ✓ Create inventory items
- ✓ Update inventory items
- ✓ Delete inventory items
- ✓ Configure inventory settings

**Stock Management**
- ✓ View stock in records
- ✓ View stock out records
- ✓ Create stock out records
- ✓ Update stock out records (own records only)
- ✓ Delete stock out records (own records only)
- ✓ Approve stock out requests

**Requisition Management**
- ✓ View requisitions
- ✓ Approve requisitions (from Pharmacists)

**Category & Supplier Management**
- ✓ View categories
- ✓ Create categories
- ✓ Update categories
- ✓ Delete categories
- ✓ View suppliers (read-only)
- ✓ View departments

**Purchase Orders**
- ✓ View purchase orders (read-only)

**Reporting**
- ✓ View stock reports
- ✓ View department reports

**Alerts & Notifications**
- ✓ View alerts (low stock, etc.)
- ✓ View notifications

**Communication**
- ✓ View messages
- ✓ Send messages (to Pharmacist, Procurement Officer)

#### ❌ **RESTRICTIONS**

**User Management**
- ✗ Manage users
- ✗ View user accounts

**Stock In** (Auto-Generated)
- ✗ Create stock in records (automatically generated)
- ✗ Update stock in records
- ✗ Delete stock in records

**Procurement**
- ✗ Create purchase orders
- ✗ Edit purchase orders
- ✗ Delete purchase orders
- ✗ Approve purchase orders
- ✗ Create suppliers
- ✗ Edit suppliers
- ✗ Delete suppliers

**System**
- ✗ View audit logs
- ✗ Delete audit logs
- ✗ Configure system settings

**Rationale**: Manager focuses on inventory operations. Procurement is handled by Procurement Officer. Stock In is auto-generated to maintain data integrity.

---

### 4. PHARMACIST (pharmacist)

**Philosophy**: *"Dispense and request"* - Minimal permissions for frontline dispensing operations.

#### ✅ **ALLOWED PERMISSIONS**

**Inventory** (VIEW ONLY)
- ✓ View inventory items
- ✓ Check stock levels
- ✓ Search inventory

**Stock Out** (Dispensing)
- ✓ View stock out records
- ✓ Create stock out records (dispense to patients)

**Requisitions** (Request Stock)
- ✓ View requisitions (own requisitions)
- ✓ Create requisitions (request stock from Manager)

**Notifications**
- ✓ View notifications
- ✓ View alerts

**Communication**
- ✓ View messages
- ✓ Send messages (to Manager)

#### ❌ **RESTRICTIONS** (Most Restricted Role)

**User Management**
- ✗ Manage users
- ✗ View users

**Inventory Management**
- ✗ Create inventory items
- ✗ Edit stock quantities manually
- ✗ Delete inventory items
- ✗ Configure inventory settings

**Stock In**
- ✗ Create stock in records
- ✗ Edit stock in records
- ✗ Delete stock in records

**Purchase Orders**
- ✗ View purchase orders
- ✗ Create purchase orders
- ✗ Edit purchase orders
- ✗ Delete purchase orders

**Requisitions**
- ✗ Edit requisitions after submission
- ✗ Delete requisitions
- ✗ Approve requisitions

**Master Data**
- ✗ View suppliers
- ✗ Manage suppliers
- ✗ Manage categories
- ✗ Manage departments

**Reports & Audit**
- ✗ View reports
- ✗ View audit logs

**System**
- ✗ Configure system settings

**Rationale**: Pharmacist has minimal permissions focused on dispensing operations. All other actions require Manager approval through requisitions.

---

### 5. PROCUREMENT OFFICER (procurement_officer)

**Philosophy**: *"Procure and receive"* - Specialized role for purchasing and supplier management.

#### ✅ **ALLOWED PERMISSIONS**

**Purchase Orders** (FULL CRUD except Approval)
- ✓ View purchase orders
- ✓ Create purchase orders
- ✓ Update purchase orders
- ✓ Submit purchase orders (for approval)

**Supplier Management** (FULL CRUD)
- ✓ View suppliers
- ✓ Create suppliers
- ✓ Update suppliers
- ✓ Delete suppliers

**Stock In** (Receiving)
- ✓ View stock in records
- ✓ Create stock in records (receive shipments)

**Inventory** (VIEW ONLY)
- ✓ View inventory items
- ✓ Check stock levels

**Requisitions** (VIEW ONLY)
- ✓ View requisitions (for procurement planning)

**Reporting**
- ✓ View procurement reports

**Audit**
- ✓ View audit logs

**Communication**
- ✓ View messages
- ✓ Send messages (to Manager, Admin, Super Admin)

#### ❌ **RESTRICTIONS**

**User Management**
- ✗ Manage users
- ✗ View users

**Stock Management**
- ✗ Create stock out records
- ✗ Modify inventory manually
- ✗ Delete inventory items

**Approvals**
- ✗ Approve purchase orders (requires Admin/Manager)
- ✗ Approve requisitions

**Master Data**
- ✗ Manage categories
- ✗ Manage departments

**System**
- ✗ Configure system settings

**Rationale**: Procurement Officer handles purchasing and receiving but cannot approve their own purchase orders (separation of duties).

---

## 🔄 Operational Workflows by Role

### Workflow 1: Stock Dispensing (Pharmacist → Manager)

```
1. Pharmacist views inventory (READ-ONLY)
2. Pharmacist creates Stock Out record (dispense to patient)
3. System automatically updates inventory quantity
4. Manager receives notification
5. Manager can view/approve the dispensing record
```

### Workflow 2: Stock Requisition (Pharmacist → Manager)

```
1. Pharmacist creates Requisition (request stock)
2. Manager receives notification
3. Manager reviews requisition
4. Manager approves/rejects requisition
5. If approved, Manager creates Stock Out or adjusts inventory
```

### Workflow 3: Purchase Order (Procurement → Admin/Manager)

```
1. Procurement Officer creates Purchase Order
2. Procurement Officer submits for approval
3. Admin/Manager receives notification
4. Admin/Manager approves Purchase Order
5. Procurement Officer receives shipment
6. Procurement Officer creates Stock In record
7. System automatically updates inventory
```

### Workflow 4: Inventory Management (Manager)

```
1. Manager creates/updates inventory items
2. Manager sets reorder points
3. System monitors stock levels
4. System sends low stock alerts
5. Manager reviews and takes action
```

### Workflow 5: User Management (Super Admin → Admin)

```
1. Super Admin creates System Admin account
2. System Admin creates operational users (Manager, Pharmacist, Procurement)
3. System Admin assigns roles
4. System Admin monitors user activity
5. Super Admin oversees all user management
```

---

## 📋 Permission Matrix Summary

| Action | Super Admin | Admin | Manager | Pharmacist | Procurement |
|--------|-------------|-------|---------|------------|-------------|
| **User Management** |
| View Users | ✓ All | ✓ (No Super Admin) | ✗ | ✗ | ✗ |
| Create Users | ✓ (Admin only) | ✓ (Operational) | ✗ | ✗ | ✗ |
| Edit Users | ✓ | ✓ (No Super Admin) | ✗ | ✗ | ✗ |
| Delete Users | ✓ | ✓ (No Super Admin) | ✗ | ✗ | ✗ |
| **Inventory** |
| View Inventory | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create Items | ✗ | ✗ | ✓ | ✗ | ✗ |
| Edit Items | ✗ | ✗ | ✓ | ✗ | ✗ |
| Delete Items | ✗ | ✗ | ✓ | ✗ | ✗ |
| **Stock Out** |
| View Stock Out | ✓ | ✓ | ✓ | ✓ | ✗ |
| Create Stock Out | ✗ | ✗ | ✓ | ✓ | ✗ |
| Edit Stock Out | ✗ | ✗ | ✓ (Own) | ✗ | ✗ |
| Delete Stock Out | ✗ | ✗ | ✓ (Own) | ✗ | ✗ |
| **Stock In** |
| View Stock In | ✓ | ✓ | ✓ | ✗ | ✓ |
| Create Stock In | ✗ | ✗ | ✗ (Auto) | ✗ | ✓ |
| Edit Stock In | ✗ | ✗ | ✗ | ✗ | ✗ |
| Delete Stock In | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Purchase Orders** |
| View PO | ✓ | ✓ | ✓ | ✗ | ✓ |
| Create PO | ✗ | ✗ | ✗ | ✗ | ✓ |
| Edit PO | ✗ | ✗ | ✗ | ✗ | ✓ |
| Approve PO | ✗ | ✗ | ✓ | ✗ | ✗ |
| Delete PO | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Requisitions** |
| View Requisitions | ✓ | ✓ | ✓ | ✓ (Own) | ✓ |
| Create Requisitions | ✗ | ✗ | ✗ | ✓ | ✗ |
| Approve Requisitions | ✗ | ✗ | ✓ | ✗ | ✗ |
| **Suppliers** |
| View Suppliers | ✓ | ✓ | ✓ | ✗ | ✓ |
| Create Suppliers | ✗ | ✗ | ✗ | ✗ | ✓ |
| Edit Suppliers | ✗ | ✗ | ✗ | ✗ | ✓ |
| Delete Suppliers | ✗ | ✗ | ✗ | ✗ | ✓ |
| **Categories** |
| View Categories | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create Categories | ✗ | ✗ | ✓ | ✗ | ✗ |
| Edit Categories | ✗ | ✗ | ✓ | ✗ | ✗ |
| Delete Categories | ✗ | ✗ | ✓ | ✗ | ✗ |
| **Departments** |
| View Departments | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create Departments | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit Departments | ✓ | ✓ | ✗ | ✗ | ✗ |
| Delete Departments | ✓ | ✓ | ✗ | ✗ | ✗ |
| **Reports** |
| View All Reports | ✓ | ✓ | ✗ | ✗ | ✗ |
| View Stock Reports | ✗ | ✗ | ✓ | ✗ | ✗ |
| View Procurement Reports | ✗ | ✗ | ✗ | ✗ | ✓ |
| **Audit Logs** |
| View Audit Logs | ✓ | ✓ | ✗ | ✗ | ✓ |
| Edit Audit Logs | ✗ | ✗ | ✗ | ✗ | ✗ |
| Delete Audit Logs | ✗ | ✗ | ✗ | ✗ | ✗ |
| **System** |
| Configure Settings | ✓ | ✗ | ✗ | ✗ | ✗ |
| View Settings | ✓ | ✓ | ✗ | ✗ | ✗ |

---

## 🎯 Navigation Menu by Role

### Super Admin Navigation
1. Dashboard
2. Predictive Analytics
3. Inventory (View Only)
4. Purchase Orders (View Only)
5. Requisitions (View Only)
6. Stock In (View Only)
7. Stock Out (View Only)
8. Suppliers (View Only)
9. Categories (View Only)
10. Departments (Full CRUD)
11. **Users (Full Management)**
12. **Reports (All Reports)**
13. **Audit Logs (Full Access)**
14. Messages

### System Admin Navigation
1. Dashboard
2. Predictive Analytics
3. Inventory (View Only)
4. Purchase Orders (View Only)
5. Requisitions (View Only)
6. Stock In (View Only)
7. Stock Out (View Only)
8. Suppliers (View Only)
9. Categories (View Only)
10. Departments (Full CRUD)
11. **Users (Manage Operational Users)**
12. **Reports (All Reports)**
13. **Audit Logs (Full Access)**
14. Messages

### Inventory Manager Navigation
1. Dashboard
2. **Inventory (Full CRUD)**
3. Stock Requests
4. **Stock In (View)**
5. **Stock Out (Full CRUD)**
6. **Requisitions (Approve)**
7. **Categories (Full CRUD)**
8. Reports (Stock Reports)
9. Notifications
10. Messages

### Pharmacist Navigation
1. Dashboard
2. **Inventory (View Only)**
3. **Dispense (Stock Out)**
4. **Request Stock (Requisitions)**
5. Notifications
6. Messages

### Procurement Officer Navigation
1. Dashboard
2. Stock Requests
3. **Purchase Orders (Full CRUD)**
4. **Suppliers (Full CRUD)**
5. **Stock In (Receive Shipments)**
6. Inventory (View Only)
7. Reports (Procurement Reports)
8. Notifications
9. Messages

---

## 🔒 Security & Compliance Features

### 1. Audit Trail Integrity
- **Super Admin & Admin cannot modify transactions**
- All actions are logged with user ID, timestamp, and changes
- Audit logs are immutable (cannot be edited or deleted)
- Complete history of all inventory movements

### 2. Separation of Duties
- **Super Admin**: Oversight only, no operational actions
- **Admin**: Monitoring only, no operational actions
- **Manager**: Inventory operations, cannot approve own purchase orders
- **Procurement**: Creates purchase orders, cannot approve them
- **Pharmacist**: Dispenses only, requires Manager approval for stock requests

### 3. Role-Based Access Control (RBAC)
- Permissions checked at middleware level
- Frontend navigation filtered by role
- Backend API endpoints protected by role middleware
- Database queries filtered by user permissions

### 4. Transaction Ownership
- Users can only edit/delete their own transactions
- Super Admin cannot edit any transactions (oversight role)
- Manager can approve transactions created by others

### 5. User Management Hierarchy
- **Super Admin** can only create **System Admin**
- **System Admin** can only create **operational users** (Manager, Pharmacist, Procurement)
- **System Admin** cannot view/edit **Super Admin** accounts
- Prevents privilege escalation

---

## 📊 Permission Implementation Details

### Backend Implementation

**Middleware**: `RoleMiddleware.php`
```php
// Checks if user has required role
if (!in_array(Auth::user()->role, $roles)) {
    abort(403, 'Unauthorized');
}
```

**Permission Helper**: `PermissionHelper.php`
```php
// Checks specific permissions
public static function can(User $user, string $permission): bool
{
    $rolePermissions = config("permissions.{$user->role}.permissions", []);
    return in_array($permission, $rolePermissions);
}
```

**Configuration**: `config/permissions.php`
- Defines all permissions and restrictions per role
- Centralized permission management
- Easy to audit and modify

### Frontend Implementation

**Navigation Config**: `frontend/src/config/navigation.tsx`
- Role-based menu items
- Filtered navigation based on user role
- Consistent UI across all pages

**Permission Checks**: Throughout React components
```typescript
{user.role === 'manager' && (
    <Button>Create Inventory Item</Button>
)}
```

---

## 🎓 Best Practices & Guidelines

### For Super Admin
1. **Focus on oversight**, not operations
2. **Create System Admins** for day-to-day administration
3. **Monitor audit logs** regularly
4. **Review reports** for system health
5. **Do not interfere** with operational workflows

### For System Admin
1. **Manage operational users** effectively
2. **Monitor system activity** through audit logs
3. **Generate reports** for management
4. **Coordinate** between operational teams
5. **Do not perform** operational actions

### For Inventory Manager
1. **Maintain accurate** inventory records
2. **Approve requisitions** promptly
3. **Monitor stock levels** and reorder points
4. **Coordinate** with Procurement Officer
5. **Review reports** regularly

### For Pharmacist
1. **Dispense accurately** and document properly
2. **Request stock** through requisitions
3. **Check inventory** before dispensing
4. **Report issues** to Manager
5. **Follow protocols** strictly

### For Procurement Officer
1. **Create purchase orders** based on needs
2. **Manage suppliers** effectively
3. **Receive shipments** and create Stock In records
4. **Coordinate** with Manager for approvals
5. **Monitor procurement** metrics

---

## 📈 System Statistics

- **Total Roles**: 5
- **Permission Types**: 50+
- **Restriction Types**: 40+
- **Navigation Items**: 14 (Super Admin) to 6 (Pharmacist)
- **Workflow Types**: 5 major workflows
- **Security Layers**: 4 (Middleware, Helper, Config, Frontend)

---

## ✅ Compliance & Audit

### Audit Requirements Met
✓ Complete transaction history
✓ Immutable audit logs
✓ User action tracking
✓ Separation of duties
✓ Role-based access control
✓ Transaction ownership
✓ Approval workflows
✓ Read-only oversight roles

### Regulatory Compliance
✓ Healthcare data integrity
✓ Inventory accountability
✓ User access controls
✓ Audit trail requirements
✓ Separation of duties
✓ Transaction immutability

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-04-28  
**System**: Hospital Inventory Management System (SHIMS)
