// Application configuration
export const appConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8083', 10),
  host: process.env.HOST || '0.0.0.0',
  logLevel: process.env.LOG_LEVEL || 'info',
  nodeEnv: process.env.NODE_ENV || 'development',

  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001').split(','),
  },

  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'development-secret',
    issuer: process.env.JWT_ISSUER || 'marketplace-service',
  },

  marketplaceService: {
    url: process.env.MARKETPLACE_SERVICE_URL || 'http://localhost:8080/api',
  },

  cache: {
    ttl: {
      content: parseInt(process.env.CACHE_TTL_CONTENT || '3600', 10),
      list: parseInt(process.env.CACHE_TTL_LIST || '600', 10),
      categories: parseInt(process.env.CACHE_TTL_CATEGORIES || '7200', 10),
    },
  },

  // Image upload configuration
  imageUpload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxSize: parseInt(process.env.IMAGE_MAX_SIZE_BYTES || '10485760', 10), // 10MB
    allowedMimeTypes: (
      process.env.IMAGE_ALLOWED_TYPES || 'image/jpeg,image/png,image/webp,image/gif'
    ).split(','),
  },

  image: {
    maxSizeMB: parseInt(process.env.IMAGE_MAX_SIZE_MB || '10', 10),
    allowedTypes: (
      process.env.IMAGE_ALLOWED_TYPES || 'image/jpeg,image/png,image/webp,image/gif'
    ).split(','),
    sizes: {
      thumbnail: parseInt(process.env.IMAGE_THUMBNAIL_WIDTH || '300', 10),
      medium: parseInt(process.env.IMAGE_MEDIUM_WIDTH || '800', 10),
      large: parseInt(process.env.IMAGE_LARGE_WIDTH || '1200', 10),
    },
  },
};

export type AppConfig = typeof appConfig;
