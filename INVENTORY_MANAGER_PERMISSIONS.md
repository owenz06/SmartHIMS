# Inventory Manager Permissions Implementation

## Overview
Inventory Manager (manager role) has full control over inventory and stock management. This role is responsible for maintaining accurate stock levels, approving stock issuance, setting reorder levels, and generating stock reports.

---

## Inventory Manager Permissions

### ✅ What Inventory Manager CAN Do

#### 1. Inventory Management (Full Control)
- ✅ **View all inventory items**
  - View complete inventory list
  - View item details
  - View stock levels
  - View reorder points
  
- ✅ **Add new inventory items**
  - Create new inventory items
  - Set initial stock levels
  - Define item specifications
  - Assign categories and suppliers
  
- ✅ **Update stock quantities**
  - Adjust stock levels
  - Update item information
  - Modify descriptions
  - Change unit of measurement
  
- ✅ **Set reorder levels**
  - Configure reorder points
  - Set minimum stock levels
  - Set maximum stock levels
  - Define safety stock
  
- ✅ **Configure stock alerts**
  - Set up low stock alerts
  - Configure reorder notifications
  - Manage alert thresholds
  
- ✅ **Delete inventory items**
  - Remove obsolete items
  - Clean up inventory database

#### 2. Stock In Management
- ✅ **View stock in records**
  - View receiving history
  - Track deliveries
  - Monitor incoming stock
  
- ✅ **Create stock in records**
  - Record received stock
  - Process deliveries
  - Update inventory levels
  
- ✅ **Update stock in records**
  - Modify receiving records
  - Correct quantities
  - Update delivery information

#### 3. Stock Out Management
- ✅ **View stock out records**
  - View issuance history
  - Track stock movements
  - Monitor dispensing
  
- ✅ **Create stock out records**
  - Process stock issuance
  - Approve stock requests
  - Issue stock to departments
  
- ✅ **Approve stock issuance**
  - Review stock out requests
  - Approve/reject issuance
  - Authorize stock movements

#### 4. Requisition Management
- ✅ **View requisitions**
  - View all requisition requests
  - Track requisition status
  - Monitor pending requests
  
- ✅ **Approve requisitions**
  - Approve stock issuance requests
  - Reject requisitions if needed
  - Provide approval comments

#### 5. Purchase Orders (View Only)
- ✅ **View purchase orders**
  - Monitor incoming orders
  - Track order status
  - Plan for receiving
  - View order details

#### 6. Master Data (View Only)
- ✅ **View categories**
  - View item categories
  - Use for inventory classification
  
- ✅ **View suppliers**
  - View supplier information
  - Reference for inventory items
  
- ✅ **View departments**
  - View department list
  - Track stock issuance by department

#### 7. Reporting
- ✅ **Generate stock reports**
  - Stock level reports
  - Stock movement reports
  - Reorder reports
  - Low stock reports
  - Stock valuation reports
  
- ✅ **View stock alerts**
  - Low stock alerts
  - Reorder point alerts
  - Expiry alerts
  - Critical stock alerts

#### 8. Notifications
- ✅ **View notifications**
  - Stock alerts
  - Reorder notifications
  - System notifications

### ❌ What Inventory Manager CANNOT Do

#### 1. User Management
- ❌ Cannot manage users
- ❌ Cannot view user accounts
- ❌ Cannot assign roles
- ❌ Cannot create/edit/delete users

#### 2. Procurement Records
- ❌ Cannot create purchase orders
- ❌ Cannot edit purchase orders
- ❌ Cannot delete purchase orders
- ❌ Cannot approve purchase orders (procurement approval)
- ❌ Cannot create suppliers
- ❌ Cannot edit suppliers
- ❌ Cannot delete suppliers

#### 3. Audit Logs
- ❌ Cannot view audit logs
- ❌ Cannot delete audit logs
- ❌ Cannot modify historical audit records

#### 4. System Settings
- ❌ Cannot configure global system settings
- ❌ Cannot modify system parameters

#### 5. Master Data Management
- ❌ Cannot create categories
- ❌ Cannot update categories
- ❌ Cannot delete categories
- ❌ Cannot create departments
- ❌ Cannot update departments
- ❌ Cannot delete departments

---

## Workflow Examples

### Adding a New Inventory Item

1. **Navigate to Inventory**
   - Click "Add Item"

2. **Enter Item Details**
   - Item name
   - Description
   - Category
   - Supplier
   - Unit of measurement
   - Initial quantity
   - Reorder point
   - Maximum stock level

3. **Save Item**
   - Item added to inventory
   - Stock level initialized
   - Alerts configured

### Setting Reorder Levels

1. **Navigate to Inventory**
   - Find item to configure

2. **Edit Item**
   - Click edit button
   - Update reorder point
   - Set minimum stock level
   - Set maximum stock level

3. **Save Changes**
   - Reorder levels updated
   - Alerts automatically configured

### Approving Stock Issuance

1. **View Requisitions**
   - Navigate to Requisitions
   - View pending requests

2. **Review Request**
   - Check requested items
   - Verify quantities
   - Check stock availability

3. **Approve/Reject**
   - Approve if stock available
   - Reject if insufficient stock
   - Add comments if needed

4. **Process Stock Out**
   - Navigate to Stock Out
   - Create stock out record
   - Link to approved requisition
   - Update inventory levels

### Generating Stock Reports

1. **Navigate to Reports**
   - Select report type
   - Set date range
   - Select filters

2. **Generate Report**
   - View report data
   - Analyze stock levels
   - Identify trends

3. **Export Report**
   - Download as PDF/Excel
   - Share with management

---

## Implementation Details

### Permission Checks

#### Inventory Management
```php
// Full CRUD access
if (PermissionHelper::can($user, 'inventory.create')) {
    // Show create button
}

if (PermissionHelper::can($user, 'inventory.update')) {
    // Show edit button
}

if (PermissionHelper::can($user, 'inventory.delete')) {
    // Show delete button
}

if (PermissionHelper::can($user, 'inventory.configure')) {
    // Show reorder level configuration
}
```

#### Stock Out and Approval
```php
// Can create and approve
if (PermissionHelper::can($user, 'stock_out.create')) {
    // Allow stock issuance
}

if (PermissionHelper::can($user, 'stock_out.approve')) {
    // Show approve button
}
```

#### Requisitions
```php
// Can view and approve
if (PermissionHelper::can($user, 'requisitions.view')) {
    // Show requisitions list
}

if (PermissionHelper::can($user, 'requisitions.approve')) {
    // Show approve/reject buttons
}
```

#### Purchase Orders (View Only)
```php
// View only, no edit/delete
if (PermissionHelper::can($user, 'purchase_orders.view')) {
    // Show purchase orders list
}

if (PermissionHelper::isRestricted($user, 'purchase_orders.create')) {
    // Hide create button
}

if (PermissionHelper::isRestricted($user, 'purchase_orders.update')) {
    // Hide edit button
}
```

---

## Controller Updates Needed

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
        'canCreate' => PermissionHelper::can(auth()->user(), 'inventory.create'),
        'canEdit' => PermissionHelper::can(auth()->user(), 'inventory.update'),
        'canDelete' => PermissionHelper::can(auth()->user(), 'inventory.delete'),
        'canConfigure' => PermissionHelper::can(auth()->user(), 'inventory.configure'),
    ]);
}

public function create()
{
    if (!PermissionHelper::can(auth()->user(), 'inventory.create')) {
        abort(403, 'You do not have permission to add inventory items.');
    }
    
    $categories = Category::all();
    $suppliers = Supplier::all();
    
    return inertia('admin/inventory-create', [
        'categories' => $categories,
        'suppliers' => $suppliers,
    ]);
}

public function update(Request $request, $id)
{
    if (!PermissionHelper::can(auth()->user(), 'inventory.update')) {
        abort(403, 'You do not have permission to update inventory.');
    }
    
    // Update logic including reorder levels
    $item = Item::findOrFail($id);
    
    $request->validate([
        'name' => 'required|string|max:255',
        'quantity' => 'required|integer|min:0',
        'reorder_point' => 'required|integer|min:1',
        'max_stock' => 'nullable|integer|min:1',
    ]);
    
    $item->update($request->all());
    
    return redirect()->back()->with('success', 'Inventory updated successfully');
}
```

### StockOutController

```php
public function create()
{
    if (!PermissionHelper::can(auth()->user(), 'stock_out.create')) {
        abort(403, 'You do not have permission to create stock out records.');
    }
    
    $items = Item::where('quantity', '>', 0)->get();
    $departments = Department::all();
    
    return inertia('stock-out/create', [
        'items' => $items,
        'departments' => $departments,
    ]);
}

public function approve(Request $request, $id)
{
    if (!PermissionHelper::can(auth()->user(), 'stock_out.approve')) {
        abort(403, 'You do not have permission to approve stock issuance.');
    }
    
    $stockOut = StockOut::findOrFail($id);
    $stockOut->status = 'Approved';
    $stockOut->approved_by = auth()->id();
    $stockOut->approved_at = now();
    $stockOut->save();
    
    return redirect()->back()->with('success', 'Stock issuance approved');
}
```

### RequisitionController

```php
public function approve(Request $request, $id)
{
    if (!PermissionHelper::can(auth()->user(), 'requisitions.approve')) {
        abort(403, 'You do not have permission to approve requisitions.');
    }
    
    $requisition = Requisition::findOrFail($id);
    
    $request->validate([
        'status' => 'required|in:Approved,Rejected',
        'comments' => 'nullable|string',
    ]);
    
    $requisition->status = $request->status;
    $requisition->approved_by = auth()->id();
    $requisition->approved_at = now();
    $requisition->approval_comments = $request->comments;
    $requisition->save();
    
    return redirect()->back()->with('success', 'Requisition ' . strtolower($request->status));
}
```

### PurchaseOrderController

```php
public function index()
{
    if (!PermissionHelper::can(auth()->user(), 'purchase_orders.view')) {
        abort(403, 'You do not have permission to view purchase orders.');
    }
    
    $orders = PurchaseOrder::with('supplier', 'items')->paginate(15);
    
    return inertia('admin/purchase-orders', [
        'orders' => $orders,
        'canCreate' => PermissionHelper::can(auth()->user(), 'purchase_orders.create'),
        'canEdit' => PermissionHelper::can(auth()->user(), 'purchase_orders.update'),
        'canDelete' => PermissionHelper::can(auth()->user(), 'purchase_orders.delete'),
    ]);
}
```

---

## Frontend Integration

### Inventory Page with Full Controls

```tsx
<div className="flex items-center justify-between">
    <h1>Inventory Management</h1>
    {canCreate && (
        <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
        </Button>
    )}
</div>

<table>
    {/* ... table content ... */}
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
        {canConfigure && (
            <Button onClick={() => handleConfigureReorder(item)}>
                <Settings className="h-4 w-4" />
            </Button>
        )}
    </td>
</table>
```

### Stock Out with Approval

```tsx
<div className="stock-out-request">
    <h3>Stock Out Request #{request.id}</h3>
    <p>Department: {request.department.name}</p>
    <p>Items: {request.items.length}</p>
    
    {canApprove && request.status === 'Pending' && (
        <div className="approval-actions">
            <Button onClick={() => handleApprove(request.id)}>
                Approve
            </Button>
            <Button variant="destructive" onClick={() => handleReject(request.id)}>
                Reject
            </Button>
        </div>
    )}
</div>
```

### Purchase Orders (View Only)

```tsx
<div className="purchase-orders">
    <h1>Purchase Orders</h1>
    {/* No create button for manager */}
    
    <table>
        {/* ... table content ... */}
        <td>
            <Button onClick={() => handleView(order)}>
                <Eye className="h-4 w-4" />
                View
            </Button>
            {/* No edit or delete buttons */}
        </td>
    </table>
</div>
```

---

## Navigation Structure

```
Inventory Manager Dashboard
├── Inventory (Full CRUD + Configure Reorder Levels)
├── Stock In (Full CRUD)
├── Stock Out (Full CRUD + Approve)
├── Requisitions (View + Approve)
├── Purchase Orders (View Only)
├── Categories (View Only)
├── Reports (Stock Reports)
└── Notifications (Stock Alerts)
```

---

## Testing Scenarios

### Test Inventory Manager Permissions:

1. **Login as Inventory Manager**

2. **Inventory Management**
   - ✅ View inventory → Should succeed
   - ✅ Add new item → Should succeed
   - ✅ Update stock quantity → Should succeed
   - ✅ Set reorder level → Should succeed
   - ✅ Delete item → Should succeed

3. **Stock In**
   - ✅ View stock in records → Should succeed
   - ✅ Create stock in → Should succeed
   - ✅ Update stock in → Should succeed

4. **Stock Out**
   - ✅ View stock out records → Should succeed
   - ✅ Create stock out → Should succeed
   - ✅ Approve stock issuance → Should succeed

5. **Requisitions**
   - ✅ View requisitions → Should succeed
   - ✅ Approve requisition → Should succeed
   - ❌ Create requisition → Should be blocked

6. **Purchase Orders**
   - ✅ View purchase orders → Should succeed
   - ❌ Create purchase order → Should be blocked
   - ❌ Edit purchase order → Should be blocked
   - ❌ Delete purchase order → Should be blocked

7. **Suppliers**
   - ✅ View suppliers → Should succeed
   - ❌ Create supplier → Should be blocked
   - ❌ Edit supplier → Should be blocked

8. **System Access**
   - ❌ View users → Should be blocked
   - ❌ View audit logs → Should be blocked
   - ❌ Configure settings → Should be blocked

---

## Key Differences from Other Roles

| Feature | Inventory Manager | System Admin | Procurement Officer |
|---------|------------------|--------------|---------------------|
| **Add Inventory Items** | ✅ Yes | ✅ Yes | ❌ No |
| **Update Stock Quantities** | ✅ Yes | ✅ Yes | ❌ No |
| **Set Reorder Levels** | ✅ Yes | ✅ Yes | ❌ No |
| **Delete Inventory** | ✅ Yes | ✅ Yes | ❌ No |
| **Approve Stock Issuance** | ✅ Yes | ✅ Yes | ❌ No |
| **Create Purchase Orders** | ❌ No | ✅ Yes | ✅ Yes |
| **Edit Purchase Orders** | ❌ No | ✅ Yes | ❌ No |
| **Create Suppliers** | ❌ No | ✅ Yes | ✅ Yes |
| **Edit Suppliers** | ❌ No | ✅ Yes | ❌ No |
| **View Audit Logs** | ❌ No | ✅ Yes | ❌ No |
| **Manage Users** | ❌ No | ✅ Yes | ❌ No |

---

## Security Benefits

1. **Inventory Control**: Full control over inventory management
2. **Approval Workflow**: Can approve stock issuance requests
3. **No Procurement Interference**: Cannot modify procurement records
4. **Audit Protection**: Cannot view or delete audit logs
5. **Focused Responsibility**: Clear separation from procurement and user management

---

## Summary

Inventory Manager is a specialized operational role focused on:
- Managing inventory items and stock levels
- Setting and monitoring reorder levels
- Approving stock issuance requests
- Processing stock movements
- Generating stock reports and monitoring alerts

The role has full control over inventory operations while maintaining appropriate restrictions on procurement activities, user management, and audit logs.
