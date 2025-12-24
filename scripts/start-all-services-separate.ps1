# Script to start all services in separate PowerShell windows

Write-Host "Starting all services in separate windows..." -ForegroundColor Green

# Start LMS Service (Port 8082)
Write-Host "Starting LMS Service on port 8082..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\playground\designer\services\lms-service; Write-Host 'LMS Service Starting...' -ForegroundColor Green; dotnet bin/Debug/net8.0/lms-service.dll"

Start-Sleep -Seconds 2

# Start Marketplace Service (Port 8080)
Write-Host "Starting Marketplace Service on port 8080..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\playground\designer\services\marketplace-service; Write-Host 'Marketplace Service Starting...' -ForegroundColor Green; java -jar target/marketplace-service-1.0.0-SNAPSHOT.jar"

Start-Sleep -Seconds 2

# Start Frontend (Port 3002)
Write-Host "Starting Frontend on port 3002..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\playground\designer\frontend\marketplace-web; Write-Host 'Frontend Starting...' -ForegroundColor Green; npm run dev"

Write-Host "`nAll services started in separate windows!" -ForegroundColor Green
Write-Host "LMS Service: http://localhost:8082" -ForegroundColor Yellow
Write-Host "Marketplace Service: http://localhost:8080" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3002" -ForegroundColor Yellow
