#!/bin/bash

# SHIMS PostgreSQL Setup Script
# This script helps set up PostgreSQL for local development

echo "🐘 SHIMS PostgreSQL Setup"
echo "=========================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo ""
    echo "Please install PostgreSQL:"
    echo "  - Windows: https://www.postgresql.org/download/windows/"
    echo "  - Mac: brew install postgresql"
    echo "  - Linux: sudo apt-get install postgresql"
    echo ""
    echo "Or use Docker:"
    echo "  docker run --name shims-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=SHIMS -p 5432:5432 -d postgres:16"
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Check if database exists
DB_NAME="SHIMS"
DB_USER="postgres"

echo "Checking if database '$DB_NAME' exists..."

# Create database if it doesn't exist
if psql -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "✅ Database '$DB_NAME' already exists"
else
    echo "📝 Creating database '$DB_NAME'..."
    createdb -U $DB_USER $DB_NAME
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "❌ Failed to create database"
        echo "You may need to create it manually:"
        echo "  psql -U postgres"
        echo "  CREATE DATABASE $DB_NAME;"
        echo "  \\q"
        exit 1
    fi
fi

echo ""
echo "🔧 Running Laravel migrations..."
php artisan migrate:fresh

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migrations failed"
    echo "Please check your .env file configuration"
    exit 1
fi

echo ""
echo "🌱 Seeding database..."
php artisan db:seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "⚠️  Seeding had issues (this might be okay if data already exists)"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Default credentials:"
echo "  Admin:       admin@example.com / password"
echo "  Manager:     manager@example.com / password"
echo "  Pharmacist:  pharmacist@example.com / password"
echo "  Staff:       staff@example.com / password"
echo ""
echo "🚀 Start the backend:"
echo "  php artisan serve"
echo ""
