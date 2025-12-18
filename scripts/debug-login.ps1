# Debug script for login 403 issue
# Shows detailed request and response information

$ErrorActionPreference = "Continue"
$API_URL = "http://localhost:8080/api"

Write-Host "`n=== Debugging Login 403 Issue ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check backend status
Write-Host "Test 1: Checking backend status..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-WebRequest -Uri "$API_URL/auth/test" -Method GET -UseBasicParsing
    Write-Host "✓ Backend is responding" -ForegroundColor Green
    Write-Host "  Status: $($testResponse.StatusCode)" -ForegroundColor Gray
    Write-Host "  Response: $($testResponse.Content)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend not responding" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Attempt login with detailed debugging
Write-Host "Test 2: Attempting login with CLIENT user..." -ForegroundColor Yellow

$loginUrl = "$API_URL/auth/login"
$loginBody = @{
    emailOrUsername = "john_client"
    password = "password123"
} | ConvertTo-Json

Write-Host "  URL: $loginUrl" -ForegroundColor Gray
Write-Host "  Method: POST" -ForegroundColor Gray
Write-Host "  Request Body: $loginBody" -ForegroundColor Gray
Write-Host ""

try {
    # Create web request with detailed error handling
    $headers = @{
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }
    
    Write-Host "  Request Headers:" -ForegroundColor Gray
    $headers.GetEnumerator() | ForEach-Object {
        Write-Host "    $($_.Key): $($_.Value)" -ForegroundColor Gray
    }
    Write-Host ""

    $response = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $loginBody -Headers $headers -UseBasicParsing
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
    
    # Parse and display tokens
    $loginData = $response.Content | ConvertFrom-Json
    Write-Host ""
    Write-Host "  Access Token: $($loginData.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "  Refresh Token: $($loginData.refreshToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "  User Role: $($loginData.role)" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Error Type: $($_.Exception.GetType().FullName)" -ForegroundColor Red
    Write-Host "  Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host ""
        Write-Host "  Response Details:" -ForegroundColor Red
        Write-Host "    Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "    Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
        
        # Try to read response content
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "    Response Body: $responseBody" -ForegroundColor Red
            $reader.Close()
        } catch {
            Write-Host "    Could not read response body" -ForegroundColor Red
        }
        
        # Display response headers
        Write-Host ""
        Write-Host "  Response Headers:" -ForegroundColor Red
        $_.Exception.Response.Headers | ForEach-Object {
            Write-Host "    $($_): $($_.Exception.Response.Headers[$_])" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "  Stack Trace:" -ForegroundColor Red
    Write-Host "    $($_.Exception.StackTrace)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Debug Complete ===" -ForegroundColor Cyan
