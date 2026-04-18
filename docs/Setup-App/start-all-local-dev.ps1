# start-all-local-dev.ps1
# PowerShell script to start all Docker services and both frontend apps
# Usage: .\start-all-local-dev.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Full Stack Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$CONFIG_DIR = Join-Path $SCRIPT_DIR "config"
$FRONTEND_ADMIN = Join-Path $SCRIPT_DIR "frontend\admin-dashboard"
$FRONTEND_MARKETPLACE = Join-Path $SCRIPT_DIR "frontend\marketplace-web"

# Step 1: Start Docker services
Write-Host "[1/4] Starting Docker containers..." -ForegroundColor Blue

Set-Location $CONFIG_DIR

# Check if docker-compose is available
$composeCmd = if (Get-Command docker-compose -ErrorAction SilentlyContinue) { "docker-compose" } else { "docker compose" }

Write-Host "   Stopping previous containers..." -ForegroundColor Gray
& $composeCmd down 2>$null | Out-Null

Write-Host "   Pulling latest images..." -ForegroundColor Gray
& $composeCmd pull --quiet

Write-Host "   Starting services..." -ForegroundColor Gray
& $composeCmd up -d --build

Write-Host "✓ Docker services started" -ForegroundColor Green
Write-Host ""

# Step 2: Wait for services to be healthy
Write-Host "[2/4] Waiting for services to be ready..." -ForegroundColor Blue
$maxAttempts = 60
$attempt = 0

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ API Gateway is healthy" -ForegroundColor Green
            break
        }
    }
    catch {
        $attempt++
        Write-Host "   Waiting for services... ($attempt/$maxAttempts)" -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Host "⚠ Services might not be fully ready yet, but proceeding..." -ForegroundColor Yellow
}
else {
    Write-Host "✓ All services are ready" -ForegroundColor Green
}
Write-Host ""

# Step 3: Configure frontend apps
Write-Host "[3/4] Setting up frontend applications..." -ForegroundColor Blue

$adminEnvPath = Join-Path $FRONTEND_ADMIN ".env"
if (-not (Test-Path $adminEnvPath)) {
    Write-Host "   Creating Admin Dashboard .env" -ForegroundColor Gray
    $adminEnvContent = @"
VITE_API_BASE_URL=http://localhost/api
VITE_MARKETPLACE_API=http://localhost:8080/api
VITE_CONTENT_API=http://localhost:8083/api
VITE_LMS_API=http://localhost:8082/api
VITE_MESSAGING_API=http://localhost:8081/api
VITE_KAFKA_UI_URL=http://localhost:8085
"@
    Set-Content -Path $adminEnvPath -Value $adminEnvContent
    Write-Host "✓ Admin Dashboard .env created" -ForegroundColor Green
}
else {
    Write-Host "   Admin Dashboard .env already exists" -ForegroundColor Gray
}

$marketplaceEnvPath = Join-Path $FRONTEND_MARKETPLACE ".env"
if (-not (Test-Path $marketplaceEnvPath)) {
    Write-Host "   Creating Marketplace Web .env" -ForegroundColor Gray
    $marketplaceEnvContent = @"
VITE_API_BASE_URL=http://localhost/api
VITE_MARKETPLACE_API=http://localhost:8080/api
VITE_CONTENT_API=http://localhost:8083/api
VITE_LMS_API=http://localhost:8082/api
VITE_MESSAGING_API=http://localhost:8081/api
VITE_KAFKA_UI_URL=http://localhost:8085
"@
    Set-Content -Path $marketplaceEnvPath -Value $marketplaceEnvContent
    Write-Host "✓ Marketplace Web .env created" -ForegroundColor Green
}
else {
    Write-Host "   Marketplace Web .env already exists" -ForegroundColor Gray
}

Write-Host ""

# Step 4: Display startup instructions
Write-Host "[4/4] Startup Instructions" -ForegroundColor Blue
Write-Host ""
Write-Host "✓ Docker Backend Services are running!" -ForegroundColor Green
Write-Host ""
Write-Host "Next, start the frontend apps in separate terminals:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 2 - Admin Dashboard:" -ForegroundColor Yellow
Write-Host "  cd $FRONTEND_ADMIN"
Write-Host "  npm install  # if needed"
Write-Host "  npm run dev"
Write-Host "  → http://localhost:3000"
Write-Host ""
Write-Host "Terminal 3 - Marketplace Web:" -ForegroundColor Yellow
Write-Host "  cd $FRONTEND_MARKETPLACE"
Write-Host "  npm install  # if needed"
Write-Host "  npm run dev"
Write-Host "  → http://localhost:3001"
Write-Host ""

# Display service URLs
Write-Host "Service URLs:" -ForegroundColor Blue
Write-Host "  API Gateway:        http://localhost    (port 80)"
Write-Host "  Marketplace (Java):  http://localhost:8080"
Write-Host "  Messaging (Go):      http://localhost:8081"
Write-Host "  LMS (.NET):          http://localhost:8082"
Write-Host "  Content (Node.js):   http://localhost:8083"
Write-Host ""

Write-Host "Tools & Monitoring:" -ForegroundColor Blue
Write-Host "  Kafka UI:            http://localhost:8085"
Write-Host "  Prometheus:          http://localhost:9090"
Write-Host ""

Write-Host "Management Commands:" -ForegroundColor Blue
Write-Host "  View all logs:       cd $CONFIG_DIR && $composeCmd logs -f"
Write-Host "  View specific logs:  cd $CONFIG_DIR && $composeCmd logs -f <service>"
Write-Host "  Stop everything:     cd $CONFIG_DIR && $composeCmd stop"
Write-Host "  Restart services:    cd $CONFIG_DIR && $composeCmd restart"
Write-Host "  Clean up:            cd $CONFIG_DIR && $composeCmd down"
Write-Host "  Status:              cd $CONFIG_DIR && $composeCmd ps"
Write-Host ""

Write-Host "🎉 Setup complete! Check the terminals for frontend apps." -ForegroundColor Green
