/**
 * Seed runner script
 * Run manually: npm run seed
 */
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

const SEEDS_DIR = path.resolve(__dirname, '../database/seeds');
const SCHEMA = process.env.DB_SCHEMA || 'content';

/**
 * Parse DATABASE_URL if provided, otherwise use individual env vars
 */
function parseConnectionConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      return {
        host: url.hostname,
        port: parseInt(url.port || '5432'),
        database: url.pathname.slice(1).split('?')[0],
        user: url.username,
        password: decodeURIComponent(url.password),
      };
    } catch (error) {
      console.error('Invalid DATABASE_URL, falling back to individual env vars');
    }
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'marketplace_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };
}

async function runSeeds(): Promise<void> {
  const config = parseConnectionConfig();
  console.log(`Connecting to: ${config.host}:${config.port}/${config.database} as ${config.user}`);

  const pool = new Pool(config);

  console.log('🌱 Running seed scripts...');
  console.log(`Schema: ${SCHEMA}`);
  console.log(`Seeds directory: ${SEEDS_DIR}`);

  try {
    // Set search path
    await pool.query(`SET search_path TO ${SCHEMA}, public`);

    // Get all seed files
    const files = fs
      .readdirSync(SEEDS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} seed file(s)`);

    for (const file of files) {
      console.log(`\n📄 Running: ${file}`);

      const sql = fs.readFileSync(path.join(SEEDS_DIR, file), 'utf-8');

      try {
        await pool.query('BEGIN');
        await pool.query(sql);
        await pool.query('COMMIT');
        console.log(`  ✓ ${file} completed successfully`);
      } catch (error) {
        await pool.query('ROLLBACK');
        console.error(`  ✗ ${file} failed:`, error);
        throw error;
      }
    }

    console.log('\n✅ All seeds completed successfully!');
  } finally {
    await pool.end();
  }
}

// Run if called directly
runSeeds()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
