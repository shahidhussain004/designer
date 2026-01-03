# Marketplace-Web: Quick Reference Card

**Keep this handy while developing!**

---

## 🚀 Quick Start New Feature

### Step 1: Create Custom Hook
```bash
# Create in lib/hooks/use[Feature]Data.ts
```

```typescript
// Template
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';

export const use[Feature]Data = (filters?: any) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filters]);

  return { data, error, loading };
};
```

### Step 2: Create Page Component
```bash
# Create in app/[route]/page.tsx
```

```typescript
'use client';

import { use[Feature]Data } from '@/lib/hooks/use[Feature]Data';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function [Feature]Page() {
  const { data, error, loading } = use[Feature]Data();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBoundary error={error} />;
  if (!data) return <div>No data</div>;

  return <div>{/* Content */}</div>;
}
```

### Step 3: Add Types
```typescript
// types/index.ts
export interface [Feature]Type {
  id: string;
  title: string;
  // ... other fields
}
```

### Step 4: Test
```bash
npm run type-check
npm run lint
npm run build
npm run dev
```

---

## ✅ Pre-Commit Checklist

```
Before committing code:

[ ] npm run type-check    # TypeScript errors?
[ ] npm run lint           # Code style?
[ ] No console.log()       # Debugging code removed?
[ ] Browser console clean  # No JS errors?
[ ] Tested on mobile       # Responsive?
[ ] Error states work      # Can it fail gracefully?
[ ] Loading states show    # UX complete?
[ ] API response in Network tab? # Check DevTools
```

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot read property of undefined"
```typescript
// ❌ Wrong
<div>{data.job.title}</div>

// ✅ Right
<div>{data?.job?.title ?? 'Untitled'}</div>
```

### Issue: Infinite Loop / Memory Leak
```typescript
// ❌ Wrong
useEffect(() => {
  fetchData();
}); // Missing dependencies!

// ✅ Right
useEffect(() => {
  fetchData();
}, [filterId]); // Dependencies specified
```

### Issue: Stale Data
```typescript
// ❌ Wrong
const cachedData = useCallback(() => data, []); // Captures old data

// ✅ Right
const cachedData = useCallback(() => data, [data]); // Includes dependency
```

### Issue: Console Errors About Keys
```typescript
// ❌ Wrong
{items.map((item, i) => <Item key={i} />)}

// ✅ Right
{items.map((item) => <Item key={item.id} />)}
```

---

## 📁 File Structure Reference

```
marketplace-web/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Dashboard
│   ├── jobs/                # Jobs feature
│   │   ├── page.tsx         # Jobs list
│   │   └── [id]/page.tsx    # Job detail
│   ├── courses/             # Courses feature
│   ├── projects/            # Projects feature
│   ├── resources/           # Resources feature
│   ├── marketplace/         # Marketplace hub
│   ├── settings/            # User settings
│   ├── profile/             # User profile
│   ├── search/              # Search results
│   ├── my-enrollments/      # Enrollments
│   └── my-applications/     # Applications
│
├── components/              # Reusable components
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── JobCard.tsx
│   └── ...
│
├── lib/
│   ├── api/
│   │   └── client.ts        # API client config
│   └── hooks/               # Custom hooks
│       ├── useApiData.ts
│       ├── useJobsData.ts
│       ├── useCoursesData.ts
│       └── ...
│
├── types/                   # TypeScript definitions
│   └── index.ts
│
└── styles/                  # CSS/Tailwind
    └── globals.css
```

---

## 🔗 API Endpoints

### Jobs Service
```
GET    /api/v1/jobs           # List jobs
GET    /api/v1/jobs/:id       # Get job detail
POST   /api/v1/jobs           # Create job
PUT    /api/v1/jobs/:id       # Update job
DELETE /api/v1/jobs/:id       # Delete job
```

### Courses Service
```
GET    /api/v1/courses        # List courses
GET    /api/v1/courses/:id    # Get course detail
POST   /api/v1/enrollments    # Enroll in course
```

### Projects Service
```
GET    /api/v1/projects       # List projects
GET    /api/v1/projects/:id   # Get project detail
```

### Search Service
```
GET    /api/v1/search?q=term  # Unified search
```

### User Service
```
GET    /api/v1/user/profile              # Get profile
PUT    /api/v1/user/profile              # Update profile
GET    /api/v1/user/enrollments          # My enrollments
GET    /api/v1/user/applications         # My applications
```

---

## 🎨 Component Props Pattern

```typescript
// Define interface
interface MyComponentProps {
  title: string;
  items: ItemType[];
  onSelect: (item: ItemType) => void;
  isLoading?: boolean;
  error?: Error;
}

// Implement component
const MyComponent: React.FC<MyComponentProps> = ({
  title,
  items,
  onSelect,
  isLoading = false,
  error,
}) => {
  // Implementation
};

// Export
export default MyComponent;
```

---

## 🧪 Testing Pattern

```typescript
// test/myPage.test.tsx
describe('MyPage', () => {
  it('should render loading state', () => {
    // Test implementation
  });

  it('should handle error state', () => {
    // Test implementation
  });

  it('should display data when loaded', () => {
    // Test implementation
  });
});
```

---

## 📊 Performance Checklist

```
Before shipping:

[ ] Images optimized (use next/image)
[ ] Components memoized (React.memo)
[ ] Callbacks memoized (useCallback)
[ ] Computations memoized (useMemo)
[ ] Lazy loading enabled
[ ] Code splitting working
[ ] Bundle size < 200KB gzipped
[ ] LCP < 2.5s
[ ] FID < 100ms
[ ] CLS < 0.1
```

---

## 🔒 Security Checklist

```
Before shipping:

[ ] No hardcoded secrets
[ ] API keys in environment variables
[ ] CORS properly configured
[ ] XSS protection enabled
[ ] CSRF tokens if needed
[ ] Input validation
[ ] Output escaping
[ ] Rate limiting checked
[ ] Authentication verified
[ ] Authorization enforced
```

---

## 📱 Responsive Design Breakpoints

```typescript
// Tailwind CSS breakpoints
sm: 640px   // Small phones
md: 768px   // Tablets
lg: 1024px  // Desktops
xl: 1280px  // Large desktops
2xl: 1536px // Extra large
```

---

## 🎯 Key Principles

### ✅ DO:
- Use custom hooks for data fetching
- Implement error boundaries
- Show loading states
- Use TypeScript types
- Keep components < 300 lines
- Memoize expensive computations
- Use proper dependency arrays
- Handle null/undefined safely

### ❌ DON'T:
- Fetch directly in components
- Ignore errors
- Use index as key
- Create hooks inside components
- Use any type unnecessarily
- Leave console logs in production
- Create circular dependencies
- Mutate state directly

---

## 🚨 Error Handling Template

```typescript
try {
  const response = await apiClient.get('/endpoint');
  setData(response.data);
} catch (error) {
  const message = error instanceof Error 
    ? error.message 
    : 'An error occurred';
  
  setError(new Error(message));
  console.error('Fetch failed:', error);
}
```

---

## 💾 Commit Message Convention

```
feat: Add new jobs filter feature
fix: Correct error handling in courses page
refactor: Improve useApiData hook
docs: Update API documentation
test: Add tests for job detail page
chore: Update dependencies

Format: <type>: <description>
```

---

## 🔧 Troubleshooting Commands

```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Check for linting issues
npm run lint

# Build and check for errors
npm run build

# Run in development
npm run dev
```

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `lib/api/client.ts` | API client configuration |
| `lib/hooks/useApiData.ts` | Base data fetching hook |
| `components/ErrorBoundary.tsx` | Error handling |
| `components/LoadingSpinner.tsx` | Loading states |
| `types/index.ts` | Type definitions |
| `tsconfig.json` | TypeScript config |
| `next.config.js` | Next.js config |

---

## 💡 Pro Tips

1. **Use DevTools**: Press F12 to open DevTools and check Network tab for API calls
2. **Inspect Component Props**: React DevTools shows props for debugging
3. **Check Types**: Hover over variables in VS Code to see inferred types
4. **Use Code Navigation**: Ctrl+Click to jump to definitions
5. **Search Workspace**: Ctrl+Shift+F to find code across files

---

## 🆘 Need Help?

1. Check [MARKETPLACE_WEB_AUDIT_VERIFICATION.md](./MARKETPLACE_WEB_AUDIT_VERIFICATION.md)
2. Check [COMPLIANCE_MAINTENANCE_GUIDE.md](./COMPLIANCE_MAINTENANCE_GUIDE.md)
3. Review [API_BEST_PRACTICES.md](./API_BEST_PRACTICES.md)
4. Look at similar existing pages
5. Check component documentation

---

**Last Updated:** 2024  
**Keep This Accessible While Coding!**
