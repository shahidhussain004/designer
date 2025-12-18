# Manual HTTP POST using WebClient
$ErrorActionPreference = "Continue"
$API_URL = "http://localhost:8080/api"

Write-Host "`n=== Manual WebClient Test ===" -ForegroundColor Cyan

Write-Host "`nTesting with System.Net.WebClient..." -ForegroundColor Yellow

try {
    $webClient = New-Object System.Net.WebClient
    $webClient.Headers.Add("Content-Type", "application/json; charset=utf-8")
    $webClient.Encoding = [System.Text.Encoding]::UTF8
    
    $json = '{"emailOrUsername":"john_client","password":"password123"}'
    $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    
    Write-Host "  Sending: $json" -ForegroundColor Gray
    Write-Host "  Byte count: $($jsonBytes.Length)" -ForegroundColor Gray
    
    $response = $webClient.UploadString("$API_URL/auth/login", "POST", $json)
    
    Write-Host "✓ Success with WebClient!" -ForegroundColor Green
    Write-Host "  Response: $($response.Substring(0, [Math]::Min(200, $response.Length)))..." -ForegroundColor Gray
    
    $webClient.Dispose()
    
} catch [System.Net.WebException] {
    Write-Host "✗ Failed with WebClient" -ForegroundColor Red
    $response = $_.Exception.Response
    if ($response) {
        $stream = $response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseText = $reader.ReadToEnd()
        
        Write-Host "  Status: $([int]$response.StatusCode) $($response.StatusDescription)" -ForegroundColor Red
        Write-Host "  Response: $responseText" -ForegroundColor Red
        
        Write-Host "  Response Headers:" -ForegroundColor Red
        foreach ($header in $response.Headers.AllKeys) {
            $headerValue = $response.Headers[$header]
            Write-Host "    ${header}: ${headerValue}" -ForegroundColor DarkRed
        }
        
        $reader.Close()
    }
} catch {
    Write-Host "✗ Exception: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
