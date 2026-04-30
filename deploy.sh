#!/bin/bash

# Hospital Inventory Management System - Deployment Script
# Make sure to run this script from the project root directory

echo "🏥 Starting HIMS Deployment..."

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found. Please run this script from the Laravel project root."
    exit 1
fi

# Set environment to production
echo "📝 Setting up environment..."
if [ ! -f ".env" ]; then
    if [ -f ".env.production" ]; then
        cp .env.production .env
        echo "✅ Copied .env.production to .env"
    else
        echo "❌ Error: No .env file found. Please create one based on .env.production"
        exit 1
    fi
fi

# Generate application key if not set
echo "🔑 Generating application key..."
php artisan key:generate --force

# Install/update dependencies
echo "📦 Installing dependencies..."
composer install --no-dev --optimize-autoloader
npm ci
npm run build

# Database setup
echo "🗄️ Setting up database..."
php artisan migrate --force

# Seed database with default data
echo "🌱 Seeding database..."
php artisan db:seed --force

# Create storage symlink
echo "🔗 Creating storage symlink..."
php artisan storage:link

# Create necessary directories
echo "📁 Creating upload directories..."
mkdir -p storage/app/public/uploads/items
mkdir -p storage/app/public/uploads/purchase_orders
mkdir -p storage/app/public/uploads/documents
mkdir -p storage/app/public/uploads/temp

# Set proper permissions
echo "🔒 Setting permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || echo "⚠️ Could not set ownership (run as root if needed)"

# Clear and cache configuration
echo "⚡ Optimizing application..."
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Clear application cache
php artisan cache:clear

echo "✅ Deployment completed successfully!"
echo ""
echo "🎉 HIMS is ready to use!"
echo ""
echo "📋 Default Login Credentials:"
echo "Super Admin: admin@hospital.com / admin123"
echo "Admin: admin2@hospital.com / admin123"
echo "Manager: manager@hospital.com / manager123"
echo "Procurement: procurement@hospital.com / procurement123"
echo "Pharmacist: pharmacist@hospital.com / pharmacist123"
echo ""
echo "⚠️  IMPORTANT: Change default passwords after first login!"
echo ""
echo "🌐 Your application should now be accessible at your configured APP_URL"