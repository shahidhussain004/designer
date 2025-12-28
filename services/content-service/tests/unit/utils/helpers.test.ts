import {
    buildPaginationMeta,
    calculateReadingTime,
    generateExcerpt,
    generateSlug,
    isValidUuid,
} from '../../../src/common/utils/helpers';

describe('Helpers', () => {
  describe('generateSlug', () => {
    it('should generate a slug from text', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(generateSlug("What's New in JavaScript?")).toBe('whats-new-in-javascript');
    });

    it('should handle multiple spaces', () => {
      expect(generateSlug('Hello    World')).toBe('hello-world');
    });

    it('should handle unicode characters', () => {
      expect(generateSlug('Café Résumé')).toBe('cafe-resume');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(generateSlug('  Hello World  ')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time for short content', () => {
      const shortText = 'This is a short article.';
      expect(calculateReadingTime(shortText)).toBe(1);
    });

    it('should calculate reading time for medium content', () => {
      // 400 words = 2 minutes (200 wpm)
      const words = Array(400).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(2);
    });

    it('should calculate reading time for long content', () => {
      // 1000 words = 5 minutes
      const words = Array(1000).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(5);
    });

    it('should handle empty content', () => {
      expect(calculateReadingTime('')).toBe(1);
    });

    it('should round up to nearest minute', () => {
      // 250 words = 1.25 minutes = 2 minutes rounded
      const words = Array(250).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(2);
    });
  });

  describe('buildPaginationMeta', () => {
    it('should build pagination meta for first page', () => {
      const meta = buildPaginationMeta(100, 1, 10);

      expect(meta).toEqual({
        total: 100,
        page: 1,
        limit: 10,
        totalPages: 10,
        hasNextPage: true,
        hasPrevPage: false,
      });
    });

    it('should build pagination meta for last page', () => {
      const meta = buildPaginationMeta(100, 10, 10);

      expect(meta).toEqual({
        total: 100,
        page: 10,
        limit: 10,
        totalPages: 10,
        hasNextPage: false,
        hasPrevPage: true,
      });
    });

    it('should build pagination meta for middle page', () => {
      const meta = buildPaginationMeta(100, 5, 10);

      expect(meta).toEqual({
        total: 100,
        page: 5,
        limit: 10,
        totalPages: 10,
        hasNextPage: true,
        hasPrevPage: true,
      });
    });

    it('should handle single page', () => {
      const meta = buildPaginationMeta(5, 1, 10);

      expect(meta).toEqual({
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });

    it('should handle empty results', () => {
      const meta = buildPaginationMeta(0, 1, 10);

      expect(meta).toEqual({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });
  });

  describe('generateExcerpt', () => {
    it('should generate excerpt from long text', () => {
      const longText = 'This is a very long article that contains many words. '.repeat(10);
      const excerpt = generateExcerpt(longText, 50);

      expect(excerpt.length).toBeLessThanOrEqual(53); // 50 + '...'
      expect(excerpt.endsWith('...')).toBe(true);
    });

    it('should not add ellipsis to short text', () => {
      const shortText = 'Short text';
      const excerpt = generateExcerpt(shortText, 50);

      expect(excerpt).toBe('Short text');
      expect(excerpt.endsWith('...')).toBe(false);
    });

    it('should handle exact length text', () => {
      const text = 'A'.repeat(50);
      const excerpt = generateExcerpt(text, 50);

      expect(excerpt).toBe(text);
    });

    it('should handle empty text', () => {
      expect(generateExcerpt('', 50)).toBe('');
    });

    it('should use default length', () => {
      const text = 'A'.repeat(200);
      const excerpt = generateExcerpt(text);

      expect(excerpt.length).toBeLessThanOrEqual(163); // 160 + '...'
    });
  });

  describe('isValidUuid', () => {
    it('should validate correct UUID v4', () => {
      expect(isValidUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    });

    it('should validate lowercase UUID', () => {
      expect(isValidUuid('a1b2c3d4-e5f6-7890-abcd-ef1234567890')).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(isValidUuid('not-a-uuid')).toBe(false);
    });

    it('should reject UUID with wrong format', () => {
      expect(isValidUuid('123e4567e89b12d3a456426614174000')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidUuid('')).toBe(false);
    });

    it('should handle uppercase UUID', () => {
      expect(isValidUuid('123E4567-E89B-12D3-A456-426614174000')).toBe(true);
    });
  });
});
