# Test Login API
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  CORS & Login API Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: OPTIONS (Preflight)
Write-Host "[1/3] Testing OPTIONS (Preflight)..." -ForegroundColor Yellow
try {
    $options = Invoke-WebRequest `
        -Uri "http://localhost/Smart%20Hospital%20Inventory%20Management%20System%20(SHIMS)/backend/public/api/login" `
        -Method OPTIONS `
        -Headers @{
            Origin = "http://localhost:3000"
            "Access-Control-Request-Method" = "POST"
            "Access-Control-Request-Headers" = "content-type,authorization"
        }
    
    Write-Host "   ✓ Status: $($options.StatusCode)" -ForegroundColor Green
    Write-Host "   ✓ CORS Origin: $($options.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: POST (Login)
Write-Host "[2/3] Testing POST (Login)..." -ForegroundColor Yellow
try {
    $body = @{
        email = 'superadmin@hims.com'
        password = 'password123'
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest `
        -Uri "http://localhost/Smart%20Hospital%20Inventory%20Management%20System%20(SHIMS)/backend/public/api/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -Headers @{
            Accept = "application/json"
            Origin = "http://localhost:3000"
        }
    
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "   ✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   ✓ User: $($data.data.user.name)" -ForegroundColor Green
    Write-Host "   ✓ Role: $($data.data.user.role)" -ForegroundColor Green
    Write-Host "   ✓ Token: $($data.data.token.Substring(0, 20))..." -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Frontend Server
Write-Host "[3/3] Checking Frontend Server..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 2
    Write-Host "   ✓ Frontend is running on http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Test Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "2. Open Developer Tools (F12)" -ForegroundColor White
Write-Host "3. Go to Console tab" -ForegroundColor White
Write-Host "4. Try logging in with:" -ForegroundColor White
Write-Host "   Email: superadmin@hims.com" -ForegroundColor Cyan
Write-Host "   Password: password123" -ForegroundColor Cyan
Write-Host "5. Check for any errors in the console" -ForegroundColor White
Write-Host ""
