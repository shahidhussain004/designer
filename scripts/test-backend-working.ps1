# Working backend test script - matches Postman approach
# This script creates a new user and logs in successfully

$ErrorActionPreference = "Continue"
$API_URL = "http://localhost:8080/api"

Write-Host "`n=== Testing Marketplace Backend API (Working Version) ===" -ForegroundColor Cyan
Write-Host "Backend URL: $API_URL" -ForegroundColor Yellow

# Generate unique username to avoid conflicts
$timestamp = Get-Date -Format "MMddHHmmss"
$username = "testuser$timestamp"
$email = "test$timestamp@example.com"

Write-Host "`n[1/3] Testing backend health check..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-RestMethod -Uri "$API_URL/auth/test" -Method Get
    Write-Host "✓ Backend is healthy: $testResponse" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend health check failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/3] Registering new user..." -ForegroundColor Yellow
Write-Host "  Username: $username" -ForegroundColor Gray
Write-Host "  Email: $email" -ForegroundColor Gray

try {
    $registerData = @{
        email = $email
        username = $username
        password = "TestPassword123!"
        fullName = "Test User"
        role = "CLIENT"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "$API_URL/auth/register" `
        -Method Post `
        -Body $registerData `
        -ContentType "application/json"
    
    Write-Host "✓ User registered successfully" -ForegroundColor Green
    Write-Host "  User ID: $($registerResponse.user.id)" -ForegroundColor Gray
    Write-Host "  Access Token: $($registerResponse.accessToken.Substring(0, 50))..." -ForegroundColor DarkGray
    
} catch {
    Write-Host "✗ Registration failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "  Response: $errorBody" -ForegroundColor Red
            $reader.Close()
        } catch {
            # Ignore read errors
        }
    }
    exit 1
}

Write-Host "`n[3/3] Logging in with newly created user..." -ForegroundColor Yellow
Write-Host "  Username: $username" -ForegroundColor Gray

try {
    $loginData = @{
        emailOrUsername = $username
        password = "TestPassword123!"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "`n  ===== Login Response =====" -ForegroundColor Cyan
    Write-Host "  User ID: $($loginResponse.user.id)" -ForegroundColor Gray
    Write-Host "  Email: $($loginResponse.user.email)" -ForegroundColor Gray
    Write-Host "  Username: $($loginResponse.user.username)" -ForegroundColor Gray
    Write-Host "  Full Name: $($loginResponse.user.fullName)" -ForegroundColor Gray
    Write-Host "  Role: $($loginResponse.user.role)" -ForegroundColor Gray
    Write-Host "  Access Token: $($loginResponse.accessToken.Substring(0, 50))..." -ForegroundColor DarkGray
    Write-Host "  Refresh Token: $($loginResponse.refreshToken.Substring(0, 50))..." -ForegroundColor DarkGray
    Write-Host "  Token Type: $($loginResponse.tokenType)" -ForegroundColor Gray
    Write-Host "  ========================" -ForegroundColor Cyan
    
    # Store tokens for potential use
    $script:accessToken = $loginResponse.accessToken
    $script:refreshToken = $loginResponse.refreshToken
    
    Write-Host "`n✓ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "  Backend authentication is working correctly`n" -ForegroundColor Green
    
} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "  Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "  Response: $errorBody" -ForegroundColor Red
            $reader.Close()
        } catch {
            # Ignore read errors
        }
    }
    exit 1
}

Write-Host ""
