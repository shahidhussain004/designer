/**
 * Migration runner script
 * Run manually: npm run db:migrate
 */
import * as dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import { getMigrationStatus, runMigrations } from '../src/config/migrations';

async function main(): Promise<void> {
  console.log('📦 Database Migration Runner');
  console.log('============================\n');

  try {
    // Show current status
    const statusBefore = await getMigrationStatus();
    console.log(`Applied migrations: ${statusBefore.applied.length}`);
    console.log(`Pending migrations: ${statusBefore.pending.length}\n`);

    if (statusBefore.pending.length === 0) {
      console.log('✅ Database is up to date!');
      return;
    }

    // Run migrations
    await runMigrations();

    // Show final status
    const statusAfter = await getMigrationStatus();
    console.log(`\n✅ Migration complete!`);
    console.log(`Total applied migrations: ${statusAfter.applied.length}`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
