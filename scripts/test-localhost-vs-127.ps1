# Test with 127.0.0.1 instead of localhost
$ErrorActionPreference = "Continue"
$API_URL_LOCALHOST = "http://localhost:8080/api"
$API_URL_127 = "http://127.0.0.1:8080/api"

Write-Host "`n=== Testing with localhost vs 127.0.0.1 ===" -ForegroundColor Cyan

# Test with localhost
Write-Host "`nTest 1: Login with localhost" -ForegroundColor Yellow
try {
    $loginData = @{
        emailOrUsername = "john_client"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$API_URL_LOCALHOST/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    Write-Host "✓ Success with localhost!" -ForegroundColor Green
    Write-Host "  Role: $($response.role)" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ Failed with localhost - Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test with 127.0.0.1
Write-Host "`nTest 2: Login with 127.0.0.1" -ForegroundColor Yellow
try {
    $loginData = @{
        emailOrUsername = "john_client"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$API_URL_127/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    Write-Host "✓ Success with 127.0.0.1!" -ForegroundColor Green
    Write-Host "  Role: $($response.role)" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ Failed with 127.0.0.1 - Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test GET with localhost
Write-Host "`nTest 3: GET test with localhost" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL_LOCALHOST/auth/test" -Method Get
    Write-Host "✓ GET works with localhost: $response" -ForegroundColor Green
} catch {
    Write-Host "✗ GET failed with localhost" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
