# PostgreSQL Deployment Quick Start

## 🎯 Choose Your Platform

### Option 1: Render (Recommended for Beginners)

**Why Render?**
- ✅ Easy setup with web dashboard
- ✅ Free PostgreSQL database (1GB)
- ✅ Auto-deploy from GitHub
- ✅ Free SSL certificates
- ✅ Good documentation

#### Render Setup (5 minutes):

1. **Create PostgreSQL Database**
   - Go to https://dashboard.render.com/
   - Click "New +" → "PostgreSQL"
   - Name: `shims-database`
   - Plan: **Free**
   - Click "Create Database"
   - Copy the **Internal Database URL**

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Name: `shims-backend`
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `PHP`
   - Build Command:
     ```bash
     composer install --no-dev --optimize-autoloader
     ```
   - Start Command:
     ```bash
     php artisan config:cache && php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT
     ```
   - Plan: **Free**

3. **Set Environment Variables**
   Click "Environment" tab and add:
   ```env
   APP_NAME=SHIMS
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:+eIEcrPaWGeYBXzEvZZW4+fimJphNONWygulbWxPPyc=
   
   # Use Internal Database URL (format: postgres://user:pass@host:5432/dbname)
   DATABASE_URL=<paste-internal-database-url-here>
   
   DB_CONNECTION=pgsql
   DB_SSLMODE=require
   
   SESSION_DRIVER=database
   CACHE_STORE=database
   QUEUE_CONNECTION=database
   
   # Will update after frontend is deployed
   FRONTEND_URL=http://localhost:3000
   SANCTUM_STATEFUL_DOMAINS=localhost:3000
   ```

4. **Deploy Frontend**
   - Click "New +" → "Static Site"
   - Connect your GitHub repo
   - Name: `shims-frontend`
   - Branch: `main`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add Environment Variable:
     ```env
     VITE_API_URL=https://shims-backend.onrender.com
     VITE_APP_NAME=SHIMS
     ```

5. **Update Backend Environment**
   Go back to backend service, update:
   ```env
   FRONTEND_URL=https://shims-frontend.onrender.com
   SANCTUM_STATEFUL_DOMAINS=shims-frontend.onrender.com
   APP_URL=https://shims-backend.onrender.com
   ```

**Done! Your app is live! 🎉**

Access at: `https://shims-frontend.onrender.com`

---

### Option 2: Railway (Best Performance)

**Why Railway?**
- ✅ Faster deployments
- ✅ Better performance
- ✅ Simple configuration
- ✅ Auto-detects frameworks
- ✅ Free PostgreSQL (1GB + 5GB transfer)

#### Railway Setup (5 minutes):

1. **Create Project**
   - Go to https://railway.app/
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `SmartHIMS` repo

2. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically creates database
   - No configuration needed!

3. **Configure Backend Service**
   - Click on your backend service
   - Go to "Variables" tab
   - Add:
     ```env
     APP_NAME=SHIMS
     APP_ENV=production
     APP_DEBUG=false
     APP_KEY=base64:+eIEcrPaWGeYBXzEvZZW4+fimJphNONWygulbWxPPyc=
     
     DB_CONNECTION=pgsql
     # DATABASE_URL is automatically provided by Railway!
     
     SESSION_DRIVER=database
     CACHE_STORE=database
     QUEUE_CONNECTION=database
     
     FRONTEND_URL=https://${RAILWAY_PUBLIC_DOMAIN}
     SANCTUM_STATEFUL_DOMAINS=${RAILWAY_PUBLIC_DOMAIN}
     ```

4. **Configure Frontend Service**
   - Click "New" → "GitHub Repo" → Select same repo
   - Go to "Settings"
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
   - Add Variable:
     ```env
     VITE_API_URL=https://your-backend.railway.app
     VITE_APP_NAME=SHIMS
     ```

5. **Generate Domains**
   - Click on each service
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Update cross-references

**Done! Your app is live! 🎉**

---

### Option 3: Vercel (Frontend) + Railway/Render (Backend)

**Best of Both Worlds:**
- ✅ Vercel: Best frontend hosting (fast CDN, auto-preview)
- ✅ Railway/Render: Backend + Database

#### Setup:

1. **Deploy Backend** (Use Railway or Render steps above)

2. **Deploy Frontend on Vercel**
   - Go to https://vercel.com/
   - Click "New Project"
   - Import from GitHub
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add Environment Variable:
     ```env
     VITE_API_URL=https://your-backend.railway.app
     VITE_APP_NAME=SHIMS
     ```

3. **Update Backend CORS**
   Update backend environment on Railway/Render:
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   SANCTUM_STATEFUL_DOMAINS=your-app.vercel.app
   ```

**Done! Your app is live! 🎉**

---

## 🧪 Testing Your Deployment

After deployment, test these:

### 1. Backend Health Check
```bash
curl https://your-backend-url.com/api/user
# Should return: {"message":"Unauthenticated."}
```

### 2. Frontend Access
Open: `https://your-frontend-url.com/login`

### 3. Test Login
Use seeded credentials:
- **Email**: admin@example.com
- **Password**: password

### 4. Check Features
- ✅ Dashboard loads
- ✅ Inventory page loads
- ✅ Can create/edit items
- ✅ Notifications work
- ✅ Reports generate

---

## 🐛 Troubleshooting

### Database Connection Error
**Problem**: "SQLSTATE[08006] Connection refused"

**Solution**:
1. Check `DATABASE_URL` or `DB_HOST` in environment variables
2. Verify database is running (check platform dashboard)
3. Ensure `DB_SSLMODE=require` for production

### Migration Errors
**Problem**: "Base table or column not found"

**Solution**:
```bash
# In your platform's console or SSH:
php artisan migrate:fresh --force
php artisan db:seed --force
```

### CORS Errors
**Problem**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**:
1. Verify `FRONTEND_URL` in backend environment
2. Check `backend/config/cors.php` has `'allowed_origins' => ['*']`
3. Ensure `VITE_API_URL` in frontend points to correct backend

### 502 Bad Gateway
**Problem**: Backend not starting

**Solution**:
1. Check logs in platform dashboard
2. Verify build command completed successfully
3. Check start command is correct
4. Ensure `$PORT` variable is used (not hardcoded 8000)

---

## 💰 Cost Breakdown

### Free Forever Option:
- **Render**: Free PostgreSQL (1GB) + Free Web Service
- **Frontend**: Render Static Site (Free) or Vercel (Free)
- **Total Cost**: $0/month

### Limitations of Free Tier:
- Database: 1GB storage (enough for ~100,000 records)
- Bandwidth: Limited but sufficient for small apps
- Uptime: May spin down after inactivity (15 min restart)
- No custom domains (use .onrender.com or .railway.app)

### Upgrade When:
- Need more than 1GB database storage
- Need 24/7 uptime without spin-down
- Need custom domain with SSL
- **Cost**: ~$7-15/month

---

## 📊 Platform Comparison

| Feature | Render | Railway | Vercel (Frontend Only) |
|---------|--------|---------|------------------------|
| PostgreSQL | ✅ Free 1GB | ✅ Free 1GB | ❌ No database |
| Auto-Deploy | ✅ | ✅ | ✅ |
| SSL | ✅ Free | ✅ Free | ✅ Free |
| Custom Domain | ✅ | ✅ | ✅ |
| Logs | ✅ Good | ✅ Excellent | ✅ Good |
| Setup Difficulty | ⭐⭐ Easy | ⭐⭐⭐ Moderate | ⭐ Very Easy |
| Performance | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent |
| Dashboard | ⭐⭐⭐⭐ Great | ⭐⭐⭐⭐ Great | ⭐⭐⭐⭐⭐ Excellent |

**Recommendation**: 
- **Beginners**: Render (easiest)
- **Performance**: Railway (Backend) + Vercel (Frontend)
- **Simplicity**: Railway (all-in-one)

---

## ✅ Deployment Checklist

### Before Deploying:
- [ ] PostgreSQL configured locally and tested
- [ ] All migrations run successfully
- [ ] Seeders create proper test data
- [ ] Frontend connects to local backend
- [ ] Login and authentication work locally
- [ ] All main features tested locally

### During Deployment:
- [ ] PostgreSQL database created on platform
- [ ] Backend deployed successfully
- [ ] Migrations ran automatically
- [ ] Database seeded with initial data
- [ ] Frontend deployed successfully
- [ ] Environment variables configured correctly

### After Deployment:
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Login works with test credentials
- [ ] Dashboard displays correctly
- [ ] CRUD operations work
- [ ] No CORS errors in browser console
- [ ] All API endpoints responding

---

## 🎓 Need Help?

### Platform Documentation:
- **Render**: https://render.com/docs
- **Railway**: https://docs.railway.app/
- **Vercel**: https://vercel.com/docs

### Common Commands:

**View Logs** (Render):
- Dashboard → Service → Logs tab

**View Logs** (Railway):
- Dashboard → Service → Deployments → Click deployment

**Run Artisan Commands** (Render):
- Dashboard → Service → Shell tab
- `php artisan migrate:fresh --force`

**Run Artisan Commands** (Railway):
- Dashboard → Service → Settings → One-off commands
- Or use Railway CLI: `railway run php artisan migrate`

---

**Last Updated**: Migration to PostgreSQL
**Estimated Setup Time**: 10-15 minutes per platform
**Difficulty**: Easy to Moderate
