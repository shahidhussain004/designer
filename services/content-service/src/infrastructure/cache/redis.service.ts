/**
 * Redis cache service
 */
import { logger } from '@config/logger.config';
import { redisConfig } from '@config/redis.config';
import Redis, { RedisOptions } from 'ioredis';

class RedisService {
  private static instance: RedisService;
  private _client: Redis;
  private _isConnected: boolean = false;

  private constructor() {
    const options: RedisOptions = {
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password || undefined,
      db: redisConfig.db,
      retryStrategy: (times: number) => {
        if (times > 10) {
          logger.error('Redis connection failed after 10 retries');
          return null;
        }
        return Math.min(times * 100, 3000);
      },
      lazyConnect: true,
    };

    this._client = new Redis(options);

    this._client.on('connect', () => {
      this._isConnected = true;
      logger.info('Redis connected successfully');
    });

    this._client.on('error', (err) => {
      this._isConnected = false;
      logger.error({ error: err.message }, 'Redis connection error');
    });

    this._client.on('close', () => {
      this._isConnected = false;
      logger.warn('Redis connection closed');
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public get client(): Redis {
    return this._client;
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public async connect(): Promise<void> {
    try {
      await this._client.connect();
    } catch (error) {
      logger.error({ error }, 'Failed to connect to Redis');
      // Don't throw - Redis is optional for the service to run
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this._client.quit();
      logger.info('Redis disconnected');
    } catch (error) {
      logger.error({ error }, 'Error disconnecting from Redis');
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this._client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  // Cache operations
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this._client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.warn({ error, key }, 'Cache get error');
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this._client.setex(key, ttlSeconds, serialized);
      } else {
        await this._client.set(key, serialized);
      }
    } catch (error) {
      logger.warn({ error, key }, 'Cache set error');
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this._client.del(key);
    } catch (error) {
      logger.warn({ error, key }, 'Cache delete error');
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await this._client.keys(pattern);
      if (keys.length > 0) {
        await this._client.del(...keys);
      }
    } catch (error) {
      logger.warn({ error, pattern }, 'Cache delete pattern error');
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this._client.exists(key);
      return result === 1;
    } catch {
      return false;
    }
  }

  async incr(key: string): Promise<number> {
    return this._client.incr(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this._client.expire(key, ttlSeconds);
  }

  // Content-specific cache methods
  buildContentKey(id: string): string {
    return `${redisConfig.keyPatterns.content}${id}`;
  }

  buildContentListKey(params: string): string {
    return `${redisConfig.keyPatterns.contentList}${params}`;
  }

  buildCategoryKey(id: string): string {
    return `${redisConfig.keyPatterns.category}${id}`;
  }

  buildTagKey(id: string): string {
    return `${redisConfig.keyPatterns.tag}${id}`;
  }

  buildAuthorKey(id: string): string {
    return `${redisConfig.keyPatterns.author}${id}`;
  }

  buildSearchKey(query: string): string {
    return `${redisConfig.keyPatterns.search}${query}`;
  }
}

export const redisService = RedisService.getInstance();
export const redis = redisService.client;
