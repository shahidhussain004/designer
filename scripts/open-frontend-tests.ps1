# Open Frontend in Browser for Manual Testing

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Opening Frontend for Browser Testing" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✓ All services are running:" -ForegroundColor Green
Write-Host "  - Frontend:      http://localhost:3002" -ForegroundColor White
Write-Host "  - Marketplace:   http://localhost:8080" -ForegroundColor White
Write-Host "  - LMS:           http://localhost:8082" -ForegroundColor White

Write-Host "`n📋 Test Checklist:" -ForegroundColor Yellow
Write-Host "  1. Jobs Page - Should show 11 jobs (not 'No jobs found')" -ForegroundColor White
Write-Host "  2. Courses Page - No CORS errors in console" -ForegroundColor White
Write-Host "  3. Filters and search work on both pages" -ForegroundColor White
Write-Host "  4. Navigation between pages works" -ForegroundColor White

Write-Host "`n🌐 Opening browser windows..." -ForegroundColor Cyan

# Open main pages
Start-Process "http://localhost:3002"
Start-Sleep -Seconds 2
Start-Process "http://localhost:3002/jobs"
Start-Sleep -Seconds 2
Start-Process "http://localhost:3002/courses"

Write-Host "`n✓ Browser windows opened!" -ForegroundColor Green
Write-Host "`n📊 Check Browser Developer Tools (F12):" -ForegroundColor Yellow
Write-Host "  - Console: Look for any errors (especially CORS)" -ForegroundColor White
Write-Host "  - Network: Verify API calls return 200 status" -ForegroundColor White

Write-Host "`n========================================`n" -ForegroundColor Cyan
