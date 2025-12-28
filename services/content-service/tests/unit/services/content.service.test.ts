import { ContentStatus, ContentType } from '@prisma/client';
import { BadRequestException, NotFoundException } from '../../../src/common';
import { CategoryRepository } from '../../../src/modules/category/category.repository';
import { ContentRepository } from '../../../src/modules/content/content.repository';
import { ContentService } from '../../../src/modules/content/content.service';

jest.mock('../../../src/modules/content/content.repository');
jest.mock('../../../src/modules/category/category.repository');

describe('ContentService', () => {
  let service: ContentService;
  let mockContentRepo: jest.Mocked<ContentRepository>;
  let mockCategoryRepo: jest.Mocked<CategoryRepository>;

  const mockAuthor = {
    id: 'author-1',
    userId: 'user-1',
    bio: 'Test author',
    avatarUrl: null,
    socialLinks: {},
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCategory = {
    id: 'cat-1',
    name: 'Technology',
    slug: 'technology',
    description: null,
    icon: null,
    parentId: null,
    isActive: true,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockContent = {
    id: 'content-1',
    title: 'Test Article',
    slug: 'test-article',
    excerpt: 'Test excerpt',
    body: 'Test body content',
    type: ContentType.ARTICLE,
    status: ContentStatus.DRAFT,
    authorId: 'author-1',
    categoryId: 'cat-1',
    featuredImageUrl: null,
    metaTitle: null,
    metaDescription: null,
    isFeatured: false,
    readingTime: 1,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: mockAuthor,
    category: mockCategory,
    tags: [],
  };

  beforeEach(() => {
    mockContentRepo = new ContentRepository() as jest.Mocked<ContentRepository>;
    mockCategoryRepo = new CategoryRepository() as jest.Mocked<CategoryRepository>;
    
    service = new ContentService();
    (service as any).repository = mockContentRepo;
    (service as any).categoryRepository = mockCategoryRepo;
  });

  describe('findAll', () => {
    it('should return paginated content', async () => {
      const mockResult = {
        data: [mockContent],
        total: 1,
      };
      mockContentRepo.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll({});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by type', async () => {
      mockContentRepo.findAll.mockResolvedValue({ data: [], total: 0 });

      await service.findAll({ type: ContentType.BLOG });

      expect(mockContentRepo.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ type: ContentType.BLOG })
      );
    });
  });

  describe('findById', () => {
    it('should return content by id', async () => {
      mockContentRepo.findById.mockResolvedValue(mockContent);

      const result = await service.findById('content-1');

      expect(result).toEqual(mockContent);
    });

    it('should throw NotFoundException when content not found', async () => {
      mockContentRepo.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return content by slug', async () => {
      mockContentRepo.findBySlug.mockResolvedValue(mockContent);

      const result = await service.findBySlug('test-article');

      expect(result).toEqual(mockContent);
    });
  });

  describe('create', () => {
    it('should create new content', async () => {
      mockCategoryRepo.findById.mockResolvedValue(mockCategory);
      mockContentRepo.findBySlug.mockResolvedValue(null);
      mockContentRepo.create.mockResolvedValue(mockContent);

      const result = await service.create('author-1', {
        title: 'Test Article',
        body: 'Test body content',
        type: ContentType.ARTICLE,
        categoryId: 'cat-1',
      });

      expect(result).toEqual(mockContent);
    });

    it('should throw BadRequestException when category not found', async () => {
      mockCategoryRepo.findById.mockResolvedValue(null);

      await expect(
        service.create('author-1', {
          title: 'Test Article',
          body: 'Test body',
          type: ContentType.ARTICLE,
          categoryId: 'invalid-cat',
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update content', async () => {
      const updatedContent = { ...mockContent, title: 'Updated Title' };
      mockContentRepo.findById.mockResolvedValue(mockContent);
      mockContentRepo.update.mockResolvedValue(updatedContent);

      const result = await service.update('content-1', 'author-1', {
        title: 'Updated Title',
      });

      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundException when content not found', async () => {
      mockContentRepo.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent', 'author-1', { title: 'Updated' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('publish', () => {
    it('should publish draft content', async () => {
      const publishedContent = {
        ...mockContent,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      };
      mockContentRepo.findById.mockResolvedValue(mockContent);
      mockContentRepo.update.mockResolvedValue(publishedContent);

      const result = await service.publish('content-1', 'author-1');

      expect(result.status).toBe(ContentStatus.PUBLISHED);
    });
  });

  describe('unpublish', () => {
    it('should unpublish published content', async () => {
      const publishedContent = {
        ...mockContent,
        status: ContentStatus.PUBLISHED,
      };
      const draftContent = {
        ...mockContent,
        status: ContentStatus.DRAFT,
      };
      mockContentRepo.findById.mockResolvedValue(publishedContent);
      mockContentRepo.update.mockResolvedValue(draftContent);

      const result = await service.unpublish('content-1', 'author-1');

      expect(result.status).toBe(ContentStatus.DRAFT);
    });
  });

  describe('delete', () => {
    it('should delete content', async () => {
      mockContentRepo.findById.mockResolvedValue(mockContent);
      mockContentRepo.delete.mockResolvedValue(undefined);

      await expect(service.delete('content-1', 'author-1')).resolves.not.toThrow();
    });
  });

  describe('getFeatured', () => {
    it('should return featured content', async () => {
      mockContentRepo.findFeatured.mockResolvedValue([mockContent]);

      const result = await service.getFeatured(5);

      expect(mockContentRepo.findFeatured).toHaveBeenCalledWith(5);
    });
  });

  describe('getTrending', () => {
    it('should return trending content', async () => {
      mockContentRepo.findTrending.mockResolvedValue([mockContent]);

      const result = await service.getTrending(10);

      expect(mockContentRepo.findTrending).toHaveBeenCalledWith(10);
    });
  });
});
