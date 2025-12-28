# Content Service

A high-performance microservice for managing content (articles, blog posts, news) built with Fastify, TypeScript, and Node.js. Part of the Designer marketplace platform.

## Features

- 📝 **Content Management** - Create, read, update, delete articles, blogs, and news
- 🏷️ **Categories & Tags** - Hierarchical categories and flexible tagging system
- 💬 **Comments** - Nested comments with moderation support
- 📊 **Analytics** - View tracking, likes, and content engagement metrics
- 🔍 **Full-Text Search** - Fast content search with suggestions
- 📁 **Media Management** - Image uploads with automatic thumbnail generation
- ⚡ **High Performance** - Redis caching and optimized queries
- 📨 **Event-Driven** - Kafka integration for real-time events

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Fastify 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15 with Prisma ORM
- **Cache**: Redis 7.x
- **Messaging**: Apache Kafka
- **Image Processing**: Sharp
- **Validation**: Zod
- **Documentation**: OpenAPI/Swagger

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Kafka (optional, for events)

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp env.example.txt .env

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### Using Docker

```bash
# Development with full stack
docker-compose -f docker-compose.dev.yml up

# Production build
docker-compose up --build
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8083` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `KAFKA_BROKERS` | Kafka broker addresses | `localhost:9092` |
| `JWT_SECRET` | JWT signing secret | - |
| `UPLOAD_DIR` | File upload directory | `./uploads` |

## API Documentation

Once running, access the Swagger documentation at:
- **Swagger UI**: http://localhost:8083/docs
- **OpenAPI JSON**: http://localhost:8083/docs/json

## API Endpoints

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | List all categories |
| GET | `/api/v1/categories/tree` | Get category tree |
| GET | `/api/v1/categories/:id` | Get category by ID |
| GET | `/api/v1/categories/slug/:slug` | Get category by slug |
| POST | `/api/v1/categories` | Create category (admin) |
| PATCH | `/api/v1/categories/:id` | Update category (admin) |
| DELETE | `/api/v1/categories/:id` | Delete category (admin) |

### Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tags` | List all tags |
| GET | `/api/v1/tags/popular` | Get popular tags |
| GET | `/api/v1/tags/search` | Search tags |
| GET | `/api/v1/tags/:id` | Get tag by ID |
| POST | `/api/v1/tags` | Create tag (admin) |
| PATCH | `/api/v1/tags/:id` | Update tag (admin) |
| DELETE | `/api/v1/tags/:id` | Delete tag (admin) |

### Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/content` | List content (paginated) |
| GET | `/api/v1/content/featured` | Get featured content |
| GET | `/api/v1/content/trending` | Get trending content |
| GET | `/api/v1/content/recent/:type` | Get recent by type |
| GET | `/api/v1/content/:id` | Get content by ID |
| GET | `/api/v1/content/slug/:slug` | Get content by slug |
| POST | `/api/v1/content` | Create content (auth) |
| PATCH | `/api/v1/content/:id` | Update content (author) |
| DELETE | `/api/v1/content/:id` | Delete content (author) |
| POST | `/api/v1/content/:id/publish` | Publish content (author) |
| POST | `/api/v1/content/:id/unpublish` | Unpublish content (author) |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/comments/content/:id` | Get content comments |
| POST | `/api/v1/comments` | Create comment (auth) |
| PATCH | `/api/v1/comments/:id` | Update comment (owner) |
| DELETE | `/api/v1/comments/:id` | Delete comment (owner) |
| GET | `/api/v1/comments/moderation` | Pending moderation (admin) |
| POST | `/api/v1/comments/:id/approve` | Approve comment (admin) |
| POST | `/api/v1/comments/:id/flag` | Flag comment (admin) |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/search` | Search content |
| GET | `/api/v1/search/suggest` | Get search suggestions |
| GET | `/api/v1/search/popular` | Popular search terms |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/analytics/view/:id` | Track content view |
| POST | `/api/v1/analytics/like/:id` | Toggle like (auth) |
| POST | `/api/v1/analytics/share/:id` | Track share |
| GET | `/api/v1/analytics/content/:id` | Content analytics |
| GET | `/api/v1/analytics/overview` | Overall analytics (admin) |

### Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/media/upload` | Upload image (auth) |
| GET | `/api/v1/media/my` | User's media assets |
| GET | `/api/v1/media` | List all media (admin) |
| DELETE | `/api/v1/media/:id` | Delete media (owner) |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Basic health check |
| GET | `/health/ready` | Readiness check |
| GET | `/metrics` | Prometheus metrics |

## Project Structure

```
content-service/
├── src/
│   ├── common/              # Shared code
│   │   ├── exceptions/      # Custom exceptions
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── middleware/      # Auth, context middleware
│   │   └── utils/           # Helpers, validation
│   ├── config/              # Configuration files
│   ├── infrastructure/      # External services
│   │   ├── cache/           # Redis service
│   │   ├── database/        # Prisma service
│   │   ├── messaging/       # Kafka service
│   │   └── storage/         # File storage
│   ├── modules/             # Feature modules
│   │   ├── analytics/
│   │   ├── category/
│   │   ├── comment/
│   │   ├── content/
│   │   ├── media/
│   │   ├── search/
│   │   └── tag/
│   ├── plugins/             # Fastify plugins
│   ├── app.ts               # App builder
│   └── server.ts            # Entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── tests/
│   ├── unit/                # Unit tests
│   └── e2e/                 # E2E tests
└── docker-compose.yml       # Docker setup
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Run tests with coverage
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

## Database Schema

### Models

- **Author** - Content authors (linked to users)
- **Category** - Hierarchical content categories
- **Tag** - Content tags
- **Content** - Main content items (articles, blogs, news)
- **Comment** - Nested comments on content
- **ContentView** - View tracking
- **ContentLike** - Like tracking
- **MediaAsset** - Uploaded media files

## Event-Driven Architecture

### Published Events

- `content.created` - New content created
- `content.updated` - Content updated
- `content.published` - Content published
- `content.deleted` - Content deleted
- `comment.created` - New comment posted
- `content.viewed` - Content viewed
- `content.liked` - Content liked

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run specific test file
npm test -- --testPathPattern=content

# Run in watch mode
npm run test:watch
```

## Deployment

### Docker

```bash
# Build image
docker build -t content-service .

# Run container
docker run -p 8083:8083 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_HOST=redis \
  -e JWT_SECRET=secret \
  content-service
```

### Kubernetes

See `k8s/` directory for Kubernetes manifests.

## License

MIT
