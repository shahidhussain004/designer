# Start Backend Service with Environment Variables
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_NAME = "marketplace_db"
$env:DB_USER = "marketplace_user"
$env:DB_PASSWORD = "marketplace_pass_dev"
$env:REDIS_HOST = "localhost"
$env:REDIS_PORT = "6379"
$env:KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"
$env:JWT_SECRET = "your-secret-key-min-256-bits-long-for-hs256-algorithm-security"
$env:JWT_EXPIRATION = "86400000"
$env:JWT_REFRESH_EXPIRATION = "604800000"

Write-Host "=== Starting Marketplace Backend Service ===" -ForegroundColor Cyan
Write-Host "Database: $env:DB_HOST:$env:DB_PORT/$env:DB_NAME"
Write-Host "Redis: $env:REDIS_HOST:$env:REDIS_PORT"
Write-Host ""

cd C:\playground\designer\services\marketplace-service

# Check if JAR exists
if (!(Test-Path "target\marketplace-service-1.0.0-SNAPSHOT.jar")) {
    Write-Host "ERROR: JAR file not found. Please run 'mvn package' first." -ForegroundColor Red
    exit 1
}

Write-Host "Starting backend service..." -ForegroundColor Green
Write-Host "Access at: http://localhost:8080"
Write-Host "Press Ctrl+C to stop`n"

java -jar target\marketplace-service-1.0.0-SNAPSHOT.jar
