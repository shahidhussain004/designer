import { ContentRepository } from '../../../src/modules/content/content.repository';
import { SearchService } from '../../../src/modules/search/search.service';

jest.mock('../../../src/modules/content/content.repository');

describe('SearchService', () => {
  let service: SearchService;
  let mockContentRepo: jest.Mocked<ContentRepository>;

  const mockContent = {
    id: 'content-1',
    title: 'Test JavaScript Article',
    slug: 'test-javascript-article',
    excerpt: 'Learn JavaScript fundamentals',
    body: 'JavaScript is a programming language...',
  };

  beforeEach(() => {
    mockContentRepo = new ContentRepository() as jest.Mocked<ContentRepository>;
    service = new SearchService();
    (service as any).contentRepository = mockContentRepo;
  });

  describe('search', () => {
    it('should search content by query', async () => {
      const mockResult = {
        data: [mockContent],
        total: 1,
      };
      mockContentRepo.search.mockResolvedValue(mockResult);

      const result = await service.search({
        query: 'javascript',
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter search by type', async () => {
      mockContentRepo.search.mockResolvedValue({ data: [], total: 0 });

      await service.search({
        query: 'javascript',
        type: 'ARTICLE',
      });

      expect(mockContentRepo.search).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'ARTICLE' })
      );
    });

    it('should filter search by category', async () => {
      mockContentRepo.search.mockResolvedValue({ data: [], total: 0 });

      await service.search({
        query: 'javascript',
        categoryId: 'cat-1',
      });

      expect(mockContentRepo.search).toHaveBeenCalledWith(
        expect.objectContaining({ categoryId: 'cat-1' })
      );
    });

    it('should filter search by tags', async () => {
      mockContentRepo.search.mockResolvedValue({ data: [], total: 0 });

      await service.search({
        query: 'javascript',
        tags: ['javascript', 'programming'],
      });

      expect(mockContentRepo.search).toHaveBeenCalledWith(
        expect.objectContaining({ tags: ['javascript', 'programming'] })
      );
    });

    it('should return empty results for empty query', async () => {
      const result = await service.search({ query: '' });

      expect(result.data).toHaveLength(0);
      expect(mockContentRepo.search).not.toHaveBeenCalled();
    });
  });

  describe('suggest', () => {
    it('should return search suggestions', async () => {
      const mockSuggestions = ['javascript', 'java', 'json'];
      mockContentRepo.getSuggestions.mockResolvedValue(mockSuggestions);

      const result = await service.suggest('jav');

      expect(result).toEqual(mockSuggestions);
      expect(mockContentRepo.getSuggestions).toHaveBeenCalledWith('jav', 5);
    });

    it('should return empty suggestions for short query', async () => {
      const result = await service.suggest('j');

      expect(result).toHaveLength(0);
      expect(mockContentRepo.getSuggestions).not.toHaveBeenCalled();
    });

    it('should limit suggestions', async () => {
      mockContentRepo.getSuggestions.mockResolvedValue(['a', 'b', 'c']);

      await service.suggest('test', 3);

      expect(mockContentRepo.getSuggestions).toHaveBeenCalledWith('test', 3);
    });
  });

  describe('getPopularSearches', () => {
    it('should return popular searches', async () => {
      const mockPopular = [
        { query: 'javascript', count: 100 },
        { query: 'react', count: 80 },
      ];
      mockContentRepo.getPopularSearches.mockResolvedValue(mockPopular);

      const result = await service.getPopularSearches(10);

      expect(result).toEqual(mockPopular);
      expect(mockContentRepo.getPopularSearches).toHaveBeenCalledWith(10);
    });
  });
});
