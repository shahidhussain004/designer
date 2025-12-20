# scripts/

This folder contains utility scripts for development, testing, and integration.

## Files Overview

### Testing Scripts
- `test-all.ps1` - Comprehensive test suite (PowerShell)
- `test-backend-api.ps1` - Backend API testing
- `test-login.ps1` - Authentication testing
- `test-register.ps1` - User registration testing
- `test-cors.ps1` - CORS configuration validation
- `test-localhost-vs-127.ps1` - Network testing
- `test-user-agent.ps1` - User agent validation
- `test-session-analysis.ps1` - Session management testing
- `test-with-curl.ps1` - cURL-based API testing

### Backend Management
- `start-backend.ps1` - Start Java Spring Boot service
- `REBUILD_AND_TEST.ps1` - Clean build and comprehensive testing
- `debug-login.ps1` - Debug login flow issues

### Load Testing
- `sprint4-automated-tests.ps1` - Sprint 4 comprehensive automated test suite

### Jira Integration
- `jira_integration.py` - Python tool for Jira automation
  - Create/rebuild Jira board
  - List epics and tasks
  - Assign and transition tasks
  - Detect available transitions
  - Destructive operations with safety warnings

- `find_jira_transitions.py` - Utility to discover Jira workflow transitions

### API Testing Data
- `login-payload.json` - Sample login request payload

## Quick Usage

### Test Backend Connectivity
```powershell
.\test-all.ps1
```

### Start Backend Service
```powershell
.\start-backend.ps1
```

### Run Comprehensive Tests
```powershell
.\REBUILD_AND_TEST.ps1
```

### Test Login Endpoint
```powershell
.\test-login.ps1
```

### Run Load Tests
```powershell
.\sprint4-automated-tests.ps1
```

## Jira Integration (Python)

Install dependencies:
```bash
python -m pip install --user -r ../docs/requirements.txt
```

Detect transitions for task:
```bash
python jira_integration.py --domain designercompk --email you@domain.com --token <API_TOKEN> transitions KAN-43
```

Rebuild Jira board (DESTRUCTIVE):
```bash
python jira_integration.py --domain designercompk --email you@domain.com --token <API_TOKEN> --rebuild-board
```

## Status

✅ All scripts tested and working with current backend (Dec 20, 2025)  
✅ Backend running on localhost:8080  
✅ All endpoints responding correctly

## Safety Notes

- Jira `--clean-board` and `--rebuild-board` are **DESTRUCTIVE**
- Use only with backups or test instances
- Keep credentials in environment variables or GitHub Actions secrets
