# Seed Data Migrations

This folder contains seed data and reference data migrations that populate the database with initial/test data.

## File Organization

Seed data migrations follow the pattern `V{NUMBER}__seed_{description}.sql` to distinguish them from schema migrations.

### Currently Available Seed Data

- **V100__seed_job_categories.sql** - Inserts standard job categories
- **V101__seed_experience_levels.sql** - Inserts standard experience levels  
- **V102__seed_test_data.sql** - Test users (companies, freelancers, admin), test jobs, proposals, and notifications

## Usage

These files are automatically executed by Flyway in sequence. You can:

1. **For development/testing**: Run the application normally and all seed data will be applied
2. **For production**: Either:
   - Skip these migrations by excluding this folder from the migration path, or
   - Selectively apply only production-appropriate seed data

## Guidelines for Adding New Seed Data

When adding new seed data:

1. Create a new file with pattern `V{NUMBER}__seed_{description}.sql`
2. Use the next available version number (check existing files)
3. Include clear comments about what data is being inserted
4. Include timestamps using `CURRENT_TIMESTAMP`
5. Consider idempotency - seed should be safe to run multiple times if possible
6. Document the purpose in this README

## Important Notes

- Seed data in this folder is separate from schema migrations in the parent `migration/` folder
- These migrations run AFTER all schema migrations
- Test data includes hashed passwords (bcrypt hash of "password123")
