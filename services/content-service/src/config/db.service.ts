/**
 * PostgreSQL Database Service (replaces Prisma)
 * Uses raw pg library with connection pooling
 */
import {
  closePool,
  healthCheck as dbHealthCheck,
  getPool,
  initializeSchema,
  query,
} from './database';
import { logger } from './logger.config';
import { getMigrationStatus, runMigrations } from './migrations';

class DatabaseService {
  private static instance: DatabaseService;
  private _connected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public get connected(): boolean {
    return this._connected;
  }

  public async connect(): Promise<void> {
    try {
      // Initialize the pool and schema
      await initializeSchema();

      // Run migrations automatically
      logger.info('Running database migrations...');
      await runMigrations();

      // Test connection
      const healthy = await dbHealthCheck();
      if (!healthy) {
        throw new Error('Database health check failed');
      }

      this._connected = true;
      logger.info('Database connected and migrations applied successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to connect to database');
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await closePool();
      this._connected = false;
      logger.info('Database disconnected');
    } catch (error) {
      logger.error({ error }, 'Error disconnecting from database');
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      return await dbHealthCheck();
    } catch {
      return false;
    }
  }

  public async getMigrationStatus() {
    return getMigrationStatus();
  }

  /**
   * Execute a raw query - exposed for direct database access when needed
   */
  public async query<T extends Record<string, any> = any>(text: string, params?: any[]) {
    return query<T>(text, params);
  }

  /**
   * Get the connection pool for advanced use cases
   */
  public getPool() {
    return getPool();
  }
}

/**
 * Lazy getter for database service instance
 * Returns the singleton, but defers creation until first call
 * This allows test mocks to intercept the getInstance() call
 */
export function getDatabaseService(): DatabaseService {
  return DatabaseService.getInstance();
}
