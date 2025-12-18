# Test with curl to see raw HTTP interaction
$ErrorActionPreference = "Continue"

Write-Host "`n=== Testing with CURL for detailed HTTP debugging ===" -ForegroundColor Cyan

# Test 1: GET test endpoint
Write-Host "`nTest 1: GET /api/auth/test" -ForegroundColor Yellow
curl -v http://localhost:8080/api/auth/test 2>&1 | Write-Host

Write-Host "`n`n"

# Test 2: POST login with explicit headers
Write-Host "Test 2: POST /api/auth/login with JSON body" -ForegroundColor Yellow
$json = '{"emailOrUsername":"john_client","password":"password123"}'
curl -v -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -H "Accept: application/json" -d $json 2>&1 | Write-Host

Write-Host "`n=== Tests complete ===" -ForegroundColor Cyan
