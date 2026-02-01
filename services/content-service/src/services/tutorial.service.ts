// Tutorial Service
import { createPaginatedResult, PaginatedResult } from '../models/base.model';
import {
    CreateTutorialDTO,
    CreateTutorialSectionDTO,
    CreateTutorialTopicDTO,
    Tutorial,
    TutorialFilter,
    TutorialSection,
    TutorialSectionWithTopics,
    TutorialTopic,
    TutorialWithSections,
    UpdateTutorialDTO,
} from '../models/tutorial.model';
import { tutorialRepository, TutorialRepository } from '../repositories/tutorial.repository';

export class TutorialService {
  constructor(private repository: TutorialRepository = tutorialRepository) {}

  /**
   * Get all tutorials with pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<TutorialWithSections>> {
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.repository.findWithFilter({}, pageSize, offset),
      this.repository.count(),
    ]);
    return createPaginatedResult(items, total, page, pageSize);
  }

  /**
   * Get tutorials with filter
   */
  async getFiltered(
    filter: TutorialFilter,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<TutorialWithSections>> {
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.repository.findWithFilter(filter, pageSize, offset),
      this.repository.countWithFilter(filter),
    ]);
    return createPaginatedResult(items, total, page, pageSize);
  }

  /**
   * Get tutorial by ID
   */
  async getById(id: number): Promise<Tutorial | null> {
    return this.repository.findById(id);
  }

  /**
   * Get tutorial by slug
   */
  async getBySlug(slug: string): Promise<Tutorial | null> {
    return this.repository.findBySlug(slug);
  }

  /**
   * Get tutorial by slug with sections and topics
   */
  async getBySlugWithSections(slug: string): Promise<TutorialWithSections | null> {
    const tutorial = await this.repository.findBySlugWithSections(slug);
    if (tutorial) {
      // Increment view count
      await this.repository.incrementViewCount(tutorial.id);
    }
    return tutorial;
  }

  /**
   * Get section by slug
   */
  async getSectionBySlug(
    tutorialSlug: string,
    sectionSlug: string
  ): Promise<TutorialSectionWithTopics | null> {
    return this.repository.getSectionBySlug(tutorialSlug, sectionSlug);
  }

  /**
   * Get topic by slug
   */
  async getTopicBySlug(
    tutorialSlug: string,
    sectionSlug: string,
    topicSlug: string
  ): Promise<TutorialTopic | null> {
    return this.repository.getTopicBySlug(tutorialSlug, sectionSlug, topicSlug);
  }

  /**
   * Create tutorial
   */
  async create(data: CreateTutorialDTO): Promise<Tutorial> {
    return this.repository.create(data);
  }

  /**
   * Update tutorial
   */
  async update(id: number, data: UpdateTutorialDTO): Promise<Tutorial | null> {
    return this.repository.update(id, data);
  }

  /**
   * Delete tutorial
   */
  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Create section
   */
  async createSection(data: CreateTutorialSectionDTO): Promise<TutorialSection> {
    return this.repository.createSection(data);
  }

  /**
   * Create topic
   */
  async createTopic(data: CreateTutorialTopicDTO): Promise<TutorialTopic> {
    return this.repository.createTopic(data);
  }
}

export const tutorialService = new TutorialService();
export default tutorialService;
