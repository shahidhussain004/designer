@echo off
setlocal enabledelayedexpansion

REM Create JSON body
set body={\"emailOrUsername\":\"admin@designermarket.com\",\"password\":\"t7G$k9Pz!Qw2RmX4\"}

REM Send POST request
curl.exe -i -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "!body!"
