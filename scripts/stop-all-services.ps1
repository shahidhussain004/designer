# Designer Marketplace - Stop All Services Script
# Run this script to stop all running services

$ErrorActionPreference = "SilentlyContinue"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Stopping Designer Marketplace     " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Stop application services
Write-Host "`n[1/3] Stopping application services..." -ForegroundColor Yellow

Write-Host "   Stopping Java processes..." -ForegroundColor DarkGray
$javaProcs = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcs) {
    $javaProcs | Stop-Process -Force
    Write-Host "   Stopped $($javaProcs.Count) Java process(es)" -ForegroundColor Green
} else {
    Write-Host "   No Java processes running" -ForegroundColor DarkGray
}

Write-Host "   Stopping Go Messaging service..." -ForegroundColor DarkGray
$goProcs = Get-Process -Name "messaging-service" -ErrorAction SilentlyContinue
if ($goProcs) {
    $goProcs | Stop-Process -Force
    Write-Host "   Stopped $($goProcs.Count) Go process(es)" -ForegroundColor Green
} else {
    Write-Host "   No Go Messaging processes running" -ForegroundColor DarkGray
}

Write-Host "   Stopping .NET processes..." -ForegroundColor DarkGray
# Be careful not to kill unrelated dotnet processes
$dotnetProcs = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -match "lms-service"
}
if ($dotnetProcs) {
    $dotnetProcs | Stop-Process -Force
    Write-Host "   Stopped $($dotnetProcs.Count) .NET LMS process(es)" -ForegroundColor Green
} else {
    Write-Host "   No .NET LMS processes running" -ForegroundColor DarkGray
}

# Stop Docker infrastructure
Write-Host "`n[2/3] Stopping Docker containers..." -ForegroundColor Yellow
Set-Location "c:\playground\designer\config"
docker compose down 2>$null
Write-Host "   Docker containers stopped" -ForegroundColor Green

# Verify ports are free
Write-Host "`n[3/3] Verifying ports are free..." -ForegroundColor Yellow
$ports = @(8080, 8081, 8082, 5432, 27017, 6379, 9092)
$allFree = $true

foreach ($port in $ports) {
    $listening = netstat -ano | findstr ":$port" | findstr "LISTENING"
    if ($listening) {
        Write-Host "   Port $port is still in use" -ForegroundColor Yellow
        $allFree = $false
    }
}

if ($allFree) {
    Write-Host "   All ports are free" -ForegroundColor Green
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  All services stopped!              " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
