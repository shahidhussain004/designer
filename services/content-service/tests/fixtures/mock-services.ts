import { vi } from 'vitest';

/**
 * Create mock database service for e2e tests
 * This simulates database responses without requiring a real PostgreSQL instance
 */
export function createMockDatabaseService() {
  const mockData: Record<string, any[]> = {
    categories: [
      { id: '1', name: 'Technology', icon: 'tech-icon', sort_order: 1 },
      { id: '2', name: 'Business', icon: 'business-icon', sort_order: 2 },
    ],
    tags: [
      { id: 'tag-1', name: 'JavaScript', color: '#F7DF1E' },
      { id: 'tag-2', name: 'Node.js', color: '#68A063' },
      { id: 'tag-3', name: 'REST API', color: '#009688' },
    ],
    content: [
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
      },
    ],
  };

  return {
    connected: true,
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    healthCheck: vi.fn().mockResolvedValue(true),
    getMigrationStatus: vi.fn().mockResolvedValue({ applied: true }),
    query: vi.fn((text: string) => {
      if (text.includes('COUNT(*) FROM categories')) {
        return Promise.resolve([[{ count: mockData.categories.length }]]);
      }
      if (text.includes('FROM categories')) {
        return Promise.resolve([mockData.categories]);
      }
      if (text.includes('COUNT(*) FROM tags')) {
        return Promise.resolve([[{ count: mockData.tags.length }]]);
      }
      if (text.includes('FROM tags')) {
        return Promise.resolve([mockData.tags]);
      }
      if (text.includes('COUNT(*) FROM content')) {
        return Promise.resolve([[{ count: mockData.content.length }]]);
      }
      if (text.includes('FROM content')) {
        return Promise.resolve([mockData.content]);
      }
      return Promise.resolve([[]]);
    }),
    getPool: vi.fn().mockReturnValue({ end: vi.fn() }),
  };
}

/**
 * Create mock Redis service for e2e tests
 */
export function createMockRedisService() {
  const cache = new Map();
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    get: vi.fn((key: string) => {
      const val = cache.get(key);
      return Promise.resolve(val ? JSON.parse(val) : null);
    }),
    set: vi.fn((key: string, value: any) => {
      cache.set(key, JSON.stringify(value));
      return Promise.resolve('OK');
    }),
    delete: vi.fn((key: string) => {
      cache.delete(key);
      return Promise.resolve(1);
    }),
    deletePattern: vi.fn((pattern: string) => {
      for (const key of cache.keys()) {
        if (key.includes(pattern.replace('*', ''))) {
          cache.delete(key);
        }
      }
      return Promise.resolve(cache.size);
    }),
    getCategoryById: vi.fn((id: string) => Promise.resolve([{ id, name: 'Cache Hit' }])),
    setCategoryById: vi.fn(() => Promise.resolve('OK')),
    invalidateCategoryCache: vi.fn(() => Promise.resolve(undefined)),
    getTagById: vi.fn((id: string) => Promise.resolve([{ id, name: 'Tag' }])),
    setTagById: vi.fn(() => Promise.resolve('OK')),
    invalidateTagCache: vi.fn(() => Promise.resolve(undefined)),
    getContentById: vi.fn((id: string) => Promise.resolve([{ id, title: 'Content' }])),
    setContentById: vi.fn(() => Promise.resolve('OK')),
    getContentBySlug: vi.fn((slug: string) => Promise.resolve([{ slug, title: 'Content' }])),
    setContentBySlug: vi.fn(() => Promise.resolve('OK')),
    invalidateContentCache: vi.fn(() => Promise.resolve(undefined)),
    getSearchResults: vi.fn(() => Promise.resolve([])),
    setSearchResults: vi.fn(() => Promise.resolve('OK')),
    healthCheck: vi.fn().mockResolvedValue(true),
  };
}

/**
 * Create mock Kafka service for e2e tests
 */
export function createMockKafkaService() {
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    publishContentCreated: vi.fn().mockResolvedValue(undefined),
    publishContentUpdated: vi.fn().mockResolvedValue(undefined),
    publishContentPublished: vi.fn().mockResolvedValue(undefined),
    publishContentDeleted: vi.fn().mockResolvedValue(undefined),
    publishCommentCreated: vi.fn().mockResolvedValue(undefined),
    publishContentViewed: vi.fn().mockResolvedValue(undefined),
    publishContentLiked: vi.fn().mockResolvedValue(undefined),
    healthCheck: vi.fn().mockResolvedValue(true),
  };
}

/**
 * Create mock storage service for e2e tests
 */
export function createMockStorageService() {
  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    init: vi.fn().mockResolvedValue(undefined),
    uploadImage: vi.fn().mockResolvedValue('https://storage.example.com/images/test.jpg'),
    deleteFile: vi.fn().mockResolvedValue(true),
  };
}
