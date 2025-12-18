# Test with explicit User-Agent header
$ErrorActionPreference = "Continue"
$API_URL = "http://localhost:8080/api"

Write-Host "`n=== Testing with Different User-Agent Headers ===" -ForegroundColor Cyan

$testCases = @(
    @{Name = "No User-Agent"; Headers = @{"Content-Type" = "application/json"}},
    @{Name = "curl User-Agent"; Headers = @{"Content-Type" = "application/json"; "User-Agent" = "curl/7.68.0"}},
    @{Name = "Browser User-Agent"; Headers = @{"Content-Type" = "application/json"; "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}},
    @{Name = "Empty User-Agent"; Headers = @{"Content-Type" = "application/json"; "User-Agent" = ""}}
)

foreach ($test in $testCases) {
    Write-Host "`nTest: $($test.Name)" -ForegroundColor Yellow
    try {
        $body = @{
            emailOrUsername = "john_client"
            password = "password123"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$API_URL/auth/login" `
            -Method Post `
            -Body $body `
            -Headers $test.Headers
        
        Write-Host "✓ Success!" -ForegroundColor Green
        Write-Host "  Role: $($response.role)" -ForegroundColor Gray
        break
        
    } catch {
        Write-Host "✗ Failed - Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
