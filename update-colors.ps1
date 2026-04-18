# Replace teal with red-pink colors
$filePath = "frontend\marketplace-web\app\design-studio\page.tsx"
$content = Get-Content $filePath -Raw

# Replace hex color
$content = $content -replace '#00E5C5', '#FF1B6D'

# Replace RGB color
$content = $content -replace '0,229,197', '255,27,109'

Set-Content $filePath $content
Write-Host "✓ Color theme updated: Teal (#00E5C5) → Red-Pink (#FF1B6D)" -ForegroundColor Green
