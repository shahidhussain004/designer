# PowerShell script to create Kafka topics for Designer Marketplace

param(
    [string]$KafkaBroker = "localhost:9092",
    [int]$Partitions = 3,
    [int]$ReplicationFactor = 1
)

Write-Host "Creating Kafka topics on $KafkaBroker..." -ForegroundColor Cyan

# Define all core event topics
$topics = @(
    "jobs.posted",
    "jobs.updated",
    "jobs.deleted",
    "payments.received",
    "payments.disputed",
    "payments.succeeded",
    "messages.sent",
    "users.joined",
    "users.created",
    "proposals.submitted",
    "contracts.signed",
    "courses.completed",
    "certificates.issued"
)

# Check if running via Docker
$useDocker = $true
try {
    docker ps | Out-Null
    $containerName = docker ps --filter "ancestor=confluentinc/cp-kafka:7.4.0" --format "{{.Names}}" | Select-Object -First 1
    if (-not $containerName) {
        $containerName = "config-kafka-1"  # Default compose name
    }
} catch {
    $useDocker = $false
}

foreach ($topic in $topics) {
    Write-Host "Creating topic: $topic" -ForegroundColor Yellow
    
    if ($useDocker) {
        docker exec $containerName kafka-topics --create `
            --bootstrap-server kafka:29092 `
            --topic $topic `
            --partitions $Partitions `
            --replication-factor $ReplicationFactor `
            --if-not-exists 2>&1 | Out-Null
    } else {
        kafka-topics --create `
            --bootstrap-server $KafkaBroker `
            --topic $topic `
            --partitions $Partitions `
            --replication-factor $ReplicationFactor `
            --if-not-exists 2>&1 | Out-Null
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Created: $topic" -ForegroundColor Green
    } else {
        Write-Host "  ! Topic may already exist: $topic" -ForegroundColor Gray
    }
}

Write-Host "`nListing all topics:" -ForegroundColor Cyan
if ($useDocker) {
    docker exec $containerName kafka-topics --list --bootstrap-server kafka:29092
} else {
    kafka-topics --list --bootstrap-server $KafkaBroker
}

Write-Host "`nKafka topics setup complete!" -ForegroundColor Green
