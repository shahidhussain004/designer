# Jira Automation Setup Guide

This guide explains how to set up automatic Jira ticket status transitions based on your GitHub CI/CD workflow.

## Overview

The automation integrates your GitHub repository with Jira to automatically transition tickets through your workflow:

```
Branch Creation (KAN-43)
        ↓
    PR Opened → [In Review]
        ↓
    Label Added (test) → [In Test]
        ↓
    PR Merged to main → [Done]
```

## Branch Naming Convention

Create branches using this format:

```
feature/KAN-43-user-authentication
bugfix/KAN-45-postgres-config
hotfix/KAN-50-nginx-restart
```

**Pattern:** `<type>/KAN-<number>-<description>`

Examples:
- `feature/KAN-58-user-api` → extracts `KAN-58`
- `bugfix/KAN-64-mongo-setup` → extracts `KAN-64`
- `develop` → no ticket (skipped)

## Step 1: Create Jira API Token

1. Go to your Atlassian account: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **Create API token**
3. Name it: `GitHub-CI-CD-Automation`
4. Copy the token (you'll use it in the next step)

⚠️ **IMPORTANT:** Keep this token secret!

## Step 2: Add Token to GitHub Repository Secrets

1. Go to your GitHub repository settings
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `JIRA_API_TOKEN`
5. Value: Paste your Jira API token from Step 1
6. Click **Add secret**

## Step 3: Understand Transition IDs

The workflow uses transition IDs to move tickets between statuses. You may need to adjust these based on your Jira board configuration:

- `"id":"11"` → In Review (adjust if different)
- `"id":"21"` → In Test (adjust if different)
- `"id":"31"` → Done (adjust if different)

### How to Find Your Transition IDs

Run this curl command to get available transitions for a ticket:

```bash
curl -X GET \
  -H "Authorization: Basic $(echo -n 'YOUR_EMAIL:YOUR_TOKEN' | base64)" \
  -H "Content-Type: application/json" \
  "https://designercompk.atlassian.net/rest/api/3/issue/KAN-43/transitions"
```

Look for the `"id"` values in the response and update the workflow accordingly.

## Step 4: Configure Workflow (Optional)

The workflow file at `.github/workflows/jira-ticket-status-ci-cd.yml` is pre-configured. You can customize:

- **Transition IDs:** Edit the `id` values in the curl commands
- **Branch patterns:** Add additional branch types (chore, docs, etc.)
- **Trigger events:** Add or remove GitHub events (push, pull_request, issues, etc.)

## Workflow Events

### Event 1: PR Opened → In Review

**When:** A pull request is opened from a branch like `feature/KAN-43-...`

**Action:** Ticket moves to `In Review` status

```yaml
on:
  pull_request:
    types: [opened]
```

### Event 2: Test Label Added → In Test

**When:** A test label is added to a PR

**Action:** Ticket moves to `In Test` status

```yaml
on:
  pull_request:
    types: [labeled]
```

To trigger this, add a label named `test` to your PR on GitHub.

### Event 3: PR Merged to Main → Done

**When:** A PR is merged to the `main` branch

**Action:** Ticket moves to `Done` status

```yaml
on:
  push:
    branches: [main]
```

## Usage Examples

### Example 1: Feature Development

```bash
# 1. Create a feature branch with KAN ticket
git checkout -b feature/KAN-58-user-api

# 2. Make commits
git commit -m "Add user registration endpoint - KAN-58"

# 3. Push and create PR
git push origin feature/KAN-58-user-api
# PR opens → Jira ticket KAN-58 moves to [In Review]

# 4. Add test label on GitHub PR
# On GitHub: add label "test" to PR
# → Jira ticket KAN-58 moves to [In Test]

# 5. Merge PR to main
# On GitHub: click "Merge pull request"
# → Jira ticket KAN-58 moves to [Done]
```

### Example 2: Bug Fix

```bash
git checkout -b bugfix/KAN-65-db-migration

# Make changes...
git commit -m "Fix database migration script - KAN-65"
git push origin bugfix/KAN-65-db-migration

# Create PR on GitHub
# PR opens → Jira KAN-65 moves to [In Review]

# Add label "test" when testing is complete
# → Jira KAN-65 moves to [In Test]

# Merge to main when ready
# → Jira KAN-65 moves to [Done]
```

## Troubleshooting

### Workflow Not Triggering

1. Check that your branch name includes `KAN-XX` pattern
2. Verify the branch was created in the GitHub repo (not just locally)
3. Check GitHub Actions log: Repository → Actions → Jira Automation

### Jira Ticket Not Updating

1. Verify `JIRA_API_TOKEN` is set in GitHub Secrets
2. Confirm the token is valid and not expired
3. Check that transition IDs match your Jira board configuration
4. Verify ticket key format: `KAN-XX` (case-sensitive)

### Wrong Transition ID Error

Run this to find correct transition IDs for your instance:

```bash
TICKET=KAN-43
EMAIL=shahidhussain004@gmail.com
TOKEN=your_jira_token

curl -X GET \
  -H "Authorization: Basic $(echo -n $EMAIL:$TOKEN | base64)" \
  "https://designercompk.atlassian.net/rest/api/3/issue/$TICKET/transitions" \
  | jq '.transitions[] | {name: .to.name, id: .id}'
```

Update the workflow IDs based on the output.

## Advanced: Custom Automation

You can extend this workflow to:

1. **Auto-assign tickets** to PR author
2. **Add comments** to tickets with PR links
3. **Create subtasks** for code reviews
4. **Post to Slack** when tickets are done
5. **Generate release notes** from merged tickets

## Reference

- [Jira API Documentation](https://developer.atlassian.com/cloud/jira/rest/v3)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Branch Naming Conventions](https://git-flow.readthedocs.io/en/latest/branching-and-tagging.html)

## Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Verify Jira API token permissions
3. Confirm branch naming convention is followed
4. Review workflow YAML syntax
