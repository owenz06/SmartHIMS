# Stock Requests CRUD Operations - Implementation Summary

## Task Completed ✅

All CRUD (Create, Read, Update, Delete) operations for the Stock Requests feature have been successfully implemented for the Manager role.

## What Was Implemented

### 1. Backend API Controller
**File**: `backend/app/Http/Controllers/Api/V1/StockRequestController.php`

Created a complete REST API controller with the following endpoints:

- **GET /api/stock-requests** - List all stock requests (filtered by role)
- **POST /api/stock-requests** - Create new stock request (Manager only)
- **GET /api/stock-requests/{id}** - View single stock request
- **PUT /api/stock-requests/{id}** - Update stock request (Manager, own pending requests only)
- **PUT /api/stock-requests/{id}/status** - Approve/Reject request (Procurement Officer only)
- **DELETE /api/stock-requests/{id}** - Delete stock request (Manager own pending, or Procurement Officer any pending)

### 2. API Routes
**File**: `backend/routes/api.php`

Added 6 new API routes for stock requests with proper authentication middleware.

### 3. Frontend Edit Page
**File**: `frontend/src/pages/EditStockRequest.tsx`

Created a complete edit page with:
- Form pre-filled with existing request data
- Item selection with current stock display
- Quantity input validation
- Optional supplier selection
- Notes field
- Permission checks (only manager's own pending requests)
- Status validation (only pending requests can be edited)
- Loading states and error handling

### 4. Updated Stock Requests List
**File**: `frontend/src/pages/StockRequests.tsx`

Added:
- Edit button for managers on their own pending requests
- `canEditRequest()` function to determine edit permissions
- Edit icon import from lucide-react

### 5. Updated API Service
**File**: `frontend/src/lib/api.ts`

Added:
- `updateStockRequest(id, data)` method to StockRequestAPI class

### 6. Updated App Routes
**File**: `frontend/src/App.tsx`

Added:
- Route for `/admin/stock-requests/create` (AddStockRequest)
- Route for `/admin/stock-requests/:id` (ViewStockRequest)
- Route for `/admin/stock-requests/:id/edit` (EditStockRequest)
- Import for EditStockRequest component

## CRUD Operations Breakdown

### ✅ CREATE (Add Stock Request)
- **Page**: `AddStockRequest.tsx`
- **Route**: `/admin/stock-requests/create`
- **Access**: Manager only
- **Features**:
  - Select item from inventory
  - Display current stock level
  - Enter quantity requested
  - Optional supplier selection
  - Optional notes
  - Validation and error handling
  - Notifications to procurement officers

### ✅ READ (View Stock Requests)
- **List Page**: `StockRequests.tsx`
- **Route**: `/admin/stock-requests`
- **Access**: Manager (own requests), Procurement Officer (all requests)
- **Features**:
  - Search by request number, item, or requester
  - Filter by status (All, Pending, Approved, Rejected)
  - Status badges with icons
  - Role-based info banners
  - Responsive table layout

- **Detail Page**: `ViewStockRequest.tsx`
- **Route**: `/admin/stock-requests/:id`
- **Access**: Manager (own requests), Procurement Officer (all requests)
- **Features**:
  - Complete request details
  - Item information
  - Requester information
  - Supplier (if specified)
  - Notes (if provided)
  - Rejection reason (if rejected)
  - Approve/Reject buttons (Procurement Officer only)

### ✅ UPDATE (Edit Stock Request)
- **Page**: `EditStockRequest.tsx`
- **Route**: `/admin/stock-requests/:id/edit`
- **Access**: Manager (own pending requests only)
- **Features**:
  - Pre-filled form with existing data
  - Can modify item, quantity, supplier, notes
  - Permission validation (own requests only)
  - Status validation (pending only)
  - Current stock display
  - Save changes with validation

### ✅ DELETE (Remove Stock Request)
- **Location**: `StockRequests.tsx` (list page)
- **Access**: Manager (own pending requests), Procurement Officer (any pending request)
- **Features**:
  - Delete button with trash icon
  - Confirmation dialog
  - Permission checks
  - Status validation (pending only)
  - Success feedback

## Permission Matrix

| Action | Manager | Procurement Officer | Super Admin | System Admin |
|--------|---------|-------------------|-------------|--------------|
| Create Request | ✅ | ❌ | ❌ | ❌ |
| View Own Requests | ✅ | N/A | ✅ (Read-only) | ✅ (Read-only) |
| View All Requests | ❌ | ✅ | ✅ (Read-only) | ✅ (Read-only) |
| Edit Own Pending | ✅ | ❌ | ❌ | ❌ |
| Delete Own Pending | ✅ | ❌ | ❌ | ❌ |
| Delete Any Pending | ❌ | ✅ | ❌ | ❌ |
| Approve/Reject | ❌ | ✅ | ❌ | ❌ |

## Status Restrictions

### Pending Requests
- ✅ Can be edited by manager (owner)
- ✅ Can be deleted by manager (owner) or procurement officer
- ✅ Can be approved/rejected by procurement officer

### Approved/Rejected/Completed Requests
- ❌ Cannot be edited
- ❌ Cannot be deleted
- ❌ Cannot change status
- ✅ Can only be viewed

## Workflow Example

### Manager Creates and Edits Request

1. **Create Request**
   ```
   Manager → Stock Requests → New Request
   → Fill form (Item: Paracetamol, Qty: 500)
   → Submit
   → Request SR-20260428-1234 created (Status: Pending)
   → Procurement Officers notified
   ```

2. **Edit Request** (realizes quantity should be 1000)
   ```
   Manager → Stock Requests → View SR-20260428-1234
   → Click Edit button
   → Change quantity from 500 to 1000
   → Save Changes
   → Request updated (Status: still Pending)
   ```

3. **Procurement Officer Reviews**
   ```
   Procurement Officer → Stock Requests
   → View SR-20260428-1234
   → Review details (Item: Paracetamol, Qty: 1000)
   → Click Approve
   → Confirm approval
   → Stock added to inventory (+1000 Paracetamol)
   → Stock In record created
   → Manager notified
   → Admins notified
   ```

## Technical Details

### Backend Authorization
```php
// Only managers can create
if (auth()->user()->role !== 'manager') {
    return response()->json(['success' => false, 'message' => 'Only managers can create stock requests.'], 403);
}

// Only managers can update their own pending requests
if ($user->role !== 'manager' || $stockRequest->requested_by !== $user->id) {
    return response()->json(['success' => false, 'message' => 'You do not have permission to update this stock request.'], 403);
}

// Only pending requests can be updated
if ($stockRequest->status !== 'Pending') {
    return response()->json(['success' => false, 'message' => 'Cannot update a stock request that has been processed.'], 403);
}
```

### Frontend Permission Checks
```typescript
// Check if user can edit request
const canEditRequest = (request: StockRequest) => {
  if (request.status !== 'Pending') return false;
  if (user?.role === 'manager' && request.requested_by === user.id) return true;
  return false;
};

// Check if user can delete request
const canDeleteRequest = (request: StockRequest) => {
  if (request.status !== 'Pending') return false;
  if (user?.role === 'procurement_officer') return true;
  if (user?.role === 'manager' && request.requested_by === user.id) return true;
  return false;
};
```

### Inventory Integration
When a request is approved:
```php
// Add stock to inventory
$item = Item::find($stockRequest->item_id);
$item->quantity += $stockRequest->quantity_requested;
$item->save();

// Create Stock In record
StockIn::create([
    'item_id' => $stockRequest->item_id,
    'supplier_id' => $stockRequest->supplier_id,
    'quantity_received' => $stockRequest->quantity_requested,
    'received_date' => now(),
    'notes' => 'Stock request ' . $stockRequest->request_number . ' fulfilled',
]);
```

## Testing Recommendations

### Manager Tests
1. ✅ Create a new stock request
2. ✅ View the created request in the list
3. ✅ Edit the pending request (change quantity)
4. ✅ Verify changes are saved
5. ✅ Delete the pending request
6. ✅ Try to edit another manager's request (should fail)
7. ✅ Try to edit an approved request (should fail)

### Procurement Officer Tests
1. ✅ View all stock requests from all managers
2. ✅ Approve a pending request
3. ✅ Verify stock was added to inventory
4. ✅ Verify Stock In record was created
5. ✅ Reject a pending request with reason
6. ✅ Delete any pending request
7. ✅ Try to approve an already processed request (should fail)

### Integration Tests
1. ✅ Manager creates request → Procurement Officer receives notification
2. ✅ Procurement Officer approves → Manager receives notification
3. ✅ Procurement Officer approves → Admins receive notification
4. ✅ Procurement Officer rejects → Manager receives notification with reason
5. ✅ Approved request adds correct quantity to inventory
6. ✅ Stock In record has correct data

## Files Changed

### Created
- ✅ `backend/app/Http/Controllers/Api/V1/StockRequestController.php`
- ✅ `frontend/src/pages/EditStockRequest.tsx`
- ✅ `STOCK_REQUESTS_COMPLETE.md`
- ✅ `STOCK_REQUESTS_CRUD_SUMMARY.md`

### Modified
- ✅ `backend/routes/api.php` (added stock-requests routes)
- ✅ `frontend/src/pages/StockRequests.tsx` (added edit button and permission check)
- ✅ `frontend/src/App.tsx` (added routes and import)
- ✅ `frontend/src/lib/api.ts` (added updateStockRequest method)

## Next Steps

The Stock Requests feature is now complete with full CRUD operations. You can:

1. **Test the implementation**:
   - Login as a Manager
   - Create a stock request
   - Edit the pending request
   - Delete the request
   - Create another request and wait for approval

2. **Test as Procurement Officer**:
   - Login as Procurement Officer
   - View all requests
   - Approve/reject requests
   - Verify inventory updates

3. **Move to next Manager feature**:
   - The Stock Requests feature is complete
   - Ready to implement other Manager-specific features if needed

## Status: ✅ COMPLETE

All CRUD operations for Stock Requests are fully implemented and ready for testing!
