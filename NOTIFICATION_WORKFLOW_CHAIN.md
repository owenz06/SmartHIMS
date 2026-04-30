# Notification Workflow Chain

## Overview
The notification system now follows a clear hierarchical chain matching the organizational workflow:

**Pharmacist → Manager → Procurement Officer → Admin**

## Workflow 1: Requisitions (Pharmacist → Manager)

### When Pharmacist Creates Requisition
**Notification Sent To:** Manager
```
Title: "New Requisition Submitted"
Message: "Requisition REQ-XXX has been submitted by [Pharmacist Name] and requires approval."
Target: manager role
```

### When Manager Approves/Rejects Requisition
**Notification Sent To:** Pharmacist (original requester)
```
Title: "Requisition Approved" or "Requisition Rejected"
Message: "Your requisition REQ-XXX has been [approved/rejected]..."
Target: specific user_id (the pharmacist)
```

## Workflow 2: Stock Requests (Manager → Procurement Officer → Admin)

### When Manager Creates Stock Request
**Notification Sent To:** Procurement Officer
```
Title: "New Stock Request"
Message: "Stock request SR-XXX has been submitted by [Manager Name] for approval."
Target: procurement_officer role
```

### When Procurement Officer Approves Stock Request
**Notifications Sent To:**

1. **Manager (original requester)**
```
Title: "Stock Request Approved"
Message: "Your stock request SR-XXX has been approved and stock has been added."
Target: specific user_id (the manager)
```

2. **Admin (for oversight)**
```
Title: "Stock Request Approved"
Message: "Stock request SR-XXX has been approved by [Procurement Officer Name]. Stock has been added to inventory."
Target: admin role
```

### When Procurement Officer Rejects Stock Request
**Notification Sent To:** Manager (original requester)
```
Title: "Stock Request Rejected"
Message: "Your stock request SR-XXX has been rejected. Reason: [rejection reason]"
Target: specific user_id (the manager)
```

## Workflow 3: Stock Delivery (Manager → Procurement Officer)

### When Manager Receives Stock from Supplier and Adds to Inventory
**Notification Sent To:** Procurement Officer
```
Title: "Stock Delivery Confirmed"
Message: "Manager has received and added '[Item Name]' (Quantity: X) from supplier to inventory."
Target: procurement_officer role
```

**Purpose:** Confirms that orders placed by procurement officer have been successfully delivered and received by the manager.

### When Manager Increases Existing Stock (Additional Delivery)
**Notification Sent To:** Procurement Officer
```
Title: "Additional Stock Delivery Confirmed"
Message: "Manager has received additional stock for '[Item Name]' (Quantity: X) from supplier. New total: Y."
Target: procurement_officer role
```

**Automatic Actions:**
- Stock In record is automatically created
- Inventory quantity is updated
- Procurement officer is notified of successful delivery

## Notification Chain Summary

```
REQUISITIONS WORKFLOW:
┌─────────────┐
│  Pharmacist │
└──────┬──────┘
       │ Creates Requisition
       ↓
┌─────────────┐
│   Manager   │ ← Receives notification
└──────┬──────┘
       │ Approves/Rejects
       ↓
┌─────────────┐
│  Pharmacist │ ← Receives notification
└─────────────┘

STOCK REQUESTS WORKFLOW:
       ┌─────────────┐
       │   Manager   │
       └──────┬──────┘
              │ Creates Stock Request
              ↓
       ┌─────────────────────┐
       │ Procurement Officer │ ← Receives notification
       └──────┬──────────────┘
              │ Approves/Rejects
              ↓
       ┌─────────────┬─────────────┐
       │   Manager   │    Admin    │ ← Both receive notifications
       └─────────────┴─────────────┘

STOCK DELIVERY WORKFLOW:
       ┌─────────────┐
       │   Manager   │
       └──────┬──────┘
              │ Receives stock from supplier
              │ Adds to inventory
              ↓
       ┌─────────────────────┐
       │ Procurement Officer │ ← Receives delivery confirmation
       └─────────────────────┘
```

## Removed Notifications

### Inventory Changes
- **Removed:** Procurement officer notifications when inventory is added/updated
- **Reason:** Not part of the workflow chain; inventory changes are managed by managers

### Requisitions to Procurement Officer
- **Removed:** Procurement officer notifications for requisitions
- **Reason:** Requisitions are between pharmacist and manager only

## Files Modified

1. **app/Http/Controllers/Admin/RequisitionController.php**
   - Removed procurement officer notification from store method
   - Only notifies manager when pharmacist creates requisition

2. **app/Http/Controllers/Admin/StockRequestController.php**
   - Added admin notification when procurement officer approves
   - Maintains manager notification for status updates

3. **app/Http/Controllers/Admin/InventoryController.php**
   - Removed procurement officer notifications from store method
   - Removed procurement officer notifications from update method

## Notification Types

### Role-Based Notifications
Used when notifying all users of a specific role:
```php
SystemNotification::create([
    'target_role' => 'manager', // or 'admin', 'procurement_officer'
    'user_id' => null,
    // ...
]);
```

### User-Specific Notifications
Used when notifying a specific user:
```php
SystemNotification::create([
    'user_id' => $userId,
    'target_role' => null,
    // ...
]);
```

## Benefits

1. **Clear Communication Chain**: Each role knows who to communicate with
2. **Reduced Noise**: Users only receive relevant notifications
3. **Proper Escalation**: Issues flow up the hierarchy appropriately
4. **Audit Trail**: Admin is notified of major actions (stock additions)
5. **Role Clarity**: Each role's responsibilities are clear from notifications

## Testing

### Test as Pharmacist
1. Create a requisition
2. Manager should receive notification
3. Procurement officer should NOT receive notification

### Test as Manager
1. Approve/reject pharmacist requisition
2. Pharmacist should receive notification
3. Create a stock request
4. Procurement officer should receive notification

### Test as Procurement Officer
1. Approve stock request
2. Manager should receive notification
3. Admin should receive notification
4. Should NOT receive notifications for inventory changes

### Test as Admin
1. Should receive notifications when procurement officer approves stock requests
2. Should NOT receive notifications for requisitions (those are manager's responsibility)

## Future Enhancements
- Add notification preferences (email, SMS, in-app)
- Add notification grouping (daily digest)
- Add notification priority levels
- Add read receipts
- Add notification history/archive
