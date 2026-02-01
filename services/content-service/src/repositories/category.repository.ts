// Category Repository
import { query } from '../config/database';
import {
    Category,
    CategoryFilter,
    CategoryWithChildren,
    CreateCategoryDTO,
    UpdateCategoryDTO,
} from '../models/category.model';
import { BaseRepository } from './base.repository';

export class CategoryRepository extends BaseRepository<
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO
> {
  protected tableName = 'categories';
  protected columns = [
    'id',
    'name',
    'slug',
    'description',
    'parent_id',
    'icon',
    'color',
    'sort_order',
    'is_active',
    'created_at',
    'updated_at',
  ];

  /**
   * Find category by slug
   */
  async findBySlug(slug: string): Promise<Category | null> {
    const result = await query<Category>(`SELECT * FROM ${this.tableName} WHERE slug = $1`, [slug]);
    return result.rows[0] || null;
  }

  /**
   * Find categories with filter
   */
  async findWithFilter(
    filter: CategoryFilter,
    limit: number = 100,
    offset: number = 0
  ): Promise<Category[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.parent_id !== undefined) {
      if (filter.parent_id === null) {
        conditions.push('parent_id IS NULL');
      } else {
        conditions.push(`parent_id = $${paramIndex++}`);
        params.push(filter.parent_id);
      }
    }

    if (filter.is_active !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(filter.is_active);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);

    const result = await query<Category>(
      `SELECT * FROM ${this.tableName} 
       ${whereClause} 
       ORDER BY sort_order ASC, name ASC 
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );
    return result.rows;
  }

  /**
   * Get category tree (hierarchical structure)
   */
  async getTree(): Promise<CategoryWithChildren[]> {
    const result = await query<Category>(
      `SELECT * FROM ${this.tableName} WHERE is_active = true ORDER BY sort_order ASC, name ASC`
    );

    const categories = result.rows;
    const categoryMap = new Map<number, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create map of all categories
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: build tree
    categories.forEach((cat) => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parent_id === null) {
        rootCategories.push(category);
      } else {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(category);
        }
      }
    });

    return rootCategories;
  }

  /**
   * Get children of a category
   */
  async getChildren(parentId: number): Promise<Category[]> {
    const result = await query<Category>(
      `SELECT * FROM ${this.tableName} 
       WHERE parent_id = $1 AND is_active = true 
       ORDER BY sort_order ASC, name ASC`,
      [parentId]
    );
    return result.rows;
  }

  /**
   * Create a new category
   */
  async create(data: CreateCategoryDTO): Promise<Category> {
    const slug = data.slug || this.generateSlug(data.name);
    const { sql, values } = this.buildInsertQuery({ ...data, slug });
    const result = await query<Category>(sql, values);
    return result.rows[0];
  }

  /**
   * Update category
   */
  async update(id: number, data: UpdateCategoryDTO): Promise<Category | null> {
    const { sql, values } = this.buildUpdateQuery(id, data);
    const result = await query<Category>(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Check if slug exists (excluding a specific id)
   */
  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const params = excludeId ? [slug, excludeId] : [slug];
    const excludeClause = excludeId ? ' AND id != $2' : '';

    const result = await query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM ${this.tableName} WHERE slug = $1${excludeClause})`,
      params
    );
    return result.rows[0].exists;
  }

  /**
   * Generate slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export const categoryRepository = new CategoryRepository();
export default categoryRepository;
