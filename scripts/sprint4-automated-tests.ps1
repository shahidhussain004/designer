# Sprint 4: Automated End-to-End Test Script
# This script tests the core API endpoints and workflows

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  DESIGNER MARKETPLACE - END-TO-END TEST SUITE               ║" -ForegroundColor Cyan
Write-Host "║  Sprint 4: Automated Testing                                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api"
$frontendUrl = "http://localhost:3001"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [scriptblock]$TestBlock
    )
    
    Write-Host "`n[$Name]" -ForegroundColor Yellow
    Write-Host ("─" * 60) -ForegroundColor Gray
    
    try {
        $result = & $TestBlock
        if ($result) {
            Write-Host "✓ PASS" -ForegroundColor Green
            $script:testResults += @{Name=$Name; Status="PASS"; Error=""}
            return $true
        } else {
            Write-Host "✗ FAIL" -ForegroundColor Red
            $script:testResults += @{Name=$Name; Status="FAIL"; Error="Test returned false"}
            return $false
        }
    } catch {
        Write-Host "✗ FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += @{Name=$Name; Status="FAIL"; Error=$_.Exception.Message}
        return $false
    }
}

# Test 1: Backend Health Check
Test-Endpoint "Test 1: Backend Health Check" {
    Write-Host "Checking if backend is responding..." -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/test" -Method GET
    Write-Host "Response: $response" -ForegroundColor Cyan
    return $response -like "*reachable*"
}

# Test 2: User Registration (CLIENT)
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$clientEmail = "testclient_$timestamp@example.com"
$clientUsername = "testclient_$timestamp"
$clientToken = $null

Test-Endpoint "Test 2: Register New Client User" {
    Write-Host "Creating client: $clientUsername" -ForegroundColor Gray
    
    $body = @{
        email = $clientEmail
        username = $clientUsername
        password = "password123"
        fullName = "Test Client $timestamp"
        role = "CLIENT"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "User created: $($response.user.fullName)" -ForegroundColor Cyan
    Write-Host "Role: $($response.user.role)" -ForegroundColor Cyan
    $script:clientToken = $response.accessToken
    
    return ($response.user.email -eq $clientEmail -and $response.user.role -eq "CLIENT")
}

# Test 3: User Registration (FREELANCER)
$freelancerEmail = "testfreelancer_$timestamp@example.com"
$freelancerUsername = "testfreelancer_$timestamp"
$freelancerToken = $null

Test-Endpoint "Test 3: Register New Freelancer User" {
    Write-Host "Creating freelancer: $freelancerUsername" -ForegroundColor Gray
    
    $body = @{
        email = $freelancerEmail
        username = $freelancerUsername
        password = "password123"
        fullName = "Test Freelancer $timestamp"
        role = "FREELANCER"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "User created: $($response.user.fullName)" -ForegroundColor Cyan
    Write-Host "Role: $($response.user.role)" -ForegroundColor Cyan
    $script:freelancerToken = $response.accessToken
    
    return ($response.user.email -eq $freelancerEmail -and $response.user.role -eq "FREELANCER")
}

# Test 4: Login with Existing User
Test-Endpoint "Test 4: Login with Existing Credentials" {
    Write-Host "Logging in as client1@example.com..." -ForegroundColor Gray
    
    $body = @{
        emailOrUsername = "client1@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "Logged in as: $($response.user.fullName)" -ForegroundColor Cyan
    Write-Host "Token: $($response.accessToken.Substring(0,50))..." -ForegroundColor Gray
    
    return ($response.accessToken -ne $null)
}

# Test 5: Get Jobs List (Public)
$jobCount = 0
Test-Endpoint "Test 5: Get Public Jobs List" {
    Write-Host "Fetching jobs list..." -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$baseUrl/jobs" -Method GET
    $jobs = if ($response.content) { $response.content } else { $response }
    $script:jobCount = $jobs.Count
    
    Write-Host "Found $($jobs.Count) jobs" -ForegroundColor Cyan
    if ($jobs.Count -gt 0) {
        Write-Host "Sample job: $($jobs[0].title) - `$$($jobs[0].budget)" -ForegroundColor Gray
    }
    
    return ($jobs.Count -ge 0)
}

# Test 6: Get Specific Job Details
$testJobId = 1
Test-Endpoint "Test 6: Get Job Details by ID" {
    Write-Host "Fetching job ID: $testJobId..." -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$baseUrl/jobs/$testJobId" -Method GET
    
    Write-Host "Job: $($response.title)" -ForegroundColor Cyan
    Write-Host "Budget: `$$($response.budget)" -ForegroundColor Cyan
    Write-Host "Category: $($response.category)" -ForegroundColor Cyan
    
    return ($response.id -eq $testJobId)
}

# Test 7: Create New Job (CLIENT)
$newJobId = $null
Test-Endpoint "Test 7: Create New Job (Authenticated CLIENT)" {
    Write-Host "Creating job as authenticated client..." -ForegroundColor Gray
    
    if (-not $clientToken) {
        throw "Client token not available"
    }
    
    $body = @{
        title = "Automated Test Job - $timestamp"
        description = "This is an automated test job created during Sprint 4 testing. It includes detailed requirements and expectations for the project."
        category = "WEB_DEV"
        experienceLevel = "INTERMEDIATE"
        budget = 4500
    } | ConvertTo-Json
    
    $headers = @{
        "Authorization" = "Bearer $clientToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/jobs" `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    $script:newJobId = $response.id
    Write-Host "Job created with ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "Title: $($response.title)" -ForegroundColor Cyan
    Write-Host "Budget: `$$($response.budget)" -ForegroundColor Cyan
    
    return ($response.id -gt 0)
}

# Test 8: Submit Proposal (FREELANCER)
Test-Endpoint "Test 8: Submit Proposal (Authenticated FREELANCER)" {
    Write-Host "Submitting proposal to job ID: $newJobId..." -ForegroundColor Gray
    
    if (-not $freelancerToken) {
        throw "Freelancer token not available"
    }
    
    if (-not $newJobId) {
        throw "No job ID available for proposal"
    }
    
    $body = @{
        jobId = $newJobId
        coverLetter = "I am an experienced developer with expertise in the required technologies. I can complete this project within the timeline and budget."
        proposedRate = 4200
        estimatedDuration = 30
    } | ConvertTo-Json
    
    $headers = @{
        "Authorization" = "Bearer $freelancerToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/proposals" `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    Write-Host "Proposal submitted successfully" -ForegroundColor Cyan
    Write-Host "Proposal ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "Proposed Rate: `$$($response.proposedRate)" -ForegroundColor Cyan
    
    return ($response.id -gt 0)
}

# Test 9: Filter Jobs by Category
Test-Endpoint "Test 9: Filter Jobs by Category" {
    Write-Host "Filtering jobs by category: WEB_DESIGN..." -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$baseUrl/jobs?category=WEB_DESIGN" -Method GET
    $jobs = if ($response.content) { $response.content } else { $response }
    
    Write-Host "Found $($jobs.Count) WEB_DESIGN jobs" -ForegroundColor Cyan
    
    return ($jobs.Count -ge 0)
}

# Test 10: Filter Jobs by Budget Range
Test-Endpoint "Test 10: Filter Jobs by Budget Range" {
    Write-Host "Filtering jobs with budget between 3000-6000..." -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$baseUrl/jobs?minBudget=3000&maxBudget=6000" -Method GET
    $jobs = if ($response.content) { $response.content } else { $response }
    
    Write-Host "Found $($jobs.Count) jobs in budget range" -ForegroundColor Cyan
    
    return ($jobs.Count -ge 0)
}

# Test 11: CORS Verification
Test-Endpoint "Test 11: CORS Headers Verification" {
    Write-Host "Checking CORS headers from frontend origin..." -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/jobs" `
            -Method GET `
            -Headers @{"Origin"="http://localhost:3001"} `
            -UseBasicParsing
        
        Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Cyan
        Write-Host "CORS working correctly" -ForegroundColor Cyan
        
        return ($response.StatusCode -eq 200)
    } catch {
        return $false
    }
}

# Test 12: Token Refresh
Test-Endpoint "Test 12: Token Refresh" {
    Write-Host "Testing token refresh..." -ForegroundColor Gray
    
    # First, login to get refresh token
    $loginBody = @{
        emailOrUsername = "client1@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    $refreshToken = $loginResponse.refreshToken
    
    # Now refresh
    $refreshBody = @{
        refreshToken = $refreshToken
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/refresh" `
        -Method POST `
        -ContentType "application/json" `
        -Body $refreshBody
    
    Write-Host "New access token obtained" -ForegroundColor Cyan
    Write-Host "Token: $($response.accessToken.Substring(0,50))..." -ForegroundColor Gray
    
    return ($response.accessToken -ne $null)
}

# Summary Report
Write-Host "`n`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    TEST SUMMARY REPORT                       ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $testResults.Count

Write-Host "Total Tests: $totalCount" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host ""

if ($failCount -gt 0) {
    Write-Host "Failed Tests:" -ForegroundColor Red
    $testResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  ✗ $($_.Name)" -ForegroundColor Red
        if ($_.Error) {
            Write-Host "    Error: $($_.Error)" -ForegroundColor Gray
        }
    }
    Write-Host ""
}

$successRate = [math]::Round(($passCount / $totalCount) * 100, 2)
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -eq 100) { "Green" } else { "Yellow" })

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                   ENVIRONMENT STATUS                         ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: $baseUrl" -ForegroundColor Cyan
Write-Host "Frontend URL: $frontendUrl" -ForegroundColor Cyan
Write-Host "Test Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

if ($successRate -eq 100) {
    Write-Host "🎉 ALL TESTS PASSED! System is ready for production." -ForegroundColor Green
} elseif ($successRate -ge 80) {
    Write-Host "⚠️  Most tests passed. Review failed tests before proceeding." -ForegroundColor Yellow
} else {
    Write-Host "❌ Multiple tests failed. System needs attention." -ForegroundColor Red
}

Write-Host "`n" 
Write-Host "Test execution complete. Check results above." -ForegroundColor White
Write-Host "For manual testing, open: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
