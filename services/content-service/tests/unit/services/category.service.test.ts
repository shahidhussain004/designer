import { ConflictException, NotFoundException } from '../../../src/common';
import { CategoryRepository } from '../../../src/modules/category/category.repository';
import { CategoryService } from '../../../src/modules/category/category.service';

// Mock the repository
jest.mock('../../../src/modules/category/category.repository');

describe('CategoryService', () => {
  let service: CategoryService;
  let mockRepository: jest.Mocked<CategoryRepository>;

  const mockCategory = {
    id: 'cat-1',
    name: 'Technology',
    slug: 'technology',
    description: 'Tech articles',
    icon: 'tech-icon',
    parentId: null,
    isActive: true,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockRepository = new CategoryRepository() as jest.Mocked<CategoryRepository>;
    service = new CategoryService();
    (service as any).repository = mockRepository;
  });

  describe('findAll', () => {
    it('should return all active categories', async () => {
      mockRepository.findAll.mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(result).toEqual([mockCategory]);
      expect(mockRepository.findAll).toHaveBeenCalledWith(true);
    });

    it('should return all categories including inactive', async () => {
      mockRepository.findAll.mockResolvedValue([mockCategory]);

      const result = await service.findAll(false);

      expect(mockRepository.findAll).toHaveBeenCalledWith(false);
    });
  });

  describe('findById', () => {
    it('should return category by id', async () => {
      mockRepository.findById.mockResolvedValue(mockCategory);

      const result = await service.findById('cat-1');

      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return category by slug', async () => {
      mockRepository.findBySlug.mockResolvedValue(mockCategory);

      const result = await service.findBySlug('technology');

      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.findBySlug.mockResolvedValue(null);

      await expect(service.findBySlug('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      mockRepository.findBySlug.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockCategory);

      const result = await service.create({
        name: 'Technology',
        description: 'Tech articles',
      });

      expect(result).toEqual(mockCategory);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException when slug already exists', async () => {
      mockRepository.findBySlug.mockResolvedValue(mockCategory);

      await expect(
        service.create({
          name: 'Technology',
          description: 'Tech articles',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const updatedCategory = { ...mockCategory, name: 'Updated Tech' };
      mockRepository.findById.mockResolvedValue(mockCategory);
      mockRepository.findBySlug.mockResolvedValue(null);
      mockRepository.update.mockResolvedValue(updatedCategory);

      const result = await service.update('cat-1', { name: 'Updated Tech' });

      expect(result.name).toBe('Updated Tech');
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { name: 'Updated' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      mockRepository.findById.mockResolvedValue(mockCategory);
      mockRepository.delete.mockResolvedValue(undefined);

      await expect(service.delete('cat-1')).resolves.not.toThrow();
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTree', () => {
    it('should return category tree', async () => {
      const parentCategory = { ...mockCategory, children: [] };
      mockRepository.findWithChildren.mockResolvedValue([parentCategory]);

      const result = await service.getTree();

      expect(result).toEqual([parentCategory]);
    });
  });
});
