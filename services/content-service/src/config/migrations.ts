import * as fs from 'fs';
import * as path from 'path';
import { getPool, initializeSchema, query, SCHEMA } from '../config/database';

export interface Migration {
  version: number;
  name: string;
  filename: string;
  sql: string;
}

export interface MigrationRecord {
  version: number;
  name: string;
  applied_at: Date;
}

const MIGRATIONS_DIR = path.resolve(__dirname, '../../database/migrations');

/**
 * Create migrations tracking table if not exists
 */
async function createMigrationsTable(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.schema_migrations (
      version INTEGER PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

/**
 * Get list of applied migrations
 */
async function getAppliedMigrations(): Promise<MigrationRecord[]> {
  const result = await query<MigrationRecord>(
    `SELECT version, name, applied_at FROM ${SCHEMA}.schema_migrations ORDER BY version`
  );
  return result.rows;
}

/**
 * Parse migration filename to extract version and name
 * Format: V001__create_authors_table.sql
 */
function parseMigrationFilename(filename: string): { version: number; name: string } | null {
  const match = filename.match(/^V(\d+)__(.+)\.sql$/);
  if (!match) return null;

  return {
    version: parseInt(match[1], 10),
    name: match[2].replace(/_/g, ' '),
  };
}

/**
 * Load all migration files from the migrations directory
 */
function loadMigrationFiles(): Migration[] {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log('No migrations directory found');
    return [];
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql') && f.startsWith('V'))
    .sort();

  const migrations: Migration[] = [];

  for (const filename of files) {
    const parsed = parseMigrationFilename(filename);
    if (!parsed) {
      console.warn(`Skipping invalid migration filename: ${filename}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, filename), 'utf-8');
    migrations.push({
      ...parsed,
      filename,
      sql,
    });
  }

  return migrations;
}

/**
 * Apply a single migration
 */
async function applyMigration(migration: Migration): Promise<void> {
  console.log(
    `Applying migration V${String(migration.version).padStart(3, '0')}: ${migration.name}`
  );

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Set search path
    await client.query(`SET search_path TO ${SCHEMA}, public`);

    // Execute migration SQL
    await client.query(migration.sql);

    // Record migration
    await client.query(`INSERT INTO ${SCHEMA}.schema_migrations (version, name) VALUES ($1, $2)`, [
      migration.version,
      migration.name,
    ]);

    await client.query('COMMIT');
    console.log(
      `  ✓ Migration V${String(migration.version).padStart(3, '0')} applied successfully`
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`  ✗ Migration V${String(migration.version).padStart(3, '0')} failed:`, error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Run all pending migrations
 */
export async function runMigrations(): Promise<void> {
  console.log('Starting database migrations...');
  console.log(`Migrations directory: ${MIGRATIONS_DIR}`);
  console.log(`Schema: ${SCHEMA}`);

  // Initialize schema
  await initializeSchema();

  // Create migrations table
  await createMigrationsTable();

  // Get applied migrations
  const applied = await getAppliedMigrations();
  const appliedVersions = new Set(applied.map((m) => m.version));

  console.log(`Found ${applied.length} previously applied migration(s)`);

  // Load migration files
  const migrations = loadMigrationFiles();
  console.log(`Found ${migrations.length} migration file(s)`);

  // Filter pending migrations
  const pending = migrations.filter((m) => !appliedVersions.has(m.version));

  if (pending.length === 0) {
    console.log('No pending migrations');
    return;
  }

  console.log(`Applying ${pending.length} pending migration(s)...`);

  // Apply migrations in order
  for (const migration of pending) {
    await applyMigration(migration);
  }

  console.log('All migrations completed successfully');
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<{
  applied: MigrationRecord[];
  pending: Migration[];
}> {
  await initializeSchema();
  await createMigrationsTable();

  const applied = await getAppliedMigrations();
  const appliedVersions = new Set(applied.map((m) => m.version));
  const migrations = loadMigrationFiles();
  const pending = migrations.filter((m) => !appliedVersions.has(m.version));

  return { applied, pending };
}

export default { runMigrations, getMigrationStatus };
