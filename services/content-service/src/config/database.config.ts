// Database configuration
export const databaseConfig = {
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres:password@localhost:5432/content_db?schema=public',
  logging: process.env.NODE_ENV === 'development',
};

export type DatabaseConfig = typeof databaseConfig;
