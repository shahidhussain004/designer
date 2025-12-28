import {
    createCategorySchema,
    createCommentSchema,
    createContentSchema,
    createTagSchema,
    paginationSchema,
    searchQuerySchema,
    updateCategorySchema,
    updateContentSchema,
} from '../../../src/common/utils/validation';

describe('Validation Schemas', () => {
  describe('createCategorySchema', () => {
    it('should validate valid category data', () => {
      const data = {
        name: 'Technology',
        description: 'Tech articles',
        icon: 'tech-icon',
        sortOrder: 1,
      };

      const result = createCategorySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should require name', () => {
      const data = {
        description: 'Tech articles',
      };

      const result = createCategorySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should enforce minimum name length', () => {
      const data = {
        name: 'A',
      };

      const result = createCategorySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should allow optional fields', () => {
      const data = {
        name: 'Technology',
      };

      const result = createCategorySchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('updateCategorySchema', () => {
    it('should validate partial updates', () => {
      const data = {
        name: 'Updated Name',
      };

      const result = updateCategorySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should allow empty object', () => {
      const result = updateCategorySchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('createTagSchema', () => {
    it('should validate valid tag data', () => {
      const data = {
        name: 'JavaScript',
        description: 'JavaScript programming',
      };

      const result = createTagSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should require name', () => {
      const result = createTagSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('createContentSchema', () => {
    it('should validate valid content data', () => {
      const data = {
        title: 'My Article',
        body: 'Article content here',
        type: 'ARTICLE',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = createContentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should require title and body', () => {
      const data = {
        type: 'ARTICLE',
      };

      const result = createContentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should validate content type enum', () => {
      const data = {
        title: 'My Article',
        body: 'Content',
        type: 'INVALID_TYPE',
      };

      const result = createContentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should allow optional tags array', () => {
      const data = {
        title: 'My Article',
        body: 'Content',
        type: 'BLOG',
        tagIds: ['tag-1', 'tag-2'],
      };

      const result = createContentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('updateContentSchema', () => {
    it('should validate partial updates', () => {
      const data = {
        title: 'Updated Title',
      };

      const result = updateContentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('createCommentSchema', () => {
    it('should validate valid comment data', () => {
      const data = {
        contentId: '123e4567-e89b-12d3-a456-426614174000',
        body: 'Great article!',
      };

      const result = createCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should require contentId and body', () => {
      const result = createCommentSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should allow optional parentId for replies', () => {
      const data = {
        contentId: '123e4567-e89b-12d3-a456-426614174000',
        body: 'Reply to comment',
        parentId: '456e4567-e89b-12d3-a456-426614174000',
      };

      const result = createCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('searchQuerySchema', () => {
    it('should validate valid search query', () => {
      const data = {
        query: 'javascript',
        page: 1,
        limit: 10,
      };

      const result = searchQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should require query', () => {
      const result = searchQuerySchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should enforce minimum query length', () => {
      const data = {
        query: 'a',
      };

      const result = searchQuerySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should allow type filter', () => {
      const data = {
        query: 'javascript',
        type: 'ARTICLE',
      };

      const result = searchQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('should validate valid pagination', () => {
      const data = {
        page: 1,
        limit: 20,
      };

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should use default values', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('should enforce maximum limit', () => {
      const data = {
        page: 1,
        limit: 200,
      };

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should enforce minimum page', () => {
      const data = {
        page: 0,
        limit: 10,
      };

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
