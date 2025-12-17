# 🔧 Jira API Token Issue - Debugging Guide

## Error Message
```
{"error": "Failed to parse Connect Session Auth Token"}
```

## Root Cause
The `JIRA_API_TOKEN` secret is either:
1. ❌ Not set in GitHub Secrets
2. ❌ Empty/null value
3. ❌ Contains invalid characters
4. ❌ Expired or revoked

## How to Verify & Fix

### Step 1: Check if Secret is Set in GitHub

1. Go to: **https://github.com/shahidhussain004/designer/settings/secrets/actions**
2. Look for: **JIRA_API_TOKEN**
3. Expected: You should see it listed

#### If NOT Listed:
- Proceed to Step 2 to add it

#### If Listed:
- The secret exists
- But the value might be wrong (can't see the value for security)
- Proceed to Step 2 to update it

---

### Step 2: Generate a Fresh Jira API Token

Your current token may be expired or malformed. Generate a new one:

1. **Go to Jira API Token Manager:**
   - URL: https://id.atlassian.com/manage-profile/security/api-tokens
   - Or: Atlassian Account → Security → API tokens

2. **Delete Old Token (if exists):**
   - Find: "Token for Designer Repo" or similar
   - Click delete button

3. **Create New Token:**
   - Click "Create API token"
   - Label: `GitHub Designer Automation`
   - Click "Create"
   - **IMPORTANT:** Copy the token immediately (shown only once!)

---

### Step 3: Update GitHub Secret

1. Go to: **https://github.com/shahidhussain004/designer/settings/secrets/actions**

2. Find: **JIRA_API_TOKEN**

3. Click "Update" (or "New repository secret" if not listed)

4. **Paste the NEW token** from Step 2

5. Click "Update secret" or "Add secret"

---

### Step 4: Verify the Token Format

Your token should look like:
```
abcd1234efgh5678ijkl9012mnop3456qrst
```

**NOT like:**
```
user@example.com:abcd1234efgh5678ijkl9012mnop3456qrst
```

(Just the token part, not email:token)

---

## Test the Token

### Option A: Manual Curl Test (Local)

```bash
# Replace with YOUR values:
JIRA_TOKEN="your-new-token-here"
JIRA_EMAIL="shahidhussain004@gmail.com"
TICKET="KAN-43"

# Test API call:
curl -X GET \
  -H "Authorization: Bearer $JIRA_TOKEN" \
  -H "Content-Type: application/json" \
  "https://designercompk.atlassian.net/rest/api/3/issue/$TICKET" \
  -w "\n\nStatus: %{http_code}\n"
```

**Expected:** 
- `200` status code
- JSON response with ticket details

**If you get 401/403:**
- Token is wrong or expired
- Go back to Step 2 and generate a new one

---

### Option B: GitHub Actions Test

After updating the secret in GitHub:

1. Go to: https://github.com/shahidhussain004/designer/actions/workflows/jira-automation.yml

2. Click "Run workflow"

3. Select branch: **main**

4. Click "Run workflow"

5. Wait for it to complete and check logs

---

## Checklist

- [ ] Go to https://id.atlassian.com/manage-profile/security/api-tokens
- [ ] Create new API token
- [ ] Copy token immediately (shown only once)
- [ ] Go to GitHub Secrets: https://github.com/shahidhussain004/designer/settings/secrets/actions
- [ ] Update JIRA_API_TOKEN with new token
- [ ] Re-run failed workflow or create new PR
- [ ] Verify KAN ticket moves to "In Review"

---

## Still Getting Error?

### Check GitHub Secrets are Accessible

The workflow should have access to JIRA_API_TOKEN secret:

```yaml
env:
  JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
```

If empty, the curl will fail with: `Failed to parse Connect Session Auth Token`

### Verify Token Permissions

Your Jira API token should have:
- ✅ Read & Write permissions on KAN project
- ✅ Issue transition permissions
- ✅ Not expired

---

## Quick Reference

| Check | Value |
|-------|-------|
| Jira Instance | designercompk.atlassian.net |
| Email | shahidhussain004@gmail.com |
| Project | KAN |
| API Version | v3 |
| Auth Method | Bearer Token |
| Secret Name | JIRA_API_TOKEN |

---

## Support

If still failing after these steps:
1. Check GitHub Actions logs for exact error
2. Verify token has not been revoked
3. Ensure token wasn't copied with extra spaces/newlines
4. Try test curl command locally first
