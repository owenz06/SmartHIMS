# Setup and Test Guide - Separated Frontend/Backend Architecture

## ✅ Current Status

Your Hospital Inventory Management System has been successfully separated into:
- **Frontend**: React SPA in `frontend/` folder (running on http://localhost:3000)
- **Backend**: Laravel API in `backend/` folder (running on http://localhost:8000)

## 📋 Configuration Checklist

### Backend Configuration ✅
- [x] `.env` file updated with:
  - `APP_URL=http://localhost:8000`
  - `FRONTEND_URL=http://localhost:3000`
  - `SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000`
- [x] CORS configured in `backend/config/cors.php`
- [x] API routes configured in `backend/routes/api.php`
- [x] Authentication controller ready (`AuthController.php`)
- [x] Dashboard controller ready (`DashboardController.php`)
- [x] Database connected and migrations run
- [x] Users exist in database

### Frontend Configuration ✅
- [x] `.env` file with `VITE_API_URL=http://localhost:8000`
- [x] API client with auto-detection (`frontend/src/lib/api.ts`)
- [x] Auth context configured (`frontend/src/contexts/AuthContext.tsx`)
- [x] React Router configured (`frontend/src/App.tsx`)
- [x] Login page created (`frontend/src/pages/Login.tsx`)
- [x] Dashboard page created (`frontend/src/pages/Dashboard.tsx`)

## 🚀 How to Start the System

### 1. Start Backend Server
```bash
cd backend
php artisan serve
```
Backend will run at: http://localhost:8000

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run at: http://localhost:3000

## 🧪 Testing the System

### Step 1: Access the Frontend
Open your browser and go to: http://localhost:3000

You should see the login page.

### Step 2: Test Login
Use one of these credentials (based on your database):

**Primary Test Account:**
- Email: `superadmin@hims.com`
- Password: `password123`

**Alternative Accounts (if available):**
- Super Admin: `superadmin@hospital.com` / `password123`
- Admin: `admin@hospital.com` / `password123`
- Manager: `manager@hospital.com` / `password123`
- Procurement: `procurement@hospital.com` / `password123`
- Pharmacist: `pharmacist@hospital.com` / `password123`

### Step 3: Verify Dashboard Loads
After successful login, you should:
1. Be redirected to `/dashboard`
2. See your name in the header
3. See dashboard statistics (inventory, purchase orders, requisitions)
4. See a logout button

### Step 4: Check Browser Console
Open browser DevTools (F12) and check:
- **Console tab**: Should have no errors
- **Network tab**: 
  - POST to `/api/login` should return 200 with token
  - GET to `/api/dashboard/stats` should return 200 with data

## 🔍 Troubleshooting

### Issue: Login page is blank
**Solution:**
1. Check if frontend server is running: http://localhost:3000
2. Check browser console for errors
3. Verify `frontend/src/main.tsx` is importing and rendering App correctly

### Issue: "Network Error" or CORS error
**Solution:**
1. Verify backend is running: http://localhost:8000
2. Check `backend/.env` has correct FRONTEND_URL
3. Check `backend/config/cors.php` includes localhost:3000
4. Restart backend server after .env changes

### Issue: "401 Unauthorized" on login
**Solution:**
1. Verify user exists in database:
   ```bash
   cd backend
   php artisan tinker
   >>> User::where('email', 'superadmin@hims.com')->first()
   ```
2. Check password is correct
3. Verify `backend/routes/api.php` has `/login` route

### Issue: Dashboard shows "Failed to Load Dashboard"
**Solution:**
1. Check if token is stored: Open DevTools → Application → Local Storage → Check for `auth_token`
2. Verify API endpoint: http://localhost:8000/api/dashboard/stats
3. Check backend logs for errors
4. Verify `DashboardController.php` exists and has `stats()` method

### Issue: Token not being sent with requests
**Solution:**
1. Check `frontend/src/lib/api.ts` interceptor is adding Authorization header
2. Verify token is in localStorage
3. Check Network tab to see if Authorization header is present

## 📊 API Endpoints

### Authentication
- `POST /api/login` - Login and get token
- `POST /api/logout` - Logout (requires auth)
- `GET /api/user` - Get authenticated user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts` - Get chart data

### Inventory
- `GET /api/items` - List all items
- `POST /api/items` - Create item
- `GET /api/items/{id}` - Get single item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item

### Purchase Orders
- `GET /api/purchase-orders` - List purchase orders
- `POST /api/purchase-orders` - Create purchase order
- `POST /api/purchase-orders/{id}/approve` - Approve purchase order

### Requisitions
- `GET /api/requisitions` - List requisitions
- `POST /api/requisitions` - Create requisition
- `POST /api/requisitions/{id}/approve` - Approve requisition

## 🌐 Deployment Configuration

### For Railway
**Backend:**
- Set environment variable: `APP_URL=https://your-backend.railway.app`
- Set environment variable: `FRONTEND_URL=https://your-frontend.railway.app`
- Set environment variable: `SANCTUM_STATEFUL_DOMAINS=your-frontend.railway.app`

**Frontend:**
- Set environment variable: `VITE_API_URL=https://your-backend.railway.app`
- Or leave empty to use auto-detection

### For Render
**Backend:**
- Set environment variable: `APP_URL=https://your-backend.onrender.com`
- Set environment variable: `FRONTEND_URL=https://your-frontend.onrender.com`
- Set environment variable: `SANCTUM_STATEFUL_DOMAINS=your-frontend.onrender.com`

**Frontend:**
- Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`
- Or leave empty to use auto-detection

## 📝 Next Steps

1. **Test the complete login flow** (see Testing section above)
2. **Verify all API endpoints work** by testing each feature
3. **Check for CORS errors** in browser console
4. **Test logout functionality**
5. **Implement remaining pages** (Inventory, Purchase Orders, Requisitions, etc.)
6. **Add error boundaries** for better error handling
7. **Implement loading states** for better UX
8. **Add form validation** on frontend
9. **Set up production environment variables** for deployment
10. **Configure CI/CD pipeline** for automated deployment

## 🎯 Success Criteria

Your system is working correctly if:
- ✅ Frontend loads at http://localhost:3000
- ✅ Backend API responds at http://localhost:8000/api
- ✅ Login page displays correctly
- ✅ Login with valid credentials succeeds
- ✅ Token is stored in localStorage
- ✅ Dashboard loads with statistics
- ✅ No CORS errors in console
- ✅ Logout works and redirects to login
- ✅ Protected routes redirect to login when not authenticated
- ✅ Public routes redirect to dashboard when authenticated

## 📞 Support

If you encounter any issues:
1. Check the Troubleshooting section above
2. Review browser console for errors
3. Check backend logs: `backend/storage/logs/laravel.log`
4. Verify all environment variables are set correctly
5. Ensure both servers are running

---

**Last Updated:** April 25, 2026
**System Version:** 1.0.0
**Architecture:** Separated Frontend (React) + Backend (Laravel API)
