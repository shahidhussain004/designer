# Test register endpoint to see if POST works in general
$ErrorActionPreference = "Continue"
$API_URL = "http://localhost:8080/api"

Write-Host "`n=== Testing Register Endpoint (POST) ===" -ForegroundColor Cyan

try {
    $registerData = @{
        email = "test@example.com"
        username = "testuser$(Get-Random -Maximum 10000)"
        password = "password123"
        fullName = "Test User"
        role = "FREELANCER"
    } | ConvertTo-Json
    
    Write-Host "Registering user..." -ForegroundColor Yellow
    Write-Host "Body: $registerData" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$API_URL/auth/register" `
        -Method Post `
        -Body $registerData `
        -ContentType "application/json"
    
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "  User ID: $($response.userId)" -ForegroundColor Gray
    Write-Host "  Username: $($response.username)" -ForegroundColor Gray
    Write-Host "  Role: $($response.role)" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ Registration failed" -ForegroundColor Red
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
