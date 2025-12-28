import { ConflictException, NotFoundException } from '../../../src/common';
import { TagRepository } from '../../../src/modules/tag/tag.repository';
import { TagService } from '../../../src/modules/tag/tag.service';

jest.mock('../../../src/modules/tag/tag.repository');

describe('TagService', () => {
  let service: TagService;
  let mockRepository: jest.Mocked<TagRepository>;

  const mockTag = {
    id: 'tag-1',
    name: 'JavaScript',
    slug: 'javascript',
    description: 'JavaScript programming',
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { contents: 10 },
  };

  beforeEach(() => {
    mockRepository = new TagRepository() as jest.Mocked<TagRepository>;
    service = new TagService();
    (service as any).repository = mockRepository;
  });

  describe('findAll', () => {
    it('should return all tags', async () => {
      mockRepository.findAll.mockResolvedValue([mockTag]);

      const result = await service.findAll();

      expect(result).toEqual([mockTag]);
    });
  });

  describe('findById', () => {
    it('should return tag by id', async () => {
      mockRepository.findById.mockResolvedValue(mockTag);

      const result = await service.findById('tag-1');

      expect(result).toEqual(mockTag);
    });

    it('should throw NotFoundException when tag not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return tag by slug', async () => {
      mockRepository.findBySlug.mockResolvedValue(mockTag);

      const result = await service.findBySlug('javascript');

      expect(result).toEqual(mockTag);
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      mockRepository.findBySlug.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockTag);

      const result = await service.create({
        name: 'JavaScript',
        description: 'JavaScript programming',
      });

      expect(result).toEqual(mockTag);
    });

    it('should throw ConflictException when slug already exists', async () => {
      mockRepository.findBySlug.mockResolvedValue(mockTag);

      await expect(
        service.create({
          name: 'JavaScript',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update an existing tag', async () => {
      const updatedTag = { ...mockTag, name: 'TypeScript' };
      mockRepository.findById.mockResolvedValue(mockTag);
      mockRepository.findBySlug.mockResolvedValue(null);
      mockRepository.update.mockResolvedValue(updatedTag);

      const result = await service.update('tag-1', { name: 'TypeScript' });

      expect(result.name).toBe('TypeScript');
    });
  });

  describe('delete', () => {
    it('should delete a tag', async () => {
      mockRepository.findById.mockResolvedValue(mockTag);
      mockRepository.delete.mockResolvedValue(undefined);

      await expect(service.delete('tag-1')).resolves.not.toThrow();
    });
  });

  describe('getPopular', () => {
    it('should return popular tags', async () => {
      mockRepository.findPopular.mockResolvedValue([mockTag]);

      const result = await service.getPopular(10);

      expect(mockRepository.findPopular).toHaveBeenCalledWith(10);
    });
  });

  describe('search', () => {
    it('should search tags by query', async () => {
      mockRepository.search.mockResolvedValue([mockTag]);

      const result = await service.search('java');

      expect(mockRepository.search).toHaveBeenCalledWith('java', 20);
    });
  });

  describe('getOrCreate', () => {
    it('should return existing tag', async () => {
      mockRepository.findBySlug.mockResolvedValue(mockTag);

      const result = await service.getOrCreate(['JavaScript']);

      expect(result).toEqual([mockTag]);
    });

    it('should create new tag if not exists', async () => {
      mockRepository.findBySlug.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockTag);

      const result = await service.getOrCreate(['JavaScript']);

      expect(mockRepository.create).toHaveBeenCalled();
    });
  });
});
