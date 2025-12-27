# PowerShell script to verify all services are running correctly
# Run this after starting services to check their health

$baseDir = "C:\playground\designer"

Write-Host "Verifying Designer Marketplace Services..." -ForegroundColor Cyan
Write-Host ""

# Health check function
function Test-ServiceHealth {
    param(
        [string]$Name,
        [string]$Url,
        [int]$Port
    )
    
    Write-Host "Checking $Name..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ $Name (port $Port) is HEALTHY" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "  ✗ $Name (port $Port) is NOT RESPONDING" -ForegroundColor Red
        Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Gray
        return $false
    }
}

# Test API endpoint function
function Test-ApiEndpoint {
    param(
        [string]$Name,
        [string]$Url
    )
    
    Write-Host "Testing $Name..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri $Url -TimeoutSec 5 -ErrorAction Stop
        Write-Host "  ✓ $Name returns data successfully" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  ✗ $Name failed" -ForegroundColor Red
        Write-Host "    Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Gray
        return $false
    }
}

# Infrastructure checks
Write-Host "=== Infrastructure ===" -ForegroundColor Cyan
Test-ServiceHealth "PostgreSQL" "http://localhost:5432" 5432
Test-ServiceHealth "MongoDB" "http://localhost:27017" 27017
Test-ServiceHealth "Redis" "http://localhost:6379" 6379
Test-ServiceHealth "Kafka" "http://localhost:9092" 9092

Write-Host ""

# Backend service checks
Write-Host "=== Backend Services ===" -ForegroundColor Cyan
Test-ServiceHealth "Marketplace Service" "http://localhost:8080/actuator/health" 8080
Test-ServiceHealth "LMS Service" "http://localhost:8082/health" 8082
Test-ServiceHealth "Messaging Service" "http://localhost:8081/health" 8081

Write-Host ""

# Frontend checks
Write-Host "=== Frontend Services ===" -ForegroundColor Cyan
Test-ServiceHealth "Marketplace Web" "http://localhost:3002" 3002
Test-ServiceHealth "Admin Dashboard" "http://localhost:5173" 5173

Write-Host ""

# API endpoint tests
Write-Host "=== API Endpoint Tests ===" -ForegroundColor Cyan
Test-ApiEndpoint "Jobs API (no params)" "http://localhost:3002/api/jobs"
Test-ApiEndpoint "Jobs API (with category)" "http://localhost:3002/api/jobs?category=WEB_DESIGN"
Test-ApiEndpoint "Jobs API (with search)" "http://localhost:3002/api/jobs?search=design"
Test-ApiEndpoint "Courses API" "http://localhost:3002/api/courses"

Write-Host ""

# Kafka topics check
Write-Host "=== Kafka Topics ===" -ForegroundColor Cyan
Write-Host "Checking Kafka topics..." -ForegroundColor Yellow
try {
    $topics = docker exec config-kafka-1 kafka-topics --list --bootstrap-server kafka:29092 2>$null | Where-Object { $_ -notmatch "^__" }
    $requiredTopics = @(
        "jobs.posted", "jobs.updated", "jobs.deleted",
        "payments.received", "payments.disputed", "payments.succeeded",
        "users.joined", "users.created",
        "proposals.submitted", "contracts.signed",
        "courses.completed", "certificates.issued"
    )
    
    $missingTopics = @()
    foreach ($topic in $requiredTopics) {
        if ($topics -contains $topic) {
            Write-Host "  ✓ $topic" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $topic is MISSING" -ForegroundColor Red
            $missingTopics += $topic
        }
    }
    
    if ($missingTopics.Count -eq 0) {
        Write-Host "`nAll required Kafka topics exist!" -ForegroundColor Green
    } else {
        Write-Host "`nMissing topics: $($missingTopics -join ', ')" -ForegroundColor Red
        Write-Host "Run: .\scripts\create-kafka-topics.ps1" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Could not check Kafka topics" -ForegroundColor Red
    Write-Host "    Make sure Kafka container is running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Verification complete! Check status above." -ForegroundColor White
Write-Host ""
Write-Host "If any service is not responding:" -ForegroundColor Yellow
Write-Host "  1. Check the service window for error logs" -ForegroundColor Gray
Write-Host "  2. Verify Docker containers: docker ps" -ForegroundColor Gray
Write-Host "  3. Check ports are not in use: netstat -ano | findstr '8080 8081 8082 3002'" -ForegroundColor Gray
Write-Host ""
