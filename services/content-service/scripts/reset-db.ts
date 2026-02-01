/**
 * Database reset script
 * Run manually: npm run db:reset
 * WARNING: This will drop all tables and re-run migrations!
 */
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import * as readline from 'readline';

// Load environment variables
dotenv.config();

const SCHEMA = process.env.DB_SCHEMA || 'content';

async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function resetDatabase(): Promise<void> {
  console.log('⚠️  Database Reset Script');
  console.log('=========================\n');
  console.log(`Schema: ${SCHEMA}`);
  console.log(`Database: ${process.env.DB_NAME || 'marketplace_db'}`);
  console.log('\nWARNING: This will DROP the entire schema and all its data!\n');

  // Confirm in non-production environments
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot run database reset in production!');
    process.exit(1);
  }

  const confirmed = await confirm('Are you sure you want to reset the database?');
  if (!confirmed) {
    console.log('Aborted.');
    process.exit(0);
  }

  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'marketplace_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    console.log('\n🗑️  Dropping schema...');
    await pool.query(`DROP SCHEMA IF EXISTS ${SCHEMA} CASCADE`);
    console.log('✓ Schema dropped');

    console.log('\n📦 Creating fresh schema...');
    await pool.query(`CREATE SCHEMA ${SCHEMA}`);
    console.log('✓ Schema created');

    console.log('\n✅ Database reset complete!');
    console.log('\nRun the following commands to set up the database:');
    console.log('  npm run db:migrate   # Run migrations');
    console.log('  npm run db:seed      # Seed with sample data');
  } finally {
    await pool.end();
  }
}

resetDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Reset failed:', error);
    process.exit(1);
  });
