# LMS API Integration Test Script
# Tests all LMS endpoints from marketplace-web frontend

param(
    [string]$LmsBaseUrl = "http://localhost:8082/api",
    [string]$AuthToken = ""
)

$ErrorActionPreference = "Continue"
$global:passCount = 0
$global:failCount = 0

# Color output helpers
function Write-Success([string]$message) {
    Write-Host "✅ $message" -ForegroundColor Green
    $global:passCount++
}

function Write-Error([string]$message) {
    Write-Host "❌ $message" -ForegroundColor Red
    $global:failCount++
}

function Write-Info([string]$message) {
    Write-Host "ℹ️  $message" -ForegroundColor Cyan
}

function Write-Header([string]$message) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host $message -ForegroundColor Blue
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
}

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Description = ""
    )
    
    try {
        $url = "$LmsBaseUrl$Endpoint"
        Write-Info "Testing: $Description"
        Write-Info "URL: $Method $url"
        
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($AuthToken) {
            $headers["Authorization"] = "Bearer $AuthToken"
        }
        
        $params = @{
            Uri     = $url
            Method  = $Method
            Headers = $headers
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params -SkipHttpErrorCheck -SkipHeaderValidation
        
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            Write-Success "$Description (HTTP $($response.StatusCode))"
            return $response.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
        } elseif ($response.StatusCode -eq 404) {
            Write-Error "$Description - Endpoint not found (HTTP $($response.StatusCode))"
        } elseif ($response.StatusCode -eq 401 -or $response.StatusCode -eq 403) {
            Write-Error "$Description - Authentication/Authorization failed (HTTP $($response.StatusCode))"
        } else {
            Write-Error "$Description - HTTP $($response.StatusCode): $($response.Content)"
        }
        return $null
    }
    catch {
        Write-Error "$Description - Exception: $($_.Exception.Message)"
        return $null
    }
}

# Main test flow
Write-Header "LMS API Integration Test Suite"
Write-Info "Testing LMS Service at: $LmsBaseUrl"
Write-Info "Auth Token: $(if ($AuthToken) { 'Provided' } else { 'None (public endpoints only)' })"

# Test 1: Health Check
Write-Header "TEST 1: Health & Status Endpoints"
Test-Endpoint -Method "GET" -Endpoint "/health" -Description "Health check endpoint"

# Test 2: Course Endpoints
Write-Header "TEST 2: Course Management Endpoints"
Test-Endpoint -Method "GET" -Endpoint "/courses?page=1&pageSize=10" -Description "Get courses list"
Test-Endpoint -Method "GET" -Endpoint "/courses/popular?count=5" -Description "Get popular courses"
Test-Endpoint -Method "GET" -Endpoint "/courses/top-rated?count=5" -Description "Get top-rated courses"
Test-Endpoint -Method "GET" -Endpoint "/courses/newest?count=5" -Description "Get newest courses"

# Test 3: Enrollment Endpoints
Write-Header "TEST 3: Enrollment Endpoints"
Test-Endpoint -Method "GET" -Endpoint "/enrollments?page=1&pageSize=10" -Description "Get enrollments list"

# Test 4: Certificate Endpoints
Write-Header "TEST 4: Certificate Endpoints"
Test-Endpoint -Method "GET" -Endpoint "/certificates?page=1&pageSize=10" -Description "Get certificates list"

# Test 5: Quiz Endpoints
Write-Header "TEST 5: Quiz Endpoints"
Test-Endpoint -Method "GET" -Endpoint "/quizzes?page=1&pageSize=10" -Description "Get quizzes list"

# Summary
Write-Header "Test Summary"
Write-Host "Passed: $($global:passCount)" -ForegroundColor Green
Write-Host "Failed: $($global:failCount)" -ForegroundColor Red

if ($global:failCount -eq 0) {
    Write-Host ""
    Write-Success "All tests passed! LMS API is fully operational."
    exit 0
} else {
    Write-Host ""
    Write-Error "Some tests failed. Please check the errors above."
    exit 1
}
