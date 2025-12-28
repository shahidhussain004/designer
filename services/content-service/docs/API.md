# Content Service API Reference

## Overview

The Content Service provides a RESTful API for managing content, categories, tags, comments, and analytics. All API endpoints are prefixed with `/api/v1/`.

## Authentication

Most write operations require authentication via JWT token.

```http
Authorization: Bearer <token>
```

### Roles

- **Public** - Read-only access to published content
- **User** - Can create comments, like content
- **Author** - Can create and manage own content
- **Admin** - Full access to all resources

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Content not found",
    "details": { ... }
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BAD_REQUEST` | 400 | Invalid request data |
| `VALIDATION_ERROR` | 400 | Validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Categories

### List Categories

```http
GET /api/v1/categories
```

**Query Parameters:**
- `active` (boolean) - Filter by active status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Technology",
      "slug": "technology",
      "description": "Tech articles",
      "icon": "tech-icon",
      "parentId": null,
      "isActive": true,
      "sortOrder": 0,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Category Tree

```http
GET /api/v1/categories/tree
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Technology",
      "slug": "technology",
      "children": [
        {
          "id": "uuid",
          "name": "Web Development",
          "slug": "web-development",
          "children": []
        }
      ]
    }
  ]
}
```

### Create Category

```http
POST /api/v1/categories
```

**Requires:** Admin role

**Body:**
```json
{
  "name": "Technology",
  "description": "Tech articles",
  "icon": "tech-icon",
  "parentId": null,
  "sortOrder": 0
}
```

---

## Tags

### List Tags

```http
GET /api/v1/tags
```

### Get Popular Tags

```http
GET /api/v1/tags/popular?limit=10
```

### Search Tags

```http
GET /api/v1/tags/search?q=java&limit=20
```

### Create Tag

```http
POST /api/v1/tags
```

**Requires:** Admin role

**Body:**
```json
{
  "name": "JavaScript",
  "description": "JavaScript programming language"
}
```

---

## Content

### List Content

```http
GET /api/v1/content
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 100)
- `type` (string) - Filter by type: `BLOG`, `ARTICLE`, `NEWS`
- `categoryId` (string) - Filter by category
- `tagIds` (string[]) - Filter by tags
- `status` (string) - Filter by status (auth required)
- `authorId` (string) - Filter by author
- `sortBy` (string) - Sort field
- `sortOrder` (string) - `asc` or `desc`

### Get Featured Content

```http
GET /api/v1/content/featured?limit=5
```

### Get Trending Content

```http
GET /api/v1/content/trending?limit=10
```

### Get Recent by Type

```http
GET /api/v1/content/recent/:type?limit=10
```

### Get Content by ID

```http
GET /api/v1/content/:id
```

### Get Content by Slug

```http
GET /api/v1/content/slug/:slug
```

### Create Content

```http
POST /api/v1/content
```

**Requires:** Authentication

**Body:**
```json
{
  "title": "Getting Started with TypeScript",
  "body": "Full article content...",
  "excerpt": "Optional short excerpt",
  "type": "ARTICLE",
  "categoryId": "uuid",
  "tagIds": ["uuid1", "uuid2"],
  "featuredImageUrl": "https://...",
  "metaTitle": "SEO Title",
  "metaDescription": "SEO Description"
}
```

### Update Content

```http
PATCH /api/v1/content/:id
```

**Requires:** Author or Admin

### Publish Content

```http
POST /api/v1/content/:id/publish
```

**Requires:** Author or Admin

### Unpublish Content

```http
POST /api/v1/content/:id/unpublish
```

**Requires:** Author or Admin

### Delete Content

```http
DELETE /api/v1/content/:id
```

**Requires:** Author or Admin

---

## Comments

### Get Content Comments

```http
GET /api/v1/comments/content/:contentId
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "body": "Great article!",
      "userId": "uuid",
      "isApproved": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "replies": [
        {
          "id": "uuid",
          "body": "Thanks!",
          "replies": []
        }
      ]
    }
  ]
}
```

### Create Comment

```http
POST /api/v1/comments
```

**Requires:** Authentication

**Body:**
```json
{
  "contentId": "uuid",
  "body": "Great article!",
  "parentId": null
}
```

### Moderation (Admin)

```http
GET /api/v1/comments/moderation
POST /api/v1/comments/:id/approve
POST /api/v1/comments/:id/flag
POST /api/v1/comments/:id/unflag
```

---

## Search

### Search Content

```http
GET /api/v1/search
```

**Query Parameters:**
- `query` (string, required) - Search query (min 2 chars)
- `type` (string) - Filter by content type
- `categoryId` (string) - Filter by category
- `tags` (string[]) - Filter by tags
- `page` (number) - Page number
- `limit` (number) - Items per page

### Get Suggestions

```http
GET /api/v1/search/suggest?query=java&limit=5
```

### Popular Searches

```http
GET /api/v1/search/popular?limit=10
```

---

## Analytics

### Track View

```http
POST /api/v1/analytics/view/:contentId
```

**Body (optional):**
```json
{
  "referrer": "https://google.com"
}
```

### Toggle Like

```http
POST /api/v1/analytics/like/:contentId
```

**Requires:** Authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "liked": true
  }
}
```

### Track Share

```http
POST /api/v1/analytics/share/:contentId
```

**Body:**
```json
{
  "platform": "twitter"
}
```

### Content Analytics

```http
GET /api/v1/analytics/content/:contentId
```

**Requires:** Author or Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "viewCount": 1000,
    "likeCount": 150,
    "commentCount": 25,
    "shareCount": 50,
    "viewsOverTime": [...]
  }
}
```

### Overall Analytics

```http
GET /api/v1/analytics/overview
```

**Requires:** Admin

---

## Media

### Upload Image

```http
POST /api/v1/media/upload
```

**Requires:** Authentication

**Content-Type:** `multipart/form-data`

**Body:**
- `file` (file) - Image file (JPEG, PNG, WebP, GIF)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "image-abc123.jpg",
    "originalFilename": "my-image.jpg",
    "mimeType": "image/jpeg",
    "size": 102400,
    "url": "/uploads/images/image-abc123.jpg",
    "thumbnailUrl": "/uploads/thumbnails/image-abc123-thumb.jpg",
    "width": 1920,
    "height": 1080
  }
}
```

### List My Media

```http
GET /api/v1/media/my
```

**Requires:** Authentication

### Delete Media

```http
DELETE /api/v1/media/:id
```

**Requires:** Owner or Admin

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| General | 100 req/min |
| Search | 30 req/min |
| Upload | 10 req/min |

---

## Webhooks (Kafka Events)

The service publishes events to Kafka topics:

### content-events

```json
{
  "event": "content.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "uuid",
    "title": "Article Title",
    "type": "ARTICLE",
    "authorId": "uuid"
  }
}
```

Events: `content.created`, `content.updated`, `content.published`, `content.deleted`

### comment-events

```json
{
  "event": "comment.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "uuid",
    "contentId": "uuid",
    "userId": "uuid"
  }
}
```

### analytics-events

```json
{
  "event": "content.viewed",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "contentId": "uuid",
    "userId": "uuid",
    "ip": "127.0.0.1"
  }
}
```
