/**
 * Tag service
 */
import { ConflictException, NotFoundException } from '@common/exceptions';
import { PaginatedResult, PaginationParams } from '@common/interfaces';
import { buildPaginationMeta, generateSlug } from '@common/utils';
import { CreateTagInput, UpdateTagInput } from '@common/utils/validation';
import { logger } from '@config/logger.config';
import { redisConfig } from '@config/redis.config';
import { redisService } from '@infrastructure/cache';
import { Tag } from '@prisma/client';
import { tagRepository } from './tag.repository';

export class TagService {
  private readonly cachePrefix = redisConfig.keyPatterns.tag;
  private readonly cacheTtl = redisConfig.ttl.tag;

  async findAll(params: PaginationParams = {}): Promise<PaginatedResult<Tag>> {
    const { tags, total } = await tagRepository.findAll(params);
    const { page = 1, limit = 10 } = params;

    return {
      data: tags,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string): Promise<Tag> {
    const cacheKey = redisService.buildTagKey(id);

    const cached = await redisService.get<Tag>(cacheKey);
    if (cached) return cached;

    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException('Tag', id);
    }

    await redisService.set(cacheKey, tag, this.cacheTtl);
    return tag;
  }

  async findBySlug(slug: string): Promise<Tag> {
    const cacheKey = `${this.cachePrefix}slug:${slug}`;

    const cached = await redisService.get<Tag>(cacheKey);
    if (cached) return cached;

    const tag = await tagRepository.findBySlug(slug);
    if (!tag) {
      throw new NotFoundException('Tag');
    }

    await redisService.set(cacheKey, tag, this.cacheTtl);
    return tag;
  }

  async findPopular(limit = 10): Promise<Tag[]> {
    const cacheKey = `${this.cachePrefix}popular:${limit}`;

    const cached = await redisService.get<Tag[]>(cacheKey);
    if (cached) return cached;

    const tags = await tagRepository.findPopular(limit);
    await redisService.set(cacheKey, tags, this.cacheTtl);

    return tags;
  }

  async search(query: string, limit = 10): Promise<Tag[]> {
    return tagRepository.search(query, limit);
  }

  async create(input: CreateTagInput): Promise<Tag> {
    const slug = generateSlug(input.name);

    // Check name uniqueness
    if (!(await tagRepository.isNameUnique(input.name))) {
      throw new ConflictException(`Tag with name '${input.name}' already exists`);
    }

    // Check slug uniqueness
    if (!(await tagRepository.isSlugUnique(slug))) {
      throw new ConflictException(`Tag with slug '${slug}' already exists`);
    }

    const tag = await tagRepository.create({
      name: input.name,
      slug,
      color: input.color || '#3B82F6',
    });

    await this.invalidateCache();
    logger.info({ tagId: tag.id }, 'Tag created');

    return tag;
  }

  async update(id: string, input: UpdateTagInput): Promise<Tag> {
    const existing = await tagRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Tag', id);
    }

    // Check name uniqueness if changing
    if (input.name && input.name !== existing.name) {
      if (!(await tagRepository.isNameUnique(input.name, id))) {
        throw new ConflictException(`Tag with name '${input.name}' already exists`);
      }
    }

    // Generate new slug if name changes
    const slug = input.name ? generateSlug(input.name) : undefined;

    if (slug && slug !== existing.slug) {
      if (!(await tagRepository.isSlugUnique(slug, id))) {
        throw new ConflictException(`Tag with slug '${slug}' already exists`);
      }
    }

    const tag = await tagRepository.update(id, {
      name: input.name,
      slug,
      color: input.color,
    });

    await this.invalidateCache();
    logger.info({ tagId: id }, 'Tag updated');

    return tag;
  }

  async delete(id: string): Promise<void> {
    const existing = await tagRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Tag', id);
    }

    await tagRepository.delete(id);
    await this.invalidateCache();

    logger.info({ tagId: id }, 'Tag deleted');
  }

  private async invalidateCache(): Promise<void> {
    await redisService.deletePattern(`${this.cachePrefix}*`);
  }
}

export const tagService = new TagService();
