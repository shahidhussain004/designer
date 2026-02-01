// Base Repository with common CRUD operations
import { PoolClient, QueryResult, QueryResultRow } from 'pg';
import { query, transaction } from '../config/database';

export abstract class BaseRepository<T extends QueryResultRow, CreateDTO, UpdateDTO> {
  protected abstract tableName: string;
  protected abstract columns: string[];

  /**
   * Find all records with optional pagination
   */
  async findAll(
    limit: number = 10,
    offset: number = 0,
    orderBy: string = 'created_at',
    orderDir: 'asc' | 'desc' = 'desc'
  ): Promise<T[]> {
    const result = await query<T>(
      `SELECT * FROM ${this.tableName} 
       ORDER BY ${orderBy} ${orderDir} 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  /**
   * Find record by ID
   */
  async findById(id: number): Promise<T | null> {
    const result = await query<T>(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  /**
   * Count total records
   */
  async count(whereClause?: string, params?: any[]): Promise<number> {
    const sql = whereClause
      ? `SELECT COUNT(*) FROM ${this.tableName} WHERE ${whereClause}`
      : `SELECT COUNT(*) FROM ${this.tableName}`;

    const result = await query<{ count: string }>(sql, params);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Delete record by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Check if record exists
   */
  async exists(id: number): Promise<boolean> {
    const result = await query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM ${this.tableName} WHERE id = $1)`,
      [id]
    );
    return result.rows[0].exists;
  }

  /**
   * Build INSERT query dynamically
   */
  protected buildInsertQuery(data: Record<string, any>): {
    sql: string;
    values: any[];
  } {
    const keys = Object.keys(data).filter((k) => data[k] !== undefined);
    const values = keys.map((k) => data[k]);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');

    return {
      sql: `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values,
    };
  }

  /**
   * Build UPDATE query dynamically
   */
  protected buildUpdateQuery(
    id: number,
    data: Record<string, any>
  ): { sql: string; values: any[] } {
    const keys = Object.keys(data).filter((k) => data[k] !== undefined);
    const values = keys.map((k) => data[k]);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

    values.push(id);

    return {
      sql: `UPDATE ${this.tableName} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`,
      values,
    };
  }

  /**
   * Execute raw query
   */
  protected async rawQuery<R extends QueryResultRow = any>(
    sql: string,
    params?: any[]
  ): Promise<QueryResult<R>> {
    return query<R>(sql, params);
  }

  /**
   * Execute in transaction
   */
  protected async withTransaction<R>(callback: (client: PoolClient) => Promise<R>): Promise<R> {
    return transaction(callback);
  }
}

export default BaseRepository;
