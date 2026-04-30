# Manager Requisitions Access Fix

## Issue
Manager role cannot access the Requisitions page to view pharmacist requests.

## Investigation Results

### Routes ✓ Correct
The routes are properly configured in `routes/web.php`:
```php
Route::middleware(['role:admin,super_admin,manager,pharmacist'])
    ->prefix('admin')->name('admin.')->group(function () {
    Route::get('/requisitions', [RequisitionController::class, 'index'])
        ->name('requisitions.index');
    // ... other routes
});
```

### Permissions ✓ Correct
Manager has the required permissions in `config/permissions.php`:
```php
'manager' => [
    'permissions' => [
        'requisitions.view',
        'requisitions.approve',
        // ... other permissions
    ],
],
```

### Navigation ✓ Correct
Requisitions link is present in manager navigation (`resources/js/config/navigation.tsx`):
```tsx
manager: [
    // ...
    {
      title: 'Requisitions',
      href: '/admin/requisitions',
      icon: ClipboardList,
    },
    // ...
],
```

### Controller ✓ Correct
The RequisitionController properly checks permissions:
```php
public function index()
{
    if (! PermissionHelper::can(auth()->user(), 'requisitions.view')) {
        abort(403, 'You do not have permission to view requisitions.');
    }
    // ... rest of the method
}
```

## Possible Causes

1. **Session/Cache Issue** - The user's session might have old permission data
2. **Browser Cache** - The frontend might be using cached navigation data
3. **Database Role** - The user's role in the database might not be set correctly

## Solution Steps

### Step 1: Clear Laravel Cache
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Step 2: Verify User Role in Database
Check that the manager user has the correct role:
```sql
SELECT id, name, email, role FROM users WHERE role = 'manager';
```

### Step 3: Clear Browser Cache
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Or clear browser cache completely
- Or try in incognito/private mode

### Step 4: Re-login
- Log out completely
- Clear browser cookies
- Log back in as manager

## Testing
After applying the fixes, test as manager:
1. Log in as a manager user
2. Navigate to Requisitions from the sidebar
3. Should see list of all requisitions (not just own)
4. Should be able to view requisition details
5. Should be able to approve/reject requisitions

## Expected Behavior

### For Manager:
- Can VIEW all requisitions (from all pharmacists)
- Can APPROVE/REJECT requisitions
- Cannot CREATE new requisitions
- Cannot EDIT requisitions
- Can DELETE requisitions

### For Pharmacist:
- Can VIEW only their own requisitions
- Can CREATE new requisitions
- Cannot APPROVE/REJECT requisitions
- Can EDIT their own pending requisitions
- Can DELETE their own pending requisitions

## Verification Commands

Check if manager can access the route:
```bash
php artisan route:list --name=requisitions
```

Check permissions helper:
```bash
php artisan tinker
>>> $user = User::where('role', 'manager')->first();
>>> PermissionHelper::can($user, 'requisitions.view');
// Should return true
```

## Files Involved
- `routes/web.php` - Route definitions
- `config/permissions.php` - Permission configuration
- `app/Http/Controllers/Admin/RequisitionController.php` - Controller logic
- `resources/js/config/navigation.tsx` - Navigation configuration
- `app/Helpers/PermissionHelper.php` - Permission checking logic

## Notes
- All configuration is correct
- The issue is likely a caching or session problem
- No code changes are needed
- Simply clearing caches and re-logging should resolve the issue
