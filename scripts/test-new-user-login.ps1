# Try logging in with the user we just created
$ErrorActionPreference = "Continue"
$API_URL = "http://localhost:8080/api"

Write-Host "`n=== Testing Login with Newly Created User ===" -ForegroundColor Cyan

# First create a user
Write-Host "Step 1: Creating test user..." -ForegroundColor Yellow
$username = "testuser$(Get-Random -Maximum 10000)"
try {
    $registerData = @{
        email = "test@example.com"
        username = $username
        password = "password123"
        fullName = "Test User"
        role = "FREELANCER"
    } | ConvertTo-Json
    
    $registerResponse = Invoke-RestMethod -Uri "$API_URL/auth/register" `
        -Method Post `
        -Body $registerData `
        -ContentType "application/json"
    
    Write-Host "✓ User created: $username" -ForegroundColor Green
    
} catch {
    Write-Host "✗ Registration failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Now try to login
Write-Host "`nStep 2: Attempting login..." -ForegroundColor Yellow
try {
    $loginData = @{
        emailOrUsername = $username
        password = "password123"
    } | ConvertTo-Json
    
    Write-Host "Login request body: $loginData" -ForegroundColor Gray
    
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  Access Token: $($loginResponse.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "  Role: $($loginResponse.role)" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
}

# Also try with existing user
Write-Host "`nStep 3: Trying with seeded user john_client..." -ForegroundColor Yellow
try {
    $loginData = @{
        emailOrUsername = "john_client"
        password = "password123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  Access Token: $($loginResponse.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "  Role: $($loginResponse.role)" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
