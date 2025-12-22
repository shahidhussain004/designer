# Designer Marketplace - Start All Services Script
# Run this script to start all services for local development

param(
    [switch]$SkipBuild,
    [switch]$ResetDatabase
)

$ErrorActionPreference = "Continue"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Designer Marketplace Starter      " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$projectRoot = "c:\playground\designer"

# 1. Start Docker infrastructure
Write-Host "`n[1/5] Starting Docker infrastructure..." -ForegroundColor Yellow
Set-Location "$projectRoot\config"

if ($ResetDatabase) {
    Write-Host "   Resetting database volumes..." -ForegroundColor DarkYellow
    docker compose down -v postgres mongodb 2>$null
}

docker compose up -d
Write-Host "   Waiting for containers to become healthy..." -ForegroundColor DarkGray
Start-Sleep -Seconds 15

# Check Docker health
$dockerStatus = docker ps --format "{{.Names}}: {{.Status}}" | Where-Object { $_ -match "designer" }
Write-Host "   Docker containers:" -ForegroundColor DarkGray
$dockerStatus | ForEach-Object { Write-Host "      $_" -ForegroundColor DarkGray }

# 2. Build Java Marketplace Service (if needed)
if (-not $SkipBuild) {
    Write-Host "`n[2/5] Building Java Marketplace Service..." -ForegroundColor Yellow
    Set-Location "$projectRoot\services\marketplace-service"
    mvn clean package -DskipTests -q
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ERROR: Maven build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "   Build successful" -ForegroundColor Green
} else {
    Write-Host "`n[2/5] Skipping Java build (using existing JAR)..." -ForegroundColor Yellow
}

# 3. Start Java Marketplace Service
Write-Host "`n[3/5] Starting Java Marketplace Service (port 8080)..." -ForegroundColor Yellow
$javaJar = "$projectRoot\services\marketplace-service\target\marketplace-service-1.0.0-SNAPSHOT.jar"
if (-not (Test-Path $javaJar)) {
    Write-Host "   ERROR: JAR not found at $javaJar" -ForegroundColor Red
    Write-Host "   Run without -SkipBuild to build the project" -ForegroundColor Red
    exit 1
}

Start-Process -FilePath "java" -ArgumentList @(
    "-jar", $javaJar,
    "--spring.datasource.url=jdbc:postgresql://localhost:5432/marketplace_db",
    "--spring.datasource.username=marketplace_user",
    "--spring.datasource.password=marketplace_pass_dev"
) -WorkingDirectory "$projectRoot\services\marketplace-service\target"

# 4. Start Go Messaging Service
Write-Host "`n[4/5] Starting Go Messaging Service (port 8081)..." -ForegroundColor Yellow
$goExe = "$projectRoot\services\messaging-service\messaging-service.exe"
if (-not (Test-Path $goExe)) {
    Write-Host "   Building Go service..." -ForegroundColor DarkYellow
    Set-Location "$projectRoot\services\messaging-service"
    go build -o messaging-service.exe .
}
Start-Process -FilePath $goExe -WorkingDirectory "$projectRoot\services\messaging-service"

# 5. Start .NET LMS Service
Write-Host "`n[5/5] Starting .NET LMS Service (port 8082)..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList @(
    "run",
    "--project", "$projectRoot\services\lms-service\lms-service.csproj"
) -WorkingDirectory "$projectRoot\services\lms-service"

# Wait for services to start
Write-Host "`nWaiting for services to start..." -ForegroundColor DarkGray
Start-Sleep -Seconds 20

# Verify all services
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  Service Health Check               " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

try {
    $m = Invoke-RestMethod "http://localhost:8080/actuator/health" -ErrorAction SilentlyContinue
    Write-Host "  Java Marketplace (8080): " -NoNewline
    if ($m.status -eq "UP") { 
        Write-Host "UP" -ForegroundColor Green 
    } else { 
        Write-Host "DEGRADED" -ForegroundColor Yellow 
    }
} catch {
    Write-Host "  Java Marketplace (8080): " -NoNewline
    Write-Host "NOT RESPONDING" -ForegroundColor Red
}

try {
    $g = Invoke-RestMethod "http://localhost:8081/health" -ErrorAction SilentlyContinue
    Write-Host "  Go Messaging (8081):     " -NoNewline
    if ($g.status -eq "healthy") { 
        Write-Host "healthy" -ForegroundColor Green 
    } else { 
        Write-Host "DEGRADED" -ForegroundColor Yellow 
    }
} catch {
    Write-Host "  Go Messaging (8081):     " -NoNewline
    Write-Host "NOT RESPONDING" -ForegroundColor Red
}

try {
    $l = Invoke-RestMethod "http://localhost:8082/health" -ErrorAction SilentlyContinue
    Write-Host "  .NET LMS (8082):         " -NoNewline
    if ($l -eq "Healthy") { 
        Write-Host "Healthy" -ForegroundColor Green 
    } else { 
        Write-Host "DEGRADED" -ForegroundColor Yellow 
    }
} catch {
    Write-Host "  .NET LMS (8082):         " -NoNewline
    Write-Host "NOT RESPONDING" -ForegroundColor Red
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  Quick Links                        " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  API Docs:   http://localhost:8080/swagger-ui/index.html"
Write-Host "  Grafana:    http://localhost:3000 (admin/admin)"
Write-Host "  Kafka UI:   http://localhost:8085"
Write-Host "  Prometheus: http://localhost:9090"

Write-Host "`nAll services started! Press Ctrl+C in service windows to stop." -ForegroundColor Green
