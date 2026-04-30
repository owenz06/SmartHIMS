# 🚀 Deployment Checklist

## Pre-Deployment Checklist

### Backend (Laravel)
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Database seeded with initial data
- [ ] CORS origins updated for production
- [ ] APP_DEBUG set to false
- [ ] APP_ENV set to production
- [ ] Sanctum stateful domains configured
- [ ] Storage linked (`php artisan storage:link`)
- [ ] Cache cleared
- [ ] Config cached (`php artisan config:cache`)
- [ ] Routes cached (`php artisan route:cache`)

### Frontend (React)
- [ ] VITE_API_URL set to production backend URL
- [ ] Build tested locally (`npm run build`)
- [ ] No console errors in production build
- [ ] All environment variables set
- [ ] Assets optimized

---

## Railway Deployment

### Backend Deployment

1. **Create New Project**
   ```
   - Go to railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   ```

2. **Add MySQL Database**
   ```
   - Click "New"
   - Select "Database"
   - Choose "MySQL"
   ```

3. **Configure Environment Variables**
   ```env
   APP_NAME="Hospital Inventory System"
   APP_ENV=production
   APP_KEY=base64:YOUR_KEY_HERE
   APP_DEBUG=false
   APP_URL=https://your-backend.up.railway.app

   DB_CONNECTION=mysql
   DB_HOST=${{MYSQL.MYSQLHOST}}
   DB_PORT=${{MYSQL.MYSQLPORT}}
   DB_DATABASE=${{MYSQL.MYSQLDATABASE}}
   DB_USERNAME=${{MYSQL.MYSQLUSER}}
   DB_PASSWORD=${{MYSQL.MYSQLPASSWORD}}

   SESSION_DRIVER=database
   CACHE_DRIVER=database

   SANCTUM_STATEFUL_DOMAINS=your-frontend.up.railway.app
   SESSION_DOMAIN=.railway.app
   ```

4. **Deploy**
   ```bash
   # Railway will auto-deploy from GitHub
   # After deployment, run migrations:
   railway run php artisan migrate --force
   railway run php artisan db:seed --force
   ```

### Frontend Deployment

1. **Create New Project**
   ```
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose frontend folder
   ```

2. **Configure Build Settings**
   ```
   Build Command: cd frontend && npm install && npm run build
   Start Command: cd frontend && npm run preview
   ```

3. **Set Environment Variables**
   ```env
   VITE_API_URL=https://your-backend.up.railway.app
   VITE_APP_NAME=Hospital Inventory System
   ```

4. **Deploy**
   ```
   Railway will auto-deploy
   ```

---

## Render Deployment

### Backend Deployment

1. **Create Web Service**
   ```
   - Go to render.com
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repo
   ```

2. **Configure Service**
   ```
   Name: hospital-inventory-backend
   Environment: Docker or Native
   Build Command: composer install --no-dev --optimize-autoloader && php artisan migrate --force
   Start Command: php artisan serve --host=0.0.0.0 --port=$PORT
   ```

3. **Add Environment Variables**
   ```env
   APP_NAME="Hospital Inventory System"
   APP_ENV=production
   APP_KEY=base64:YOUR_KEY_HERE
   APP_DEBUG=false
   APP_URL=https://your-backend.onrender.com

   DB_CONNECTION=mysql
   DB_HOST=your-mysql-host
   DB_PORT=3306
   DB_DATABASE=your_database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password

   SESSION_DRIVER=database
   CACHE_DRIVER=database

   SANCTUM_STATEFUL_DOMAINS=your-frontend.onrender.com
   ```

4. **Add MySQL Database**
   ```
   - Create separate MySQL service on Render
   - Or use external MySQL provider (PlanetScale, AWS RDS)
   ```

### Frontend Deployment

1. **Create Static Site**
   ```
   - Click "New +"
   - Select "Static Site"
   - Connect GitHub repo
   ```

2. **Configure Build**
   ```
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```

3. **Add Environment Variables**
   ```env
   VITE_API_URL=https://your-backend.onrender.com
   VITE_APP_NAME=Hospital Inventory System
   ```

---

## Vercel Deployment (Frontend Only)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure**
   ```
   - Set build command: npm run build
   - Set output directory: dist
   - Add environment variable: VITE_API_URL
   ```

---

## Environment Variables Reference

### Backend (.env)
```env
# Application
APP_NAME="Hospital Inventory System"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://your-backend-url.com

# Database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Cache & Session
SESSION_DRIVER=database
CACHE_DRIVER=database
QUEUE_CONNECTION=database

# Sanctum
SANCTUM_STATEFUL_DOMAINS=your-frontend-url.com
SESSION_DOMAIN=.your-domain.com

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=Hospital Inventory System
```

---

## Post-Deployment Verification

### Backend Checks
- [ ] Visit backend URL - should show JSON response
- [ ] Test `/api/login` endpoint
- [ ] Test `/api/dashboard/stats` endpoint
- [ ] Check database connection
- [ ] Verify migrations ran successfully
- [ ] Check logs for errors

### Frontend Checks
- [ ] Visit frontend URL
- [ ] Login page loads correctly
- [ ] Can login with demo credentials
- [ ] Dashboard loads with data
- [ ] No console errors
- [ ] API calls working
- [ ] Logout works

### Integration Checks
- [ ] Frontend can communicate with backend
- [ ] CORS working (no CORS errors)
- [ ] Authentication flow works
- [ ] Data displays correctly
- [ ] All API endpoints accessible

---

## Troubleshooting

### CORS Errors
```
Problem: "CORS policy: No 'Access-Control-Allow-Origin' header"
Solution:
1. Check config/cors.php includes frontend URL
2. Verify SANCTUM_STATEFUL_DOMAINS in backend .env
3. Restart backend server
4. Clear browser cache
```

### 500 Server Error
```
Problem: Backend returns 500 error
Solution:
1. Check backend logs
2. Verify database connection
3. Run migrations: php artisan migrate --force
4. Check APP_KEY is set
5. Clear cache: php artisan cache:clear
```

### Login Not Working
```
Problem: Login fails or returns 401
Solution:
1. Verify database has users (run seeders)
2. Check SANCTUM configuration
3. Verify API_URL in frontend .env
4. Check browser Network tab for actual error
5. Test API endpoint directly with Postman
```

### Build Failures
```
Problem: Build fails during deployment
Solution:
1. Check build logs for specific error
2. Verify all dependencies in package.json
3. Test build locally first
4. Check Node.js version compatibility
5. Clear build cache and retry
```

---

## Monitoring & Maintenance

### Regular Tasks
- [ ] Monitor error logs
- [ ] Check database backups
- [ ] Update dependencies monthly
- [ ] Review security updates
- [ ] Monitor API response times
- [ ] Check disk space usage

### Performance Optimization
- [ ] Enable caching
- [ ] Optimize database queries
- [ ] Compress frontend assets
- [ ] Use CDN for static files
- [ ] Enable gzip compression
- [ ] Monitor and optimize slow queries

---

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API rate limiting enabled
- [ ] CSRF protection enabled
- [ ] XSS protection enabled
- [ ] SQL injection prevention
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Access logs monitored

---

## Support & Resources

### Documentation
- Laravel: https://laravel.com/docs
- React: https://react.dev
- Vite: https://vitejs.dev
- Railway: https://docs.railway.app
- Render: https://render.com/docs

### Community
- Laravel Discord
- React Discord
- Stack Overflow

---

## 🎉 Deployment Complete!

Once all checks pass, your Hospital Inventory Management System is live and ready for production use!

**Remember to**:
- Keep documentation updated
- Monitor system health
- Backup database regularly
- Update dependencies
- Review security regularly
