# Sample Notifications with Real Data - Complete ✅

## Overview
Created sample notifications populated with real data from your database (items, purchase orders, requisitions).

## Files Created

### 1. Notification Seeder (`backend/database/seeders/NotificationSeeder.php`)
Database seeder that generates realistic notifications:

**Notification Types:**
1. **Low Stock Alerts** - Based on items where `quantity <= reorder_point`
2. **Critical Stock Alerts** - Items with quantity < 10
3. **Purchase Order Notifications** - Based on recent POs (approved, received, pending)
4. **Requisition Notifications** - Based on recent requisitions (approved, fulfilled, pending)
5. **Stock Expiry Alerts** - Random items approaching expiry
6. **Approval Reminders** - Pending purchase orders
7. **System Updates** - General system notifications

**Features:**
- Uses real item names, quantities, and reorder points
- References actual PO and requisition IDs
- Includes department names
- Targets specific roles or users
- Randomizes read status for realism
- Sets realistic timestamps (5 min to 2 days ago)

### 2. Artisan Command (`backend/app/Console/Commands/GenerateSampleNotifications.php`)
Custom command for easy notification generation:

**Usage:**
```bash
# Generate notifications (keeps existing)
php artisan notifications:generate

# Clear existing and generate fresh
php artisan notifications:generate --clear
```

**Features:**
- More flexible than seeder
- Can be run anytime
- Option to clear existing notifications
- Shows detailed output of what was created
- Uses match expressions for cleaner code

## Notification Examples Generated

### Low Stock Alert
```
Title: Low Stock Alert
Message: Paracetamol is running low. Current stock: 45, Reorder point: 50
Target: All managers
Status: Unread
```

### Critical Stock Level
```
Title: Critical Stock Level
Message: URGENT: Surgical Gloves has only 8 units remaining!
Target: Everyone
Status: Unread
```

### Purchase Order Approved
```
Title: Purchase Order Approved
Message: PO #1234 has been approved. Supplier: MedSupply Co.
Target: Procurement officers
Status: Unread/Read (random)
```

### New Requisition
```
Title: New Requisition
Message: Laboratory requested supplies. Requisition #45 is pending approval.
Target: All managers
Status: Unread
```

### System Update
```
Title: System Update
Message: The inventory system has been updated with new features. Check out the Reports and Audit Logs sections!
Target: Everyone
Status: Unread
```

## How to Use

### Option 1: Run Seeder
```bash
cd backend
php artisan db:seed --class=NotificationSeeder
```

### Option 2: Run Custom Command (Recommended)
```bash
cd backend
php artisan notifications:generate --clear
```

### Option 3: Add to DatabaseSeeder
Add to `backend/database/seeders/DatabaseSeeder.php`:
```php
public function run()
{
    $this->call([
        // ... other seeders
        NotificationSeeder::class,
    ]);
}
```

## Notification Targeting

### By Role (target_role)
- `manager` - All managers see it
- `admin` - All admins see it
- `pharmacist` - All pharmacists see it
- `procurement_officer` - All procurement officers see it
- `null` - Everyone sees it

### By User (user_id)
- Specific user ID - Only that user sees it
- Used for requisition approvals/fulfillments

## Current Database State

After running the command, you should have:
- ✅ 4+ notifications with real data
- ✅ Mix of read and unread statuses
- ✅ Various notification types
- ✅ Realistic timestamps
- ✅ Proper role/user targeting

## Testing the Notifications Page

1. Navigate to `/notifications` in your browser
2. You should see notifications like:
   - Critical stock alerts for items with low quantity
   - Requisition notifications from actual departments
   - System updates
3. Test the features:
   - Filter by All/Unread
   - Mark individual as read
   - Mark all as read
   - Delete notifications
   - Clear all read

## Regenerating Notifications

To get fresh notifications anytime:
```bash
php artisan notifications:generate --clear
```

This will:
1. Clear all existing notifications
2. Query your current database for:
   - Low stock items
   - Recent purchase orders
   - Recent requisitions
3. Generate new notifications based on current data
4. Show summary of what was created

## Notification Icons & Colors

The frontend automatically assigns icons and colors based on title:

| Title Contains | Icon | Color |
|----------------|------|-------|
| "Low Stock" | TrendingDown | Orange |
| "Purchase Order" | ShoppingCart | Blue |
| "Requisition" | ClipboardList | Purple |
| "Approved" | CheckCircle | Green |
| "Stock" | Package | Primary |
| Default | Bell | Primary |

## Next Steps

1. ✅ Notifications are now populated with real data
2. Test the notifications page at `/notifications`
3. Verify filtering, marking as read, and deletion work
4. Consider adding automatic notification generation:
   - When items go below reorder point
   - When POs are approved/received
   - When requisitions are created/approved
   - When stock movements occur

## Status: ✅ COMPLETE
Sample notifications with real data are now available in your database!
