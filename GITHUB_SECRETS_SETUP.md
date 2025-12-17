# GitHub Secrets Configuration

## ⚠️ CRITICAL: Add JIRA_API_TOKEN Secret

Your Jira automation workflow is now pushed to GitHub and ready. To enable it, you must add your Jira API token to GitHub Secrets.

### Steps:

1. **Go to Your GitHub Repository Settings**
   - URL: `https://github.com/shahidhussain004/designer/settings/secrets/actions`
   - Or navigate: Repository → Settings → Secrets and variables → Actions

2. **Create New Repository Secret**
   - Click "New repository secret"
   - **Name:** `JIRA_API_TOKEN`
   - **Value:** [Your Jira API Token from earlier]

3. **Save**
   - Click "Add secret"

### Verify:
- After adding the secret, any push or PR will trigger the Jira automation workflows
- Check: https://github.com/shahidhussain004/designer/actions to see workflow runs

## Test with Feature Branch

Your test branch is ready:
- **Branch:** `feature/KAN-43-test-automation`
- **PR:** https://github.com/shahidhussain004/designer/pull/new/feature/KAN-43-test-automation

### To Test Jira Automation:

1. **Create PR from test branch**
   - Go to https://github.com/shahidhussain004/designer/compare/main...feature/KAN-43-test-automation
   - Click "Create pull request"
   - Add a description and click "Create pull request"
   - **Expected:** KAN-43 ticket should move to "In Review" status in Jira

2. **Test "test" Label Trigger**
   - On the PR, click "Labels" 
   - Search for "test" label (create if needed)
   - Add the label to the PR
   - **Expected:** KAN-43 should move to "Test" status in Jira

3. **Test Merge to Done**
   - Click "Merge pull request"
   - Choose merge strategy and confirm
   - **Expected:** KAN-43 should move to "Done" status in Jira

## Workflow Transition IDs (Verified for Your Instance)

Your Jira instance transitions:
- **To Do:** 11
- **In Progress:** 21
- **In Review:** 31 ✅ (Used for PR opened)
- **Test:** 41 ✅ (Used for test label)
- **Done:** 51 ✅ (Used for PR merge)

These IDs are already configured in `.github/workflows/jira-automation.yml`

## Troubleshooting

If workflows don't trigger:
1. Check Actions tab: https://github.com/shahidhussain004/designer/actions
2. Verify secret is set correctly (should show "1 secret")
3. Verify branch naming: must contain `KAN-XX` pattern
4. Check curl errors in workflow logs

## Reference Files

- Workflow: [`.github/workflows/jira-automation.yml`](.github/workflows/jira-automation.yml)
- Setup Guide: [`docs/JIRA_AUTOMATION_SETUP.md`](docs/JIRA_AUTOMATION_SETUP.md)
- Quick Start: [`JIRA_AUTOMATION_QUICKSTART.md`](JIRA_AUTOMATION_QUICKSTART.md)