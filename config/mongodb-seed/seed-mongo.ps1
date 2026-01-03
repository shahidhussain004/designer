param(
    [string]$ContainerName = "config-mongodb-1",
    [string]$MongoUser = "mongo_user",
    [string]$MongoPass = "mongo_pass_dev",
    [string]$DbName = "lms_db",
    [string]$SeedFile = "lms-seed.js"
)

Write-Host "Seeding MongoDB in container $ContainerName"

$localPath = Join-Path -Path $PSScriptRoot -ChildPath $SeedFile
if (-not (Test-Path $localPath)) { Write-Error "Seed file not found: $localPath"; exit 1 }


$destPath = "/tmp/$SeedFile"
$dockerCpTarget = "$ContainerName`:$destPath"
Write-Host "Copying $localPath -> $dockerCpTarget"
docker cp "$localPath" "$dockerCpTarget"

$conn = "mongodb://${MongoUser}:${MongoPass}@localhost:27017/${DbName}?authSource=admin"
Write-Host "Executing seed inside container using mongosh"
& docker exec -i $ContainerName mongosh $conn --file $destPath

Write-Host "Verifying collection counts"

$eval = "db = db.getSiblingDB('$DbName'); print('courses', db.courses.countDocuments()); print('enrollments', db.enrollments.countDocuments()); print('certificates', db.certificates.countDocuments()); print('quizzes', db.quizzes.countDocuments()); print('quiz_attempts', db.quiz_attempts.countDocuments());"
Write-Host "Running count verification"
& docker exec -i $ContainerName mongosh $conn --eval $eval

Write-Host "Done"
