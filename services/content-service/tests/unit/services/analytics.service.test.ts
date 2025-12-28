import { NotFoundException } from '../../../src/common';
import { AnalyticsService } from '../../../src/modules/analytics/analytics.service';
import { ContentRepository } from '../../../src/modules/content/content.repository';

jest.mock('../../../src/modules/content/content.repository');

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockContentRepo: jest.Mocked<ContentRepository>;

  const mockContent = {
    id: 'content-1',
    title: 'Test Article',
    slug: 'test-article',
    viewCount: 100,
    likeCount: 50,
    commentCount: 25,
  };

  beforeEach(() => {
    mockContentRepo = new ContentRepository() as jest.Mocked<ContentRepository>;
    service = new AnalyticsService();
    (service as any).contentRepository = mockContentRepo;
  });

  describe('trackView', () => {
    it('should track content view', async () => {
      mockContentRepo.findById.mockResolvedValue(mockContent as any);
      mockContentRepo.incrementViewCount.mockResolvedValue(undefined);

      await expect(
        service.trackView('content-1', 'user-1', '127.0.0.1', 'Test Browser')
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundException when content not found', async () => {
      mockContentRepo.findById.mockResolvedValue(null);

      await expect(
        service.trackView('non-existent', 'user-1', '127.0.0.1', 'Test Browser')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('trackLike', () => {
    it('should like content', async () => {
      mockContentRepo.findById.mockResolvedValue(mockContent as any);
      mockContentRepo.toggleLike.mockResolvedValue({ liked: true });

      const result = await service.trackLike('content-1', 'user-1');

      expect(result.liked).toBe(true);
    });

    it('should unlike content', async () => {
      mockContentRepo.findById.mockResolvedValue(mockContent as any);
      mockContentRepo.toggleLike.mockResolvedValue({ liked: false });

      const result = await service.trackLike('content-1', 'user-1');

      expect(result.liked).toBe(false);
    });

    it('should throw NotFoundException when content not found', async () => {
      mockContentRepo.findById.mockResolvedValue(null);

      await expect(
        service.trackLike('non-existent', 'user-1')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('trackShare', () => {
    it('should track content share', async () => {
      mockContentRepo.findById.mockResolvedValue(mockContent as any);

      await expect(
        service.trackShare('content-1', 'twitter')
      ).resolves.not.toThrow();
    });
  });

  describe('getContentAnalytics', () => {
    it('should return content analytics', async () => {
      mockContentRepo.findById.mockResolvedValue(mockContent as any);

      const result = await service.getContentAnalytics('content-1');

      expect(result).toHaveProperty('viewCount');
      expect(result).toHaveProperty('likeCount');
      expect(result).toHaveProperty('commentCount');
    });

    it('should throw NotFoundException when content not found', async () => {
      mockContentRepo.findById.mockResolvedValue(null);

      await expect(
        service.getContentAnalytics('non-existent')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOverallAnalytics', () => {
    it('should return overall analytics', async () => {
      const mockStats = {
        totalContent: 100,
        totalViews: 10000,
        totalLikes: 5000,
        totalComments: 2500,
      };
      mockContentRepo.getOverallStats.mockResolvedValue(mockStats);

      const result = await service.getOverallAnalytics();

      expect(result).toEqual(mockStats);
    });
  });

  describe('getTrendingContent', () => {
    it('should return trending content', async () => {
      mockContentRepo.findTrending.mockResolvedValue([mockContent as any]);

      const result = await service.getTrendingContent(10);

      expect(result).toHaveLength(1);
      expect(mockContentRepo.findTrending).toHaveBeenCalledWith(10);
    });
  });
});
