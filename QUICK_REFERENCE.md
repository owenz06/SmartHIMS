# 🚀 Quick Reference - Hospital Inventory System

## Start Servers

### Backend
```bash
cd backend
php artisan serve
```
**URL:** http://127.0.0.1:8000

### Frontend
```bash
cd frontend
npm run dev
```
**URL:** http://localhost:3000

## Test Login

**URL:** http://localhost:3000

**Credentials:**
- Email: `superadmin@hims.com`
- Password: `password123`

## Quick Test

1. Open http://localhost:3000
2. Login with credentials above
3. Should see dashboard with statistics
4. Check browser console (F12) - no errors
5. Click logout - should return to login

## File Locations

### Frontend
- **Login Page:** `frontend/src/pages/Login.tsx`
- **Dashboard:** `frontend/src/pages/Dashboard.tsx`
- **API Client:** `frontend/src/lib/api.ts`
- **Auth Context:** `frontend/src/contexts/AuthContext.tsx`
- **Routes:** `frontend/src/App.tsx`
- **Config:** `frontend/.env`

### Backend
- **API Routes:** `backend/routes/api.php`
- **Auth Controller:** `backend/app/Http/Controllers/Api/V1/AuthController.php`
- **Dashboard Controller:** `backend/app/Http/Controllers/Api/V1/DashboardController.php`
- **CORS Config:** `backend/config/cors.php`
- **Config:** `backend/.env`

## API Endpoints

### Authentication
```
POST   /api/login          - Login (public)
POST   /api/logout         - Logout (protected)
GET    /api/user           - Get user (protected)
```

### Dashboard
```
GET    /api/dashboard/stats   - Get statistics (protected)
GET    /api/dashboard/charts  - Get charts (protected)
```

### Inventory
```
GET    /api/items          - List items (protected)
POST   /api/items          - Create item (protected)
GET    /api/items/{id}     - Get item (protected)
PUT    /api/items/{id}     - Update item (protected)
DELETE /api/items/{id}     - Delete item (protected)
```

## Troubleshooting

### Login page blank?
- Check if frontend server is running
- Check browser console for errors
- Verify http://localhost:3000 is accessible

### CORS error?
- Check `backend/.env` has `FRONTEND_URL=http://localhost:3000`
- Restart backend server
- Clear browser cache

### 401 Unauthorized?
- Verify credentials are correct
- Check if backend server is running
- Check `backend/routes/api.php` has login route

### Dashboard not loading?
- Check if token is in localStorage (F12 → Application)
- Check Network tab for API call errors
- Verify backend server is running

## Test Accounts

| Email | Password | Role |
|-------|----------|------|
| superadmin@hims.com | password123 | Super Admin |
| admin@hims.com | password123 | Admin |
| manager@hims.com | password123 | Manager |
| pharmacist@hims.com | password123 | Pharmacist |
| procurement@hims.com | password123 | Procurement |

## Documentation

- **Setup Guide:** `SETUP_AND_TEST_GUIDE.md`
- **API Testing:** `TEST_API.md`
- **Completion Report:** `ROUTING_UPDATE_COMPLETE.md`
- **This File:** `QUICK_REFERENCE.md`

---

**Last Updated:** April 25, 2026
