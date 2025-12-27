$body = @{ emailOrUsername = 'admin@designermarket.com'; password = 'Admin123!' } | ConvertTo-Json
try {
    $resp = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 10
    Write-Output "REQUEST_SUCCEEDED"
    $resp | ConvertTo-Json -Depth 5
} catch {
    Write-Output "REQUEST_FAILED"
    if ($_.Exception.Response) {
        try {
            $sr = $_.Exception.Response.GetResponseStream()
            $srReader = New-Object System.IO.StreamReader($sr)
            $text = $srReader.ReadToEnd()
            Write-Output "RESPONSE_BODY:"
            Write-Output $text
        } catch {
            Write-Output "NO_RESPONSE_BODY"
        }
    } else {
        Write-Output $_.Exception.Message
    }
}