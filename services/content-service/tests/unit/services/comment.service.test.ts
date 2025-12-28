import { BadRequestException, NotFoundException } from '../../../src/common';
import { CommentRepository } from '../../../src/modules/comment/comment.repository';
import { CommentService } from '../../../src/modules/comment/comment.service';
import { ContentRepository } from '../../../src/modules/content/content.repository';

jest.mock('../../../src/modules/comment/comment.repository');
jest.mock('../../../src/modules/content/content.repository');

describe('CommentService', () => {
  let service: CommentService;
  let mockCommentRepo: jest.Mocked<CommentRepository>;
  let mockContentRepo: jest.Mocked<ContentRepository>;

  const mockComment = {
    id: 'comment-1',
    contentId: 'content-1',
    userId: 'user-1',
    parentId: null,
    body: 'Great article!',
    isApproved: true,
    isFlagged: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    replies: [],
  };

  const mockContent = {
    id: 'content-1',
    title: 'Test Article',
    slug: 'test-article',
    body: 'Test body',
    status: 'PUBLISHED',
  };

  beforeEach(() => {
    mockCommentRepo = new CommentRepository() as jest.Mocked<CommentRepository>;
    mockContentRepo = new ContentRepository() as jest.Mocked<ContentRepository>;
    
    service = new CommentService();
    (service as any).repository = mockCommentRepo;
    (service as any).contentRepository = mockContentRepo;
  });

  describe('findByContentId', () => {
    it('should return comments for content', async () => {
      mockCommentRepo.findByContentId.mockResolvedValue([mockComment]);

      const result = await service.findByContentId('content-1');

      expect(result).toEqual([mockComment]);
    });
  });

  describe('findById', () => {
    it('should return comment by id', async () => {
      mockCommentRepo.findById.mockResolvedValue(mockComment);

      const result = await service.findById('comment-1');

      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException when comment not found', async () => {
      mockCommentRepo.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      mockContentRepo.findById.mockResolvedValue(mockContent as any);
      mockCommentRepo.create.mockResolvedValue(mockComment);

      const result = await service.create('user-1', {
        contentId: 'content-1',
        body: 'Great article!',
      });

      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException when content not found', async () => {
      mockContentRepo.findById.mockResolvedValue(null);

      await expect(
        service.create('user-1', {
          contentId: 'non-existent',
          body: 'Comment',
        })
      ).rejects.toThrow(NotFoundException);
    });

    it('should create a reply comment', async () => {
      const parentComment = { ...mockComment };
      mockContentRepo.findById.mockResolvedValue(mockContent as any);
      mockCommentRepo.findById.mockResolvedValue(parentComment);
      mockCommentRepo.create.mockResolvedValue({
        ...mockComment,
        parentId: 'comment-1',
      });

      const result = await service.create('user-1', {
        contentId: 'content-1',
        body: 'Reply comment',
        parentId: 'comment-1',
      });

      expect(result.parentId).toBe('comment-1');
    });

    it('should throw BadRequestException for invalid parent comment', async () => {
      mockContentRepo.findById.mockResolvedValue(mockContent as any);
      mockCommentRepo.findById.mockResolvedValue(null);

      await expect(
        service.create('user-1', {
          contentId: 'content-1',
          body: 'Reply',
          parentId: 'invalid-parent',
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const updatedComment = { ...mockComment, body: 'Updated comment' };
      mockCommentRepo.findById.mockResolvedValue(mockComment);
      mockCommentRepo.update.mockResolvedValue(updatedComment);

      const result = await service.update('comment-1', 'user-1', {
        body: 'Updated comment',
      });

      expect(result.body).toBe('Updated comment');
    });

    it('should throw NotFoundException when comment not found', async () => {
      mockCommentRepo.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent', 'user-1', { body: 'Updated' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a comment', async () => {
      mockCommentRepo.findById.mockResolvedValue(mockComment);
      mockCommentRepo.delete.mockResolvedValue(undefined);

      await expect(service.delete('comment-1', 'user-1')).resolves.not.toThrow();
    });
  });

  describe('approve', () => {
    it('should approve a comment', async () => {
      const approvedComment = { ...mockComment, isApproved: true };
      mockCommentRepo.findById.mockResolvedValue(mockComment);
      mockCommentRepo.update.mockResolvedValue(approvedComment);

      const result = await service.approve('comment-1');

      expect(result.isApproved).toBe(true);
    });
  });

  describe('flag', () => {
    it('should flag a comment', async () => {
      const flaggedComment = { ...mockComment, isFlagged: true };
      mockCommentRepo.findById.mockResolvedValue(mockComment);
      mockCommentRepo.update.mockResolvedValue(flaggedComment);

      const result = await service.flag('comment-1');

      expect(result.isFlagged).toBe(true);
    });
  });

  describe('unflag', () => {
    it('should unflag a comment', async () => {
      const unflaggedComment = { ...mockComment, isFlagged: false };
      const flaggedComment = { ...mockComment, isFlagged: true };
      mockCommentRepo.findById.mockResolvedValue(flaggedComment);
      mockCommentRepo.update.mockResolvedValue(unflaggedComment);

      const result = await service.unflag('comment-1');

      expect(result.isFlagged).toBe(false);
    });
  });

  describe('getPendingModeration', () => {
    it('should return pending moderation comments', async () => {
      mockCommentRepo.findPendingModeration.mockResolvedValue([mockComment]);

      const result = await service.getPendingModeration();

      expect(result).toEqual([mockComment]);
    });
  });
});
