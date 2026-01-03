// Database configuration
export const databaseConfig = {
  url:
    process.env.DATABASE_URL ||
    'postgresql://marketplace_user:marketplace_pass_dev@localhost:5432/marketplace_db?schema=content',
  logging: process.env.NODE_ENV === 'development',
};

export type DatabaseConfig = typeof databaseConfig;
