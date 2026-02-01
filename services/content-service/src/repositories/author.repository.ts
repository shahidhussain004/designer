// Author Repository
import { query } from '../config/database';
import { Author, CreateAuthorDTO, UpdateAuthorDTO } from '../models/author.model';
import { BaseRepository } from './base.repository';

export class AuthorRepository extends BaseRepository<Author, CreateAuthorDTO, UpdateAuthorDTO> {
  protected tableName = 'authors';
  protected columns = [
    'id',
    'user_id',
    'name',
    'email',
    'bio',
    'avatar_url',
    'website',
    'social_links',
    'created_at',
    'updated_at',
  ];

  /**
   * Find author by user ID
   */
  async findByUserId(userId: number): Promise<Author | null> {
    const result = await query<Author>(`SELECT * FROM ${this.tableName} WHERE user_id = $1`, [
      userId,
    ]);
    return result.rows[0] || null;
  }

  /**
   * Find author by email
   */
  async findByEmail(email: string): Promise<Author | null> {
    const result = await query<Author>(`SELECT * FROM ${this.tableName} WHERE email = $1`, [email]);
    return result.rows[0] || null;
  }

  /**
   * Create author
   */
  async create(data: CreateAuthorDTO): Promise<Author> {
    const insertData = {
      ...data,
      social_links: JSON.stringify(data.social_links || {}),
    };
    const { sql, values } = this.buildInsertQuery(insertData);
    const result = await query<Author>(sql, values);
    return result.rows[0];
  }

  /**
   * Update author
   */
  async update(id: number, data: UpdateAuthorDTO): Promise<Author | null> {
    const updateData: any = { ...data };
    if (data.social_links) {
      updateData.social_links = JSON.stringify(data.social_links);
    }
    const { sql, values } = this.buildUpdateQuery(id, updateData);
    const result = await query<Author>(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Get or create author by user ID
   */
  async getOrCreate(userId: number, name: string, email?: string): Promise<Author> {
    let author = await this.findByUserId(userId);
    if (!author) {
      author = await this.create({ user_id: userId, name, email });
    }
    return author;
  }
}

export const authorRepository = new AuthorRepository();
export default authorRepository;
