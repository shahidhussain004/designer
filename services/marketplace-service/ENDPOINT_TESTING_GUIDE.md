# Service Endpoint Testing Guide

## Prerequisites
- Ensure marketplace-service is running on `http://localhost:8080`
- Database is running in Docker with migrations applied
- All API endpoints should return HTTP 200 for GET requests on public endpoints

## Testing Commands (PowerShell)

### 1. Health & Actuator Endpoints

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -Method Get

# Application info
Invoke-RestMethod -Uri "http://localhost:8080/actuator/info" -Method Get

# Metrics
Invoke-RestMethod -Uri "http://localhost:8080/actuator/metrics" -Method Get
```

### 2. User Service Endpoints

```powershell
# Get all users (paginated)
Invoke-RestMethod -Uri "http://localhost:8080/api/users?page=0&size=10" -Method Get

# Get user by ID
Invoke-RestMethod -Uri "http://localhost:8080/api/users/1" -Method Get

# Get user by username
Invoke-RestMethod -Uri "http://localhost:8080/api/users/username/john_dev" -Method Get
```

### 3. Job Service Endpoints

```powershell
# Get all jobs
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs?page=0&size=10" -Method Get

# Get job by ID
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs/1" -Method Get

# Get jobs by category
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs?categoryId=1" -Method Get

# Search jobs
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs/search?keyword=Senior&page=0&size=10" -Method Get

# Get featured jobs
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs/featured?page=0&size=10" -Method Get

# Get jobs by employer
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs/employer/3" -Method Get
```

### 4. Job Category Endpoints

```powershell
# Get all categories
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs/categories" -Method Get

# Get category by slug
Invoke-RestMethod -Uri "http://localhost:8080/api/jobs/categories/software-development" -Method Get
```

### 5. Job Application Endpoints

```powershell
# Get applications for a job
Invoke-RestMethod -Uri "http://localhost:8080/api/job-applications/job/1" -Method Get

# Get user's applications
Invoke-RestMethod -Uri "http://localhost:8080/api/job-applications/applicant/1" -Method Get

# Get application by ID
Invoke-RestMethod -Uri "http://localhost:8080/api/job-applications/1" -Method Get
```

### 6. Project Service Endpoints

```powershell
# Get all projects
Invoke-RestMethod -Uri "http://localhost:8080/api/projects?page=0&size=10" -Method Get

# Get project by ID
Invoke-RestMethod -Uri "http://localhost:8080/api/projects/1" -Method Get

# Get projects by category
Invoke-RestMethod -Uri "http://localhost:8080/api/projects?categoryId=1" -Method Get

# Search projects
Invoke-RestMethod -Uri "http://localhost:8080/api/projects/search?keyword=mobile&page=0&size=10" -Method Get

# Get projects by client
Invoke-RestMethod -Uri "http://localhost:8080/api/projects/client/3" -Method Get
```

### 7. Proposal Service Endpoints

```powershell
# Get proposals for a project
Invoke-RestMethod -Uri "http://localhost:8080/api/proposals/project/1" -Method Get

# Get freelancer's proposals
Invoke-RestMethod -Uri "http://localhost:8080/api/proposals/freelancer/1" -Method Get

# Get proposal by ID
Invoke-RestMethod -Uri "http://localhost:8080/api/proposals/1" -Method Get
```

### 8. Contract Service Endpoints

```powershell
# Get all contracts
Invoke-RestMethod -Uri "http://localhost:8080/api/contracts?page=0&size=10" -Method Get

# Get contract by ID
Invoke-RestMethod -Uri "http://localhost:8080/api/contracts/1" -Method Get

# Get user's contracts (as freelancer)
Invoke-RestMethod -Uri "http://localhost:8080/api/contracts?freelancerId=1" -Method Get

# Get user's contracts (as client)
Invoke-RestMethod -Uri "http://localhost:8080/api/contracts?clientId=3" -Method Get
```

### 9. Message Service Endpoints

```powershell
# Get user's message threads
Invoke-RestMethod -Uri "http://localhost:8080/api/messages/threads" -Method Get

# Get messages in a thread
Invoke-RestMethod -Uri "http://localhost:8080/api/messages/threads/1/messages" -Method Get

# Get message thread by ID
Invoke-RestMethod -Uri "http://localhost:8080/api/messages/threads/1" -Method Get
```

### 10. Review Service Endpoints

```powershell
# Get reviews for a user
Invoke-RestMethod -Uri "http://localhost:8080/api/reviews/user/1" -Method Get

# Get reviews written by a user
Invoke-RestMethod -Uri "http://localhost:8080/api/reviews/reviewer/1" -Method Get

# Get reviews for a contract
Invoke-RestMethod -Uri "http://localhost:8080/api/reviews/contract/1" -Method Get

# Get review by ID
Invoke-RestMethod -Uri "http://localhost:8080/api/reviews/1" -Method Get
```

### 11. Notification Service Endpoints

```powershell
# Get user notifications
Invoke-RestMethod -Uri "http://localhost:8080/api/notifications?page=0&size=10" -Method Get

# Get unread notifications
Invoke-RestMethod -Uri "http://localhost:8080/api/notifications/unread" -Method Get
```

### 12. Invoice Service Endpoints

```powershell
# Get invoices for project
Invoke-RestMethod -Uri "http://localhost:8080/api/invoices/project/1" -Method Get

# Get user invoices
Invoke-RestMethod -Uri "http://localhost:8080/api/invoices/user/1" -Method Get

# Get invoice by ID
Invoke-RestMethod -Uri "http://localhost:8080/api/invoices/1" -Method Get
```

### 13. Milestone Service Endpoints

```powershell
# Get milestones for project
Invoke-RestMethod -Uri "http://localhost:8080/api/milestones/project/1" -Method Get

# Get milestone by ID
Invoke-RestMethod -Uri "http://localhost:8080/api/milestones/1" -Method Get
```

## Bulk Testing Script

Save this as `test-all-endpoints.ps1` and run it to test all endpoints at once:

```powershell
$baseUrl = "http://localhost:8080"
$endpoints = @(
    "/actuator/health",
    "/api/users?page=0&size=5",
    "/api/jobs?page=0&size=5",
    "/api/jobs/categories",
    "/api/projects?page=0&size=5",
    "/api/contracts?page=0&size=5",
    "/api/messages/threads",
    "/api/reviews/user/1",
    "/api/notifications?page=0&size=5",
    "/api/invoices/user/1"
)

$passed = 0
$failed = 0

Write-Host "Testing Marketplace Service Endpoints..." -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method Get -TimeoutSec 5
        Write-Host "✓ $endpoint" -ForegroundColor Green
        $passed++
    }
    catch {
        Write-Host "✗ $endpoint - Error: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Results: $passed passed, $failed failed" -ForegroundColor Yellow
```

## Expected Responses

All endpoints should return:
- **Status Code**: 200 (OK)
- **Content-Type**: application/json
- **Body**: JSON with data or pagination info

Example response structure:
```json
{
  "content": [...],
  "pageable": {...},
  "totalElements": 10,
  "totalPages": 1,
  "number": 0,
  "size": 10,
  "empty": false
}
```

## Authentication (Protected Endpoints)

Protected endpoints require JWT token in Authorization header:

```powershell
$headers = @{
    "Authorization" = "Bearer <YOUR_JWT_TOKEN>"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/protected-endpoint" `
    -Method Post `
    -Headers $headers `
    -Body (ConvertTo-Json @{ data = "value" })
```

## Database Verification

After service is running, verify the database has the clean schema:

```sql
-- Connect to marketplace_db
SELECT table_name FROM information_schema.tables 
WHERE table_schema='public' 
ORDER BY table_name;

-- Check migration history
SELECT version, description, success FROM flyway_schema_history 
ORDER BY installed_rank DESC;

-- Verify seed data
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as job_count FROM jobs;
SELECT COUNT(*) as project_count FROM projects;
```

## Troubleshooting

### Service Won't Start
- Check if port 8080 is available
- Verify Docker containers are running: `docker ps`
- Check logs: `tail -f C:\playground\designer\services\marketplace-service\marketplace-service.log`

### Database Connection Issues
- Verify PostgreSQL is running: `docker ps | grep postgres`
- Check credentials in application.properties
- Test connection: `docker exec designer-postgres-1 psql -U marketplace_user -d marketplace_db`

### Migration Failures
- Check Flyway schema history: `SELECT * FROM flyway_schema_history;`
- Verify migration files in `/db/migration` directory
- Check for foreign key constraint violations

## Next Steps

1. Start the service: `cd C:\playground\designer\services\marketplace-service && mvn spring-boot:run -DskipTests`
2. Wait for "Started MarketplaceServiceApplication" message
3. Run the bulk test script to verify all endpoints
4. Monitor application logs for any errors or warnings
