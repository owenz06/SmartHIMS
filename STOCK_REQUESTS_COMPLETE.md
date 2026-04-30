# Stock Requests Feature - Complete Implementation

## Overview
The Stock Requests feature allows Managers to request stock items from Procurement Officers. This creates a formal workflow for inventory replenishment with approval processes.

## User Roles & Permissions

### Manager
- **Can Create**: Submit new stock requests
- **Can View**: Own stock requests only
- **Can Edit**: Own pending stock requests only
- **Can Delete**: Own pending stock requests only
- **Cannot**: Approve/reject requests, view other managers' requests

### Procurement Officer
- **Can View**: All stock requests from all managers
- **Can Approve**: Pending stock requests (automatically adds stock to inventory)
- **Can Reject**: Pending stock requests (with reason)
- **Can Delete**: Any pending stock request
- **Cannot**: Create stock requests, edit requests

### Super Admin & System Admin
- **Read-Only Access**: Can view stock requests but cannot create, edit, approve, or delete

## Workflow

### 1. Manager Creates Request
1. Manager navigates to Stock Requests page
2. Clicks "New Request" button
3. Fills out form:
   - **Item** (required): Select from inventory items
   - **Quantity Requested** (required): Number of units needed
   - **Preferred Supplier** (optional): Suggest a supplier
   - **Notes** (optional): Additional information
4. Submits request
5. Request is created with status "Pending"
6. Procurement Officers receive notification

### 2. Manager Can Edit Pending Request
1. Manager views their stock requests
2. Clicks "Edit" button on pending request
3. Modifies any field (item, quantity, supplier, notes)
4. Saves changes
5. Request remains in "Pending" status

### 3. Procurement Officer Reviews Request
1. Procurement Officer views all pending requests
2. Clicks on request to view details
3. Reviews:
   - Item information
   - Quantity requested
   - Current stock level
   - Requester information
   - Preferred supplier
   - Notes

### 4. Procurement Officer Approves Request
1. Clicks "Approve" button
2. Confirms approval
3. System automatically:
   - Updates request status to "Approved"
   - Adds quantity to inventory
   - Creates Stock In record
   - Notifies manager of approval
   - Notifies admins of stock addition

### 5. Procurement Officer Rejects Request
1. Clicks "Reject" button
2. Provides rejection reason (required)
3. Confirms rejection
4. System:
   - Updates request status to "Rejected"
   - Stores rejection reason
   - Notifies manager with reason

## Status Flow

```
Pending → Approved → (Stock added to inventory)
   ↓
Rejected (with reason)
```

### Status Definitions
- **Pending**: Awaiting procurement officer review
- **Approved**: Approved and stock added to inventory
- **Rejected**: Rejected with reason provided
- **Completed**: (Future use) For tracking fulfillment

## Features

### Stock Requests List Page
- **Search**: By request number, item name, or requester name
- **Filter**: By status (All, Pending, Approved, Rejected)
- **Role-Based View**:
  - Managers see only their own requests
  - Procurement Officers see all requests
- **Actions**:
  - View: All users can view details
  - Edit: Managers can edit their own pending requests
  - Delete: Managers can delete their own pending requests; Procurement Officers can delete any pending request

### Add Stock Request Page
- **Access**: Managers only
- **Form Fields**:
  - Item dropdown with current stock display
  - Quantity input (minimum 1)
  - Supplier dropdown (optional)
  - Notes textarea (optional)
- **Current Stock Display**: Shows real-time stock level for selected item
- **Validation**: Client-side and server-side validation

### Edit Stock Request Page
- **Access**: Managers can edit their own pending requests only
- **Restrictions**:
  - Cannot edit if status is not "Pending"
  - Cannot edit other managers' requests
- **Same form as Add page** with pre-filled data

### View Stock Request Page
- **Access**: All authenticated users
- **Displays**:
  - Request number and status badge
  - Item information (name, code, quantity)
  - Requester information (name, email, date)
  - Preferred supplier (if specified)
  - Notes (if provided)
  - Rejection reason (if rejected)
  - Completion date (if completed)
- **Actions for Procurement Officers**:
  - Approve button (for pending requests)
  - Reject button (for pending requests)

## Backend Implementation

### API Controller
**File**: `backend/app/Http/Controllers/Api/V1/StockRequestController.php`

#### Endpoints
1. **GET /api/stock-requests**
   - Lists stock requests
   - Filters by role (managers see own, procurement officers see all)
   - Supports status filter and search

2. **POST /api/stock-requests**
   - Creates new stock request
   - Manager role required
   - Generates unique request number
   - Sends notification to procurement officers

3. **GET /api/stock-requests/{id}**
   - Shows single stock request
   - Managers can only view their own

4. **PUT /api/stock-requests/{id}**
   - Updates stock request
   - Manager role required
   - Can only update own pending requests

5. **PUT /api/stock-requests/{id}/status**
   - Updates request status (approve/reject)
   - Procurement officer role required
   - Automatically adds stock to inventory on approval
   - Creates Stock In record
   - Sends notifications

6. **DELETE /api/stock-requests/{id}**
   - Deletes stock request
   - Managers can delete own pending requests
   - Procurement officers can delete any pending request

### Model
**File**: `backend/app/Models/StockRequest.php`

#### Fields
- `id`: Primary key
- `request_number`: Unique identifier (e.g., SR-20260428123456-1234)
- `item_id`: Foreign key to items table
- `supplier_id`: Foreign key to suppliers table (nullable)
- `quantity_requested`: Integer
- `requested_by`: Foreign key to users table
- `status`: Enum (Pending, Approved, Rejected, Completed)
- `notes`: Text (nullable)
- `rejection_reason`: Text (nullable)
- `requested_date`: Timestamp
- `completed_date`: Timestamp (nullable)
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### Relationships
- `item()`: BelongsTo Item
- `supplier()`: BelongsTo Supplier
- `requestedBy()`: BelongsTo User

### Routes
**File**: `backend/routes/api.php`

```php
// Stock Requests
Route::get('/stock-requests', [ApiStockRequestController::class, 'index']);
Route::get('/stock-requests/{stockRequest}', [ApiStockRequestController::class, 'show']);
Route::post('/stock-requests', [ApiStockRequestController::class, 'store']);
Route::put('/stock-requests/{stockRequest}', [ApiStockRequestController::class, 'update']);
Route::put('/stock-requests/{stockRequest}/status', [ApiStockRequestController::class, 'updateStatus']);
Route::delete('/stock-requests/{stockRequest}', [ApiStockRequestController::class, 'destroy']);
```

## Frontend Implementation

### Pages
1. **StockRequests.tsx**: List view with search, filter, and actions
2. **AddStockRequest.tsx**: Create new request form
3. **EditStockRequest.tsx**: Edit existing pending request form
4. **ViewStockRequest.tsx**: View details and approve/reject

### API Service
**File**: `frontend/src/lib/api.ts`

```typescript
export class StockRequestAPI {
  static async getStockRequests(params?: any)
  static async getStockRequest(id: number)
  static async createStockRequest(data: any)
  static async updateStockRequest(id: number, data: any)
  static async updateStockRequestStatus(id: number, data: any)
  static async deleteStockRequest(id: number)
}
```

### Routes
**File**: `frontend/src/App.tsx`

```typescript
/admin/stock-requests              // List page
/admin/stock-requests/create       // Create page
/admin/stock-requests/:id          // View page
/admin/stock-requests/:id/edit     // Edit page
```

## Notifications

### When Request is Created
- **Recipients**: All Procurement Officers
- **Title**: "New Stock Request"
- **Message**: "Stock request {request_number} has been submitted by {manager_name} for approval."

### When Request is Approved
- **To Manager**:
  - **Title**: "Stock Request Approved"
  - **Message**: "Your stock request {request_number} has been approved and stock has been added."
- **To Admins**:
  - **Title**: "Stock Request Approved"
  - **Message**: "Stock request {request_number} has been approved by {procurement_officer_name}. Stock has been added to inventory."

### When Request is Rejected
- **Recipients**: Requesting Manager
- **Title**: "Stock Request Rejected"
- **Message**: "Your stock request {request_number} has been rejected. Reason: {rejection_reason}"

## Inventory Integration

### On Approval
When a stock request is approved:
1. Item quantity is increased by requested amount
2. Stock In record is created with:
   - Item ID
   - Supplier ID (if specified)
   - Quantity received = quantity requested
   - Received date = current timestamp
   - Notes = "Stock request {request_number} fulfilled"

### Audit Trail
All stock request operations are logged in the audit logs:
- Request creation
- Request updates
- Status changes (approval/rejection)
- Request deletion

## Security & Validation

### Backend Validation
- Item must exist in database
- Supplier must exist if provided
- Quantity must be positive integer
- Status transitions must be valid
- Role-based access control enforced

### Frontend Validation
- Required fields checked
- Quantity must be greater than 0
- Real-time error display
- Confirmation dialogs for destructive actions

### Authorization Rules
1. Only managers can create requests
2. Managers can only view/edit/delete their own requests
3. Only procurement officers can approve/reject
4. Only pending requests can be edited or deleted
5. Approved/rejected requests are immutable

## UI/UX Features

### Status Badges
- **Pending**: Yellow badge with clock icon
- **Approved**: Green badge with checkmark icon
- **Rejected**: Red badge with X icon
- **Completed**: Blue badge with checkmark icon

### Role-Based Banners
- **Manager**: Blue info banner explaining the request process
- **Procurement Officer**: Green info banner explaining approval responsibilities

### Current Stock Display
When selecting an item, the form shows:
- Item name and code
- Current stock level
- Unit of measurement

### Confirmation Dialogs
- **Approve**: Shows quantity that will be added to inventory
- **Reject**: Requires rejection reason input
- **Delete**: Confirms deletion with request number

## Testing Checklist

### Manager Tests
- [ ] Can create stock request
- [ ] Can view own requests only
- [ ] Can edit own pending requests
- [ ] Cannot edit approved/rejected requests
- [ ] Can delete own pending requests
- [ ] Cannot delete processed requests
- [ ] Cannot view other managers' requests
- [ ] Cannot approve/reject requests
- [ ] Receives notification on approval
- [ ] Receives notification on rejection

### Procurement Officer Tests
- [ ] Can view all requests
- [ ] Can approve pending requests
- [ ] Can reject pending requests with reason
- [ ] Cannot approve/reject already processed requests
- [ ] Can delete any pending request
- [ ] Approval adds stock to inventory
- [ ] Approval creates Stock In record
- [ ] Rejection stores reason
- [ ] Notifications sent correctly

### Admin Tests
- [ ] Can view all requests (read-only)
- [ ] Cannot create requests
- [ ] Cannot edit requests
- [ ] Cannot approve/reject requests
- [ ] Cannot delete requests
- [ ] Receives notification on approval

## Database Schema

```sql
CREATE TABLE stock_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_number VARCHAR(255) UNIQUE NOT NULL,
    item_id BIGINT UNSIGNED NOT NULL,
    supplier_id BIGINT UNSIGNED NULL,
    quantity_requested INT NOT NULL,
    requested_by BIGINT UNSIGNED NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Completed') DEFAULT 'Pending',
    notes TEXT NULL,
    rejection_reason TEXT NULL,
    requested_date TIMESTAMP NOT NULL,
    completed_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE
);
```

## Future Enhancements

### Potential Features
1. **Bulk Requests**: Allow managers to request multiple items at once
2. **Request Templates**: Save common requests as templates
3. **Approval Workflow**: Multi-level approval for high-value requests
4. **Budget Integration**: Check budget availability before approval
5. **Supplier Quotes**: Attach supplier quotes to requests
6. **Delivery Tracking**: Track delivery status after approval
7. **Request History**: View historical trends and patterns
8. **Auto-Approval**: Automatically approve requests below threshold
9. **Email Notifications**: Send email in addition to system notifications
10. **Request Comments**: Allow discussion thread on requests

## Files Modified/Created

### Backend
- ✅ Created: `backend/app/Http/Controllers/Api/V1/StockRequestController.php`
- ✅ Modified: `backend/routes/api.php` (added stock-requests routes)
- ✅ Existing: `backend/app/Models/StockRequest.php`
- ✅ Existing: `backend/app/Http/Controllers/Admin/StockRequestController.php`

### Frontend
- ✅ Modified: `frontend/src/pages/StockRequests.tsx` (added edit button)
- ✅ Existing: `frontend/src/pages/AddStockRequest.tsx`
- ✅ Existing: `frontend/src/pages/ViewStockRequest.tsx`
- ✅ Created: `frontend/src/pages/EditStockRequest.tsx`
- ✅ Modified: `frontend/src/App.tsx` (added routes)
- ✅ Modified: `frontend/src/lib/api.ts` (added updateStockRequest method)

## Status: ✅ COMPLETE

All CRUD operations for Stock Requests are now fully implemented:
- ✅ **Create**: Managers can create stock requests
- ✅ **Read**: Role-based viewing (managers see own, procurement officers see all)
- ✅ **Update**: Managers can edit their own pending requests
- ✅ **Delete**: Managers can delete their own pending requests; procurement officers can delete any pending request
- ✅ **Approve/Reject**: Procurement officers can approve or reject pending requests
- ✅ **Inventory Integration**: Approved requests automatically add stock to inventory
- ✅ **Notifications**: All stakeholders receive appropriate notifications
- ✅ **Audit Trail**: All operations are logged

The Stock Requests feature is production-ready and fully integrated with the existing inventory management system.
