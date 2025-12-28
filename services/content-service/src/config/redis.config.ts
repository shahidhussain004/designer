// Redis configuration
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  
  // Key prefixes
  keyPrefix: 'content-service:',
  
  // Key patterns for cache keys
  keyPatterns: {
    content: 'content:',
    contentList: 'content:list:',
    category: 'category:',
    tag: 'tag:',
    author: 'author:',
    search: 'search:',
  },
  
  // TTL in seconds
  ttl: {
    content: parseInt(process.env.CACHE_TTL_CONTENT || '3600', 10),
    category: parseInt(process.env.CACHE_TTL_CATEGORY || '7200', 10),
    tag: parseInt(process.env.CACHE_TTL_TAG || '7200', 10),
    search: parseInt(process.env.CACHE_TTL_SEARCH || '600', 10),
  },
  
  // Cache key builder functions
  keys: {
    contentById: (id: string) => `content:${id}`,
    contentBySlug: (slug: string) => `content:slug:${slug}`,
    contentList: (type: string, page: number, limit: number) => `content:list:${type}:${page}:${limit}`,
    featuredContent: 'content:featured',
    trendingContent: 'content:trending',
    categories: 'categories:all',
    popularTags: (limit: number) => `tags:popular:${limit}`,
    authorContent: (authorId: string) => `author:${authorId}:content`,
  },
};

export type RedisConfig = typeof redisConfig;
