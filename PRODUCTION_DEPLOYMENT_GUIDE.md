# 🏥 HIMS Production Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Pre-Deployment Setup
```bash
# Copy production environment file
cp .env.production .env

# Edit .env with your production values:
# - Database credentials
# - SMTP settings
# - Domain URL
# - Generate new APP_KEY
```

### 2. Run Deployment Script
```bash
# On Linux/Mac
chmod +x deploy.sh
./deploy.sh

# On Windows (PowerShell)
php artisan key:generate --force
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
php artisan optimize
```

### 3. Web Server Configuration

#### Apache (.htaccess already included)
```apache
# Ensure mod_rewrite is enabled
# Point document root to /public directory
```

#### Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/your/project/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@hospital.com | admin123 |
| Admin | admin2@hospital.com | admin123 |
| Manager | manager@hospital.com | manager123 |
| Procurement Officer | procurement@hospital.com | procurement123 |
| Pharmacist | pharmacist@hospital.com | pharmacist123 |

**⚠️ CRITICAL: Change all default passwords immediately after deployment!**

## 📋 Production Environment Variables

### Required Settings
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=your_db_host
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# Mail (for purchase order emails)
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

## 🛡️ Security Checklist

- [ ] Change all default passwords
- [ ] Set strong APP_KEY
- [ ] Configure HTTPS/SSL
- [ ] Set proper file permissions (755 for directories, 644 for files)
- [ ] Configure firewall rules
- [ ] Set up regular database backups
- [ ] Configure log rotation
- [ ] Enable rate limiting on login routes

## 📊 Post-Deployment Verification

### 1. Test Core Functionality
- [ ] Login with each role type
- [ ] Create inventory items
- [ ] Generate purchase orders
- [ ] Test stock in/out operations
- [ ] Verify email notifications work
- [ ] Check mobile responsiveness

### 2. Performance Optimization
```bash
# Enable OPcache in php.ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=4000

# Configure Redis/Memcached for caching (optional)
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

## 🔧 Maintenance Commands

### Regular Maintenance
```bash
# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Optimize for production
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Database Backup
```bash
# Create backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u username -p database_name < backup_file.sql
```

## 📈 Monitoring & Logging

### Log Files Location
- Application logs: `storage/logs/laravel.log`
- Web server logs: Check your web server configuration
- Database logs: Check your database server configuration

### Health Check Endpoints
- Application: `GET /dashboard` (requires auth)
- Database: Monitor connection in logs
- File uploads: Test through inventory item creation

## 🆘 Troubleshooting

### Common Issues

1. **500 Internal Server Error**
   - Check `storage/logs/laravel.log`
   - Verify file permissions
   - Ensure `.env` file exists and is readable

2. **Database Connection Error**
   - Verify database credentials in `.env`
   - Check database server is running
   - Ensure database exists

3. **File Upload Issues**
   - Check `storage/app/public` permissions
   - Verify `storage:link` was run
   - Check PHP upload limits in `php.ini`

4. **Email Not Sending**
   - Verify SMTP credentials
   - Check firewall allows SMTP port
   - Test with a simple mail client

## 📞 Support

For technical support or issues:
1. Check application logs first
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check file and directory permissions

---

**🎉 Congratulations! Your Hospital Inventory Management System is now ready for production use!**