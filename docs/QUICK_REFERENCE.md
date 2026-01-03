# Quick Reference Guide - Content Service & Frontend

## Current System Status ✅

- **Content-Service**: Running on port 8083
- **Marketplace-Web**: Running on port 3002  
- **Database**: PostgreSQL with Prisma ORM
- **Data**: 7 content items, 8 categories, 10 tags

## Content Available

All content is displaying correctly on the Resources page:
1. Microservices Architecture: Designing Scalable Systems (Blog)
2. Database Optimization: Indexing Strategies (Article)
3. AI Integration in Enterprise Applications - Latest Trends (News)
4. Docker and Kubernetes: Container Orchestration Guide (Article)
5. Modern React Development: Hooks vs Classes (Blog)
6. Spring Boot Best Practices for 2025 (Article) - **FEATURED**
7. Getting Started with Java: A Comprehensive Guide (Article) - **FEATURED**

## Running Services

### Content-Service (Backend)
```powershell
cd C:\playground\designer\services\content-service
npm run dev
```
- Accessible at: http://localhost:8083
- API base: http://localhost:8083/api/v1
- Framework: Fastify 4.26.0
- Database: PostgreSQL via Prisma

### Marketplace-Web (Frontend)
```powershell
cd C:\playground\designer\frontend\marketplace-web
npm start
```
- Accessible at: http://localhost:3002
- Resources page: http://localhost:3002/resources
- Framework: Next.js 14+ with React
- Data fetching: React Query + Axios

## Key API Endpoints

### Content Endpoints
```
GET  /api/v1/content                      - List all content (with filters)
GET  /api/v1/content/featured             - Get featured content
GET  /api/v1/content/trending             - Get trending content
GET  /api/v1/content/slug/{slug}          - Get content by slug
GET  /api/v1/content/{id}                 - Get content by ID
```

### Category Endpoints
```
GET  /api/v1/categories                   - List all categories
GET  /api/v1/categories?active=true       - List active categories
GET  /api/v1/categories/tree              - Get category tree
```

### Tag Endpoints
```
GET  /api/v1/tags                         - List all tags
GET  /api/v1/tags/popular/{limit}         - Get popular tags
```

## Supported Query Parameters

### Pagination & Sorting
```
?page=1                   - Page number (default: 1)
?limit=10                 - Items per page (default: 10)
?sortBy=publishedAt       - Sort field (publishedAt, viewCount, likeCount)
?sortOrder=desc           - Sort direction (asc, desc)
```

### Filtering
```
?type=blog                - Content type (blog, article, news)
?search=microservices     - Search in title/excerpt/body
?categoryId={uuid}        - Filter by category
?tagIds={uuid},{uuid}     - Filter by tags (comma-separated)
```

### Example Queries
```
# Get blog posts sorted by newest
/api/v1/content?type=blog&sortBy=publishedAt&sortOrder=desc

# Get featured content with limit
/api/v1/content/featured?limit=5

# Search for database articles
/api/v1/content?search=database&type=article

# Get paginated results
/api/v1/content?page=2&limit=5

# Filter by category and tags
/api/v1/content?categoryId=338b9d83-cf5b-4be2-b7f4-3d25116e159c&tagIds=tag-uuid-1,tag-uuid-2
```

## Frontend Filter Structure

When sending filters from React, pass them as **top-level query parameters**:

```typescript
// Correct ✅
const filters = {
  page: 1,
  limit: 12,
  sortBy: 'publishedAt',
  sortOrder: 'desc',
  type: 'blog',           // Not inside filters object
  categoryId: 'xxx',
  tagIds: ['xxx', 'yyy'],
  search: 'query'
};

// Incorrect ❌
const filters = {
  page: 1,
  limit: 12,
  filters: {              // Don't nest like this
    contentType: 'blog',
    categoryId: 'xxx'
  }
};
```

## Important Files

### Backend
- `services/content-service/src/modules/content/content.routes.ts` - API routes
- `services/content-service/src/modules/content/content.service.ts` - Business logic
- `services/content-service/prisma/schema.prisma` - Database schema
- `services/content-service/prisma/seed.ts` - Data seeding

### Frontend
- `frontend/marketplace-web/app/resources/page.tsx` - Resources list page
- `frontend/marketplace-web/app/resources/[slug]/page.tsx` - Content detail page
- `frontend/marketplace-web/hooks/useContent.ts` - React Query hooks
- `frontend/marketplace-web/lib/content-api.ts` - Axios client & API functions

## Known Issues Fixed ✅

1. **Flyway Migration Duplication** - Removed V20 & V21 from marketplace-service
2. **Hook Return Format** - useContent now returns { data, meta }
3. **Filter Structure** - Frontend sends flat query params, not nested filters

## Database Schema (Prisma)

### Core Tables
- `categories` - Content categories (8 records)
- `tags` - Content tags (10 records)
- `authors` - Content authors (4 records)
- `content` - Published content items (7 records)
- `content_tags` - Join table for content-tag relationships

### Key Fields
- `id` - UUID primary key
- `title` - Content title
- `slug` - URL-friendly identifier
- `contentType` - 'BLOG', 'ARTICLE', 'NEWS'
- `status` - 'published', 'draft', 'archived'
- `isFeatured` - Boolean for featured content
- `isTrending` - Boolean for trending content
- `publishedAt` - Publication date

## Troubleshooting

### Content not showing?
1. Check both services are running
2. Verify database has content: `GET http://localhost:8083/api/v1/content`
3. Check browser console for errors
4. Verify filters are sent as top-level params

### API returning 404?
1. Check correct port (8083 for backend)
2. Verify endpoint path is correct
3. Check if query params are properly formatted

### Database empty?
1. Run Prisma seed: `npm run prisma:seed` in content-service
2. Verify PostgreSQL is running
3. Check `.env` file has correct DATABASE_URL

## Next Steps

### To add more content:
```powershell
# In content-service
npm run prisma:studio  # Opens Prisma Studio UI
# Or modify prisma/seed.ts and run:
npm run prisma:seed
```

### To deploy:
1. Set environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Start services with `npm run build && npm start`
4. Configure nginx/reverse proxy for production

## Contact & Support

For issues or questions:
1. Check the logs in the service terminal
2. Review TESTING_AND_REFACTORING_COMPLETE.md for detailed info
3. Check API responses in browser DevTools Network tab
