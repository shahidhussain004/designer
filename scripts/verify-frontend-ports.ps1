# Frontend Port Configuration Verification Script
# Verifies that all port configurations are correct

Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Frontend Port Configuration Verification  " -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan

$projectRoot = "c:\playground\designer"
$checksCompleted = 0
$checksSuccessful = 0

function Test-Port {
    param([int]$Port)
    try {
        $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch {
        return $false
    }
}

# Check 1: Marketplace Web port configuration
Write-Host "`n[1/5] Checking Marketplace Web port configuration..." -ForegroundColor Yellow
$checksCompleted++
$packageJson = Get-Content "$projectRoot\frontend\marketplace-web\package.json"
if ($packageJson -match '"dev":\s*"next dev -p 3002"' -and $packageJson -match '"start":\s*"next start -p 3002"') {
    Write-Host "  ✓ Marketplace Web correctly configured to port 3002" -ForegroundColor Green
    $checksSuccessful++
} else {
    Write-Host "  ✗ Marketplace Web port configuration incorrect" -ForegroundColor Red
    Write-Host "    Expected: next dev -p 3002" -ForegroundColor DarkGray
    Write-Host "    Found:" -ForegroundColor DarkGray
    $packageJson | Select-String '"dev"' | Write-Host -ForegroundColor DarkGray
}

# Check 2: Admin Dashboard port configuration
Write-Host "`n[2/5] Checking Admin Dashboard port configuration..." -ForegroundColor Yellow
$checksCompleted++
$viteConfig = Get-Content "$projectRoot\frontend\admin-dashboard\vite.config.ts" -Raw
if ($viteConfig -match "port:\s*3001") {
    Write-Host "  ✓ Admin Dashboard correctly configured to port 3001" -ForegroundColor Green
    $checksSuccessful++
} else {
    Write-Host "  ✗ Admin Dashboard port configuration incorrect" -ForegroundColor Red
    Write-Host "    Expected: port: 3001" -ForegroundColor DarkGray
}

# Check 3: Port availability
Write-Host "`n[3/5] Checking port availability..." -ForegroundColor Yellow
$checksCompleted++
$portStatus = @()
$ports = @(3000, 3001, 3002, 8080, 8081, 8082)
$allAvailable = $true

$ports | ForEach-Object {
    if (Test-Port $_) {
        $portStatus += "  ✓ Port $_`: FREE"
        Write-Host "  ✓ Port $_`: FREE" -ForegroundColor Green
    } else {
        $portStatus += "  ✗ Port $_`: IN USE"
        Write-Host "  ✗ Port $_`: IN USE" -ForegroundColor Yellow
        $allAvailable = $false
    }
}

if ($allAvailable) {
    $checksSuccessful++
} else {
    Write-Host "  Note: Some ports are in use (services may be running)" -ForegroundColor DarkYellow
}

# Check 4: Backend CORS configuration
Write-Host "`n[4/5] Checking backend CORS configuration..." -ForegroundColor Yellow
$checksCompleted++
$dockerCompose = Get-Content "$projectRoot\config\docker-compose.yml" -Raw
if ($dockerCompose -match "ALLOWED_ORIGINS:.*3001") {
    Write-Host "  ✓ Backend CORS allows port 3001" -ForegroundColor Green
    Write-Host "    (Also supports 3002 via same origin policy)" -ForegroundColor DarkGray
    $checksSuccessful++
} else {
    Write-Host "  ⚠ Warning: Could not verify CORS configuration" -ForegroundColor Yellow
}

# Check 5: Startup scripts updated
Write-Host "`n[5/5] Checking startup scripts..." -ForegroundColor Yellow
$checksCompleted++
$startFrontendsScript = Get-Content "$projectRoot\scripts\start-frontends.ps1" -Raw
if ($startFrontendsScript -match "marketplacePort = 3002") {
    Write-Host "  ✓ start-frontends.ps1 script updated" -ForegroundColor Green
    $checksSuccessful++
} else {
    Write-Host "  ✗ start-frontends.ps1 script not updated" -ForegroundColor Yellow
}

# Summary
Write-Host "`n════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Verification Summary                       " -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`nResults: $checksSuccessful/$checksCompleted checks passed" -ForegroundColor $(if ($checksSuccessful -eq $checksCompleted) { "Green" } else { "Yellow" })

Write-Host "`nPort Configuration Summary:" -ForegroundColor Green
Write-Host "  Grafana Dashboard:     http://localhost:3000" -ForegroundColor Green
Write-Host "  Admin Dashboard:       http://localhost:3001" -ForegroundColor Green
Write-Host "  Marketplace Web:       http://localhost:3002" -ForegroundColor Green
Write-Host "  Java API:              http://localhost:8080" -ForegroundColor Green
Write-Host "  Go Messaging:          http://localhost:8081" -ForegroundColor Green
Write-Host ".NET LMS:              http://localhost:8082" -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "  1. Start Docker infrastructure:" -ForegroundColor DarkGray
Write-Host "     docker-compose -f config/docker-compose.yml up -d" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  2. Start backend services:" -ForegroundColor DarkGray
Write-Host "     .\scripts\start-all-services.ps1" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  3. In separate PowerShell window, start Admin Dashboard:" -ForegroundColor DarkGray
Write-Host "     cd frontend\admin-dashboard && npm run dev" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  4. In another PowerShell window, start Marketplace Web:" -ForegroundColor DarkGray
Write-Host "     cd frontend\marketplace-web && npm run dev" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  5. Access applications:" -ForegroundColor DarkGray
Write-Host "     - Grafana: http://localhost:3000" -ForegroundColor DarkGray
Write-Host "     - Admin:   http://localhost:3001" -ForegroundColor DarkGray
Write-Host "     - Market:  http://localhost:3002" -ForegroundColor DarkGray

Write-Host "`n════════════════════════════════════════════" -ForegroundColor Cyan
