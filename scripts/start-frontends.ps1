# Frontend Development Startup Script
# Starts both Admin Dashboard and Marketplace Web with proper port configuration
# Run from root of designer directory: .\scripts\start-frontends.ps1

param(
    [ValidateSet("all", "admin", "marketplace", "status")]
    [string]$Action = "all"
)

$ErrorActionPreference = "Stop"

# Configuration
$projectRoot = "c:\playground\designer"
$adminDashPath = Join-Path $projectRoot "frontend\admin-dashboard"
$marketplaceWebPath = Join-Path $projectRoot "frontend\marketplace-web"
$adminDashPort = 3001
$marketplacePort = 3002

# Colors for output
function Write-Status { Write-Host $args[0] -ForegroundColor Green }
function Write-Error { Write-Host $args[0] -ForegroundColor Red }
function Write-Info { Write-Host $args[0] -ForegroundColor Cyan }
function Write-Warning { Write-Host $args[0] -ForegroundColor Yellow }

Write-Info "================================"
Write-Info "  Frontend Development Startup  "
Write-Info "================================"

# Check Node.js installation
Write-Info "`n[1/3] Checking prerequisites..."
try {
    $nodeVersion = node --version
    Write-Status "  ✓ Node.js $nodeVersion installed"
} catch {
    Write-Error "  ✗ Node.js not found. Please install Node.js 18+"
    exit 1
}

# Verify project structure
Write-Info "`n[2/3] Verifying project structure..."
if (-not (Test-Path $adminDashPath)) {
    Write-Error "  ✗ Admin Dashboard not found at: $adminDashPath"
    exit 1
}
Write-Status "  ✓ Admin Dashboard found"

if (-not (Test-Path $marketplaceWebPath)) {
    Write-Error "  ✗ Marketplace Web not found at: $marketplaceWebPath"
    exit 1
}
Write-Status "  ✓ Marketplace Web found"

# Check and install dependencies
Write-Info "`n[3/3] Checking dependencies..."

if (-not (Test-Path "$adminDashPath\node_modules")) {
    Write-Warning "  Installing Admin Dashboard dependencies..."
    Push-Location $adminDashPath
    npm install --legacy-peer-deps
    Pop-Location
    Write-Status "  ✓ Admin Dashboard dependencies installed"
} else {
    Write-Status "  ✓ Admin Dashboard dependencies already installed"
}

if (-not (Test-Path "$marketplaceWebPath\node_modules")) {
    Write-Warning "  Installing Marketplace Web dependencies..."
    Push-Location $marketplaceWebPath
    npm install --legacy-peer-deps
    Pop-Location
    Write-Status "  ✓ Marketplace Web dependencies installed"
} else {
    Write-Status "  ✓ Marketplace Web dependencies already installed"
}

# Verify backend is running
Write-Info "`n[4/3] Checking backend service..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Status "  ✓ Java backend (8080) is running"
    }
} catch {
    Write-Warning "  ⚠ Java backend (8080) may not be running"
    Write-Warning "    Start it with: .\scripts\start-backend.ps1"
}

# Port validation function
function Test-PortAvailable {
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

# Startup functions
function Start-AdminDashboard {
    Write-Info "`n================================"
    Write-Info "  Starting Admin Dashboard     "
    Write-Info "================================"
    
    if (-not (Test-PortAvailable $adminDashPort)) {
        Write-Error "  ✗ Port $adminDashPort is already in use"
        return $false
    }
    
    Write-Status "  ✓ Port $adminDashPort is available"
    Write-Info "`n  Starting development server..."
    Write-Info "  → Running: npm run dev"
    
    Push-Location $adminDashPath
    npm run dev
    Pop-Location
    
    return $true
}

function Start-MarketplaceWeb {
    Write-Info "`n================================"
    Write-Info "  Starting Marketplace Web     "
    Write-Info "================================"
    
    if (-not (Test-PortAvailable $marketplacePort)) {
        Write-Error "  ✗ Port $marketplacePort is already in use"
        return $false
    }
    
    Write-Status "  ✓ Port $marketplacePort is available"
    Write-Info "`n  Starting development server..."
    Write-Info "  → Running: npm run dev"
    
    Push-Location $marketplaceWebPath
    npm run dev
    Pop-Location
    
    return $true
}

function Show-Status {
    Write-Info "`n================================"
    Write-Info "  Frontend Services Status      "
    Write-Info "================================"
    
    $adminUp = (Test-Connection -ComputerName localhost -TcpPort $adminDashPort -ErrorAction SilentlyContinue) -ne $null
    $marketplaceUp = (Test-Connection -ComputerName localhost -TcpPort $marketplacePort -ErrorAction SilentlyContinue) -ne $null
    
    Write-Info "`nWeb Applications:"
    if ($adminUp) {
        Write-Status "  ✓ Admin Dashboard:  http://localhost:$adminDashPort"
    } else {
        Write-Warning "  ✗ Admin Dashboard:  Not running (port $adminDashPort)"
    }
    
    if ($marketplaceUp) {
        Write-Status "  ✓ Marketplace Web:  http://localhost:$marketplacePort"
    } else {
        Write-Warning "  ✗ Marketplace Web:  Not running (port $marketplacePort)"
    }
    
    Write-Info "`nMonitoring & Analytics:"
    try {
        $grafanaCheck = Invoke-WebRequest -Uri "http://localhost:3000" -ErrorAction SilentlyContinue
        if ($grafanaCheck.StatusCode -eq 200) {
            Write-Status "  ✓ Grafana Monitor:  http://localhost:3000"
        }
    } catch {
        Write-Warning "  ✗ Grafana Monitor:  Not running (port 3000)"
    }
    
    Write-Info "`nBackend Services:"
    try {
        $backendCheck = Invoke-WebRequest -Uri "http://localhost:8080/health" -ErrorAction SilentlyContinue
        if ($backendCheck.StatusCode -eq 200) {
            Write-Status "  ✓ Java Marketplace:  http://localhost:8080"
        }
    } catch {
        Write-Warning "  ✗ Java Marketplace:  Not running (port 8080)"
    }
}

# Main execution
switch ($Action) {
    "admin" {
        Start-AdminDashboard
    }
    "marketplace" {
        Start-MarketplaceWeb
    }
    "status" {
        Show-Status
    }
    "all" {
        Write-Info "`n========================================="
        Write-Info "  Starting All Frontend Applications    "
        Write-Info "========================================="
        
        Write-Info "`nIMPORTANT: This will start both applications in the same window."
        Write-Info "For concurrent development, open TWO PowerShell windows and run:"
        Write-Info ""
        Write-Info "  Window 1: .\scripts\start-frontends.ps1 -Action admin"
        Write-Info "  Window 2: .\scripts\start-frontends.ps1 -Action marketplace"
        Write-Info ""
        Write-Info "Press Enter to continue with Admin Dashboard first..."
        Read-Host
        
        Start-AdminDashboard
        
        Write-Info "`n[When Admin Dashboard is ready, open another PowerShell window]"
        Write-Info "and run: .\scripts\start-frontends.ps1 -Action marketplace"
    }
}
