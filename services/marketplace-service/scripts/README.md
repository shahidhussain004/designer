# Migration Helper

This folder contains a small helper to detect `bytea` columns in your PostgreSQL database and apply the V20 migration `V20__coerce_bytea_to_text.sql` that converts likely-affected columns to `text`/`text[]`.

Prerequisites
- `psql` on PATH (PostgreSQL client)
- PowerShell (Windows)
- Backup your database before running anything

Usage

Open PowerShell and run:

```powershell
cd services/marketplace-service/scripts
.\run_v20_migration.ps1
```

The script will prompt for DB host, user, and password, list columns currently of type `bytea`, and ask for confirmation before applying the migration SQL file.

Manual alternative

If you prefer to run the migration directly with `psql`:

```powershell
psql "host=DB_HOST port=5432 dbname=marketplace_db user=DB_USER password=DB_PASS" -f ..\src\main\resources\db\migration\V20__coerce_bytea_to_text.sql
```

If `convert_from(...,'UTF8')` fails due to invalid byte sequences, inspect problematic rows first, for example:

```sql
SELECT id, pg_typeof(skills) AS t, encode(skills, 'escape') AS val
FROM users
WHERE pg_typeof(skills) = 'bytea'::regtype
LIMIT 20;
```

Contact
If you want me to craft column-specific ALTER statements or help clean problematic rows, paste the `bytea` detection output or a sample problem row and I will generate the exact SQL to run.
