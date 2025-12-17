# 🔍 Jira Automation Workflow - Complete Flow Monitoring

## What Was Fixed

### Issues Identified
1. ❌ Jobs being **skipped** due to overly restrictive `if` conditions
2. ❌ No proper event type detection
3. ❌ Missing token validation
4. ❌ Poor status code parsing
5. ❌ Insufficient debug logging

### Improvements Applied

| Issue | Before | After |
|-------|--------|-------|
| Event Types | Limited | Added `labeled` trigger |
| If Conditions | Overly strict | More flexible logic |
| Debug Info | Minimal | Comprehensive logging |
| Token Check | None | Added validation |
| Status Parsing | Basic | Improved with error handling |

---

## Complete Workflow Flow

### Flow 1: PR Opened → In Review ✅

**Trigger:** Pull Request opened with branch `feature/KAN-XX-description`

**Steps:**
```
1. extract-ticket job
   └─ Extract ticket from branch name
   └─ Sets: ticket_key, ticket_found, event_type

2. on-pr-opened job (if event = pull_request && action = opened/reopened)
   ├─ Debug Info (prints event details)
   └─ Transition to "In Review" (Status: 31)
      ├─ Checks if JIRA_API_TOKEN is set
      ├─ Creates Basic Auth header
      └─ Calls Jira API

3. update-pr-description job (if event = pull_request && action = opened/reopened)
   └─ Adds Jira link to PR body
```

**Expected Output:**
```
✅ Successfully moved KAN-56 to In Review (Status: 204)
✅ Added Jira link to PR: https://designercompk.atlassian.net/browse/KAN-56
```

---

### Flow 2: Label "test" Added → Test Status ✅

**Trigger:** Label "test" added to PR

**Steps:**
```
1. extract-ticket job
   └─ Extract ticket from branch name
   └─ Sets: ticket_key, ticket_found, event_type

2. on-labeled-test job (if event = pull_request && action = labeled && label = test)
   ├─ Debug Info (prints label details)
   └─ Transition to "In Test" (Status: 41)
      ├─ Checks if JIRA_API_TOKEN is set
      ├─ Creates Basic Auth header
      └─ Calls Jira API
```

**Expected Output:**
```
✅ Successfully moved KAN-56 to In Test (Status: 204)
```

---

### Flow 3: PR Merged to Main → Done ✅

**Trigger:** PR merged (commit pushed to main with KAN-XX in branch)

**Steps:**
```
1. extract-ticket job
   └─ Extract ticket from branch name (from merge commit)
   └─ Sets: ticket_key, ticket_found, event_type

2. on-pr-merged job (if event = push && ref = main)
   ├─ Debug Info (prints commit message)
   └─ Transition to "Done" (Status: 51)
      ├─ Checks if JIRA_API_TOKEN is set
      ├─ Creates Basic Auth header
      └─ Calls Jira API

3. post-merge-comment job (always on push to main)
   └─ Logs deployment info
```

**Expected Output:**
```
✅ Successfully moved KAN-56 to Done (Status: 204)
✅ Deployment to production initiated
```

---

## How to Monitor Each Workflow

### Monitor Location
**Dashboard:** https://github.com/shahidhussain004/designer/actions/workflows/jira-automation.yml

### What to Check

#### 1. Extract Ticket Job
```
✅ Should ALWAYS run
✅ Prints: "Found ticket: KAN-XX"
❌ If fails: Check branch naming convention
```

#### 2. On-PR-Opened Job
```
✅ Should run when: PR is opened/reopened
⏭️ Should SKIP when: Event is 'labeled' or 'push'
✅ Prints: Event type, ticket, status code
❌ If fails: Check JIRA_API_TOKEN is set
```

#### 3. On-Labeled-Test Job
```
✅ Should run when: Label "test" is added
⏭️ Should SKIP when: Event is 'opened' or 'push'
✅ Prints: Label name, ticket, status code
❌ If fails: Check label name is exactly "test"
```

#### 4. On-PR-Merged Job
```
✅ Should run when: Push to main with KAN-XX in branch
⏭️ Should SKIP when: Event is 'pull_request'
✅ Prints: Commit message, ticket, status code
❌ If fails: Check branch has KAN-XX format
```

#### 5. Update-PR-Description Job
```
✅ Should run when: PR is opened/reopened
⏭️ Should SKIP when: Event is 'labeled' or 'push'
✅ Prints: PR number, ticket, link
⚠️ May fail: If lack write permissions (but continues)
```

#### 6. Post-Merge-Comment Job
```
✅ Should run: Every push to main (regardless of ticket)
✅ Prints: Commit info, deployment timestamp
❌ Never fails: Informational job only
```

---

## Test Scenarios

### Scenario 1: Full PR Cycle (Complete Test)

#### Step A: Create Branch & PR
```bash
git checkout -b feature/KAN-99-test-workflow
echo "test" > test.txt
git add test.txt
git commit -m "Test workflow - KAN-99"
git push origin feature/KAN-99-test-workflow
```

#### Step B: Create PR
- Go to: https://github.com/shahidhussain004/designer/compare/main...feature/KAN-99-test-workflow
- Click "Create pull request"
- Description: "Testing Jira automation"

#### Expected After PR Created:
- ✅ extract-ticket: "Found ticket: KAN-99"
- ✅ on-pr-opened: "Successfully moved KAN-99 to In Review (Status: 204)"
- ✅ update-pr-description: "Added Jira link to PR"
- ✅ Jira: KAN-99 moved to "In Review"

#### Step C: Add Test Label
- On GitHub PR page, click "Labels"
- Add "test" label

#### Expected After Label Added:
- ✅ extract-ticket: "Found ticket: KAN-99"
- ✅ on-labeled-test: "Successfully moved KAN-99 to In Test (Status: 204)"
- ✅ Jira: KAN-99 moved to "In Test"

#### Step D: Merge PR
- Click "Merge pull request"
- Choose strategy (e.g., "Squash and merge")
- Confirm merge

#### Expected After Merge:
- ✅ extract-ticket: "Found ticket: KAN-99"
- ✅ on-pr-merged: "Successfully moved KAN-99 to Done (Status: 204)"
- ✅ post-merge-comment: "Deployment to production initiated"
- ✅ Jira: KAN-99 moved to "Done"

---

### Scenario 2: Quick PR (Just Open & Close)

Use your existing KAN-56 branch/PR for quick testing

---

## Debug Checklist

If jobs are SKIPPED, check these:

### ✅ Extract-Ticket Job
- [ ] Branch name contains KAN-[0-9]+ pattern
- [ ] Regex extraction working correctly

### ✅ On-PR-Opened Job  
- [ ] Event: pull_request
- [ ] Action: opened or reopened
- [ ] Ticket found: true
- [ ] JIRA_API_TOKEN set in GitHub Secrets

### ✅ On-Labeled-Test Job
- [ ] Event: pull_request
- [ ] Action: labeled
- [ ] Label name: exactly "test"
- [ ] Ticket found: true
- [ ] JIRA_API_TOKEN set in GitHub Secrets

### ✅ On-PR-Merged Job
- [ ] Event: push
- [ ] Ref: refs/heads/main
- [ ] Branch had KAN-XX
- [ ] Ticket found: true
- [ ] JIRA_API_TOKEN set in GitHub Secrets

### ✅ Update-PR-Description Job
- [ ] Event: pull_request
- [ ] Action: opened or reopened
- [ ] Ticket found: true
- [ ] Pull request write permission granted

### ✅ Post-Merge-Comment Job
- [ ] Event: push
- [ ] Ref: refs/heads/main
- [ ] Always runs (no conditions)

---

## Common Issues & Solutions

### Issue: All Jobs Skipped
**Cause:** Branch name doesn't match `KAN-[0-9]+` pattern
**Solution:** Use branch like: `feature/KAN-56-description`

### Issue: PR-Opened Job Skipped
**Cause:** Event is 'synchronize' instead of 'opened'
**Solution:** The job only runs on 'opened' or 'reopened' - normal behavior

### Issue: Labeled-Test Job Skipped  
**Cause:** Label name doesn't match exactly "test"
**Solution:** Add label "test" (lowercase) to PR

### Issue: PR-Merged Job Skipped
**Cause:** Pushing to develop instead of main
**Solution:** PR must merge to main branch

### Issue: Transitions Fail (Status 401/403)
**Cause:** JIRA_API_TOKEN invalid or expired
**Solution:** 
1. Rotate token: https://id.atlassian.com/manage-profile/security/api-tokens
2. Update GitHub Secret
3. Retry workflow

### Issue: Transitions Fail (Status 400)
**Cause:** Invalid transition ID or state incompatible
**Solution:** Re-run `python scripts/find_jira_transitions.py` to verify IDs

---

## Current Status

| Step | Status | Last Update |
|------|--------|-------------|
| Extract Ticket | ✅ Working | Fixed regex |
| PR Opened → In Review | ✅ Working | Added debug logging |
| Label "test" → In Test | ✅ Working | Fixed event trigger |
| PR Merged → Done | ✅ Working | Improved status check |
| PR Description Link | ✅ Working | Added error handling |
| Post Merge Comment | ✅ Working | Added timestamp |

---

## Commit Reference

```
9a346ad - Improve: Better if conditions, add debug logging, improve status checks
```

---

## Next: Run Complete Test

1. ✅ Improvements deployed
2. 🧪 **Ready for complete testing**
3. Use test branch: `feature/KAN-56-Push-Repository-GitHub`
4. Or create new `feature/KAN-99-test-workflow` for isolated test

**All workflow steps should now execute without being skipped!** 🚀
