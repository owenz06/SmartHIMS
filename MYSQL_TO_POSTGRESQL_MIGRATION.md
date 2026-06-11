# MySQL to PostgreSQL Migration Guide

## ✅ What's Been Done

### 1. Environment Configuration Updated
- ✅ `backend/.env` - Updated to use PostgreSQL
- ✅ `backend/.env.example` - Updated to use PostgreSQL
- ✅ `backend/.env.production` - Updated to use PostgreSQL

### 2. Database Configuration
The `backend/config/database.php` already has PostgreSQL configuration ready to use.

## 🚀 Migration Steps

### Step 1: Install PostgreSQL Locally (Development)

#### Windows (Using PostgreSQL Installer)
1. Download from: https://www.postgresql.org/download/windows/
2. Install PostgreSQL (includes pgAdmin)
3. During installation, set password for `postgres` user
4. Default port: 5432

#### Or Use Docker (Recommended)
```bash
docker run --name shims-postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=SHIMS -p 5432:5432 -d postgres:16
```

### Step 2: Update Local Environment

Your `backend/.env` is already updated to:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=SHIMS
DB_USERNAME=postgres
DB_PASSWORD=yourpassword  # Set your password here!
```

**IMPORTANT**: Update `DB_PASSWORD` with your PostgreSQL password!

### Step 3: Install PostgreSQL PHP Extension

#### Check if installed:
```bash
php -m | grep pgsql
```

#### If not installed:

**Windows (XAMPP/PHP)**:
1. Open `php.ini` (usually in `C:\xampp\php\php.ini`)
2. Find and uncomment (remove `;`):
   ```ini
   extension=pdo_pgsql
   extension=pgsql
   ```
3. Restart Apache

**Linux/Mac**:
```bash
# Ubuntu/Debian
sudo apt-get install php-pgsql

# Mac with Homebrew
brew install php-pgsql
```

### Step 4: Create Database and Run Migrations

```bash
cd backend

# Test connection
php artisan tinker
# In tinker: DB::connection()->getPdo(); (should connect without error)
# Exit: exit

# Run migrations
php artisan migrate:fresh

# Seed the database
php artisan db:seed
```

### Step 5: Test Locally

1. Start backend:
   ```bash
   cd backend
   php artisan serve
   ```

2. Test API:
   ```bash
   curl http://localhost:8000/api/user
   # Should return: {"message":"Unauthenticated."}
   ```

3. Test login with frontend

## 🌐 Production Deployment (Render/Railway)

### Option A: Render

#### 1. Create PostgreSQL Database
1. Go to Render Dashboard: https://dashboard.render.com/
2. Click "New +" → "PostgreSQL"
3. Name: `shims-database`
4. Plan: Free
5. Click "Create Database"

#### 2. Get Database Credentials
After creation, Render provides:
- Internal Database URL
- External Database URL
- Host, Port, Database, Username, Password

#### 3. Configure Backend Service

In your backend service on Render, set these environment variables:

```env
# App Configuration
APP_NAME=SHIMS
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:+eIEcrPaWGeYBXzEvZZW4+fimJphNONWygulbWxPPyc=
APP_URL=https://your-backend.onrender.com

# Frontend
FRONTEND_URL=https://your-frontend.onrender.com
SANCTUM_STATEFUL_DOMAINS=your-frontend.onrender.com

# Database - Use Internal Database URL for better performance
DATABASE_URL=${INTERNAL_DATABASE_URL}

# Or use individual credentials:
DB_CONNECTION=pgsql
DB_HOST=your-db-host.oregon-postgres.render.com
DB_PORT=5432
DB_DATABASE=shims_db
DB_USERNAME=shims_user
DB_PASSWORD=your_secure_password
DB_SSLMODE=require

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# Mail (optional - for notifications)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@shims.com
MAIL_FROM_NAME=SHIMS
```

#### 4. Deploy Backend

**Build Command**:
```bash
composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache && php artisan view:cache
```

**Start Command**:
```bash
php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
```

### Option B: Railway

#### 1. Create PostgreSQL Database
1. Go to Railway Dashboard: https://railway.app/
2. Create new project
3. Click "New" → "Database" → "PostgreSQL"

#### 2. Railway Auto-Provides Variables
Railway automatically sets:
- `DATABASE_URL` (use this!)
- `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

#### 3. Configure Backend

Create `backend/railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks",
    "buildCommand": "composer install --no-dev --optimize-autoloader"
  },
  "deploy": {
    "startCommand": "php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 4. Environment Variables (Railway)
```env
APP_NAME=SHIMS
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:+eIEcrPaWGeYBXzEvZZW4+fimJphNONWygulbWxPPyc=
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
FRONTEND_URL=https://your-frontend.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-frontend.vercel.app

# Railway provides DATABASE_URL automatically
# Just set the connection driver:
DB_CONNECTION=pgsql
```

## 🔄 Data Migration (If You Have Existing MySQL Data)

If you have data in MySQL you want to keep:

### Method 1: pgLoader (Automatic)
```bash
# Install pgLoader
# Ubuntu: sudo apt-get install pgloader

# Run migration
pgloader mysql://root:password@localhost/SHIMS pgsql://postgres:password@localhost/SHIMS
```

### Method 2: Manual Export/Import
```bash
# Export from MySQL
php artisan db:seed --class=DatabaseSeeder

# Or backup specific data
php artisan tinker
# Export users, items, etc. to JSON

# Then import to PostgreSQL
php artisan migrate:fresh
php artisan db:seed
# Import your JSON data
```

### Method 3: Fresh Start (Recommended)
```bash
# PostgreSQL
php artisan migrate:fresh --seed

# This creates fresh database with sample data
```

## 🧪 Testing Checklist

### Local Testing
- [ ] PostgreSQL installed and running
- [ ] PHP pgsql extensions enabled
- [ ] Database connection successful
- [ ] Migrations run without errors
- [ ] Seeders create sample data
- [ ] Backend starts successfully
- [ ] API endpoints return data
- [ ] Login works from frontend
- [ ] CRUD operations work

### Production Testing
- [ ] Database created on hosting platform
- [ ] Environment variables configured
- [ ] Backend deploys successfully
- [ ] Migrations run automatically
- [ ] Can seed production database
- [ ] API responds to requests
- [ ] Frontend connects to backend
- [ ] Authentication works
- [ ] All features functional

## 📊 Why PostgreSQL?

### Free Tier Benefits:
✅ **Render**: Free PostgreSQL with 1GB storage
✅ **Railway**: Free PostgreSQL with 1GB storage, 5GB transfer
✅ **Heroku**: Free PostgreSQL addon available
✅ **Supabase**: Free PostgreSQL with 500MB storage

### MySQL Free Tier Issues:
❌ Most platforms require paid plans for MySQL
❌ PlanetScale free tier is limited
❌ AWS RDS MySQL has no free tier

### Technical Benefits:
✅ Better JSON support
✅ Full ACID compliance
✅ Better concurrency handling
✅ More advanced features (arrays, full-text search)
✅ Better for production workloads

## 🔧 Troubleshooting

### Error: "could not find driver"
**Solution**: Install PHP PostgreSQL extension (see Step 3)

### Error: "Connection refused"
**Solution**: 
- Check PostgreSQL is running: `pg_isready`
- Check port 5432 is open
- Verify credentials in `.env`

### Error: "SQLSTATE[08006]"
**Solution**: 
- Check PostgreSQL service is running
- Verify `DB_HOST`, `DB_PORT`, `DB_DATABASE` are correct

### Error: "FATAL: database does not exist"
**Solution**:
```bash
# Create database manually
psql -U postgres
CREATE DATABASE shims;
\q
```

### Migration Errors
**Solution**:
```bash
# Fresh start
php artisan migrate:fresh

# If specific migration fails, check for MySQL-specific syntax
# All migrations should be PostgreSQL-compatible already
```

## 📝 Important Notes

1. **Enum Types**: Laravel handles enum migrations differently for PostgreSQL. Already compatible.

2. **Timestamps**: PostgreSQL uses different timestamp formats. Laravel handles this automatically.

3. **Auto-increment**: PostgreSQL uses sequences instead of AUTO_INCREMENT. Laravel handles this.

4. **Case Sensitivity**: PostgreSQL column names are case-sensitive. Stick to lowercase.

5. **SSL Mode**: Production databases usually require `DB_SSLMODE=require`

## ✨ Next Steps

1. ✅ Install PostgreSQL locally
2. ✅ Update `DB_PASSWORD` in `backend/.env`
3. ✅ Enable PHP pgsql extensions
4. ✅ Run `php artisan migrate:fresh --seed`
5. ✅ Test locally
6. ✅ Create PostgreSQL database on Render/Railway
7. ✅ Update production environment variables
8. ✅ Deploy backend
9. ✅ Deploy frontend with updated `VITE_API_URL`
10. ✅ Test production deployment

---

**Status**: ✅ Configuration files updated and ready for PostgreSQL migration!

**Estimated Migration Time**: 15-30 minutes
