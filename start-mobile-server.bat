@echo off
echo ========================================
echo HIMS Mobile Access Setup
echo ========================================
echo.

echo Step 1: Finding your IP address...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    set IP=!IP:~1!
    echo Found IP: !IP!
)

echo.
echo Step 2: Adding firewall rule...
netsh advfirewall firewall delete rule name="Laravel Dev Server" >nul 2>&1
netsh advfirewall firewall add rule name="Laravel Dev Server" dir=in action=allow protocol=TCP localport=8000
echo Firewall rule added!

echo.
echo Step 3: Starting Laravel server...
echo.
echo ========================================
echo Access from your phone:
echo http://%IP%:8000
echo ========================================
echo.
echo Keep this window open!
echo Press Ctrl+C to stop the server
echo.

php artisan serve --host=0.0.0.0 --port=8000
