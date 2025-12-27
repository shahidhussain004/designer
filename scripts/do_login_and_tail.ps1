$body = @{emailOrUsername='admin@designermarket.com'; password='t7G$k9Pz!Qw2RmX4'}
try {
    $r = Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/auth/login' -ContentType 'application/json' -Body (ConvertTo-Json $body -Depth 10)
    Write-Output 'RESPONSE:'
    $r | ConvertTo-Json -Depth 10 | Write-Output
} catch {
    Write-Output 'REQUEST_FAILED'
    if ($_.Exception.Response -ne $null) {
        $sr = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($sr)
        Write-Output 'RESPONSE_BODY:'
        Write-Output $reader.ReadToEnd()
    } else {
        Write-Output $_.Exception.Message
    }
}

Write-Output '--- LOG TAIL ---'
Get-Content -Path 'C:\playground\designer\services\marketplace-service\backend.log' -Tail 200 -Encoding UTF8 | Write-Output
