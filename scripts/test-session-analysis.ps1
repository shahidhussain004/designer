# Debug detailed request/response with session tracking
$ErrorActionPreference = "Continue"
$API_URL = "http://localhost:8080/api"

Write-Host "`n=== Detailed Request/Response Analysis ===" -ForegroundColor Cyan

# Test 1: GET request to see headers
Write-Host "`nTest 1: GET /api/auth/test with -SessionVariable" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/test" -Method GET -SessionVariable session -UseBasicParsing
    
    Write-Host "✓ GET successful" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "  Response Headers:" -ForegroundColor Gray
    $response.Headers.GetEnumerator() | ForEach-Object {
        Write-Host "    $($_.Key): $($_.Value)" -ForegroundColor DarkGray
    }
    
    Write-Host "`n  Session Cookies:" -ForegroundColor Gray
    if ($session.Cookies.Count -gt 0) {
        $session.Cookies.GetCookies("$API_URL") | ForEach-Object {
            Write-Host "    $($_.Name) = $($_.Value)" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "    (No cookies)" -ForegroundColor DarkGray
    }
    
} catch {
    Write-Host "✗ GET failed" -ForegroundColor Red
}

# Test 2: POST request with same session
Write-Host "`nTest 2: POST /api/auth/login using same session" -ForegroundColor Yellow
try {
    $body = @{
        emailOrUsername = "john_client"
        password = "password123"
    } | ConvertTo-Json
    
    Write-Host "  Request Body: $body" -ForegroundColor Gray
    
    $response = Invoke-WebRequest -Uri "$API_URL/auth/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -WebSession $session `
        -UseBasicParsing
    
    Write-Host "✓ POST successful" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ POST failed" -ForegroundColor Red
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Check what request was actually sent
    if ($_.Exception.Response) {
        Write-Host "`n  Actual Request Details:" -ForegroundColor Red
        Write-Host "    Method: POST" -ForegroundColor DarkGray
        Write-Host "    URI: $API_URL/auth/login" -ForegroundColor DarkGray
    }
}

# Test 3: POST without session (fresh request)
Write-Host "`nTest 3: POST /api/auth/login WITHOUT session" -ForegroundColor Yellow
try {
    $body = @{
        emailOrUsername = "john_client"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$API_URL/auth/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "✓ POST successful" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ POST failed (as expected)" -ForegroundColor Red
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`n=== Analysis Complete ===" -ForegroundColor Cyan
