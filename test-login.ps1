$body = @{
    emailOrUsername = "admin@designermarket.com"
    password = 't7G$k9Pz!Qw2RmX4'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "Status Code: $($response.StatusCode)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.Value)"
    Write-Host "Response:"
    $_.Exception.Response.StatusCode.Value
}

Write-Host "Response Body:"
try {
    $response.Content
} catch {
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $streamReader.ReadToEnd()
}
