# Pharmacist/Technician Permissions Implementation

## Overview
Pharmacist/Technician role is focused on dispensing medicines and requesting stock. This is a front-line operational role with limited access to only the functions needed for daily dispensing activities.

---

## Pharmacist Permissions

### ✅ What Pharmacist CAN Do

#### 1. View Available Inventory
- ✅ **View inventory items**
  - View medicine list
  - Check stock availability
  - View item details
  - Check stock levels
  - View item descriptions
  
- ✅ **Search inventory**
  - Search for medicines
  - Filter by category
  - Find specific items quickly

#### 2. Dispense Medicines (Stock Out)
- ✅ **View stock out records**
  - View dispensing history
  - Track own dispensing activities
  - View past transactions
  
- ✅ **Create stock out records**
  - Dispense medicines
  - Record usage
  - Document dispensing
  - Specify quantities
  - Add notes/comments
  
- ✅ **Record patient/department information**
  - Record who received the medicine
  - Document purpose
  - Track dispensing details

#### 3. Request Stock (Requisitions)
- ✅ **View requisitions**
  - View own requisition requests
  - Track request status
  - Monitor approval status
  
- ✅ **Create requisitions**
  - Request stock when running low
  - Submit stock requests
  - Specify needed quantities
  - Add justification/notes

#### 4. Notifications
- ✅ **View notifications**
  - View low stock notifications
  - View stock alerts
  - View system notifications
  - Stay informed of stock status

### ❌ What Pharmacist CANNOT Do

#### 1. User Management
- ❌ Cannot manage users
- ❌ Cannot view user accounts
- ❌ Cannot assign roles
- ❌ Cannot create/edit/delete users

#### 2. Inventory Management
- ❌ Cannot create inventory items
- ❌ Cannot edit stock quantities manually
- ❌ Cannot delete inventory items
- ❌ Cannot configure inventory settings
- ❌ Cannot set reorder levels
- ❌ Cannot adjust stock levels directly

#### 3. Stock In (Receiving)
- ❌ Cannot create stock in records
- ❌ Cannot edit stock in records
- ❌ Cannot delete stock in records
- ❌ Cannot receive stock
- ❌ Cannot process deliveries

#### 4. Purchase Orders
- ❌ Cannot view purchase orders
- ❌ Cannot create purchase orders
- ❌ Cannot edit purchase orders
- ❌ Cannot delete purchase orders
- ❌ Cannot track procurement

#### 5. Requisitions (Limited)
- ❌ Cannot edit requisitions after submission
- ❌ Cannot delete requisitions
- ❌ Cannot approve requisitions
- ❌ Can only create and view own requests

#### 6. Master Data
- ❌ Cannot view suppliers
- ❌ Cannot manage suppliers
- ❌ Cannot manage categories
- ❌ Cannot manage departments

#### 7. Reports and Audit
- ❌ Cannot view reports
- ❌ Cannot view audit logs
- ❌ Cannot generate reports
- ❌ Cannot access analytics

#### 8. Settings
- ❌ Cannot configure system settings
- ❌ Cannot modify system parameters

---

## Workflow Examples

### Dispensing Medicine

1. **Check Inventory**
   - Navigate to Inventory
   - Search for medicine
   - Verify availability
   - Check stock level

2. **Dispense Medicine**
   - Navigate to Dispense (Stock Out)
   - Click "Dispense Medicine"
   - Select medicine
   - Enter quantity
   - Enter patient/department information
   - Add notes if needed
   - Submit

3. **Verify Dispensing**
   - View confirmation
   - Check updated stock level
   - Record transaction number

### Requesting Stock

1. **Check Stock Levels**
   - Navigate to Inventory
   - Identify low stock items
   - Note required quantities

2. **Create Requisition**
   - Navigate to Request Stock
   - Click "Create Request"
   - Select items needed
   - Enter quantities
   - Add justification
   - Submit request

3. **Track Request**
   - View requisition status
   - Monitor approval
   - Wait for stock arrival

### Daily Routine

1. **Morning Check**
   - View notifications
   - Check low stock alerts
   - Review inventory levels

2. **Dispensing Activities**
   - Dispense medicines as needed
   - Record all transactions
   - Monitor stock levels

3. **End of Day**
   - Review dispensing activities
   - Create requisitions for low stock
   - Check notifications

---

## Implementation Details

### Permission Checks

#### Inventory (View Only)
```php
// Can view only
if (PermissionHelper::can($user, 'inventory.view')) {
    // Show inventory list
}

// Cannot edit
if (PermissionHelper::isRestricted($user, 'inventory.update')) {
    // Hide edit button
}

// Cannot create
if (PermissionHelper::isRestricted($user, 'inventory.create')) {
    // Hide create button
}
```

#### Stock Out (Dispensing)
```php
// Can create stock out
if (PermissionHelper::can($user, 'stock_out.create')) {
    // Show dispense button
}

// Can view own records
if (PermissionHelper::can($user, 'stock_out.view')) {
    // Show dispensing history
}
```

#### Requisitions
```php
// Can create requisitions
if (PermissionHelper::can($user, 'requisitions.create')) {
    // Show create request button
}

// Cannot approve
if (PermissionHelper::isRestricted($user, 'requisitions.approve')) {
    // Hide approve button
}

// Cannot edit after submission
if (PermissionHelper::isRestricted($user, 'requisitions.update')) {
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
    
    $items = Item::with('category')
        ->where('quantity', '>', 0)
        ->paginate(15);
    
    return inertia('admin/inventory', [
        'items' => $items,
        'canCreate' => false, // Pharmacist cannot create
        'canEdit' => false,   // Pharmacist cannot edit
        'canDelete' => false, // Pharmacist cannot delete
        'viewOnly' => true,   // Mark as view-only
    ]);
}
```

### StockOutController

```php
public function index()
{
    if (!PermissionHelper::can(auth()->user(), 'stock_out.view')) {
        abort(403, 'You do not have permission to view stock out records.');
    }
    
    // Pharmacist sees only their own records
    $query = StockOut::with('item', 'user');
    
    if (auth()->user()->role === 'pharmacist') {
        $query->where('user_id', auth()->id());
    }
    
    $stockOuts = $query->latest()->paginate(15);
    
    return inertia('stock-out/index', [
        'stockOuts' => $stockOuts,
        'canCreate' => PermissionHelper::can(auth()->user(), 'stock_out.create'),
    ]);
}

public function create()
{
    if (!PermissionHelper::can(auth()->user(), 'stock_out.create')) {
        abort(403, 'You do not have permission to dispense medicines.');
    }
    
    $items = Item::where('quantity', '>', 0)->get();
    $departments = Department::all();
    
    return inertia('stock-out/create', [
        'items' => $items,
        'departments' => $departments,
    ]);
}

public function store(Request $request)
{
    if (!PermissionHelper::can(auth()->user(), 'stock_out.create')) {
        abort(403, 'You do not have permission to dispense medicines.');
    }
    
    $request->validate([
        'item_id' => 'required|exists:items,id',
        'quantity' => 'required|integer|min:1',
        'department_id' => 'nullable|exists:departments,id',
        'patient_name' => 'nullable|string',
        'notes' => 'nullable|string',
    ]);
    
    $item = Item::findOrFail($request->item_id);
    
    // Check stock availability
    if ($item->quantity < $request->quantity) {
        return redirect()->back()
            ->with('error', 'Insufficient stock. Available: ' . $item->quantity);
    }
    
    // Create stock out record
    $stockOut = StockOut::create([
        'item_id' => $request->item_id,
        'quantity_taken' => $request->quantity,
        'department_id' => $request->department_id,
        'patient_name' => $request->patient_name,
        'notes' => $request->notes,
        'user_id' => auth()->id(),
        'dispensed_at' => now(),
    ]);
    
    // Update inventory
    $item->quantity -= $request->quantity;
    $item->save();
    
    // Log activity
    AuditHelper::log('dispensed', $stockOut, null, $stockOut->toArray());
    
    return redirect()->route('stockout.index')
        ->with('success', 'Medicine dispensed successfully');
}
```

### RequisitionController

```php
public function index()
{
    if (!PermissionHelper::can(auth()->user(), 'requisitions.view')) {
        abort(403, 'You do not have permission to view requisitions.');
    }
    
    // Pharmacist sees only their own requisitions
    $query = Requisition::with('department', 'items.item');
    
    if (auth()->user()->role === 'pharmacist') {
        $query->where('user_id', auth()->id());
    }
    
    $requisitions = $query->latest()->paginate(15);
    
    return inertia('admin/requisitions', [
        'requisitions' => $requisitions,
        'canCreate' => PermissionHelper::can(auth()->user(), 'requisitions.create'),
        'canApprove' => PermissionHelper::can(auth()->user(), 'requisitions.approve'),
    ]);
}

public function create()
{
    if (!PermissionHelper::can(auth()->user(), 'requisitions.create')) {
        abort(403, 'You do not have permission to create requisitions.');
    }
    
    $items = Item::all();
    $departments = Department::all();
    
    return inertia('admin/requisitions-create', [
        'items' => $items,
        'departments' => $departments,
    ]);
}

public function store(Request $request)
{
    if (!PermissionHelper::can(auth()->user(), 'requisitions.create')) {
        abort(403, 'You do not have permission to create requisitions.');
    }
    
    $request->validate([
        'department_id' => 'required|exists:departments,id',
        'items' => 'required|array',
        'items.*.item_id' => 'required|exists:items,id',
        'items.*.quantity' => 'required|integer|min:1',
        'justification' => 'nullable|string',
    ]);
    
    DB::transaction(function () use ($request) {
        $requisition = Requisition::create([
            'requisition_number' => 'REQ-' . date('YmdHis'),
            'department_id' => $request->department_id,
            'user_id' => auth()->id(),
            'status' => 'Pending',
            'requested_date' => now(),
            'justification' => $request->justification,
        ]);
        
        foreach ($request->items as $item) {
            RequisitionItem::create([
                'requisition_id' => $requisition->id,
                'item_id' => $item['item_id'],
                'quantity' => $item['quantity'],
            ]);
        }
        
        // Notify managers
        SystemNotification::create([
            'title' => 'New Requisition',
            'message' => 'Requisition ' . $requisition->requisition_number . ' submitted by ' . auth()->user()->name,
            'target_role' => 'manager',
        ]);
        
        AuditHelper::log('created', $requisition, null, $requisition->toArray());
    });
    
    return redirect()->route('admin.requisitions.index')
        ->with('success', 'Requisition submitted successfully');
}
```

---

## Frontend Integration

### Inventory Page (View Only)

```tsx
export default function Inventory({ items, viewOnly }: Props) {
    return (
        <>
            <Head title="Inventory" />
            
            <div className="flex items-center justify-between border-b border-sidebar-border px-6 py-4">
                <div>
                    <h1 className="text-2xl font-semibold">Available Inventory</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View available medicines and stock levels
                    </p>
                </div>
                {/* No create button for pharmacist */}
            </div>
            
            <div className="p-6">
                {viewOnly && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            View-only access. Contact inventory manager to modify stock.
                        </p>
                    </div>
                )}
                
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-sidebar-border text-left text-sm text-muted-foreground">
                            <th className="pb-3 font-medium">NAME</th>
                            <th className="pb-3 font-medium">CATEGORY</th>
                            <th className="pb-3 font-medium">AVAILABLE</th>
                            <th className="pb-3 font-medium">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.data.map((item) => (
                            <tr key={item.id} className="border-b border-sidebar-border">
                                <td className="py-4 font-medium">{item.name}</td>
                                <td className="py-4 text-sm">{item.category.name}</td>
                                <td className="py-4 text-sm">{item.quantity}</td>
                                <td className="py-4">
                                    {item.quantity <= item.reorder_point ? (
                                        <Badge variant="destructive">Low Stock</Badge>
                                    ) : (
                                        <Badge variant="success">Available</Badge>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
```

### Dispense Page

```tsx
export default function Dispense() {
    const form = useForm({
        item_id: '',
        quantity: '',
        department_id: '',
        patient_name: '',
        notes: '',
    });
    
    return (
        <>
            <Head title="Dispense Medicine" />
            
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Dispense Medicine</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label>Medicine</Label>
                            <select
                                value={form.data.item_id}
                                onChange={(e) => form.setData('item_id', e.target.value)}
                                required
                            >
                                <option value="">Select medicine</option>
                                {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} (Available: {item.quantity})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <Label>Quantity</Label>
                            <Input
                                type="number"
                                value={form.data.quantity}
                                onChange={(e) => form.setData('quantity', e.target.value)}
                                min="1"
                                required
                            />
                        </div>
                        
                        <div>
                            <Label>Department (Optional)</Label>
                            <select
                                value={form.data.department_id}
                                onChange={(e) => form.setData('department_id', e.target.value)}
                            >
                                <option value="">Select department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <Label>Patient Name (Optional)</Label>
                            <Input
                                value={form.data.patient_name}
                                onChange={(e) => form.setData('patient_name', e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <Label>Notes (Optional)</Label>
                            <Textarea
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                            />
                        </div>
                        
                        <Button type="submit" disabled={form.processing}>
                            {form.processing && <Spinner />}
                            Dispense Medicine
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
```

---

## Navigation Structure

```
Pharmacist Dashboard
├── Inventory (View Only - Check Availability)
├── Dispense (Create Stock Out - Dispense Medicines)
├── Request Stock (Create Requisitions)
└── Notifications (Low Stock Alerts)
```

---

## Testing Scenarios

### Test Pharmacist Permissions:

1. **Login as Pharmacist**

2. **Inventory**
   - ✅ View inventory → Should succeed
   - ❌ Create item → Should be blocked
   - ❌ Edit item → Should be blocked
   - ❌ Delete item → Should be blocked

3. **Dispensing**
   - ✅ View own dispensing history → Should succeed
   - ✅ Dispense medicine → Should succeed
   - ✅ Record usage → Should succeed

4. **Requisitions**
   - ✅ View own requisitions → Should succeed
   - ✅ Create requisition → Should succeed
   - ❌ Edit requisition → Should be blocked
   - ❌ Approve requisition → Should be blocked

5. **System Access**
   - ❌ View purchase orders → Should be blocked
   - ❌ View stock in → Should be blocked
   - ❌ View suppliers → Should be blocked
   - ❌ View reports → Should be blocked
   - ❌ View audit logs → Should be blocked
   - ❌ View users → Should be blocked

---

## Key Differences from Other Roles

| Feature | Pharmacist | Inventory Manager | Procurement Officer |
|---------|-----------|------------------|---------------------|
| **View Inventory** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Edit Inventory** | ❌ No | ✅ Yes | ❌ No |
| **Dispense Medicines** | ✅ Yes | ✅ Yes | ❌ No |
| **Request Stock** | ✅ Yes | ✅ Yes | ❌ No |
| **Approve Requisitions** | ❌ No | ✅ Yes | ❌ No |
| **Create Purchase Orders** | ❌ No | ❌ No | ✅ Yes |
| **View Purchase Orders** | ❌ No | ✅ Yes | ✅ Yes |
| **Receive Stock** | ❌ No | ✅ Yes | ✅ Yes |
| **View Reports** | ❌ No | ✅ Yes | ✅ Yes |

---

## Security Benefits

1. **Limited Access**: Only essential functions for dispensing
2. **No Manual Adjustments**: Cannot edit stock quantities directly
3. **Audit Trail**: All dispensing activities are logged
4. **Request-Based**: Must request stock through proper channels
5. **View-Only Inventory**: Cannot modify inventory data

---

## Summary

Pharmacist is a front-line operational role focused on:
- Dispensing medicines to patients/departments
- Recording usage accurately
- Requesting stock when needed
- Monitoring available inventory

The role has minimal permissions to maintain data integrity and ensure all stock movements are properly documented and approved through the appropriate channels.
