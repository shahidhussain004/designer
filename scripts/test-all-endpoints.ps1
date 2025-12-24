# Comprehensive endpoint testing script

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testing All Endpoints" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$testResults = @()

# Test LMS Service - Courses endpoint
Write-Host "1. Testing LMS Service - Courses..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8082/api/courses?page=0&size=5" -UseBasicParsing -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    $corsHeader = $response.Headers['Access-Control-Allow-Origin']
    
    Write-Host "   Status: $($response.StatusCode) ✓" -ForegroundColor Green
    Write-Host "   CORS Header: $corsHeader" -ForegroundColor Gray
    Write-Host "   Courses returned: $($data.Length)" -ForegroundColor Gray
    $testResults += [PSCustomObject]@{Endpoint="Courses (LMS)"; Status="PASS"; Code=$response.StatusCode}
}
catch {
    Write-Host "   Failed: $_" -ForegroundColor Red
    $testResults += [PSCustomObject]@{Endpoint="Courses (LMS)"; Status="FAIL"; Code="Error"}
}

Start-Sleep -Seconds 1

# Test Marketplace Service - Jobs endpoint
Write-Host "`n2. Testing Marketplace Service - Jobs..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/jobs?page=0&size=20" -UseBasicParsing -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "   Status: $($response.StatusCode) ✓" -ForegroundColor Green
    Write-Host "   Total jobs: $($data.totalElements)" -ForegroundColor Gray
    Write-Host "   Jobs in response: $($data.content.Count)" -ForegroundColor Gray
    $testResults += [PSCustomObject]@{Endpoint="Jobs (Marketplace)"; Status="PASS"; Code=$response.StatusCode}
}
catch {
    Write-Host "   Failed: $_" -ForegroundColor Red
    $testResults += [PSCustomObject]@{Endpoint="Jobs (Marketplace)"; Status="FAIL"; Code="Error"}
}

Start-Sleep -Seconds 1

# Test Marketplace Service - Auth Login endpoint
Write-Host "`n3. Testing Marketplace Service - Auth Login..." -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@test.com"
        password = "password"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing -TimeoutSec 10
    
    Write-Host "   Status: $($response.StatusCode) ✓" -ForegroundColor Green
    $testResults += [PSCustomObject]@{Endpoint="Auth Login"; Status="PASS"; Code=$response.StatusCode}
}
catch {
    Write-Host "   Failed: $_" -ForegroundColor Red
    $testResults += [PSCustomObject]@{Endpoint="Auth Login"; Status="FAIL"; Code="Error"}
}

Start-Sleep -Seconds 1

# Test Frontend
Write-Host "`n4. Testing Frontend (Next.js)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002" -UseBasicParsing -TimeoutSec 10
    Write-Host "   Status: $($response.StatusCode) ✓" -ForegroundColor Green
    $testResults += [PSCustomObject]@{Endpoint="Frontend"; Status="PASS"; Code=$response.StatusCode}
}
catch {
    Write-Host "   Failed or still starting: $_" -ForegroundColor Yellow
    $testResults += [PSCustomObject]@{Endpoint="Frontend"; Status="PENDING"; Code="N/A"}
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$testResults | Format-Table -AutoSize

$passCount = ($testResults | Where-Object {$_.Status -eq "PASS"}).Count
$failCount = ($testResults | Where-Object {$_.Status -eq "FAIL"}).Count
$pendingCount = ($testResults | Where-Object {$_.Status -eq "PENDING"}).Count

Write-Host "`nPassed: $passCount | Failed: $failCount | Pending: $pendingCount" -ForegroundColor $(if($failCount -eq 0){"Green"}else{"Yellow"})

if ($failCount -eq 0 -and $pendingCount -eq 0) {
    Write-Host "`n✓ All endpoints are working correctly!" -ForegroundColor Green
} elseif ($failCount -gt 0) {
    Write-Host "`n✗ Some endpoints failed. Please check the errors above." -ForegroundColor Red
} else {
    Write-Host "`n⚠ Some endpoints are still starting. Please wait and run the test again." -ForegroundColor Yellow
}

Write-Host "`n========================================`n" -ForegroundColor Cyan
