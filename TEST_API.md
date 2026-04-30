# API Testing Guide

## Quick API Tests

### 1. Test Backend Health
```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "success": true,
  "message": "Hospital Inventory Management System API",
  "version": "1.0.0",
  "endpoints": {
    "api": "http://localhost:8000/api",
    "documentation": "See README.md for API documentation"
  }
}
```

### 2. Test Login Endpoint
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"superadmin@hims.com","password":"password123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "1|xxxxxxxxxxxxxxxxxxxxx",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "superadmin@hims.com",
      "role": "super_admin",
      ...
    }
  }
}
```

### 3. Test Dashboard Stats (with token)
First, get your token from the login response above, then:

```bash
curl http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "inventory": {
      "total_items": 0,
      "low_stock_items": 0,
      "out_of_stock_items": 0,
      "total_value": 0
    },
    "purchase_orders": {
      "total": 0,
      "pending": 0,
      "approved": 0,
      "received": 0
    },
    "requisitions": {
      "total": 0,
      "pending": 0,
      "approved": 0,
      "fulfilled": 0
    },
    "users": {
      "total": 5,
      "active": 5,
      "by_role": {...}
    }
  }
}
```

### 4. Test User Endpoint (with token)
```bash
curl http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Super Admin",
    "email": "superadmin@hims.com",
    "role": "super_admin",
    ...
  }
}
```

## Available Test Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Super Admin | superadmin@hims.com | password123 | Full system access |
| Admin | admin@hims.com | password123 | Administrative access |
| Manager | manager@hims.com | password123 | Store management |
| Pharmacist | pharmacist@hims.com | password123 | Pharmacy operations |
| Procurement | procurement@hims.com | password123 | Procurement operations |

## Testing Checklist

- [ ] Backend server is running (http://localhost:8000)
- [ ] Frontend server is running (http://localhost:3000)
- [ ] Health check endpoint returns success
- [ ] Login endpoint returns token
- [ ] Dashboard stats endpoint returns data (with token)
- [ ] User endpoint returns user data (with token)
- [ ] Frontend login page loads
- [ ] Frontend login works with test credentials
- [ ] Frontend dashboard loads after login
- [ ] Frontend shows correct user name
- [ ] Frontend displays dashboard statistics
- [ ] Logout works and redirects to login
- [ ] No CORS errors in browser console
- [ ] Token is stored in localStorage
- [ ] Protected routes redirect to login when not authenticated

## Common Issues and Solutions

### Issue: "Connection refused"
**Cause:** Backend server is not running
**Solution:** Run `cd backend && php artisan serve`

### Issue: "CORS error"
**Cause:** CORS not configured properly
**Solution:** 
1. Check `backend/.env` has `FRONTEND_URL=http://localhost:3000`
2. Check `backend/config/cors.php` includes localhost:3000
3. Restart backend server

### Issue: "401 Unauthorized"
**Cause:** Invalid credentials or token
**Solution:**
1. Verify email and password are correct
2. Check token is being sent in Authorization header
3. Verify token hasn't expired

### Issue: "404 Not Found"
**Cause:** Route doesn't exist
**Solution:**
1. Check `backend/routes/api.php` for available routes
2. Verify URL is correct (should start with /api/)
3. Check HTTP method (GET, POST, etc.)

### Issue: "500 Internal Server Error"
**Cause:** Backend error
**Solution:**
1. Check `backend/storage/logs/laravel.log` for errors
2. Verify database connection
3. Check if migrations are run
4. Verify controller methods exist

## Browser Testing

### Using Browser DevTools

1. Open http://localhost:3000
2. Open DevTools (F12)
3. Go to Network tab
4. Try logging in
5. Check the requests:
   - POST to `/api/login` should return 200
   - Response should contain token
6. After login, check:
   - GET to `/api/dashboard/stats` should return 200
   - Request should have Authorization header
7. Check Application tab → Local Storage:
   - Should have `auth_token` key
   - Should have `auth_user` key

### Console Testing

Open browser console and run:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('auth_token'));

// Check if user exists
console.log('User:', JSON.parse(localStorage.getItem('auth_user')));

// Test API call
fetch('http://localhost:8000/api/user', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Accept': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('User data:', data));
```

---

**Last Updated:** April 25, 2026
