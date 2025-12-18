# Test login endpoint
Write-Host "Testing Backend Login Endpoint..." -ForegroundColor Cyan
Write-Host ""

$loginUrl = "http://localhost:8080/api/auth/login"
$testUrl = "http://localhost:8080/api/auth/test"

# Test 1: Check if backend is running
Write-Host "Test 1: Checking if backend is reachable..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $testUrl -Method GET -UseBasicParsing
    Write-Host "✓ Backend is reachable!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend is NOT reachable!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Try login with client credentials
Write-Host "Test 2: Testing login with client credentials..." -ForegroundColor Yellow
$body = @{
    emailOrUsername = "client1@example.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "Sending POST to: $loginUrl" -ForegroundColor Gray
Write-Host "Body: $body" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to get response content
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Cyan
