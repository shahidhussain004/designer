@echo off
setlocal enabledelayedexpansion
REM Try login with original admin password from V10__insert_admin_user.sql
set body={\"emailOrUsername\":\"admin@designermarket.com\",\"password\":\"Admin123!!\"}
curl.exe -i -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "!body!"
