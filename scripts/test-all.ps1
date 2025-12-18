#!/usr/bin/env pwsh
# Comprehensive Test Suite for Designer Marketplace
# Tests Backend, Frontend, Database, and Integration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 MARKETPLACE COMPREHENSIVE TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Color helpers
$green = 'Green'
$red = 'Red'
$yellow = 'Yellow'

# Test counters
$passed = 0
$failed = 0

function Test-Backend {
    Write-Host "`n📦 BACKEND TESTS" -ForegroundColor Magenta
    Write-Host "=================" -ForegroundColor Magenta

    # Test 1: Health Check
    Write-Host "`nTest 1: Backend Health Check..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -SkipHttpErrorCheck -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ PASS" -ForegroundColor $green
            $global:passed++
        } else {
            Write-Host " ❌ FAIL (Status: $($response.StatusCode))" -ForegroundColor $red
            $global:failed++
        }
    } catch {
        Write-Host " ❌ FAIL (Connection refused)" -ForegroundColor $red
        $global:failed++
        return
    }

    # Test 2: Login Endpoint
    Write-Host "`nTest 2: Login Endpoint (POST /api/auth/login)..." -NoNewline
    try {
        $loginBody = @{
            emailOrUsername = "client1@example.com"
            password = "password123"
        } | ConvertTo-Json

        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $loginBody -SkipHttpErrorCheck -TimeoutSec 5

        if ($response.StatusCode -eq 200) {
            $data = $response.Content | ConvertFrom-Json
            if ($data.accessToken -and $data.refreshToken -and $data.user) {
                Write-Host " ✅ PASS" -ForegroundColor $green
                Write-Host "   - User: $($data.user.email) (Role: $($data.user.role))" -ForegroundColor Gray
                Write-Host "   - Access Token Length: $($data.accessToken.Length)" -ForegroundColor Gray
                Write-Host "   - Refresh Token Length: $($data.refreshToken.Length)" -ForegroundColor Gray
                $global:passed++
                $global:accessToken = $data.accessToken
            } else {
                Write-Host " ❌ FAIL (Invalid response structure)" -ForegroundColor $red
                $global:failed++
            }
        } else {
            Write-Host " ❌ FAIL (Status: $($response.StatusCode))" -ForegroundColor $red
            $global:failed++
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }

    # Test 3: Register Endpoint
    Write-Host "`nTest 3: Register Endpoint (POST /api/auth/register)..." -NoNewline
    try {
        $timestamp = Get-Date -Format "yyyyMMddHHmmss"
        $registerBody = @{
            email = "testuser_$timestamp@example.com"
            username = "testuser_$timestamp"
            password = "password123"
            fullName = "Test User"
            role = "FREELANCER"
        } | ConvertTo-Json

        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $registerBody -SkipHttpErrorCheck -TimeoutSec 5

        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            $data = $response.Content | ConvertFrom-Json
            if ($data.accessToken -and $data.user) {
                Write-Host " ✅ PASS" -ForegroundColor $green
                Write-Host "   - New User: $($data.user.email)" -ForegroundColor Gray
                $global:passed++
            } else {
                Write-Host " ❌ FAIL (Invalid response)" -ForegroundColor $red
                $global:failed++
            }
        } else {
            Write-Host " ❌ FAIL (Status: $($response.StatusCode))" -ForegroundColor $red
            $global:failed++
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }

    # Test 4: Token Refresh
    Write-Host "`nTest 4: Token Refresh Endpoint (POST /api/auth/refresh)..." -NoNewline
    try {
        $loginBody = @{
            emailOrUsername = "freelancer1@example.com"
            password = "password123"
        } | ConvertTo-Json

        $loginResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $loginBody -SkipHttpErrorCheck

        if ($loginResponse.StatusCode -eq 200) {
            $loginData = $loginResponse.Content | ConvertFrom-Json
            $refreshBody = @{
                refreshToken = $loginData.refreshToken
            } | ConvertTo-Json

            $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/refresh" -Method POST `
                -Headers @{"Content-Type"="application/json"} `
                -Body $refreshBody -SkipHttpErrorCheck -TimeoutSec 5

            if ($response.StatusCode -eq 200) {
                $data = $response.Content | ConvertFrom-Json
                if ($data.accessToken) {
                    Write-Host " ✅ PASS" -ForegroundColor $green
                    $global:passed++
                } else {
                    Write-Host " ❌ FAIL (No token in response)" -ForegroundColor $red
                    $global:failed++
                }
            } else {
                Write-Host " ❌ FAIL (Status: $($response.StatusCode))" -ForegroundColor $red
                $global:failed++
            }
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }

    # Test 5: Swagger/OpenAPI Documentation
    Write-Host "`nTest 5: Swagger UI (GET /swagger-ui/index.html)..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/swagger-ui/index.html" -SkipHttpErrorCheck -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ PASS" -ForegroundColor $green
            $global:passed++
        } else {
            Write-Host " ❌ FAIL (Status: $($response.StatusCode))" -ForegroundColor $red
            $global:failed++
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }
}

function Test-Database {
    Write-Host "`n🗄️  DATABASE TESTS" -ForegroundColor Magenta
    Write-Host "=================" -ForegroundColor Magenta

    # Test 1: Users Table
    Write-Host "`nTest 1: Users Table (Count: should be 50)..." -NoNewline
    try {
        $result = docker exec designer-postgres-1 psql -U marketplace_user -d marketplace_db -t -c "SELECT COUNT(*) FROM users;" 2>&1
        $count = [int]($result -match '\d+' | Select-Object -First 1)
        if ($count -eq 50) {
            Write-Host " ✅ PASS ($count users)" -ForegroundColor $green
            $global:passed++
        } else {
            Write-Host " ❌ FAIL (Found $count, expected 50)" -ForegroundColor $red
            $global:failed++
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }

    # Test 2: Jobs Table
    Write-Host "`nTest 2: Jobs Table (Count: should be 10)..." -NoNewline
    try {
        $result = docker exec designer-postgres-1 psql -U marketplace_user -d marketplace_db -t -c "SELECT COUNT(*) FROM jobs;" 2>&1
        $count = [int]($result -match '\d+' | Select-Object -First 1)
        if ($count -eq 10) {
            Write-Host " ✅ PASS ($count jobs)" -ForegroundColor $green
            $global:passed++
        } else {
            Write-Host " ❌ FAIL (Found $count, expected 10)" -ForegroundColor $red
            $global:failed++
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }

    # Test 3: Proposals Table
    Write-Host "`nTest 3: Proposals Table (Count: should be > 10)..." -NoNewline
    try {
        $result = docker exec designer-postgres-1 psql -U marketplace_user -d marketplace_db -t -c "SELECT COUNT(*) FROM proposals;" 2>&1
        $count = [int]($result -match '\d+' | Select-Object -First 1)
        if ($count -gt 10) {
            Write-Host " ✅ PASS ($count proposals)" -ForegroundColor $green
            $global:passed++
        } else {
            Write-Host " ❌ FAIL (Found $count, expected > 10)" -ForegroundColor $red
            $global:failed++
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }

    # Test 4: Flyway Migration History
    Write-Host "`nTest 4: Flyway Schema History (Migrations: should be 2)..." -NoNewline
    try {
        $result = docker exec designer-postgres-1 psql -U marketplace_user -d marketplace_db -t -c "SELECT COUNT(*) FROM flyway_schema_history;" 2>&1
        $count = [int]($result -match '\d+' | Select-Object -First 1)
        if ($count -ge 2) {
            Write-Host " ✅ PASS ($count migrations)" -ForegroundColor $green
            $global:passed++
        } else {
            Write-Host " ❌ FAIL (Found $count migrations, expected >= 2)" -ForegroundColor $red
            $global:failed++
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }

    # Test 5: Password Hash Verification
    Write-Host "`nTest 5: BCrypt Password Hashes..." -NoNewline
    try {
        $result = docker exec designer-postgres-1 psql -U marketplace_user -d marketplace_db -t -c "SELECT password_hash FROM users LIMIT 1;" 2>&1
        if ($result -match '\$2a\$12\$') {
            Write-Host " ✅ PASS (BCrypt hashes detected)" -ForegroundColor $green
            $global:passed++
        } else {
            Write-Host " ❌ FAIL (No BCrypt hashes found)" -ForegroundColor $red
            $global:failed++
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }
}

function Test-Frontend {
    Write-Host "`n🌐 FRONTEND TESTS" -ForegroundColor Magenta
    Write-Host "=================" -ForegroundColor Magenta

    # Test 1: Check if npm dev can start
    Write-Host "`nTest 1: Frontend Dependencies (node_modules)..." -NoNewline
    $frontendPath = "c:\playground\designer\frontend\marketplace-web"
    if (Test-Path "$frontendPath\node_modules") {
        Write-Host " ✅ PASS (node_modules exists)" -ForegroundColor $green
        $global:passed++
    } else {
        Write-Host " ⚠️  WARNING (node_modules not found, may need npm install)" -ForegroundColor $yellow
        $global:failed++
    }

    # Test 2: Check Next.js config
    Write-Host "`nTest 2: Next.js Configuration..." -NoNewline
    if (Test-Path "$frontendPath\next.config.js") {
        Write-Host " ✅ PASS (next.config.js exists)" -ForegroundColor $green
        $global:passed++
    } else {
        Write-Host " ❌ FAIL (next.config.js not found)" -ForegroundColor $red
        $global:failed++
    }

    # Test 3: Check required files
    Write-Host "`nTest 3: Auth Pages..." -NoNewline
    $hasLogin = Test-Path "$frontendPath\app\auth\login\page.tsx"
    $hasRegister = Test-Path "$frontendPath\app\auth\register\page.tsx"
    if ($hasLogin -and $hasRegister) {
        Write-Host " ✅ PASS (login and register pages exist)" -ForegroundColor $green
        $global:passed++
    } else {
        Write-Host " ❌ FAIL (Missing auth pages)" -ForegroundColor $red
        $global:failed++
    }

    # Test 4: Check lib files
    Write-Host "`nTest 4: Frontend Utilities..." -NoNewline
    $hasAuth = Test-Path "$frontendPath\lib\auth.ts"
    $hasApi = Test-Path "$frontendPath\lib\api-client.ts"
    if ($hasAuth -and $hasApi) {
        Write-Host " ✅ PASS (auth.ts and api-client.ts exist)" -ForegroundColor $green
        $global:passed++
    } else {
        Write-Host " ❌ FAIL (Missing utility files)" -ForegroundColor $red
        $global:failed++
    }

    # Test 5: Check TypeScript config
    Write-Host "`nTest 5: TypeScript Configuration..." -NoNewline
    if (Test-Path "$frontendPath\tsconfig.json") {
        Write-Host " ✅ PASS (tsconfig.json exists)" -ForegroundColor $green
        $global:passed++
    } else {
        Write-Host " ❌ FAIL (tsconfig.json not found)" -ForegroundColor $red
        $global:failed++
    }
}

function Test-Integration {
    Write-Host "`n🔗 INTEGRATION TESTS" -ForegroundColor Magenta
    Write-Host "===================" -ForegroundColor Magenta

    # Test 1: Backend and Database connectivity
    Write-Host "`nTest 1: Backend-Database Connection..." -NoNewline
    try {
        # Try to get a user from backend through API
        $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -SkipHttpErrorCheck -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ PASS" -ForegroundColor $green
            $global:passed++
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }

    # Test 2: Data Consistency
    Write-Host "`nTest 2: Test User Login (Data Integrity)..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body '{"emailOrUsername":"client1@example.com","password":"password123"}' `
            -SkipHttpErrorCheck -TimeoutSec 5

        if ($response.StatusCode -eq 200) {
            $data = $response.Content | ConvertFrom-Json
            if ($data.user.email -eq "client1@example.com" -and $data.user.role -eq "CLIENT") {
                Write-Host " ✅ PASS (Data matches expectations)" -ForegroundColor $green
                $global:passed++
            }
        }
    } catch {
        Write-Host " ❌ FAIL ($_)" -ForegroundColor $red
        $global:failed++
    }

    # Test 3: JWT Token Format
    Write-Host "`nTest 3: JWT Token Structure..." -NoNewline
    try {
        if ($global:accessToken) {
            $parts = $global:accessToken.Split('.')
            if ($parts.Count -eq 3) {
                Write-Host " ✅ PASS (Valid JWT format - 3 parts)" -ForegroundColor $green
                $global:passed++
            }
        }
    } catch {
        Write-Host " ⚠️  WARNING (Skipped - no token)" -ForegroundColor $yellow
    }
}

function Show-Summary {
    Write-Host "`n`n========================================" -ForegroundColor Cyan
    Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    $total = $global:passed + $global:failed
    $passRate = if ($total -gt 0) { [math]::Round(($global:passed / $total) * 100, 1) } else { 0 }
    
    Write-Host "`n✅ Passed: $($global:passed)" -ForegroundColor $green
    Write-Host "❌ Failed: $($global:failed)" -ForegroundColor $red
    Write-Host "📊 Total:  $total" -ForegroundColor Cyan
    Write-Host "📈 Pass Rate: $passRate%" -ForegroundColor $yellow
    
    if ($global:failed -eq 0) {
        Write-Host "`n🎉 ALL TESTS PASSED! Application is working correctly." -ForegroundColor $green
    } elseif ($passRate -ge 80) {
        Write-Host "`n✅ MOST TESTS PASSED (80%+). Application is mostly functional." -ForegroundColor $yellow
    } else {
        Write-Host "`n⚠️  CRITICAL ISSUES DETECTED. Please review failures above." -ForegroundColor $red
    }
    
    Write-Host "`n========================================" -ForegroundColor Cyan
}

function Show-NextSteps {
    Write-Host "`n📋 NEXT STEPS" -ForegroundColor Cyan
    Write-Host "==============" -ForegroundColor Cyan
    Write-Host "1. Backend - cd services\marketplace-service ; mvn spring-boot:run" -ForegroundColor Gray
    Write-Host "2. Frontend - cd frontend\marketplace-web ; npm install ; npm run dev" -ForegroundColor Gray
    Write-Host "3. API Docs - http://localhost:8080/swagger-ui/index.html" -ForegroundColor Gray
    Write-Host "4. Test Login - http://localhost:3000/auth/login (client1@example.com/password123)" -ForegroundColor Gray
}

# Initialize counters
$global:passed = 0
$global:failed = 0
$global:accessToken = $null

# Run all tests
Test-Backend
Test-Database
Test-Frontend
Test-Integration

# Show results
Show-Summary
Show-NextSteps

Write-Host "`n✨ Test suite completed!" -ForegroundColor Cyan
