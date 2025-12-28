import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

// Mock Prisma Client
export const prismaMock = mockDeep<PrismaClient>();

jest.mock('./src/infrastructure/database/prisma.service', () => ({
  prismaService: {
    getClient: () => prismaMock,
    connect: jest.fn(),
    disconnect: jest.fn(),
    healthCheck: jest.fn().mockResolvedValue(true),
  },
}));

// Mock Redis
jest.mock('./src/infrastructure/cache/redis.service', () => ({
  redisService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    deletePattern: jest.fn(),
    getCategoryById: jest.fn(),
    setCategoryById: jest.fn(),
    invalidateCategoryCache: jest.fn(),
    getTagById: jest.fn(),
    setTagById: jest.fn(),
    invalidateTagCache: jest.fn(),
    getContentById: jest.fn(),
    setContentById: jest.fn(),
    getContentBySlug: jest.fn(),
    setContentBySlug: jest.fn(),
    invalidateContentCache: jest.fn(),
    getSearchResults: jest.fn(),
    setSearchResults: jest.fn(),
    healthCheck: jest.fn().mockResolvedValue(true),
  },
}));

// Mock Kafka
jest.mock('./src/infrastructure/messaging/kafka.service', () => ({
  kafkaService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    publishContentCreated: jest.fn(),
    publishContentUpdated: jest.fn(),
    publishContentPublished: jest.fn(),
    publishContentDeleted: jest.fn(),
    publishCommentCreated: jest.fn(),
    publishContentViewed: jest.fn(),
    publishContentLiked: jest.fn(),
    healthCheck: jest.fn().mockResolvedValue(true),
  },
}));

// Mock Storage
jest.mock('./src/infrastructure/storage/storage.service', () => ({
  storageService: {
    initialize: jest.fn(),
    uploadImage: jest.fn(),
    deleteFile: jest.fn(),
  },
}));

beforeEach(() => {
  mockReset(prismaMock);
});

// Suppress console output during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
