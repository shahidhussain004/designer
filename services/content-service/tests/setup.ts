import { afterEach, beforeEach, vi } from 'vitest';

// Mock Database Service (using raw pg instead of Prisma)
const databaseMock = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  healthCheck: vi.fn().mockResolvedValue(true),
  query: vi.fn(),
  getPool: vi.fn(),
  getMigrationStatus: vi.fn(),
};

export { databaseMock };

vi.mock('@config/db.service', () => ({
  databaseService: databaseMock,
}));

// Mock Redis
vi.mock('@infrastructure/cache/redis.service', () => ({
  redisService: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    deletePattern: vi.fn(),
    getCategoryById: vi.fn(),
    setCategoryById: vi.fn(),
    invalidateCategoryCache: vi.fn(),
    getTagById: vi.fn(),
    setTagById: vi.fn(),
    invalidateTagCache: vi.fn(),
    getContentById: vi.fn(),
    setContentById: vi.fn(),
    getContentBySlug: vi.fn(),
    setContentBySlug: vi.fn(),
    invalidateContentCache: vi.fn(),
    getSearchResults: vi.fn(),
    setSearchResults: vi.fn(),
    healthCheck: vi.fn().mockResolvedValue(true),
  },
}));

// Mock Kafka
vi.mock('@infrastructure/messaging/kafka.service', () => ({
  kafkaService: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    publishContentCreated: vi.fn(),
    publishContentUpdated: vi.fn(),
    publishContentPublished: vi.fn(),
    publishContentDeleted: vi.fn(),
    publishCommentCreated: vi.fn(),
    publishContentViewed: vi.fn(),
    publishContentLiked: vi.fn(),
    healthCheck: vi.fn().mockResolvedValue(true),
  },
}));

// Mock Storage
vi.mock('@infrastructure/storage/storage.service', () => ({
  storageService: {
    initialize: vi.fn(),
    init: vi.fn(),
    uploadImage: vi.fn(),
    deleteFile: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

// Suppress console output during tests
global.console = {
  ...console,
  log: vi.fn() as unknown as typeof console.log,
  debug: vi.fn() as unknown as typeof console.debug,
  info: vi.fn() as unknown as typeof console.info,
  warn: vi.fn() as unknown as typeof console.warn,
  error: vi.fn() as unknown as typeof console.error,
};
