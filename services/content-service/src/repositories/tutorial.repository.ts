// Tutorial Repository
import { query } from '../config/database';
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
import { BaseRepository } from './base.repository';

export class TutorialRepository extends BaseRepository<
  Tutorial,
  CreateTutorialDTO,
  UpdateTutorialDTO
> {
  protected tableName = 'tutorials';
  protected columns = [
    'id',
    'slug',
    'title',
    'description',
    'featured_image',
    'difficulty_level',
    'estimated_time',
    'author_id',
    'category_id',
    'is_published',
    'is_featured',
    'view_count',
    'completion_count',
    'rating',
    'rating_count',
    'prerequisites',
    'learning_outcomes',
    'published_at',
    'created_at',
    'updated_at',
  ];

  /**
   * Find tutorial by slug
   */
  async findBySlug(slug: string): Promise<Tutorial | null> {
    const result = await query<Tutorial>(`SELECT * FROM ${this.tableName} WHERE slug = $1`, [slug]);
    return result.rows[0] || null;
  }

  /**
   * Find tutorial by slug with sections and topics
   */
  async findBySlugWithSections(slug: string): Promise<TutorialWithSections | null> {
    const tutorialResult = await query<TutorialWithSections>(
      `SELECT t.*,
              json_build_object(
                'id', a.id, 'name', a.name, 'avatar_url', a.avatar_url, 'bio', a.bio
              ) as author,
              json_build_object(
                'id', cat.id, 'name', cat.name, 'slug', cat.slug
              ) as category
       FROM ${this.tableName} t
       LEFT JOIN authors a ON t.author_id = a.id
       LEFT JOIN categories cat ON t.category_id = cat.id
       WHERE t.slug = $1`,
      [slug]
    );

    if (!tutorialResult.rows[0]) return null;

    const tutorial = tutorialResult.rows[0];

    // Get sections with topics
    const sectionsResult = await query<TutorialSectionWithTopics>(
      `SELECT * FROM tutorial_sections WHERE tutorial_id = $1 ORDER BY sort_order ASC`,
      [tutorial.id]
    );

    const sections = sectionsResult.rows;

    // Get topics for each section
    for (const section of sections) {
      const topicsResult = await query<TutorialTopic>(
        `SELECT * FROM tutorial_topics WHERE section_id = $1 ORDER BY sort_order ASC`,
        [section.id]
      );
      section.topics = topicsResult.rows;
    }

    tutorial.sections = sections;
    return tutorial;
  }

  /**
   * Find tutorials with filter
   */
  async findWithFilter(
    filter: TutorialFilter,
    limit: number = 10,
    offset: number = 0
  ): Promise<TutorialWithSections[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.difficulty_level) {
      conditions.push(`t.difficulty_level = $${paramIndex++}`);
      params.push(filter.difficulty_level);
    }

    if (filter.category_id) {
      conditions.push(`t.category_id = $${paramIndex++}`);
      params.push(filter.category_id);
    }

    if (filter.author_id) {
      conditions.push(`t.author_id = $${paramIndex++}`);
      params.push(filter.author_id);
    }

    if (filter.is_published !== undefined) {
      conditions.push(`t.is_published = $${paramIndex++}`);
      params.push(filter.is_published);
    }

    if (filter.is_featured !== undefined) {
      conditions.push(`t.is_featured = $${paramIndex++}`);
      params.push(filter.is_featured);
    }

    if (filter.search) {
      conditions.push(`(t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`);
      params.push(`%${filter.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);

    const result = await query<TutorialWithSections>(
      `SELECT t.*,
              json_build_object(
                'id', a.id, 'name', a.name, 'avatar_url', a.avatar_url
              ) as author,
              json_build_object(
                'id', cat.id, 'name', cat.name, 'slug', cat.slug
              ) as category
       FROM ${this.tableName} t
       LEFT JOIN authors a ON t.author_id = a.id
       LEFT JOIN categories cat ON t.category_id = cat.id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    return result.rows;
  }

  /**
   * Count tutorials with filter
   */
  async countWithFilter(filter: TutorialFilter): Promise<number> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.difficulty_level) {
      conditions.push(`difficulty_level = $${paramIndex++}`);
      params.push(filter.difficulty_level);
    }

    if (filter.category_id) {
      conditions.push(`category_id = $${paramIndex++}`);
      params.push(filter.category_id);
    }

    if (filter.is_published !== undefined) {
      conditions.push(`is_published = $${paramIndex++}`);
      params.push(filter.is_published);
    }

    if (filter.search) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${filter.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? conditions.join(' AND ') : '1=1';
    return this.count(whereClause, params);
  }

  /**
   * Create tutorial
   */
  async create(data: CreateTutorialDTO): Promise<Tutorial> {
    const slug = data.slug || this.generateSlug(data.title);
    const { sql, values } = this.buildInsertQuery({
      ...data,
      slug,
      prerequisites: JSON.stringify(data.prerequisites || []),
      learning_outcomes: JSON.stringify(data.learning_outcomes || []),
    });
    const result = await query<Tutorial>(sql, values);
    return result.rows[0];
  }

  /**
   * Update tutorial
   */
  async update(id: number, data: UpdateTutorialDTO): Promise<Tutorial | null> {
    const updateData: any = { ...data };
    if (data.prerequisites) {
      updateData.prerequisites = JSON.stringify(data.prerequisites);
    }
    if (data.learning_outcomes) {
      updateData.learning_outcomes = JSON.stringify(data.learning_outcomes);
    }

    const { sql, values } = this.buildUpdateQuery(id, updateData);
    const result = await query<Tutorial>(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Get section by slug
   */
  async getSectionBySlug(
    tutorialSlug: string,
    sectionSlug: string
  ): Promise<TutorialSectionWithTopics | null> {
    const result = await query<TutorialSectionWithTopics>(
      `SELECT ts.* FROM tutorial_sections ts
       INNER JOIN tutorials t ON ts.tutorial_id = t.id
       WHERE t.slug = $1 AND ts.slug = $2`,
      [tutorialSlug, sectionSlug]
    );

    if (!result.rows[0]) return null;

    const section = result.rows[0];

    // Get topics
    const topicsResult = await query<TutorialTopic>(
      `SELECT * FROM tutorial_topics WHERE section_id = $1 ORDER BY sort_order ASC`,
      [section.id]
    );
    section.topics = topicsResult.rows;

    return section;
  }

  /**
   * Get topic by slug
   */
  async getTopicBySlug(
    tutorialSlug: string,
    sectionSlug: string,
    topicSlug: string
  ): Promise<TutorialTopic | null> {
    const result = await query<TutorialTopic>(
      `SELECT tt.* FROM tutorial_topics tt
       INNER JOIN tutorial_sections ts ON tt.section_id = ts.id
       INNER JOIN tutorials t ON ts.tutorial_id = t.id
       WHERE t.slug = $1 AND ts.slug = $2 AND tt.slug = $3`,
      [tutorialSlug, sectionSlug, topicSlug]
    );
    return result.rows[0] || null;
  }

  /**
   * Create section
   */
  async createSection(data: CreateTutorialSectionDTO): Promise<TutorialSection> {
    const slug = data.slug || this.generateSlug(data.title);
    const result = await query<TutorialSection>(
      `INSERT INTO tutorial_sections (tutorial_id, slug, title, description, sort_order, estimated_time)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.tutorial_id,
        slug,
        data.title,
        data.description || null,
        data.sort_order || 0,
        data.estimated_time || null,
      ]
    );
    return result.rows[0];
  }

  /**
   * Create topic
   */
  async createTopic(data: CreateTutorialTopicDTO): Promise<TutorialTopic> {
    const slug = data.slug || this.generateSlug(data.title);
    const result = await query<TutorialTopic>(
      `INSERT INTO tutorial_topics (section_id, slug, title, content, code_examples, sort_order, estimated_time, video_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.section_id,
        slug,
        data.title,
        data.content || null,
        JSON.stringify(data.code_examples || []),
        data.sort_order || 0,
        data.estimated_time || null,
        data.video_url || null,
      ]
    );
    return result.rows[0];
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET view_count = view_count + 1 WHERE id = $1`, [id]);
  }

  /**
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export const tutorialRepository = new TutorialRepository();
export default tutorialRepository;
