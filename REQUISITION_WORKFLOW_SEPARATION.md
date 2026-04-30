# Requisition Workflow Separation

## Overview
The system now has two separate requisition workflows to handle different approval chains:

1. **Requisitions**: Pharmacist → Manager (for stock issuance)
2. **Stock Requests**: Manager → Procurement Officer (for stock procurement)

## Workflow 1: Requisitions (Pharmacist → Manager)

### Purpose
Pharmacists request stock from existing inventory to be issued to their departments.

### Process Flow
1. **Pharmacist** creates a requisition for items needed
2. **Manager** reviews and approves/rejects the requisition
3. If approved, stock is issued from inventory

### Access Control

#### Pharmacist
- Can CREATE requisitions
- Can VIEW only their own requisitions
- Can EDIT their own pending requisitions
- Can DELETE their own pending requisitions
- Cannot approve requisitions

#### Manager
- Can VIEW requisitions from pharmacists only
- Can APPROVE/REJECT requisitions
- Cannot create requisitions (they use Stock Requests instead)
- Can EDIT requisitions
- Can DELETE requisitions

#### Admin/Super Admin
- Can VIEW all requisitions
- Full management access

### Navigation
- **Pharmacist**: Has "Requisitions" link in sidebar
- **Manager**: Has "Requisitions" link in sidebar
- **Procurement Officer**: NO "Requisitions" link (uses Stock Requests)

## Workflow 2: Stock Requests (Manager → Procurement Officer)

### Purpose
Managers request new stock to be added to inventory from procurement.

### Process Flow
1. **Manager** creates a stock request for items needed
2. **Procurement Officer** reviews and approves/rejects the request
3. If approved, stock is added to inventory and Stock In record is created

### Access Control

#### Manager
- Can CREATE stock requests
- Can VIEW only their own stock requests
- Can DELETE their own pending stock requests
- Cannot approve stock requests

#### Procurement Officer
- Can VIEW all stock requests
- Can APPROVE/REJECT stock requests
- Cannot create stock requests

#### Admin/Super Admin
- Can VIEW all stock requests
- Full management access

### Navigation
- **Manager**: Has "Stock Requests" link in sidebar
- **Procurement Officer**: Has "Stock Requests" link in sidebar

## Key Differences

| Feature | Requisitions | Stock Requests |
|---------|-------------|----------------|
| **Creator** | Pharmacist | Manager |
| **Approver** | Manager | Procurement Officer |
| **Purpose** | Issue existing stock | Add new stock |
| **Result** | Stock Out record | Stock In record + Inventory increase |
| **Visibility** | Pharmacist sees own, Manager sees from pharmacists | Manager sees own, Procurement sees all |

## Database Tables

### Requisitions Table
- `user_id` - The pharmacist who created it
- `department_id` - Department requesting stock
- `status` - Pending, Approved, Rejected
- Linked to `requisition_items` for multiple items

### Stock Requests Table
- `requested_by` - The manager who created it
- `item_id` - Single item per request
- `supplier_id` - Preferred supplier (optional)
- `status` - Pending, Approved, Rejected, Completed
- `quantity_requested` - Amount needed

## Controller Logic

### RequisitionController::index()
```php
// Pharmacists see only their own requisitions
if ($user->role === 'pharmacist') {
    $query->where('user_id', $user->id);
}

// Managers see only requisitions from pharmacists
elseif ($user->role === 'manager') {
    $query->whereHas('user', function ($q) {
        $q->where('role', 'pharmacist');
    });
}

// Procurement officers see nothing (empty result)
elseif ($user->role === 'procurement_officer') {
    $query->whereRaw('1 = 0');
}
```

### StockRequestController::index()
```php
// Managers see their own requests
if ($user->role === 'manager') {
    $query->where('requested_by', $user->id);
}

// Procurement officers see all requests
// No filtering needed
```

## Notifications

### Requisitions
- When pharmacist creates: Manager receives notification
- When manager approves/rejects: Pharmacist receives notification

### Stock Requests
- When manager creates: Procurement officer receives notification
- When procurement officer approves/rejects: Manager receives notification

## Files Modified
1. `app/Http/Controllers/Admin/RequisitionController.php` - Added role-based filtering
2. `resources/js/config/navigation.tsx` - Removed Requisitions from procurement officer
3. `routes/web.php` - Already configured correctly

## Testing

### Test as Pharmacist
1. Create a requisition
2. Should see only own requisitions
3. Should NOT see Stock Requests link

### Test as Manager
1. Should see requisitions from pharmacists only
2. Can approve/reject requisitions
3. Can create stock requests
4. Should see own stock requests

### Test as Procurement Officer
1. Should NOT see Requisitions link
2. Should see Stock Requests link
3. Should see all stock requests from managers
4. Can approve/reject stock requests

## Benefits
- Clear separation of concerns
- Proper approval chains
- No confusion between workflows
- Each role sees only relevant information
- Maintains audit trail for both workflows
