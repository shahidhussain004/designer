# Test Backend API Endpoints
$ErrorActionPreference = 'Continue'

Write-Host "`n=== Testing Marketplace Backend API ===`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "Test 1: Checking if backend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
        -Method OPTIONS `
        -Headers @{"Origin"="http://localhost:3000"} `
        -UseBasicParsing `
        -ErrorAction Stop
    Write-Host "✓ Backend is responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend not responding" -ForegroundColor Red
    exit 1
}

# Test 2: Login as CLIENT
Write-Host "`nTest 2: Login as CLIENT (john_client)" -ForegroundColor Yellow
$loginBody = @{
    emailOrUsername = "john_client"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod `
        -Uri "http://localhost:8080/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -Headers @{"Origin"="http://localhost:3000"} `
        -ErrorAction Stop
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  Username: $($loginResponse.user.username)"
    Write-Host "  Role: $($loginResponse.user.role)"
    Write-Host "  Email: $($loginResponse.user.email)"
    $clientToken = $loginResponse.accessToken
    Write-Host "  Token obtained: $($clientToken.Substring(0, 30))...`n"
} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)"
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" 
    exit 1
}

# Test 3: GET /api/users/me
Write-Host "Test 3: GET /api/users/me (Get current user profile)" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $clientToken"
    "Origin" = "http://localhost:3000"
}

try {
    $currentUser = Invoke-RestMethod `
        -Uri "http://localhost:8080/api/users/me" `
        -Headers $headers `
        -ErrorAction Stop
    
    Write-Host "✓ Retrieved current user profile" -ForegroundColor Green
    Write-Host "  Username: $($currentUser.username)"
    Write-Host "  Email: $($currentUser.email)"
    Write-Host "  Full Name: $($currentUser.fullName)`n"
} catch {
    Write-Host "✗ Failed to get current user" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)`n"
}

# Test 4: Login as FREELANCER
Write-Host "Test 4: Login as FREELANCER (alice_freelancer)" -ForegroundColor Yellow
$freelancerLogin = @{
    emailOrUsername = "alice_freelancer"
    password = "password123"
} | ConvertTo-Json

try {
    $freelancerAuth = Invoke-RestMethod `
        -Uri "http://localhost:8080/api/auth/login" `
        -Method POST `
        -Body $freelancerLogin `
        -ContentType "application/json" `
        -Headers @{"Origin"="http://localhost:3000"} `
        -ErrorAction Stop
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  Username: $($freelancerAuth.user.username)"
    Write-Host "  Role: $($freelancerAuth.user.role)"
    $freelancerToken = $freelancerAuth.accessToken
} catch {
    Write-Host "✗ Freelancer login failed" -ForegroundColor Red
}

# Test 5: GET /api/jobs (List jobs)
Write-Host "`nTest 5: GET /api/jobs (List available jobs)" -ForegroundColor Yellow
try {
    $jobs = Invoke-RestMethod `
        -Uri "http://localhost:8080/api/jobs?page=0&size=5" `
        -Method GET `
        -Headers @{"Origin"="http://localhost:3000"} `
        -ErrorAction Stop
    
    Write-Host "✓ Retrieved jobs list" -ForegroundColor Green
    Write-Host "  Total jobs: $($jobs.totalElements)"
    Write-Host "  Jobs on this page: $($jobs.numberOfElements)`n"
} catch {
    Write-Host "✗ Failed to get jobs" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)`n"
}

# Test 6: POST /api/jobs (Create new job as CLIENT)
Write-Host "Test 6: POST /api/jobs (Create new job as client)" -ForegroundColor Yellow
$newJob = @{
    title = "Test Job - Web Development"
    description = "This is a test job for the marketplace"
    category = "web"
    requiredSkills = @("JavaScript", "React", "Node.js")
    budget = 500.00
    budgetType = "FIXED"
    duration = 30
    experienceLevel = "INTERMEDIATE"
    status = "OPEN"
} | ConvertTo-Json

$clientHeaders = @{
    "Authorization" = "Bearer $clientToken"
    "Content-Type" = "application/json"
    "Origin" = "http://localhost:3000"
}

try {
    $createdJob = Invoke-RestMethod `
        -Uri "http://localhost:8080/api/jobs" `
        -Method POST `
        -Body $newJob `
        -Headers $clientHeaders `
        -ErrorAction Stop
    
    Write-Host "✓ Job created successfully!" -ForegroundColor Green
    Write-Host "  Job ID: $($createdJob.id)"
    Write-Host "  Title: $($createdJob.title)"
    Write-Host "  Budget: `$$($createdJob.budget)`n"
    $jobId = $createdJob.id
} catch {
    Write-Host "✗ Failed to create job" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)`n"
}

# Test 7: POST /api/proposals (Submit proposal as FREELANCER)
if ($jobId -and $freelancerToken) {
    Write-Host "Test 7: POST /api/proposals (Submit proposal as freelancer)" -ForegroundColor Yellow
    $newProposal = @{
        jobId = $jobId
        coverLetter = "I am interested in this project and have relevant experience."
        proposedRate = 450.00
        estimatedDuration = 25
    } | ConvertTo-Json

    $freelancerHeaders = @{
        "Authorization" = "Bearer $freelancerToken"
        "Content-Type" = "application/json"
        "Origin" = "http://localhost:3000"
    }

    try {
        $createdProposal = Invoke-RestMethod `
            -Uri "http://localhost:8080/api/proposals" `
            -Method POST `
            -Body $newProposal `
            -Headers $freelancerHeaders `
            -ErrorAction Stop
        
        Write-Host "✓ Proposal submitted successfully!" -ForegroundColor Green
        Write-Host "  Proposal ID: $($createdProposal.id)"
        Write-Host "  Job Title: $($createdProposal.jobTitle)"
        Write-Host "  Proposed Rate: `$$($createdProposal.proposedRate)`n"
    } catch {
        Write-Host "✗ Failed to submit proposal" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)`n"
    }
}

# Test 8: GET /api/dashboard/client
Write-Host "Test 8: GET /api/dashboard/client (Client dashboard)" -ForegroundColor Yellow
try {
    $clientDashboard = Invoke-RestMethod `
        -Uri "http://localhost:8080/api/dashboard/client" `
        -Headers $clientHeaders `
        -ErrorAction Stop
    
    Write-Host "✓ Retrieved client dashboard" -ForegroundColor Green
    Write-Host "  Total Jobs Posted: $($clientDashboard.stats.totalJobsPosted)"
    Write-Host "  Active Jobs: $($clientDashboard.stats.activeJobs)"
    Write-Host "  Total Proposals Received: $($clientDashboard.stats.totalProposalsReceived)`n"
} catch {
    Write-Host "✗ Failed to get client dashboard" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)`n"
}

# Test 9: GET /api/dashboard/freelancer
if ($freelancerToken) {
    Write-Host "Test 9: GET /api/dashboard/freelancer (Freelancer dashboard)" -ForegroundColor Yellow
    try {
        $freelancerDashboard = Invoke-RestMethod `
            -Uri "http://localhost:8080/api/dashboard/freelancer" `
            -Headers $freelancerHeaders `
            -ErrorAction Stop
        
        Write-Host "✓ Retrieved freelancer dashboard" -ForegroundColor Green
        Write-Host "  Total Proposals Submitted: $($freelancerDashboard.stats.totalProposalsSubmitted)"
        Write-Host "  Active Proposals: $($freelancerDashboard.stats.activeProposals)"
        Write-Host "  Available Jobs: $($freelancerDashboard.availableJobs.Count)`n"
    } catch {
        Write-Host "✗ Failed to get freelancer dashboard" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)`n"
    }
}

Write-Host "`n=== Test Summary ===`n" -ForegroundColor Cyan
Write-Host "Backend API testing completed!" -ForegroundColor Green
Write-Host "All major endpoints have been tested.`n"
