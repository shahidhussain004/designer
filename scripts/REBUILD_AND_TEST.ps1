# Complete Rebuild and Test Script
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "MARKETPLACE LOGIN FIX - REBUILD & TEST" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$backendDir = "C:\playground\designer\services\marketplace-service"
$frontendDir = "C:\playground\designer\frontend\marketplace-web"

# Step 1: Clean and rebuild backend
Write-Host "Step 1: Cleaning and rebuilding backend..." -ForegroundColor Yellow
Set-Location $backendDir

Write-Host "  - Running Maven clean..." -ForegroundColor Gray
mvn clean -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Maven clean failed!" -ForegroundColor Red
    exit 1
}

Write-Host "  - Running Maven compile..." -ForegroundColor Gray
mvn compile -DskipTests -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Maven compile failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Backend rebuilt successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Instructions for running backend
Write-Host "Step 2: MANUAL ACTION REQUIRED" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Yellow
Write-Host "Please open a NEW PowerShell window and run:" -ForegroundColor White
Write-Host ""
Write-Host "  cd $backendDir" -ForegroundColor Cyan
Write-Host "  mvn spring-boot:run" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait for the message:" -ForegroundColor White
Write-Host "  'Started MarketplaceApplication in X seconds'" -ForegroundColor Green
Write-Host ""
Write-Host "Press ANY KEY once backend is running..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""

# Step 3: Test backend
Write-Host "Step 3: Testing backend endpoint..." -ForegroundColor Yellow
$testUrl = "http://localhost:8080/api/auth/test"
try {
    $response = Invoke-WebRequest -Uri $testUrl -Method GET -UseBasicParsing
    Write-Host "✓ Backend is reachable!" -ForegroundColor Green
    Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend is NOT reachable!" -ForegroundColor Red
    Write-Host "  Make sure backend is running on port 8080" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Test login from PowerShell
Write-Host "Step 4: Testing login from PowerShell..." -ForegroundColor Yellow
$loginUrl = "http://localhost:8080/api/auth/login"
$body = @{
    emailOrUsername = "client1@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✓ Login successful from PowerShell!" -ForegroundColor Green
    Write-Host "  Status Code: $($response.StatusCode)" -ForegroundColor Gray
    $jsonResponse = $response.Content | ConvertFrom-Json
    Write-Host "  Access Token: $($jsonResponse.accessToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed from PowerShell!" -ForegroundColor Red
    Write-Host "  Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        Write-Host "  Response: $responseBody" -ForegroundColor Red
    }
    exit 1
}
Write-Host ""

# Step 5: Check frontend dependencies
Write-Host "Step 5: Checking frontend dependencies..." -ForegroundColor Yellow
Set-Location $frontendDir
if (!(Test-Path "node_modules")) {
    Write-Host "  - Installing dependencies..." -ForegroundColor Gray
    npm install --silent
}
Write-Host "✓ Frontend dependencies ready!" -ForegroundColor Green
Write-Host ""

# Step 6: Instructions for running frontend
Write-Host "Step 6: MANUAL ACTION REQUIRED" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Yellow
Write-Host "Please open ANOTHER NEW PowerShell window and run:" -ForegroundColor White
Write-Host ""
Write-Host "  cd $frontendDir" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait for the message:" -ForegroundColor White
Write-Host "  '✓ Ready in Xms'" -ForegroundColor Green
Write-Host "  'Local: http://localhost:3000'" -ForegroundColor Green
Write-Host ""
Write-Host "Then open your browser to:" -ForegroundColor White
Write-Host "  http://localhost:3000/auth/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "Try logging in with:" -ForegroundColor White
Write-Host "  Email: client1@example.com" -ForegroundColor Cyan
Write-Host "  Password: password123" -ForegroundColor Cyan
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you still get a 403 error, check the browser console (F12)" -ForegroundColor Yellow
Write-Host "and the backend logs for any error messages." -ForegroundColor Yellow
Write-Host ""
