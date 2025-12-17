# scripts/

This folder contains admin utilities for interacting with Jira.

Files:
- `jira_integration.py`: Main integration tool. Can create/rebuild board, list epics, assign and transition tasks, and detect transitions.

Quick usage:

1. Install dependencies:

```bash
python -m pip install --user -r ../requirements.txt
```

2. Detect transitions (uses subcommand `transitions`):

```bash
python scripts/jira_integration.py --domain designercompk --email you@domain.com --token <API_TOKEN> transitions KAN-43
```

3. Rebuild board (DESTRUCTIVE - use with care):

```bash
python scripts/jira_integration.py --domain designercompk --email you@domain.com --token <API_TOKEN> --rebuild-board
```

Safety:
- `--clean-board` and `--rebuild-board` are destructive and will delete issues. Use only with backups or on test instances.

Contact:
- Keep Jira credentials secret and store tokens in GitHub Actions secrets when used in automation.
