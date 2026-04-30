# Procurement Officer Permissions Implementation

## Overview
Procurement Officer role is focused on purchasing activities: creating purchase orders, managing suppliers, and recording received stock. This role has operational access to procurement functions but cannot manage users or delete system records.

---

## Procurement Officer Permissions

### ✅ What Procurement Officer CAN Do

#### 1. Purchase Order Management
- ✅ **View all purchase orders**
  - See purchase order history
  - Track order status
  - View order details
  
- ✅ **Create purchase orders**
  - Create new purchase orders
  - Add items to purchase orders
  - Select suppliers
  - Set quantities and specifications
  
- ✅ **Submit purchase orders**
  - Submit orders for approval
  - Track submission status
  - View approval workflow

#### 2. Supplier Management
- ✅ **View suppliers**
  - View supplier list
  - View supplier details
  - View supplier contact information
  - View supplier history
  
- ✅ **Add new suppliers**
  - Create new supplier records
  - Enter supplier information
  - Set up supplier contacts

#### 3. Stock Receiving
- ✅ **View stock in records**
  - View receiving history
  - Track deliveries
  - View received quantities
  
- ✅ **Record received stock**
  - Create stock in records
  - Verify deliveries against purchase orders
  - Update received quantities
  - Record delivery dates

#### 4. Inventory Monitoring (Read-Only)
- ✅ **View inventory items**
  - View stock levels
  - View reorder points
  - Monitor inventory status
  - View item details

#### 5. Requisitions (Read-Only)
- ✅ **View requisitions**
  - View requisition requests
  - Track requisition status
  - Use for procurement planning

#### 6. Reporting
- ✅ **View procurement reports**
  - Purchase order reports
  - Supplier performance reports
  - Receiving reports
  - Procurement metrics

### ❌ What Procurement Officer CANNOT Do

#### 1. User Management
- ❌ Cannot manage users
- ❌ Cannot view user accounts
- ❌ Cannot assign roles
- ❌ Cannot create/edit/delete users

#### 2. System Records Deletion
- ❌ Cannot delete purchase orders
- ❌ Cannot delete suppliers
- ❌ Cannot delete stock in records
- ❌ Cannot delete requisitions
- ❌ Cannot delete any system records

#### 3. Stock Management
- ❌ Cannot create stock out records
- ❌ Cannot modify stock manually
- ❌ Cannot update inventory quantities directly
- ❌ Cannot delete inventory items
- ❌ Cannot edit inventory details

#### 4. Approvals
- ❌ Cannot approve purchase orders
- ❌ Cannot reject purchase orders
- ❌ Cannot approve requisitions
- ❌ Can only submit for approval

#### 5. Master Data Management
- ❌ Cannot manage categories
- ❌ Cannot manage departments
- ❌ Cannot update existing suppliers
- ❌ Cannot delete suppliers

#### 6. System Access
- ❌ Cannot view audit logs
- ❌ Cannot configure system settings
- ❌ Cannot configure inventory settings

---

## Workflow Examples

### Creating a Purchase Order

1. **View Requisitions** (to understand needs)
   - Navigate to Requisitions
   - Review pending requisitions
   - Identify items needed

2. **Check Inventory** (to verify stock levels)
   - Navigate to Inventory
   - Check current stock levels
   - Identify items below reorder point

3. **Create Purchase Order**
   - Navigate to Purchase Orders
   - Click "Create Order"
   - Select supplier
   - Add items and quantities
   - Submit for approval

4. **Track Order Status**
   - Monitor approval status
   - Track delivery status
   - Prepare for receiving

### Recording Received Stock

1. **View Purchase Order**
   - Navigate to Purchase Orders
   - Find approved order
   - Verify order details

2. **Record Receipt**
   - Navigate to Stock In
   - Click "Record Receipt"
   - Select purchase order
   - Enter received quantities
   - Verify against order
   - Save record

3. **Verify Inventory Update**
   - Navigate to Inventory
   - Verify stock levels updated
   - Confirm receipt recorded

### Adding a New Supplier

1. **Navigate to Suppliers**
   - Click "Add Supplier"

2. **Enter Supplier Information**
   - Name
   - Contact person
   - Email
   - Phone
   - Address

3. **Save Supplier**
   - Submit supplier information
   - Supplier available for purchase orders

---

## Implementation Details

### Permission Checks

#### Purchase Orders
```php
// Can create
if (PermissionHelper::can($user, 'purchase_orders.create')) {
    // Allow creation
}

// Cannot delete
if (PermissionHelper::isRestricted($user, 'purchase_orders.delete')) {
    abort(403, 'Cannot delete purchase orders');
}

// Cannot approve
if (PermissionHelper::isRestricted($user, 'purchase_orders.approve')) {
    abort(403, 'Cannot approve purchase orders');
}
```

#### Suppliers
```php
// Can view and create
if (PermissionHelper::can($user, 'suppliers.view')) {
    // Show suppliers list
}

if (PermissionHelper::can($user, 'suppliers.create')) {
    // Show create button
}

// Cannot update or delete
if (PermissionHelper::isRestricted($user, 'suppliers.update')) {
    // Hide edit button
}

if (PermissionHelper::isRestricted($user, 'suppliers.delete')) {
    // Hide delete button
}
```

#### Stock In
```php
// Can create stock in records
if (PermissionHelper::can($user, 'stock_in.create')) {
    // Allow recording received stock
}

// Cannot delete
if (PermissionHelper::isRestricted($user, 'stock_in.delete')) {
    // Hide delete button
}
```

#### Inventory (Read-Only)
```php
// Can view
if (PermissionHelper::can($user, 'inventory.view')) {
    // Show inventory list
}

// Cannot update
if (PermissionHelper::isRestricted($user, 'inventory.update')) {
    // Hide edit button
}
```

---

## Controller Updates Needed

### PurchaseOrderController

```php
public function create()
{
    if (!PermissionHelper::can(auth()->user(), 'purchase_orders.create')) {
        abort(403, 'You do not have permission to create purchase orders.');
    }
    
    $suppliers = Supplier::all();
    $items = Item::all();
    
    return inertia('admin/purchase-orders-create', [
        'suppliers' => $suppliers,
        'items' => $items,
    ]);
}

public function destroy($id)
{
    if (PermissionHelper::isRestricted(auth()->user(), 'purchase_orders.delete')) {
        abort(403, 'You do not have permission to delete purchase orders.');
    }
    
    // Delete logic...
}
```

### SupplierController

```php
public function create()
{
    if (!PermissionHelper::can(auth()->user(), 'suppliers.create')) {
        abort(403, 'You do not have permission to add suppliers.');
    }
    
    return inertia('admin/suppliers-create');
}

public function update(Request $request, $id)
{
    if (PermissionHelper::isRestricted(auth()->user(), 'suppliers.update')) {
        abort(403, 'You do not have permission to update suppliers.');
    }
    
    // Update logic...
}

public function destroy($id)
{
    if (PermissionHelper::isRestricted(auth()->user(), 'suppliers.delete')) {
        abort(403, 'You do not have permission to delete suppliers.');
    }
    
    // Delete logic...
}
```

### StockInController

```php
public function create()
{
    if (!PermissionHelper::can(auth()->user(), 'stock_in.create')) {
        abort(403, 'You do not have permission to record stock in.');
    }
    
    $purchaseOrders = PurchaseOrder::where('status', 'Approved')->get();
    
    return inertia('admin/stock-in-create', [
        'purchaseOrders' => $purchaseOrders,
    ]);
}

public function destroy($id)
{
    if (PermissionHelper::isRestricted(auth()->user(), 'stock_in.delete')) {
        abort(403, 'You do not have permission to delete stock in records.');
    }
    
    // Delete logic...
}
```

### InventoryController

```php
public function index()
{
    if (!PermissionHelper::can(auth()->user(), 'inventory.view')) {
        abort(403, 'You do not have permission to view inventory.');
    }
    
    $items = Item::with('category', 'supplier')->paginate(15);
    
    return inertia('admin/inventory', [
        'items' => $items,
        'canEdit' => PermissionHelper::can(auth()->user(), 'inventory.update'),
        'canDelete' => PermissionHelper::can(auth()->user(), 'inventory.delete'),
    ]);
}
```

---

## Frontend Integration

### Conditional Buttons

#### Purchase Orders Page
```tsx
{canCreate && (
    <Button onClick={handleCreate}>
        <Plus className="h-4 w-4 mr-2" />
        Create Order
    </Button>
)}

{/* Hide delete button for procurement officer */}
{canDelete && (
    <Button onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
    </Button>
)}

{/* Show submit button instead of approve */}
{canSubmit && !canApprove && (
    <Button onClick={handleSubmit}>
        Submit for Approval
    </Button>
)}
```

#### Suppliers Page
```tsx
{canCreate && (
    <Button onClick={handleCreate}>
        <Plus className="h-4 w-4 mr-2" />
        Add Supplier
    </Button>
)}

{/* Hide edit and delete buttons */}
{canEdit && (
    <Button onClick={handleEdit}>
        <Pencil className="h-4 w-4" />
    </Button>
)}
```

#### Inventory Page
```tsx
{/* Show view-only message */}
<div className="text-sm text-muted-foreground">
    View-only access. Contact admin to modify inventory.
</div>

{/* Hide all action buttons */}
{canEdit && (
    <Button>Edit</Button>
)}
```

---

## Navigation Structure

```
Procurement Officer Dashboard
├── Purchase Orders (Create, View, Submit)
├── Suppliers (View, Create)
├── Stock In (View, Create - Record Received)
├── Inventory (View Only)
├── Requisitions (View Only)
└── Reports (Procurement Reports)
```

---

## Testing Scenarios

### Test Procurement Officer Permissions:

1. **Login as Procurement Officer**
2. **Purchase Orders**
   - ✅ Create new purchase order → Should succeed
   - ✅ View purchase orders → Should succeed
   - ❌ Delete purchase order → Should be blocked
   - ❌ Approve purchase order → Should be blocked

3. **Suppliers**
   - ✅ View suppliers → Should succeed
   - ✅ Add new supplier → Should succeed
   - ❌ Edit supplier → Should be blocked
   - ❌ Delete supplier → Should be blocked

4. **Stock In**
   - ✅ View stock in records → Should succeed
   - ✅ Record received stock → Should succeed
   - ❌ Delete stock in record → Should be blocked

5. **Inventory**
   - ✅ View inventory → Should succeed
   - ❌ Edit inventory → Should be blocked
   - ❌ Delete inventory → Should be blocked

6. **Requisitions**
   - ✅ View requisitions → Should succeed
   - ❌ Create requisition → Should be blocked
   - ❌ Approve requisition → Should be blocked

7. **System Access**
   - ❌ View users → Should be blocked
   - ❌ View audit logs → Should be blocked
   - ❌ Configure settings → Should be blocked

---

## Key Differences from Other Roles

| Feature | Procurement Officer | System Admin | Manager |
|---------|-------------------|--------------|---------|
| **Create Purchase Orders** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Approve Purchase Orders** | ❌ No | ✅ Yes | ❌ No |
| **Delete Purchase Orders** | ❌ No | ✅ Yes | ❌ No |
| **Add Suppliers** | ✅ Yes | ✅ Yes | ❌ No |
| **Edit Suppliers** | ❌ No | ✅ Yes | ❌ No |
| **Record Stock In** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Create Stock Out** | ❌ No | ✅ Yes | ✅ Yes |
| **Edit Inventory** | ❌ No | ✅ Yes | ✅ Yes |
| **View Audit Logs** | ❌ No | ✅ Yes | ❌ No |
| **Manage Users** | ❌ No | ✅ Yes | ❌ No |

---

## Security Benefits

1. **Focused Access**: Only procurement-related functions
2. **No Deletion**: Cannot delete system records, maintaining data integrity
3. **No Manual Stock Adjustment**: Prevents unauthorized inventory changes
4. **Approval Workflow**: Must submit orders for approval
5. **Audit Trail**: All actions are logged

---

## Summary

Procurement Officer is a specialized operational role focused on:
- Creating purchase orders
- Managing supplier relationships
- Recording received stock
- Monitoring inventory for procurement planning

The role has appropriate restrictions to maintain data integrity and enforce approval workflows while providing the necessary access to perform procurement duties effectively.
