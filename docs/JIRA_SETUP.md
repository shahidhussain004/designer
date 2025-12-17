# Jira Integration Setup Guide

## Step 1: Get Your Atlassian Email

Your email is the one you use to log into Jira at: https://designercompk.atlassian.net/

## Step 2: Install Python Dependencies

```bash
pip install requests
```

## Step 3: Run the Integration Script

Navigate to the `c:\playground\designer` folder and run:

```bash
python jira_integration.py \
  --domain designercompk \
  --email YOUR_ATLASSIAN_EMAIL@example.com \
  --token designer.com.pk_API_AI_Token \
  --project-key KAN
```

**Replace:**
- `YOUR_ATLASSIAN_EMAIL@example.com` with your actual Atlassian email
- Keep `--token designer.com.pk_API_AI_Token` as is (your API token)
- `designercompk` and `KAN` are your current domain and project key

### Example:
```bash
python jira_integration.py \
  --domain designercompk \
  --email john@company.com \
  --token designer.com.pk_API_AI_Token \
  --project-key KAN
```

## Step 4: Check Your Jira Board

After the script completes successfully, visit:
https://designercompk.atlassian.net/jira/software/projects/KAN/boards/2

You should see:

✅ **4 Epics** (Phases 1-4)
- Phase 1: Core Marketplace
- Phase 2: Messaging + Admin
- Phase 3: LMS + Security
- Phase 4: Analytics & Deployment

✅ **6 Features** (Technology groupings)
- Infrastructure & Setup
- Java Spring Boot - Core APIs
- Next.js Frontend - Core Pages
- Database & Gateway
- (More in later phases)

✅ **HIGH Priority Tasks** (20+ initial tasks)
All linked to their respective Features and Epics

## What Gets Populated

### Hierarchy Structure:
```
Epic (Phase)
  └── Story/Feature (Technology Group)
      └── Task (Individual Work Item)
```

### Task Details Include:
- Task ID (e.g., 1.1, 1.7, 1.22)
- Title and Description
- Estimated Days (Story Points)
- Learning Days
- Notes/Context

### Task Linking:
- Each Task is linked to its Feature (Story)
- Each Feature is linked to its Phase (Epic)
- Easy to filter by epic/phase or feature/technology

## Managing Tasks in Jira

After import, you can:

1. **Update Status**: Drag tasks between columns (To Do → In Progress → Done)
2. **Update Actual Dates**: Click task → Set start/end date
3. **Add Subtasks**: For any task, create subtasks
4. **Add Learning Notes**: Use Comments for tracking learning progress
5. **Link Related Tasks**: Link dependent tasks
6. **Track Time**: Log actual hours vs estimates

## Keeping Sync with Markdown

The markdown file (`PROJECT_TIMELINE_TRACKER.md`) remains your master reference:
- Copy actual dates from Jira back to markdown weekly
- Use markdown for offline reference/backup
- Use Jira for real-time collaboration and tracking

## Troubleshooting

### Connection Failed
- Verify your email is correct
- Check API token is valid (hasn't been revoked)
- Ensure you're using the right Jira domain

### Issues Not Appearing
- They might be created but not shown on current board view
- Try filtering by Project = KAN to see all issues
- Check the Backlog view

### Field Mapping Issues
- `customfield_10014` is the Epic Link field in your Jira instance
- `customfield_10005` is Story Points field
- These may differ in other Jira instances

## Next Steps

1. Run the script to populate Phase 1 HIGH priority tasks
2. Verify tasks appear on your Jira board
3. Start working through tasks from your board
4. Use Jira comments to track daily progress and learning notes
5. Once Phase 1 is complete, we can add Phase 2-4 tasks

---

Questions? Check your Jira API token settings or reach out!
