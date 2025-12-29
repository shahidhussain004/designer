/**
 * Prisma database service
 */
import { logger } from '@config/logger.config';
import { PrismaClient } from '@prisma/client';

class PrismaService {
  private static instance: PrismaService;
  private _client: PrismaClient;

  private constructor() {
    this._client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  public get client(): PrismaClient {
    return this._client;
  }

  public async connect(): Promise<void> {
    try {
      await this._client.$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to connect to database');
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this._client.$disconnect();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error({ error }, 'Error disconnecting from database');
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this._client.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

export const prismaService = PrismaService.getInstance();
export const prisma = prismaService.client;
