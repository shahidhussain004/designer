# Tutorials Feature - Quick Reference

## 🚀 Quick Start

### Start Services
```powershell
# Terminal 1: Content Service
cd C:\playground\designer\services\content-service
$env:DATABASE_URL='postgresql://marketplace_user:marketplace_pass_dev@localhost:5432/marketplace_db'
npm run dev
# Runs on: http://localhost:8083

# Terminal 2: Frontend
cd C:\playground\designer\frontend\marketplace-web
npm run dev
# Runs on: http://localhost:3002
```

### Access URLs
- **Landing Page:** http://localhost:3002/tutorials
- **API Docs:** http://localhost:8083/docs
- **Example Topic:** http://localhost:3002/tutorials/java/java-tutorial/introduction

## 📁 File Locations

### Backend
```
services/content-service/
├── prisma/
│   ├── schema.prisma           # Database models (lines 200-374)
│   └── tutorials-seed.ts       # Seed data (570 lines)
├── src/
│   ├── modules/
│   │   └── tutorials/
│   │       ├── index.ts        # Module exports
│   │       ├── tutorials.routes.ts    # 9 API endpoints (450 lines)
│   │       └── tutorials.service.ts   # Business logic (280 lines)
│   ├── app.ts                  # Route registration (modified)
│   └── modules/index.ts        # Added tutorials export
```

### Frontend
```
frontend/marketplace-web/
├── app/
│   └── tutorials/
│       ├── page.tsx            # Landing page
│       ├── [slug]/
│       │   ├── page.tsx        # Tutorial detail
│       │   └── [section]/
│       │       └── [topic]/
│       │           └── page.tsx # Topic reading
├── components/
│   └── ui/
│       └── FluidHeader.tsx     # Navigation (modified)
└── package.json                # Added react-markdown
```

### Documentation
```
docs/
├── TUTORIALS_FEATURE_SUMMARY.md        # Complete implementation summary
└── TUTORIALS_FEATURE_TEST_REPORT.md    # Test results and verification
```

## 🔑 Key API Endpoints

### Public (No Auth Required)
```typescript
// List all tutorials
GET /api/tutorials
Response: Tutorial[]

// Get tutorial with sections
GET /api/tutorials/:slug
Response: Tutorial with sections[] and topics[]

// Get topic content
GET /api/tutorials/:tutorialSlug/:sectionSlug/:topicSlug
Response: Topic with content, navigation, metadata
```

### Admin (Auth Required - To Be Implemented)
```typescript
// Create tutorial
POST /api/admin/tutorials
Body: { title, slug, description, ... }

// Create section
POST /api/admin/tutorials/:tutorialId/sections
Body: { title, slug, description, ... }

// Create topic
POST /api/admin/sections/:sectionId/topics
Body: { title, slug, content, ... }
```

## 📊 Database Models

### Core Models
```prisma
model Tutorial {
  id              String
  slug            String  @unique
  title           String
  description     String
  difficulty_level DifficultyLevel
  sections        TutorialSection[]
}

model TutorialSection {
  id           String
  tutorial_id  String
  slug         String
  title        String
  topics       TutorialTopic[]
}

model TutorialTopic {
  id                  String
  section_id          String
  slug                String
  title               String
  content             String
  estimated_read_time Int
}
```

## 🎨 Tutorial Color Themes

```typescript
const tutorialColors = {
  java: '#f89820',       // Orange
  javascript: '#f7df1e',  // Yellow
  springBoot: '#6db33f',  // Green
  dotnet: '#512bd4',      // Purple
};
```

## 📝 Adding New Content

### 1. Add Tutorial via API
```bash
curl -X POST http://localhost:8083/api/admin/tutorials \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "python",
    "title": "Python Tutorial",
    "description": "Learn Python programming",
    "icon": "🐍",
    "difficulty_level": "beginner",
    "color_theme": "#3776ab",
    "estimated_hours": 20
  }'
```

### 2. Add Section
```bash
curl -X POST http://localhost:8083/api/admin/tutorials/{tutorialId}/sections \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "python-basics",
    "title": "Python Basics",
    "description": "Introduction to Python",
    "icon": "📚",
    "display_order": 1
  }'
```

### 3. Add Topic
```bash
curl -X POST http://localhost:8083/api/admin/sections/{sectionId}/topics \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "variables",
    "title": "Python Variables",
    "content": "# Python Variables\n\nVariables are...",
    "estimated_read_time": 8,
    "display_order": 1
  }'
```

### 4. Via Seed Script
Edit `prisma/tutorials-seed.ts` and run:
```bash
cd C:\playground\designer\services\content-service
$env:DATABASE_URL='postgresql://marketplace_user:marketplace_pass_dev@localhost:5432/marketplace_db'
npx tsx prisma/tutorials-seed.ts
```

## 🔍 Troubleshooting

### Backend Won't Start
```powershell
# Check if PostgreSQL is running
docker ps | findstr postgres

# Check if port 8083 is free
netstat -ano | findstr ":8083"

# Regenerate Prisma Client
cd services/content-service
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx prisma generate
```

### Frontend Won't Start
```powershell
# Check if port 3002 is free
netstat -ano | findstr ":3002"

# Reinstall dependencies
cd frontend/marketplace-web
npm install

# Clear Next.js cache
npm run clean # (if available)
rm -rf .next
```

### API Returns 404
- Verify Content Service is running on port 8083
- Check route registration in `src/app.ts`
- Verify tutorialsRoutes is imported and registered
- Check Swagger docs at http://localhost:8083/docs

### Database Connection Fails
```powershell
# Check DATABASE_URL is set
$env:DATABASE_URL

# Test PostgreSQL connection
docker exec -it designer-postgres-1 psql -U marketplace_user -d marketplace_db

# Run migrations
cd services/content-service
npx prisma migrate dev
```

## 🧪 Testing Commands

```powershell
# Test API endpoint
Invoke-RestMethod -Uri "http://localhost:8083/api/tutorials"

# Test specific tutorial
Invoke-RestMethod -Uri "http://localhost:8083/api/tutorials/java"

# Test topic endpoint
Invoke-RestMethod -Uri "http://localhost:8083/api/tutorials/java/java-tutorial/introduction"

# Check database
docker exec -it designer-postgres-1 psql -U marketplace_user -d marketplace_db -c "SELECT COUNT(*) FROM tutorials;"
```

## 📚 Dependencies

### Backend
- `@prisma/client: ^5.22.0`
- `fastify: ^4.26.0`
- `typescript: ^5.x`

### Frontend
- `next: 15.5.9`
- `react: 19`
- `react-markdown: latest` ← **NEW**
- `lucide-react: latest`
- `tailwindcss: latest`

## 🎯 Current Tutorials

| Slug | Title | Sections | Topics | Status |
|------|-------|----------|--------|--------|
| java | Java Tutorial | 8 | 5 | ✅ Live |
| javascript | JavaScript Tutorial | 6 | 2 | ✅ Live |
| spring-boot | Spring Boot Tutorial | 4 | 0 | 📝 Partial |
| dotnet | .NET Tutorial | 4 | 0 | 📝 Partial |

## 🔮 Future Phases

### Phase 2: Audio (Listen)
- AI-generated audio narration
- Audio player controls
- TutorialMedia table with type='audio'
- `/api/admin/ai-assist/generate-audio`

### Phase 3: Video (Watch)
- AI-generated video tutorials
- Video player
- TutorialMedia table with type='video'
- `/api/admin/ai-assist/generate-video`

## 📞 Quick Help

### Need to add a new tutorial?
→ Use POST /api/admin/tutorials

### Need to update existing content?
→ Use PUT /api/admin/topics/:topicId

### Need to test the API?
→ Open http://localhost:8083/docs

### Need to check database?
```sql
-- Connect to database
docker exec -it designer-postgres-1 psql -U marketplace_user -d marketplace_db

-- View tutorials
SELECT id, slug, title FROM tutorials;

-- View sections
SELECT ts.title, t.title as tutorial
FROM tutorial_sections ts
JOIN tutorials t ON ts.tutorial_id = t.id;

-- View topics
SELECT tt.title, ts.title as section
FROM tutorial_topics tt
JOIN tutorial_sections ts ON tt.section_id = ts.id;
```

---
**Last Updated:** December 30, 2025
**Status:** ✅ Production Ready (Phase 1)
