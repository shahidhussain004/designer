// Search Service - Full-text search across content
import { query } from '../config/database';
import { ContentWithRelations } from '../models/content.model';
import { Resource } from '../models/resource.model';
import { Tutorial } from '../models/tutorial.model';

export interface SearchResult {
  type: 'content' | 'tutorial' | 'resource';
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  relevance: number;
}

export interface SearchOptions {
  types?: ('content' | 'tutorial' | 'resource')[];
  limit?: number;
  offset?: number;
}

export class SearchService {
  /**
   * Search across all content types
   */
  async search(
    searchTerm: string,
    options: SearchOptions = {}
  ): Promise<{ results: SearchResult[]; total: number }> {
    const { types = ['content', 'tutorial', 'resource'], limit = 10, offset = 0 } = options;

    const searchQuery = searchTerm.split(/\s+/).join(' & ');
    const results: SearchResult[] = [];
    let total = 0;

    if (types.includes('content')) {
      const contentResults = await this.searchContent(searchQuery, limit, offset);
      results.push(...contentResults.results);
      total += contentResults.total;
    }

    if (types.includes('tutorial')) {
      const tutorialResults = await this.searchTutorials(searchQuery, limit, offset);
      results.push(...tutorialResults.results);
      total += tutorialResults.total;
    }

    if (types.includes('resource')) {
      const resourceResults = await this.searchResources(searchQuery, limit, offset);
      results.push(...resourceResults.results);
      total += resourceResults.total;
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return {
      results: results.slice(0, limit),
      total,
    };
  }

  /**
   * Search content
   */
  async searchContent(
    searchQuery: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ results: SearchResult[]; total: number }> {
    const result = await query<ContentWithRelations & { relevance: number }>(
      `SELECT *, 
              ts_rank(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, '')), 
                      plainto_tsquery('english', $1)) as relevance
       FROM content
       WHERE status = 'published'
         AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, '')) 
             @@ plainto_tsquery('english', $1)
       ORDER BY relevance DESC
       LIMIT $2 OFFSET $3`,
      [searchQuery, limit, offset]
    );

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM content
       WHERE status = 'published'
         AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, '')) 
             @@ plainto_tsquery('english', $1)`,
      [searchQuery]
    );

    return {
      results: result.rows.map((row) => ({
        type: 'content' as const,
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        relevance: row.relevance,
      })),
      total: parseInt(countResult.rows[0].count, 10),
    };
  }

  /**
   * Search tutorials
   */
  async searchTutorials(
    searchQuery: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ results: SearchResult[]; total: number }> {
    const result = await query<Tutorial & { relevance: number }>(
      `SELECT *, 
              ts_rank(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')), 
                      plainto_tsquery('english', $1)) as relevance
       FROM tutorials
       WHERE is_published = true
         AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')) 
             @@ plainto_tsquery('english', $1)
       ORDER BY relevance DESC
       LIMIT $2 OFFSET $3`,
      [searchQuery, limit, offset]
    );

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM tutorials
       WHERE is_published = true
         AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')) 
             @@ plainto_tsquery('english', $1)`,
      [searchQuery]
    );

    return {
      results: result.rows.map((row) => ({
        type: 'tutorial' as const,
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.description,
        relevance: row.relevance,
      })),
      total: parseInt(countResult.rows[0].count, 10),
    };
  }

  /**
   * Search resources
   */
  async searchResources(
    searchQuery: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ results: SearchResult[]; total: number }> {
    const result = await query<Resource & { relevance: number }>(
      `SELECT *, 
              ts_rank(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, '')), 
                      plainto_tsquery('english', $1)) as relevance
       FROM resources
       WHERE is_published = true
         AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, '')) 
             @@ plainto_tsquery('english', $1)
       ORDER BY relevance DESC
       LIMIT $2 OFFSET $3`,
      [searchQuery, limit, offset]
    );

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM resources
       WHERE is_published = true
         AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, '')) 
             @@ plainto_tsquery('english', $1)`,
      [searchQuery]
    );

    return {
      results: result.rows.map((row) => ({
        type: 'resource' as const,
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.description,
        relevance: row.relevance,
      })),
      total: parseInt(countResult.rows[0].count, 10),
    };
  }
}

export const searchService = new SearchService();
export default searchService;
