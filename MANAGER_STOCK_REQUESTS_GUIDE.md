# Manager's Guide to Stock Requests

## Quick Overview
Stock Requests allow you as a Manager to formally request inventory items from the Procurement team. This ensures proper tracking and approval workflows for inventory replenishment.

## How to Use Stock Requests

### 1. Creating a New Request

**Steps:**
1. Navigate to **Stock Requests** from the sidebar
2. Click the **"New Request"** button (top right)
3. Fill out the form:
   - **Item**: Select the item you need from the dropdown
     - You'll see the current stock level for reference
   - **Quantity Requested**: Enter how many units you need
   - **Preferred Supplier** (Optional): Suggest a supplier if you have a preference
   - **Notes** (Optional): Add any additional information or special requirements
4. Click **"Submit Request"**
5. Your request is created with status "Pending"
6. Procurement Officers are automatically notified

**Example:**
```
Item: Paracetamol 500mg (Current Stock: 50 tablets)
Quantity: 1000 tablets
Supplier: PharmaCorp Ltd (optional)
Notes: Urgent - running low on stock
```

### 2. Viewing Your Requests

**Steps:**
1. Navigate to **Stock Requests**
2. You'll see a list of all YOUR requests (you can't see other managers' requests)
3. Use the search bar to find specific requests by:
   - Request number (e.g., SR-20260428-1234)
   - Item name
4. Filter by status:
   - **All**: Show all your requests
   - **Pending**: Awaiting approval
   - **Approved**: Approved and stock added
   - **Rejected**: Rejected by procurement

**Request Information Displayed:**
- Request number
- Item name and code
- Quantity requested
- Date submitted
- Current status (with colored badge)

### 3. Editing a Pending Request

**When You Can Edit:**
- ✅ Only YOUR OWN requests
- ✅ Only requests with "Pending" status
- ❌ Cannot edit approved or rejected requests

**Steps:**
1. Find your pending request in the list
2. Click the **Edit** button (pencil icon)
3. Modify any field:
   - Change the item
   - Adjust the quantity
   - Update the supplier preference
   - Modify the notes
4. Click **"Save Changes"**
5. Your request is updated but remains "Pending"

**Why Edit?**
- You realized you need a different quantity
- You want to change the item
- You need to add more information in the notes
- You want to suggest a different supplier

### 4. Viewing Request Details

**Steps:**
1. Click the **View** button (eye icon) on any request
2. You'll see complete details:
   - Request number and status
   - Item information (name, code, quantity)
   - Your information (name, email, date submitted)
   - Preferred supplier (if you specified one)
   - Notes (if you added any)
   - Rejection reason (if it was rejected)

### 5. Deleting a Request

**When You Can Delete:**
- ✅ Only YOUR OWN requests
- ✅ Only requests with "Pending" status
- ❌ Cannot delete approved or rejected requests

**Steps:**
1. Find your pending request in the list
2. Click the **Delete** button (trash icon)
3. Confirm deletion in the dialog
4. Request is permanently removed

**When to Delete:**
- You no longer need the item
- You created a duplicate request by mistake
- You want to create a new request with different details

## Request Status Explained

### 🟡 Pending
- Your request is waiting for Procurement Officer review
- You can still **edit** or **delete** it
- Procurement Officers can see it in their queue

### 🟢 Approved
- Procurement Officer has approved your request
- Stock has been **automatically added** to inventory
- You'll receive a notification
- Request is now **locked** (cannot edit or delete)

### 🔴 Rejected
- Procurement Officer has rejected your request
- You'll receive a notification with the **reason**
- Request is now **locked** (cannot edit or delete)
- You can create a new request if needed

### 🔵 Completed
- Request has been fully processed and fulfilled
- Stock has been added to inventory
- Request is now **locked** (cannot edit or delete)

## Notifications

You'll receive notifications for:
- ✅ **Request Approved**: "Your stock request SR-XXXXX has been approved and stock has been added."
- ❌ **Request Rejected**: "Your stock request SR-XXXXX has been rejected. Reason: [reason provided]"

Check the **Notifications** icon in the header to see your notifications.

## Tips & Best Practices

### ✅ Do's
- **Check current stock** before requesting - it's shown when you select an item
- **Be specific in notes** - explain why you need the item or any urgency
- **Suggest a supplier** if you know a reliable one
- **Review before submitting** - make sure quantity and item are correct
- **Edit if needed** - you can modify pending requests if you made a mistake
- **Monitor status** - check back to see if your request was approved

### ❌ Don'ts
- **Don't create duplicate requests** - edit the existing one instead
- **Don't request unrealistic quantities** - be reasonable
- **Don't leave notes empty** for urgent requests - explain the urgency
- **Don't try to edit approved requests** - they're locked for audit purposes

## Common Scenarios

### Scenario 1: Running Low on Stock
```
Problem: Paracetamol stock is at 50 tablets, need more
Solution:
1. Create request for 1000 tablets
2. Add note: "Current stock critically low - urgent replenishment needed"
3. Submit and wait for approval
```

### Scenario 2: Made a Mistake
```
Problem: Requested 100 units but meant 1000
Solution:
1. Find the pending request
2. Click Edit
3. Change quantity from 100 to 1000
4. Save changes
```

### Scenario 3: Request Rejected
```
Problem: Your request was rejected
Solution:
1. View the request to see rejection reason
2. Address the concerns mentioned
3. Create a new request with corrections
4. Add notes explaining how you addressed the concerns
```

### Scenario 4: No Longer Need Item
```
Problem: Created request but no longer need it
Solution:
1. Find the pending request
2. Click Delete
3. Confirm deletion
```

## Workflow Timeline

```
You Create Request
    ↓
Status: Pending (you can edit/delete)
    ↓
Procurement Officer Reviews
    ↓
    ├─→ Approved
    │   ├─→ Stock added to inventory automatically
    │   ├─→ You receive notification
    │   └─→ Status: Approved (locked)
    │
    └─→ Rejected
        ├─→ Reason provided
        ├─→ You receive notification
        └─→ Status: Rejected (locked)
```

## Frequently Asked Questions

**Q: How long does approval take?**
A: It depends on the Procurement Officer's workload. They receive a notification immediately when you submit.

**Q: Can I see other managers' requests?**
A: No, you can only see your own requests for privacy and security.

**Q: What happens if my request is approved?**
A: The stock is automatically added to the inventory. You'll receive a notification and can verify in the Inventory page.

**Q: Can I cancel an approved request?**
A: No, approved requests are locked. If there's an issue, contact the Procurement Officer directly.

**Q: Why was my request rejected?**
A: Check the rejection reason in the request details. Common reasons include:
- Budget constraints
- Item not available from suppliers
- Quantity too high
- Duplicate request
- Better alternative available

**Q: Can I request multiple items at once?**
A: Currently, each request is for one item. Create separate requests for different items.

**Q: What if I need an item urgently?**
A: Add "URGENT" in the notes and explain why. You can also message the Procurement Officer directly.

**Q: Can I track delivery after approval?**
A: Once approved, the stock is added to inventory. Check the Stock In page for delivery records.

## Need Help?

- **Technical Issues**: Contact System Admin
- **Request Questions**: Message Procurement Officer
- **Urgent Needs**: Use the Messages feature to contact Procurement Officer directly
- **Training**: Check Help & Support → User Guide

## Summary

Stock Requests provide a formal, trackable way to request inventory items:
- ✅ Easy to create with guided form
- ✅ Edit pending requests if you make mistakes
- ✅ Track status in real-time
- ✅ Automatic inventory updates on approval
- ✅ Clear audit trail for all requests
- ✅ Notifications keep you informed

**Remember**: Only pending requests can be edited or deleted. Once approved or rejected, requests are locked for audit purposes.
