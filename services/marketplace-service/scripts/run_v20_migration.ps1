<#
run_v20_migration.ps1

Helper to detect `bytea` columns and apply V20__coerce_bytea_to_text.sql

Usage (PowerShell):
  .\run_v20_migration.ps1            # prompts for connection info
  .\run_v20_migration.ps1 -Host db -Port 5432 -Database marketplace_db -User postgres

Requirements:
  - `psql` must be available on PATH (Postgres client)
  - You should backup your DB before running any migration
#>

param(
    [string]$Host = $(Read-Host "DB host (default: localhost)" -AsSecureString | ForEach-Object { [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($_)) } ),
    [int]$Port = 5432,
    [string]$Database = "marketplace_db",
    [string]$User = "postgres"
)

function Prompt-ForPassword {
    Write-Host "Enter DB password for user '$User' (will not echo):"
    $pw = Read-Host -AsSecureString
    return [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pw))
}

if (-not $Host -or $Host -eq '') { $Host = 'localhost' }

$Password = Prompt-ForPassword

$env:PGPASSWORD = $Password

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$migrationFile = Join-Path $scriptRoot '..\src\main\resources\db\migration\V20__coerce_bytea_to_text.sql'
$migrationFile = (Resolve-Path $migrationFile).Path

Write-Host "Using migration file: $migrationFile"

# Detection SQL
$detectSql = "SELECT table_schema, table_name, column_name, udt_name FROM information_schema.columns WHERE udt_name = 'bytea' ORDER BY table_name, column_name;"

Write-Host "Detecting columns with udt_name = 'bytea'..."

try {
    $detectOut = & psql -h $Host -p $Port -U $User -d $Database -At -c $detectSql 2>&1
} catch {
    Write-Host "Error invoking psql: $_"
    exit 1
}

if (-not $detectOut) {
    Write-Host "No bytea columns were detected. Nothing to convert."
    exit 0
}

Write-Host "Detected bytea columns (schema|table|column|udt_name):"
$detectOut | ForEach-Object { Write-Host "  " $_ }

Write-Host "\n*** IMPORTANT: Back up your database before continuing. ***"
 $cont = Read-Host "Type YES to continue and apply $([IO.Path]::GetFileName($migrationFile))"
if ($cont -ne 'YES') { Write-Host "Aborting."; exit 0 }

Write-Host "Applying migration file using psql..."
try {
    & psql -h $Host -p $Port -U $User -d $Database -f $migrationFile 2>&1 | ForEach-Object { Write-Host $_ }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "psql returned non-zero exit code: $LASTEXITCODE"
        Write-Host "If you see errors about 'invalid byte sequence' or similar, run the helper to extract offending rows."
        exit $LASTEXITCODE
    }
} catch {
    Write-Host "Error applying migration: $_"
    exit 1
}

Write-Host "Migration applied. Verify by re-running the detection query or check your application." 
Write-Host "Tip: If Flyway is used in your deployment, also check flyway_schema_history for the migration entry."

exit 0
