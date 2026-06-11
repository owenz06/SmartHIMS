@echo off
REM SHIMS PostgreSQL Setup Script for Windows
REM This script helps set up PostgreSQL for local development

echo.
echo ========================================
echo    SHIMS PostgreSQL Setup (Windows)
echo ========================================
echo.

REM Check if psql is available
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL is not installed or not in PATH!
    echo.
    echo Please install PostgreSQL:
    echo   Download from: https://www.postgresql.org/download/windows/
    echo.
    echo Or use Docker:
    echo   docker run --name shims-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=SHIMS -p 5432:5432 -d postgres:16
    echo.
    pause
    exit /b 1
)

echo [OK] PostgreSQL is installed
echo.

REM Check if database exists
set DB_NAME=SHIMS
set DB_USER=postgres

echo Checking if database '%DB_NAME%' exists...

REM Try to connect to the database
psql -U %DB_USER% -d %DB_NAME% -c "\q" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Database '%DB_NAME%' already exists
) else (
    echo [INFO] Creating database '%DB_NAME%'...
    createdb -U %DB_USER% %DB_NAME%
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Database created successfully
    ) else (
        echo [ERROR] Failed to create database
        echo.
        echo You may need to create it manually:
        echo   psql -U postgres
        echo   CREATE DATABASE SHIMS;
        echo   \q
        echo.
        pause
        exit /b 1
    )
)

echo.
echo [INFO] Running Laravel migrations...
php artisan migrate:fresh

if %ERRORLEVEL% EQU 0 (
    echo [OK] Migrations completed successfully
) else (
    echo [ERROR] Migrations failed
    echo Please check your .env file configuration
    echo.
    pause
    exit /b 1
)

echo.
echo [INFO] Seeding database...
php artisan db:seed

if %ERRORLEVEL% EQU 0 (
    echo [OK] Database seeded successfully
) else (
    echo [WARNING] Seeding had issues (this might be okay if data already exists)
)

echo.
echo ========================================
echo           Setup Complete!
echo ========================================
echo.
echo Default credentials:
echo   Admin:       admin@example.com / password
echo   Manager:     manager@example.com / password
echo   Pharmacist:  pharmacist@example.com / password
echo   Staff:       staff@example.com / password
echo.
echo Start the backend:
echo   php artisan serve
echo.
pause
