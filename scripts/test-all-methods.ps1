# More comprehensive test with different request methods
$ErrorActionPreference = "Stop"
$API_URL = "http://localhost:8080/api"

Write-Host "`n=== Comprehensive Login Test ===" -ForegroundColor Cyan

# Approach 1: Using Invoke-RestMethod (simpler, auto-parses JSON)
Write-Host "`nApproach 1: Using Invoke-RestMethod" -ForegroundColor Yellow
try {
    $loginData = @{
        emailOrUsername = "john_client"
        password = "password123"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method Post `
        -Body ($loginData | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "✓ Login successful with Invoke-RestMethod!" -ForegroundColor Green
    Write-Host "  Access Token: $($response.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "  Role: $($response.role)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed with Invoke-RestMethod" -ForegroundColor Red
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
}

# Approach 2: Using Invoke-WebRequest with -UseBasicParsing
Write-Host "`nApproach 2: Using Invoke-WebRequest with -UseBasicParsing" -ForegroundColor Yellow
try {
    $loginData = @{
        emailOrUsername = "john_client"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$API_URL/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "✓ Login successful with Invoke-WebRequest!" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Access Token: $($data.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "  Role: $($data.role)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed with Invoke-WebRequest" -ForegroundColor Red
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
}

# Approach 3: Using Invoke-WebRequest without -UseBasicParsing
Write-Host "`nApproach 3: Using Invoke-WebRequest without -UseBasicParsing" -ForegroundColor Yellow
try {
    $loginData = @{
        emailOrUsername = "john_client"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$API_URL/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    Write-Host "✓ Login successful without -UseBasicParsing!" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Access Token: $($data.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "  Role: $($data.role)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed without -UseBasicParsing" -ForegroundColor Red
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
}

# Approach 4: Using System.Net.Http.HttpClient directly
Write-Host "`nApproach 4: Using .NET HttpClient" -ForegroundColor Yellow
try {
    $httpClient = New-Object System.Net.Http.HttpClient
    $content = New-Object System.Net.Http.StringContent(
        '{"emailOrUsername":"john_client","password":"password123"}',
        [System.Text.Encoding]::UTF8,
        "application/json"
    )
    
    $task = $httpClient.PostAsync("$API_URL/auth/login", $content)
    $response = $task.Result
    $responseBody = $response.Content.ReadAsStringAsync().Result
    
    if ($response.IsSuccessStatusCode) {
        Write-Host "✓ Login successful with HttpClient!" -ForegroundColor Green
        $data = $responseBody | ConvertFrom-Json
        Write-Host "  Access Token: $($data.accessToken.Substring(0, 50))..." -ForegroundColor Gray
        Write-Host "  Role: $($data.role)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed with HttpClient" -ForegroundColor Red
        Write-Host "  Status: $($response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "  Response: $responseBody" -ForegroundColor Red
    }
    
    $httpClient.Dispose()
} catch {
    Write-Host "✗ Exception with HttpClient" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
