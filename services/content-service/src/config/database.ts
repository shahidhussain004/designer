import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

/**
 * Parse DATABASE_URL if provided, otherwise use individual env vars
 * Format: postgresql://user:password@host:port/database
 */
function parseConnectionConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      const config = {
        host: url.hostname,
        port: parseInt(url.port || '5432'),
        database: url.pathname.slice(1).split('?')[0], // Remove leading '/' and query params
        user: url.username,
        password: decodeURIComponent(url.password), // Handle URL-encoded passwords
        max: parseInt(process.env.DB_POOL_SIZE || '20'),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };
      return config;
    } catch (error) {
      console.error('Invalid DATABASE_URL format, falling back to individual env vars:', error);
    }
  }

  // Fallback to individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'marketplace_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: parseInt(process.env.DB_POOL_SIZE || '20'),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
}

// Schema configuration - all queries will use this schema
export const SCHEMA = process.env.DB_SCHEMA || 'content';

// Connection pool
let pool: Pool | null = null;
let dbConfig: ReturnType<typeof parseConnectionConfig> | null = null;

/**
 * Get or create the database connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    // Parse config lazily to ensure env vars are loaded
    if (!dbConfig) {
      dbConfig = parseConnectionConfig();
    }
    pool = new Pool(dbConfig);

    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
    });

    pool.on('connect', (client) => {
      // Set search_path for all connections to use our schema
      client.query(`SET search_path TO ${SCHEMA}, public`);
    });
  }
  return pool;
}

/**
 * Execute a query with optional parameters
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  const start = Date.now();

  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    if (process.env.LOG_QUERIES === 'true') {
      console.log('Executed query', {
        text: text.substring(0, 100),
        duration,
        rows: result.rowCount,
      });
    }

    return result;
  } catch (error) {
    console.error('Database query error:', { text: text.substring(0, 100), error });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  const client = await pool.connect();

  // Set search_path for this client
  await client.query(`SET search_path TO ${SCHEMA}, public`);

  return client;
}

/**
 * Execute a transaction with automatic commit/rollback
 */
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getClient();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Check database connection health
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await query('SELECT 1 as health');
    return result.rows[0]?.health === 1;
  } catch {
    return false;
  }
}

/**
 * Close the connection pool gracefully
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database pool closed');
  }
}

/**
 * Initialize the database schema if it doesn't exist
 */
export async function initializeSchema(): Promise<void> {
  const pool = getPool();
  await pool.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`);
  console.log(`Schema '${SCHEMA}' initialized`);
}

export default {
  getPool,
  query,
  getClient,
  transaction,
  healthCheck,
  closePool,
  initializeSchema,
  SCHEMA,
};
