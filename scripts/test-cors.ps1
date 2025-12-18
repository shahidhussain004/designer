# Browser CORS Test - Simulates what the browser does
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "CORS TEST - Simulating Browser Request" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$loginUrl = "http://localhost:8080/api/auth/login"

# Test 1: OPTIONS preflight request (what browser sends first for CORS)
Write-Host "Test 1: Sending OPTIONS preflight request..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $loginUrl -Method OPTIONS `
        -Headers @{
            "Origin" = "http://localhost:3000"
            "Access-Control-Request-Method" = "POST"
            "Access-Control-Request-Headers" = "content-type"
        } -UseBasicParsing
    
    Write-Host "✓ OPTIONS request successful!" -ForegroundColor Green
    Write-Host "  Status Code: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "  CORS Headers:" -ForegroundColor Gray
    $response.Headers.GetEnumerator() | Where-Object { $_.Key -like "Access-Control-*" } | ForEach-Object {
        Write-Host "    $($_.Key): $($_.Value)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ OPTIONS request failed!" -ForegroundColor Red
    Write-Host "  Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "This is likely the CORS issue causing the 403 error!" -ForegroundColor Red
}

Write-Host ""

# Test 2: POST request with Origin header (simulating browser)
Write-Host "Test 2: Sending POST request with Origin header..." -ForegroundColor Yellow
$body = @{
    emailOrUsername = "client1@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $loginUrl -Method POST `
        -Body $body -ContentType "application/json" `
        -Headers @{ "Origin" = "http://localhost:3000" } `
        -UseBasicParsing
    
    Write-Host "✓ POST request successful!" -ForegroundColor Green
    Write-Host "  Status Code: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "  CORS Headers:" -ForegroundColor Gray
    $response.Headers.GetEnumerator() | Where-Object { $_.Key -like "Access-Control-*" } | ForEach-Object {
        Write-Host "    $($_.Key): $($_.Value)" -ForegroundColor Gray
    }
    
    $jsonResponse = $response.Content | ConvertFrom-Json
    Write-Host "  Access Token: $($jsonResponse.accessToken.Substring(0, 30))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ POST request failed!" -ForegroundColor Red
    Write-Host "  Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        Write-Host "  Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Test complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "If both tests pass, the backend CORS is configured correctly." -ForegroundColor White
Write-Host "If the browser still shows 403, check the browser console for details." -ForegroundColor White
Write-Host "======================================" -ForegroundColor Cyan
