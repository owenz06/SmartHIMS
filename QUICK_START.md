# 🚀 SHIMS Quick Start Guide

## 📱 What You Have Now

✅ Hospital Inventory Management System (SHIMS)
✅ **Backend**: Laravel 11 (PHP) with PostgreSQL
✅ **Frontend**: React + TypeScript + Vite
✅ **Database**: PostgreSQL (free tier friendly!)
✅ **Authentication**: Sanctum (token-based)
✅ **Ready to Deploy**: Render, Railway, or Vercel

---

## 🎯 5-Minute Local Setup

### Prerequisites
- PHP 8.2+ with PostgreSQL extension
- Node.js 18+
- PostgreSQL 14+ OR Docker

### Quick Start (Docker - Easiest)

```bash
# 1. Start PostgreSQL
docker run --name shims-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=SHIMS \
  -p 5432:5432 -d postgres:16

# 2. Setup Backend
cd backend
cp .env.example .env
# Edit .env: Set DB_PASSWORD=password
php artisan migrate:fresh --seed
php artisan serve

# 3. Setup Frontend (new terminal)
cd frontend
npm install
npm run dev

# 4. Open browser
# http://localhost:3000/login
# admin@example.com / password
```

---

## ☁️ 10-Minute Cloud Deployment

### Option 1: Render (Recommended)

**1. Create Database**
- Go to https://dashboard.render.com/
- New → PostgreSQL (Free tier)
- Copy Internal Database URL

**2. Deploy Backend**
- New → Web Service
- Connect GitHub repo: `owenz06/SmartHIMS`
- Root: `backend`
- Build: `composer install --no-dev --optimize-autoloader`
- Start: `php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT`
- Add Environment Variables (see below)

**3. Deploy Frontend**
- New → Static Site  
- Root: `frontend`
- Build: `npm install && npm run build`
- Publish: `dist`
- Environment: `VITE_API_URL=https://your-backend.onrender.com`

**Backend Environment Variables:**
```env
APP_KEY=base64:+eIEcrPaWGeYBXzEvZZW4+fimJphNONWygulbWxPPyc=
APP_ENV=production
APP_DEBUG=false
DATABASE_URL=<paste-internal-database-url>
DB_CONNECTION=pgsql
DB_SSLMODE=require
SESSION_DRIVER=database
CACHE_STORE=database
FRONTEND_URL=https://your-frontend.onrender.com
SANCTUM_STATEFUL_DOMAINS=your-frontend.onrender.com
```

**Done! 🎉** Access at: `https://your-frontend.onrender.com`

### Option 2: Railway (Faster)

**1. Create Project**
- Go to https://railway.app/
- New Project → Deploy from GitHub
- Select: `owenz06/SmartHIMS`

**2. Add Database**
- New → Database → PostgreSQL
- (Auto-configured!)

**3. Configure Backend**
- Variables tab:
```env
APP_KEY=base64:+eIEcrPaWGeYBXzEvZZW4+fimJphNONWygulbWxPPyc=
APP_ENV=production
DB_CONNECTION=pgsql
SESSION_DRIVER=database
```

**4. Deploy Frontend**
- New service from same repo
- Root: `frontend`
- Environment: `VITE_API_URL=https://your-backend.railway.app`

**Done! 🎉**

---

## 👥 Default Users

After seeding, use these to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Manager | manager@example.com | password |
| Pharmacist | pharmacist@example.com | password |
| Staff | staff@example.com | password |

---

## 🛠️ Common Commands

### Backend

```bash
# Run migrations
php artisan migrate

# Fresh migration + seed
php artisan migrate:fresh --seed

# Create admin user
php artisan tinker
User::factory()->create(['email' => 'me@example.com', 'role' => 'admin'])

# Clear caches
php artisan optimize:clear

# View routes
php artisan route:list
```

### Frontend

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

---

## 📂 Project Structure

```
Smart HIMS/
├── backend/               # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/V1/  # API Controllers
│   │   ├── Models/                    # Eloquent Models
│   │   └── Helpers/                   # Utility Helpers
│   ├── database/
│   │   ├── migrations/                # Database Schema
│   │   └── seeders/                   # Sample Data
│   ├── routes/
│   │   └── api.php                    # API Routes
│   └── .env                           # Environment Config
│
├── frontend/              # React App
│   ├── src/
│   │   ├── components/                # Reusable Components
│   │   ├── pages/                     # Page Components
│   │   ├── contexts/                  # React Contexts
│   │   ├── lib/                       # API Client & Utils
│   │   └── App.tsx                    # Main App Component
│   ├── .env                           # Frontend Config
│   └── vite.config.ts                 # Vite Config
│
└── docs/                  # Documentation
    ├── QUICK_START.md                 # This file!
    ├── POSTGRESQL_DEPLOYMENT_QUICK_START.md
    └── MYSQL_TO_POSTGRESQL_MIGRATION.md
```

---

## 🔗 Important URLs

### Local Development
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Backend Health: http://localhost:8000/api/user (returns 401)

### Documentation Files
- **This Guide**: `QUICK_START.md`
- **Full Deployment Guide**: `POSTGRESQL_DEPLOYMENT_QUICK_START.md`
- **Migration Guide**: `MYSQL_TO_POSTGRESQL_MIGRATION.md`
- **Migration Summary**: `MIGRATION_SUMMARY.md`
- **Network Error Fix**: `NETWORK_ERROR_FIX.md`
- **Render TypeScript Fix**: `RENDER_DEPLOYMENT_FIX.md`

---

## 🎨 Key Features

### ✅ Implemented
- 🔐 User Authentication & Authorization
- 👥 Role-based Access (Admin, Manager, Pharmacist, Staff)
- 📦 Inventory Management (Items, Categories, Stock)
- 🏪 Supplier Management
- 📝 Purchase Orders & Requisitions
- 📊 Dashboard with Analytics
- 📈 Predictive Analysis (demand forecasting)
- 💬 Internal Messaging System
- 🔔 Notifications
- 📋 Audit Logs
- 📄 Reports & Export (CSV/PDF)
- 🎨 Dark/Light Mode
- 📱 Responsive Design

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check PHP version
php -v  # Should be 8.2+

# Check extensions
php -m | grep pgsql

# Check database connection
php artisan tinker
DB::connection()->getPdo();

# Check environment
php artisan about
```

### Frontend won't build

```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check Node version
node -v  # Should be 18+

# Type check
npm run type-check
```

### Database connection errors

```bash
# Check PostgreSQL is running
docker ps  # If using Docker
# or
pg_isready  # If native install

# Test connection
psql -U postgres -d SHIMS

# Check .env settings
cat backend/.env | grep DB_
```

### CORS errors

```bash
# Check backend .env
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000

# Check frontend .env
VITE_API_URL=http://localhost:8000
```

---

## 📞 Getting Help

### Check Documentation
1. `QUICK_START.md` (this file) - Basic setup
2. `POSTGRESQL_DEPLOYMENT_QUICK_START.md` - Cloud deployment
3. `MYSQL_TO_POSTGRESQL_MIGRATION.md` - Detailed migration guide
4. `MIGRATION_SUMMARY.md` - What changed

### Debug Steps
1. Check logs (platform dashboard or `storage/logs/laravel.log`)
2. Verify environment variables
3. Test database connection
4. Check API endpoint manually (curl/Postman)
5. Check browser console for frontend errors

### Platform Documentation
- **Render**: https://render.com/docs
- **Railway**: https://docs.railway.app/
- **Vercel**: https://vercel.com/docs
- **Laravel**: https://laravel.com/docs
- **Vite**: https://vitejs.dev/

---

## 🎓 Next Steps

After getting the app running:

### 1. Customize
- Update branding in `.env` files
- Modify colors in `frontend/src/index.css`
- Add your logo/images

### 2. Configure
- Set up real email (SMTP settings)
- Configure proper SSL certificates
- Set up custom domain

### 3. Secure
- Change `APP_KEY` in production
- Update default passwords
- Enable 2FA for admins
- Review CORS settings

### 4. Optimize
- Enable Redis caching
- Set up queue workers
- Configure CDN for frontend
- Optimize database queries

### 5. Monitor
- Set up error tracking (Sentry)
- Enable application monitoring
- Set up database backups
- Configure uptime monitoring

---

## 💡 Tips

- **Use Docker** for local development - no PostgreSQL installation needed!
- **Railway + Vercel** combo gives best performance
- **Render** is easiest for beginners
- Check logs first when debugging
- Environment variables are the most common issue
- Test locally before deploying
- Keep `APP_DEBUG=false` in production
- Use `.env.example` as template for new environments

---

## 📊 Performance Tips

### Backend
- Enable OPcache in production
- Use Redis for cache/sessions (when available)
- Enable query caching
- Use eager loading for relationships
- Index database columns properly

### Frontend
- Enable gzip compression
- Use lazy loading for routes
- Optimize images
- Minimize bundle size
- Use CDN for assets

### Database
- Add indexes on frequently queried columns
- Use database connection pooling
- Regular VACUUM on PostgreSQL
- Monitor slow queries
- Keep database updated

---

**Status**: ✅ Ready to Deploy!

**GitHub**: https://github.com/owenz06/SmartHIMS
**Latest Commit**: PostgreSQL migration complete
**Database**: PostgreSQL (free tier friendly!)

**Enjoy building with SHIMS! 🏥✨**
