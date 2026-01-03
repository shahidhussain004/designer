# Marketplace-Web Compliance Maintenance Guide

**Purpose:** Quick reference for maintaining API_BEST_PRACTICES compliance while developing new features or modifying existing code.

---

## Quick Checklist for New Pages

Use this checklist when creating a new page in marketplace-web:

```
Creating a New Page: [Page Name]
Status: [ ] Not Started [ ] In Progress [x] Complete

Pre-Development:
[ ] Planning done in Figma/Design
[ ] API endpoint documented
[ ] Data structure defined
[ ] Error cases identified

Component Structure:
[ ] Page created in app/[route]/page.tsx
[ ] Custom hook created in lib/hooks/
[ ] Type definitions added
[ ] Error boundary considered

Implementation:
[ ] useApiData or custom hook created
[ ] Loading state implemented
[ ] Error state implemented
[ ] Empty state implemented (if applicable)
[ ] TypeScript types added for all data

Code Quality:
[ ] npm run lint passes
[ ] npm run type-check passes
[ ] npm run build succeeds
[ ] No console errors/warnings

Testing:
[ ] Page loads without errors
[ ] Data displays correctly
[ ] Error state tested
[ ] Loading state visible
[ ] Filters/Search work (if applicable)
[ ] Responsive design verified

Documentation:
[ ] Added to MARKETPLACE_WEB_AUDIT_VERIFICATION.md
[ ] Component documented with JSDoc
[ ] API contract documented
```

---

## API Hook Template

When creating a new custom hook for data fetching:

```typescript
// lib/hooks/use[Feature]Data.ts

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { [Feature]Data } from '@/types';

interface Use[Feature]DataReturn {
  data: [Feature]Data[] | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const use[Feature]Data = (filters?: Record<string, any>): Use[Feature]DataReturn => {
  const [data, setData] = useState<[Feature]Data[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/v1/[feature]', { params: filters });
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
};

export default use[Feature]Data;
```

---

## Page Component Template

When creating a new page component:

```typescript
// app/[route]/page.tsx

'use client';

import { useState } from 'react';
import { use[Feature]Data } from '@/lib/hooks/use[Feature]Data';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { [Feature]Item } from '@/components/[Feature]Item';
import { [Feature]Type } from '@/types';

export default function [Feature]Page() {
  const [filters, setFilters] = useState({});
  const { data, error, loading } = use[Feature]Data(filters);

  if (loading) {
    return (
      <div className="container py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center text-gray-500">
          No items found
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">[Feature Title]</h1>
        
        {/* Filters if applicable */}
        <div className="mb-6 flex gap-4">
          {/* Filter controls */}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item: [Feature]Type) => (
            <[Feature]Item key={item.id} item={item} />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
```

---

## Common Mistakes to Avoid

### ❌ DON'T DO THIS

```typescript
// ❌ Don't fetch directly in component
const MyPage = () => {
  useEffect(() => {
    fetch('/api/endpoint')
      .then(r => r.json())
      .then(data => setData(data));
  }, []); // Missing dependency!
};

// ❌ Don't ignore errors
const [data, setData] = useState(null);
// Error never handled

// ❌ Don't forget loading states
const { data } = useApiData('/endpoint');
if (!data) return <></>;  // Could be loading OR error!

// ❌ Don't use index as key
{items.map((item, index) => <Item key={index} item={item} />)}

// ❌ Don't create hooks inside components
const MyComponent = () => {
  const customHook = () => { // NOT ALLOWED!
    // ...
  };
};
```

### ✅ DO THIS INSTEAD

```typescript
// ✅ Use custom hooks for fetching
const { data, error, loading } = useCustomData();

// ✅ Handle all states
if (loading) return <LoadingSpinner />;
if (error) return <ErrorBoundary error={error} />;
if (!data) return <EmptyState />;

// ✅ Proper dependency arrays
useEffect(() => {
  // effect code
}, [dependency1, dependency2]); // All dependencies listed!

// ✅ Use unique IDs as keys
{items.map((item) => <Item key={item.id} item={item} />)}

// ✅ Create hooks at top level
export const useCustomData = () => {
  // Hook code
};
```

---

## Type Safety Checklist

Before committing code:

```typescript
// ✅ Import and use types
import { JobType, CourseType } from '@/types';

// ✅ Type component props
interface MyComponentProps {
  data: JobType[];
  onSelect: (job: JobType) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ data, onSelect }) => {
  // Component code
};

// ✅ Type API responses
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ✅ Handle nullable values
const jobTitle: string = data?.job?.title ?? 'Untitled';

// ✅ Type event handlers
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // Handle click
};
```

---

## Performance Optimization Checklist

### Image Optimization
```typescript
// ✅ Use Next.js Image component
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={300}
  height={200}
  priority={false}
  loading="lazy"
/>

// ❌ Don't use HTML img tag
// <img src="..." />
```

### Component Memoization
```typescript
// ✅ Memoize components that receive same props often
const JobCard = React.memo(({ job }: { job: JobType }) => {
  return <div>{job.title}</div>;
});

// ✅ Use useMemo for expensive calculations
const expensiveData = useMemo(() => {
  return data.filter(item => item.status === 'active');
}, [data]);

// ✅ Use useCallback for event handlers
const handleFilter = useCallback((filter: string) => {
  setFilters(prev => ({ ...prev, status: filter }));
}, []);
```

### Code Splitting
```typescript
// ✅ Use dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <LoadingSpinner /> }
);

// ✅ Route-based splitting (automatic with Next.js App Router)
```

---

## Testing Your Changes

### Pre-commit Checks
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build the project
npm run build

# Run in development
npm run dev
```

### Manual Testing
1. Load the page in development
2. Check browser console for errors
3. Test all filters and search
4. Test error states (disconnect internet, etc.)
5. Test loading states (throttle network)
6. Check responsive design
7. Verify API calls in Network tab

---

## Deployment Checklist

Before deploying to production:

```
[ ] All tests passing
[ ] npm run build succeeds
[ ] npm run lint has no errors
[ ] npm run type-check passes
[ ] No console errors in browser
[ ] All features tested manually
[ ] Performance acceptable (LCP < 2.5s)
[ ] Mobile responsive verified
[ ] Accessibility checked
[ ] Documentation updated
[ ] MARKETPLACE_WEB_AUDIT_VERIFICATION.md updated
[ ] Code reviewed by peer
[ ] Changes documented in PR
```

---

## Adding New Dependencies

Before adding a new npm package:

1. **Check if already available**
   ```bash
   npm list [package-name]
   ```

2. **Check compatibility**
   - Is it maintained?
   - Does it support our Node.js version?
   - Does it work with Next.js 14+?

3. **Test before committing**
   ```bash
   npm install [package-name]
   npm run build
   ```

4. **Update documentation** if it's a significant dependency

---

## Common API Response Patterns

### Success Response
```json
{
  "data": { /* your data */ },
  "status": 200,
  "message": "Success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400,
  "code": "ERROR_CODE"
}
```

### Paginated Response
```json
{
  "data": [/* items */],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Debugging Tips

### API Call Issues
1. Check Network tab in DevTools
2. Verify endpoint URL
3. Check request headers
4. Verify authentication token
5. Check CORS headers

### Component Rendering Issues
1. Check React DevTools
2. Verify prop types
3. Check dependency arrays
4. Look for infinite loops
5. Verify state updates

### Build Issues
1. Run `npm run type-check`
2. Check for import errors
3. Verify package.json
4. Clear node_modules and reinstall
5. Check for circular dependencies

---

## Resources

- [API_BEST_PRACTICES.md](../API_BEST_PRACTICES.md) - Core guidelines
- [FRONTEND_IMPLEMENTATION_GUIDE.md](./FRONTEND_IMPLEMENTATION_GUIDE.md) - Detailed patterns
- [MARKETPLACE_WEB_AUDIT_VERIFICATION.md](./MARKETPLACE_WEB_AUDIT_VERIFICATION.md) - Verification status
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

---

## Support

For questions about compliance:
1. Check API_BEST_PRACTICES.md
2. Review similar existing components
3. Check component documentation
4. Ask in code review
5. Check this guide

**Last Updated:** 2024  
**Maintained By:** Frontend Team
