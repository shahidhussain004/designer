# Designer Marketplace Web - Next.js Frontend

**Phase 1: Core Marketplace Frontend**  
**Status:** In Development (Dec 18, 2025)

## Overview

Next.js 14 App Router application for the Designer Marketplace platform. Provides user interfaces for job posting, talent search, proposals, and secure authentication.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **React Query** (data fetching & caching)
- **Zustand** (state management)
- **Axios** (HTTP client)
- **React Hook Form + Zod** (forms & validation)

## Project Structure

```
marketplace-web/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── auth/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── jobs/
│   │   ├── page.tsx        # Job listing
│   │   ├── [id]/           # Job details
│   │   └── new/            # Post new job
│   ├── talent/             # Browse freelancers
│   └── dashboard/          # User dashboard
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── forms/              # Form components
│   └── layout/             # Layout components
├── lib/
│   ├── api-client.ts       # Axios instance
│   └── auth.ts             # Auth service
├── types/
│   └── index.ts            # TypeScript types
└── public/                 # Static assets
```

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (http://localhost:8080)
- Docker infrastructure running

## Setup

### 1. Install Dependencies

```bash
cd frontend/marketplace-web
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Features

### Current (MVP Landing Page)
✅ Home page with hero section
✅ Feature cards (Post Job, Browse Talent, Find Work)
✅ How it works section
✅ Responsive design with Tailwind CSS

### In Progress
🔄 Authentication pages (login/register)
🔄 API client with JWT interceptors
🔄 Protected routes

### Upcoming
⏳ Job listing page with filters
⏳ Job detail page
⏳ Post job wizard (multi-step form)
⏳ User profile pages
⏳ Proposal submission
⏳ Dashboard

## API Integration

### API Client Setup

```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const { data } = await apiClient.get('/jobs');

// POST request
const response = await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

### Authentication

```typescript
import { authService } from '@/lib/auth';

// Login
await authService.login({ email, password });

// Check auth status
const isAuth = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();

// Logout
authService.logout();
```

## Styling

Using Tailwind CSS with custom theme:

```javascript
// Primary color palette
primary-50 to primary-900

// Usage
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Click me
</button>
```

## Current Status

✅ **Completed:**
- Next.js project setup
- TypeScript configuration
- Tailwind CSS setup
- Landing page UI
- API client with interceptors
- Auth service utilities
- Type definitions

🔄 **In Progress:**
- Authentication pages (login/register)
- Protected route middleware
- User context/state management

⏳ **Upcoming:**
- Job listing & filters
- Job detail page
- Post job form
- User profiles
- Proposal submission

## Next Steps

1. Create auth pages (login/register)
2. Implement protected route HOC
3. Build job listing page
4. Create job detail page
5. Implement job posting wizard
6. Add user profile pages
7. Integration testing with backend

## Team Notes

- Follow [PROJECT_TIMELINE_TRACKER.md](../../docs/PROJECT_TIMELINE_TRACKER.md) Tasks 1.22-1.31
- Update [INDEX.md](../../docs/INDEX.md) NEXT STEPS after completing features
- Keep components small and reusable
- Use TypeScript strictly

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker (Alternative)

```bash
# Build
docker build -t marketplace-web .

# Run
docker run -p 3000:3000 marketplace-web
```

## Support

See main project docs:
- [PROJECT_SUMMARY.md](../../PROJECT_SUMMARY.md)
- [docs/INDEX.md](../../docs/INDEX.md)
- [docs/marketplace_design.md](../../docs/marketplace_design.md)
