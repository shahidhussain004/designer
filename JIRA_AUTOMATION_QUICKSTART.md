# Quick Start: Jira Automation for GitHub CI/CD

## 1️⃣ Get Your Jira API Token

```bash
# Visit: https://id.atlassian.com/manage-profile/security/api-tokens
# Create new token → Copy it (keep it secret!)
```

## 2️⃣ Add to GitHub Repository Secrets

```
Settings → Secrets and variables → Actions
  New secret:
  Name: JIRA_API_TOKEN
  Value: <paste your token>
```

## 3️⃣ Find Your Transition IDs (IMPORTANT!)

Run this script to detect your exact transition IDs:

```bash
python scripts/find_jira_transitions.py
```

Follow the prompts:
- Domain: `designercompk`
- Email: `shahidhussain004@gmail.com`
- Token: `<your jira token>`
- Ticket: `KAN-43`

This will output your transition IDs like:
```
→ In Review
  ID: 11
→ In Test
  ID: 21
→ Done
  ID: 31
```

## 4️⃣ Update Workflow with Your IDs

Edit `.github/workflows/jira-automation.yml` and replace the transition IDs:

**Current (default):**
```yaml
-d '{"transition":{"id":"11"}}' # In Review
-d '{"transition":{"id":"21"}}' # In Test
-d '{"transition":{"id":"31"}}' # Done
```

**With your IDs (example):**
```yaml
-d '{"transition":{"id":"11"}}' # In Review
-d '{"transition":{"id":"21"}}' # In Test
-d '{"transition":{"id":"31"}}' # Done
```

## 5️⃣ Start Using It!

Create a feature branch with your ticket number:

```bash
git checkout -b feature/KAN-43-user-authentication

# Make your changes, commit, push...
git commit -m "Add user auth - KAN-43"
git push origin feature/KAN-43-user-authentication

# Create PR on GitHub
# → Jira ticket KAN-43 automatically moves to [In Review]

# Add "test" label when testing
# → Jira ticket KAN-43 automatically moves to [In Test]

# Merge PR to main
# → Jira ticket KAN-43 automatically moves to [Done]
```

## Branch Naming Convention

**Format:** `<type>/KAN-<number>-<short-description>`

Examples:
- ✅ `feature/KAN-43-user-api`
- ✅ `bugfix/KAN-50-nginx-config`
- ✅ `hotfix/KAN-65-db-migration`
- ❌ `feature/user-api` (no ticket)
- ❌ `KAN-43-user-api` (missing type)

## Workflow Triggers

| Event | Action | Jira Status |
|-------|--------|-------------|
| PR opened from `feature/KAN-43-*` | Auto-transition | → In Review |
| Label "test" added to PR | Auto-transition | → In Test |
| PR merged to `main` | Auto-transition | → Done |
| Commit message includes `KAN-43` | Auto-link | Adds PR link to ticket |

## Troubleshooting

**Q: Workflow not triggering?**
- A: Check branch name has `KAN-XX` pattern
- A: Verify repo is on GitHub (not just local)

**Q: Ticket not updating?**
- A: Check `JIRA_API_TOKEN` is set in GitHub Secrets
- A: Verify transition IDs are correct (run `find_jira_transitions.py`)

**Q: "Not authorized" error?**
- A: Check token is valid and not expired
- A: Verify email/token combination is correct

## Full Documentation

See [JIRA_AUTOMATION_SETUP.md](../docs/JIRA_AUTOMATION_SETUP.md) for complete setup and advanced configurations.
