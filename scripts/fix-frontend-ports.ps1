# Fix Frontend Port Configuration Script
# This script fixes the port conflict by updating marketplace-web to use port 3000

param(
    [switch]$DryRun
)

$ErrorActionPreference = "Continue"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Frontend Port Configuration Fixer " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$projectRoot = "c:\playground\designer\frontend"
$marketplaceWebPackageJson = "$projectRoot\marketplace-web\package.json"

# Check if file exists
if (-not (Test-Path $marketplaceWebPackageJson)) {
    Write-Host "`nERROR: File not found: $marketplaceWebPackageJson" -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/2] Checking current port configuration..." -ForegroundColor Yellow

# Read the file
$content = Get-Content $marketplaceWebPackageJson -Raw

# Check if already fixed
if ($content -match '"dev":\s*"next dev -p 3000"') {
    Write-Host "  Port 3000 already configured ✓" -ForegroundColor Green
    exit 0
}

if ($content -match '"dev":\s*"next dev -p 3001"') {
    Write-Host "  Found port conflict: 3001 → need to fix" -ForegroundColor Yellow
    
    Write-Host "`n[2/2] Updating port configuration..." -ForegroundColor Yellow
    
    if ($DryRun) {
        Write-Host "  DRY RUN MODE - Changes not applied" -ForegroundColor DarkYellow
        Write-Host "  Would replace:" -ForegroundColor DarkGray
        Write-Host "    'next dev -p 3001'   →  'next dev -p 3002'" -ForegroundColor DarkGray
        Write-Host "    'next start -p 3001' →  'next start -p 3002'" -ForegroundColor DarkGray
        exit 0
    }
    
    # Replace port 3001 with 3002
    $newContent = $content -replace '"dev":\s*"next dev -p 3001"', '"dev": "next dev -p 3002"'
    $newContent = $newContent -replace '"start":\s*"next start -p 3001"', '"start": "next start -p 3002"'
    
    # Write back to file
    Set-Content $marketplaceWebPackageJson -Value $newContent -Encoding UTF8
    
    Write-Host "  ✓ dev script:   'next dev -p 3002'" -ForegroundColor Green
    Write-Host "  ✓ start script: 'next start -p 3002'" -ForegroundColor Green
    
    Write-Host "`n=====================================" -ForegroundColor Cyan
    Write-Host "  Configuration Fixed!               " -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "`nPort Configuration:" -ForegroundColor Green
    Write-Host "  Admin Dashboard:  http://localhost:3001" -ForegroundColor Green
    Write-Host "  Marketplace Web:  http://localhost:3002" -ForegroundColor Green
    Write-Host "  Grafana Monitor:  http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Could not determine current port configuration" -ForegroundColor Yellow
    Write-Host "  Current dev script:" -ForegroundColor DarkGray
    $content | Select-String '"dev"' | Write-Host -ForegroundColor DarkGray
}
