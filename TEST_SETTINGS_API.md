# Test Settings API

## Quick Test Guide

### 1. Test Get Preferences (Should work immediately)

Open your browser console on the frontend and run:

```javascript
// Get your auth token
const token = localStorage.getItem('auth_token');

// Test get preferences
fetch('http://localhost/Smart%20Hospital%20Inventory%20Management%20System%20(SHIMS)/backend/public/api/settings/preferences', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Preferences:', data));
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "theme": "light",
    "language": "en",
    "timezone": "UTC",
    "notifications": {
      "email_notifications": true,
      "push_notifications": true,
      "low_stock_alerts": true,
      "purchase_order_updates": true,
      "requisition_updates": true,
      "system_updates": false
    }
  }
}
```

---

### 2. Test Update Theme

```javascript
const token = localStorage.getItem('auth_token');

fetch('http://localhost/Smart%20Hospital%20Inventory%20Management%20System%20(SHIMS)/backend/public/api/settings/theme', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ theme: 'dark' })
})
.then(r => r.json())
.then(data => console.log('Theme updated:', data));
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Theme updated successfully",
  "data": {
    "theme": "dark"
  }
}
```

---

### 3. Test Update Password

```javascript
const token = localStorage.getItem('auth_token');

fetch('http://localhost/Smart%20Hospital%20Inventory%20Management%20System%20(SHIMS)/backend/public/api/settings/password', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    current_password: 'password123',
    new_password: 'newpassword123',
    confirm_password: 'newpassword123'
  })
})
.then(r => r.json())
.then(data => console.log('Password updated:', data));
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Expected Response (Wrong Current Password):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### 4. Test Update Notifications

```javascript
const token = localStorage.getItem('auth_token');

fetch('http://localhost/Smart%20Hospital%20Inventory%20Management%20System%20(SHIMS)/backend/public/api/settings/notifications', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email_notifications: true,
    push_notifications: false,
    low_stock_alerts: true,
    purchase_order_updates: true,
    requisition_updates: false,
    system_updates: false
  })
})
.then(r => r.json())
.then(data => console.log('Notifications updated:', data));
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Notification preferences updated successfully",
  "data": {
    "email_notifications": true,
    "push_notifications": false,
    "low_stock_alerts": true,
    "purchase_order_updates": true,
    "requisition_updates": false,
    "system_updates": false
  }
}
```

---

## Testing in the UI

### 1. Test Theme Switcher
1. Login to the app
2. Click on user avatar → Settings
3. Go to General tab
4. Click "Dark" button
5. Should see: "Theme changed to dark mode" success message
6. Refresh page
7. Click "Get Preferences" in console to verify it saved

### 2. Test Password Change
1. Go to Settings → Security tab
2. Enter current password: `password123`
3. Enter new password: `testpass123`
4. Confirm new password: `testpass123`
5. Click "Update Password"
6. Should see: "Password updated successfully"
7. Logout and login with new password to verify

### 3. Test Notification Settings
1. Go to Settings → Notifications tab
2. Toggle some switches on/off
3. Click "Save Notification Settings"
4. Should see: "Notification settings saved successfully!"
5. Refresh page
6. Verify toggles are in the same state

---

## Verify Database Changes

### Check preferences column:

```sql
SELECT id, name, email, preferences FROM users WHERE email = 'superadmin@hims.com';
```

**Expected Result:**
```
+----+-------------+------------------------+--------------------------------------------------+
| id | name        | email                  | preferences                                      |
+----+-------------+------------------------+--------------------------------------------------+
|  1 | Super Admin | superadmin@hims.com    | {"theme":"dark","notifications":{...}}           |
+----+-------------+------------------------+--------------------------------------------------+
```

---

## Common Issues & Solutions

### Issue: "Unauthenticated" error
**Solution:** Make sure you're logged in and have a valid token in localStorage

### Issue: "preferences column not found"
**Solution:** Run the migration:
```bash
cd backend
php artisan migrate
```

### Issue: Theme doesn't persist after refresh
**Solution:** Check if the API call is successful and preferences are being loaded on mount

### Issue: Password change fails
**Solution:** 
- Verify current password is correct
- Check password meets minimum 8 characters
- Verify passwords match

---

## Success Indicators

✅ Get preferences returns default values
✅ Theme change shows success message
✅ Theme persists after page refresh
✅ Password change works with correct current password
✅ Password change fails with wrong current password
✅ Notification settings save and persist
✅ Loading spinner shows while fetching
✅ Error messages display for failures
✅ Success messages auto-dismiss after 3 seconds

---

## All Working? 🎉

If all tests pass, the Settings page is fully functional!

You can now:
- ✅ Change your password
- ✅ Switch between light/dark theme
- ✅ Configure notification preferences
- ✅ All settings persist in database
- ✅ All settings load on page refresh
