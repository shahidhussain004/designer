# Service Startup and Testing Commands

## 1. Start the Service (Run in your separate terminal)
cd c:\playground\designer\services\marketplace-service
java -jar target/marketplace-service-1.0.0-SNAPSHOT.jar

## 2. Wait for startup (look for these log messages):
# - "Started MarketplaceServiceApplication"
# - "Tomcat started on port(s): 8080"

## 3. Test Endpoints (Run after service starts)

# Quick health check
Invoke-RestMethod -Uri "http://localhost:8080/api/actuator/health" -Method GET

# Test Jobs endpoint (This was failing with 500 error)
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs" -Method GET | ConvertTo-Json -Depth 5

# Test with filters
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs?isRemote=true&page=0&size=10" -Method GET | ConvertTo-Json -Depth 5

# Test search endpoint
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs/search?query=developer" -Method GET | ConvertTo-Json -Depth 5

# Test featured jobs
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs/featured" -Method GET | ConvertTo-Json -Depth 5

# Test Projects endpoint
Invoke-RestMethod -Uri "http://localhost:8080/api/projects" -Method GET | ConvertTo-Json -Depth 5

# Test Projects search
Invoke-RestMethod -Uri "http://localhost:8080/api/projects/search?q=design" -Method GET | ConvertTo-Json -Depth 5

# Test Companies
Invoke-RestMethod -Uri "http://localhost:8080/api/companies" -Method GET | ConvertTo-Json -Depth 5

# Test Categories
Invoke-RestMethod -Uri "http://localhost:8080/api/job-categories" -Method GET | ConvertTo-Json -Depth 5
Invoke-RestMethod -Uri "http://localhost:8080/api/project-categories" -Method GET | ConvertTo-Json -Depth 5

## 4. Run Comprehensive Test Suite
cd c:\playground\designer
.\test_all_apis_systematic.ps1

## 5. Apply Tutorial Seed Data
psql -U content_user -d content_db -f seed_tutorials_comprehensive.sql

## Troubleshooting

# Check if service is running on port 8080
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

# View last 50 lines of logs (if logging to file)
Get-Content -Path "logs/marketplace-service.log" -Tail 50 -Wait

# Check Java processes
Get-Process -Name java | Format-Table Id, ProcessName, StartTime, CPU
