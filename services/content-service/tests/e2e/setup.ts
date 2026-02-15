import { vi } from 'vitest';

// Mock BEFORE importing anything else from the app
// This is critical - vi.doMock must run before any module loads the real services

// Mock database query function directly to intercept all database calls
vi.doMock('@config/database', () => ({
  query: vi.fn((text: string, params?: any[]) => {
    // Route certain queries to our mock data
    if (text.includes('COUNT(*) FROM categories')) {
      return Promise.resolve({ rows: [{ count: '2' }], rowCount: 1 });
    }
    if (text.includes('FROM categories') && text.includes('ORDER BY')) {
      // This is the main categories query with pagination
      return Promise.resolve({
        rows: [
          {
            id: 1,
            name: 'Technology',
            icon: 'tech-icon',
            sort_order: 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: 'Business',
            icon: 'business-icon',
            sort_order: 2,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        rowCount: 2,
      });
    }
    if (text.includes('FROM categories') && text.includes('is_active')) {
      // Category tree active query
      return Promise.resolve({
        rows: [
          {
            id: 1,
            name: 'Technology',
            parent_id: null,
            icon: 'tech-icon',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: 'Business',
            parent_id: null,
            icon: 'business-icon',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        rowCount: 2,
      });
    }
    if (text.includes('COUNT(*) FROM tags')) {
      return Promise.resolve({ rows: [{ count: '3' }], rowCount: 1 });
    }
    if (text.includes('FROM tags') && text.includes('ORDER BY')) {
      return Promise.resolve({
        rows: [
          { id: 'tag-1', name: 'JavaScript', color: '#F7DF1E' },
          { id: 'tag-2', name: 'Node.js', color: '#68A063' },
          { id: 'tag-3', name: 'REST API', color: '#009688' },
        ],
        rowCount: 3,
      });
    }
    if (text.includes('FROM tags') && text.includes('trending')) {
      // Popular tags
      return Promise.resolve({
        rows: [
          { id: 'tag-1', name: 'JavaScript', color: '#F7DF1E' },
          { id: 'tag-2', name: 'Node.js', color: '#68A063' },
        ],
        rowCount: 2,
      });
    }
    if (text.includes('COUNT(*) FROM content')) {
      return Promise.resolve({ rows: [{ count: '1' }], rowCount: 1 });
    }
    if (text.includes('FROM content') && text.includes('ORDER BY')) {
      return Promise.resolve({
        rows: [
          {
            id: 'content-1',
            title: 'Getting Started with Node.js',
            body: 'Learn Node.js basics',
            type: 'ARTICLE',
            status: 'PUBLISHED',
            category_id: '1',
            featured: false,
            trending: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        rowCount: 1,
      });
    }
    if (text.includes('FROM content') && text.includes('featured')) {
      return Promise.resolve({
        rows: [
          {
            id: 'content-1',
            title: 'Getting Started with Node.js',
            body: 'Learn Node.js basics',
            type: 'ARTICLE',
            status: 'PUBLISHED',
            category_id: '1',
            featured: true,
            trending: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        rowCount: 1,
      });
    }
    if (text.includes('FROM content') && text.includes('trending')) {
      return Promise.resolve({
        rows: [
          {
            id: 'content-1',
            title: 'Getting Started with Node.js',
            body: 'Learn Node.js basics',
            type: 'ARTICLE',
            status: 'PUBLISHED',
            category_id: '1',
            featured: false,
            trending: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        rowCount: 1,
      });
    }
    // Search queries (FTS)
    if (
      text.includes('plainto_tsquery') ||
      text.includes('to_tsquery') ||
      text.includes('ts_rank')
    ) {
      // Full-text search query
      return Promise.resolve({
        rows: [
          {
            id: 'content-1',
            title: 'Getting Started with Node.js',
            slug: 'getting-started-nodejs',
            excerpt: 'Learn Node.js basics',
            type: 'content',
            relevance: '1.0',
          },
        ],
        rowCount: 1,
      });
    }
    // Default: return empty result
    return Promise.resolve({ rows: [], rowCount: 0 });
  }),
  getPool: vi.fn().mockReturnValue({ end: vi.fn() }),
  initializeSchema: vi.fn().mockResolvedValue(undefined),
  healthCheck: vi.fn().mockResolvedValue(true),
  SCHEMA: 'content',
  closePool: vi.fn().mockResolvedValue(undefined),
}));

// Mock db.service with lazy getDatabaseService
vi.doMock('@config/db.service', () => {
  const createMockDatabaseService = () => ({
    connected: true,
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    healthCheck: vi.fn().mockResolvedValue(true),
    getMigrationStatus: vi.fn().mockResolvedValue({ applied: [], pending: [] }),
    query: vi.fn((text: string) => {
      if (text.includes('COUNT(*) FROM categories')) {
        return Promise.resolve({ rows: [{ count: '2' }], rowCount: 1 });
      }
      if (text.includes('FROM categories') && !text.includes('WHERE')) {
        return Promise.resolve({
          rows: [
            { id: '1', name: 'Technology', icon: 'tech-icon', sort_order: 1 },
            { id: '2', name: 'Business', icon: 'business-icon', sort_order: 2 },
          ],
          rowCount: 2,
        });
      }
      return Promise.resolve({ rows: [], rowCount: 0 });
    }),
    getPool: vi.fn().mockReturnValue({ end: vi.fn() }),
  });

  const mockDB = createMockDatabaseService();
  return {
    getDatabaseService: () => mockDB,
  };
});

vi.doMock('@infrastructure/cache/redis.service', () => ({
  redisService: {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    delete: vi.fn().mockResolvedValue(1),
    healthCheck: vi.fn().mockResolvedValue(true),
  },
}));

vi.doMock('@infrastructure/messaging/kafka.service', () => ({
  kafkaService: {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    publish: vi.fn().mockResolvedValue(undefined),
    healthCheck: vi.fn().mockResolvedValue(true),
  },
}));

vi.doMock('@infrastructure/storage/storage.service', () => ({
  storageService: {
    init: vi.fn().mockResolvedValue(undefined),
    uploadFile: vi.fn().mockResolvedValue({ url: 'mock-url' }),
    deleteFile: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock search and analytics services to prevent database calls for complex queries
vi.doMock('../src/services/search.service', () => {
  const SearchService = class {
    async search() {
      return {
        results: [
          {
            id: 1,
            title: 'Getting Started with Node.js',
            type: 'content',
            slug: 'getting-started-nodejs',
            excerpt: 'Learn Node.js basics',
            relevance: 1.0,
          },
        ],
        total: 1,
      };
    }
    async searchContent() {
      return {
        results: [
          {
            id: 1,
            title: 'Getting Started with Node.js',
            type: 'content',
            slug: 'getting-started-nodejs',
            excerpt: 'Learn Node.js basics',
            relevance: 1.0,
          },
        ],
        total: 1,
      };
    }
    async searchTutorials() {
      return { results: [], total: 0 };
    }
  };
  return {
    SearchService,
    searchService: new SearchService(),
  };
});
