# API Integration Best Practices Guide

I've created a comprehensive API Integration Best Practices guide for your projects! This markdown file includes:

Complete Setup - Project structure, dependencies, and configuration
API Client - Fully configured Axios instance with interceptors, logging, and token refresh
TanStack Query Setup - Provider configuration and devtools
6 Common Patterns:

Simple GET requests
GET with parameters
Dependent queries
Mutations (POST/PUT/DELETE)
Infinite scroll/pagination
Search with debounce


Error Handling - Error boundaries and custom error components
Loading States - Skeleton loaders and spinners
Advanced Patterns - Optimistic updates, prefetching, polling
Testing - How to test your hooks and API calls
Best Practices - Clear DOs and DON'Ts
Quick Reference - Query key conventions and common options

You can share this with your AI assistant to ensure consistent, high-performance API integration across all your projects. The patterns handle:

✅ No more error flashing
✅ Proper request cancellation
✅ Automatic caching and invalidation
✅ Loading states without useState
✅ Optimistic updates
✅ Token refresh on 401
✅ Comprehensive error handling

Save this as API_BEST_PRACTICES.md in your project docs!

This guide provides standardized patterns for API integration to ensure smooth performance, proper error handling, and excellent user experience across all projects.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [API Client Configuration](#api-client-configuration)
3. [TanStack Query Setup](#tanstack-query-setup)
4. [API Integration Patterns](#api-integration-patterns)
5. [Error Handling](#error-handling)
6. [Loading States](#loading-states)
7. [Common Patterns](#common-patterns)
8. [Testing](#testing)

---

## Project Setup

### Required Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.14.2",
    "axios": "^1.6.2",
    "next": "^15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.22.4"
  }
}
```

### Project Structure

```
src/
├── lib/
│   ├── apiClient.ts          # Axios instance with interceptors
│   ├── logger.ts             # Logging utility
│   └── queryClient.ts        # TanStack Query client config
├── hooks/
│   ├── useJobs.ts            # Job-related queries
│   ├── useUsers.ts           # User-related queries
│   └── useAuth.ts            # Auth queries/mutations
├── app/
│   ├── providers.tsx         # Query provider wrapper
│   └── layout.tsx            # Root layout with providers
└── types/
    └── api.ts                # API response types
```

---

## API Client Configuration

### `lib/apiClient.ts`

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import logger from './logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Extend Axios config for metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

/**
 * Axios instance configured with:
 * - Automatic JWT token injection
 * - Request/response logging
 * - Token refresh on 401
 * - Error handling
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const startTime = Date.now();
    config.metadata = { startTime };

    // Add auth token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log request
    logger.apiRequest(
      config.method?.toUpperCase() || 'UNKNOWN',
      config.url || 'UNKNOWN',
      config.data
    );

    return config;
  },
  (error) => {
    logger.error('API Request Interceptor Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    const duration = response.config.metadata?.startTime 
      ? Date.now() - response.config.metadata.startTime 
      : 0;

    // Log successful response
    logger.apiResponse(
      response.config.method?.toUpperCase() || 'UNKNOWN',
      response.config.url || 'UNKNOWN',
      response.status,
      duration
    );

    // Warn on slow requests
    if (duration > 1000) {
      logger.warn(`Slow API request: ${duration}ms`, {
        method: response.config.method,
        url: response.config.url,
        duration: `${duration}ms`,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    // Ignore cancellation errors (expected behavior)
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { 
      _retry?: boolean; 
      metadata?: { startTime: number } 
    };
    
    const duration = originalRequest?.metadata?.startTime 
      ? Date.now() - originalRequest.metadata.startTime 
      : 0;

    // Log errors
    if (error.response) {
      logger.apiError(
        originalRequest?.method?.toUpperCase() || 'UNKNOWN',
        originalRequest?.url || 'UNKNOWN',
        error,
        error.response.status
      );

      logger.error('API Error Response', error, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        duration: `${duration}ms`,
      });
    } else if (error.request) {
      logger.error('API Request Failed - No Response', error, {
        url: originalRequest?.url,
        method: originalRequest?.method,
        timeout: error.code === 'ECONNABORTED',
      });
    } else {
      logger.error('API Request Setup Error', error);
    }

    // Handle 401 - token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          localStorage.setItem('access_token', data.accessToken);
          apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## TanStack Query Setup

### `lib/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### `app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### `app/layout.tsx`

```typescript
import { Providers } from './providers';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

## API Integration Patterns

### Pattern 1: Simple GET Request (Fetch List)

```typescript
// hooks/useJobs.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Job } from '@/types/api';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get<Job[]>('/jobs', { signal });
      return Array.isArray(data) ? data : data.content || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Usage in component
export default function JobsPage() {
  const { data: jobs, isLoading, error } = useJobs();

  if (isLoading) return <JobsSkeleton />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!jobs || jobs.length === 0) return <EmptyState />;

  return (
    <div>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
```

### Pattern 2: GET with Parameters (Fetch Single Item)

```typescript
// hooks/useJob.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Job } from '@/types/api';

export function useJob(jobId: string | null) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async ({ signal }) => {
      if (!jobId) throw new Error('Job ID is required');
      const { data } = await apiClient.get<Job>(`/jobs/${jobId}`, { signal });
      return data;
    },
    enabled: !!jobId, // Only run if jobId exists
    staleTime: 5 * 60 * 1000,
  });
}

// Usage in component
export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const { data: job, isLoading, error } = useJob(params.id);

  if (isLoading) return <JobDetailsSkeleton />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!job) return <NotFound />;

  return <JobDetails job={job} />;
}
```

### Pattern 3: Dependent Queries (Fetch Related Data)

```typescript
// hooks/useJobWithEmployer.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Job, User } from '@/types/api';

export function useJobWithEmployer(jobId: string | null) {
  // First query: Get job
  const jobQuery = useQuery({
    queryKey: ['job', jobId],
    queryFn: async ({ signal }) => {
      if (!jobId) throw new Error('Job ID is required');
      const { data } = await apiClient.get<Job>(`/jobs/${jobId}`, { signal });
      return data;
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });

  // Second query: Get employer (depends on first query)
  const employerQuery = useQuery({
    queryKey: ['user', jobQuery.data?.employerId],
    queryFn: async ({ signal }) => {
      const employerId = jobQuery.data?.employerId;
      if (!employerId) throw new Error('Employer ID not found');
      const { data } = await apiClient.get<User>(`/users/${employerId}/profile`, { signal });
      return data;
    },
    enabled: !!jobQuery.data?.employerId, // Only run if we have employer ID
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    job: jobQuery.data,
    employer: employerQuery.data,
    isLoading: jobQuery.isLoading || (jobQuery.data?.employerId && employerQuery.isLoading),
    error: jobQuery.error || employerQuery.error,
  };
}

// Usage
export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const { job, employer, isLoading, error } = useJobWithEmployer(params.id);

  if (isLoading) return <JobDetailsSkeleton />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!job) return <NotFound />;

  return (
    <div>
      <JobDetails job={job} />
      {employer && <EmployerInfo employer={employer} />}
    </div>
  );
}
```

### Pattern 4: POST/PUT/DELETE (Mutations)

```typescript
// hooks/useJobMutations.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Job, CreateJobInput, UpdateJobInput } from '@/types/api';
import { useRouter } from 'next/navigation';

export function useCreateJob() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: CreateJobInput) => {
      const { data } = await apiClient.post<Job>('/jobs', input);
      return data;
    },
    onSuccess: (newJob) => {
      // Invalidate jobs list to refetch
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      // Optionally add to cache
      queryClient.setQueryData(['job', newJob.id], newJob);
      
      // Navigate to new job
      router.push(`/jobs/${newJob.id}`);
    },
    onError: (error) => {
      console.error('Failed to create job:', error);
      // Show toast/notification
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateJobInput }) => {
      const { data } = await apiClient.patch<Job>(`/jobs/${id}`, input);
      return data;
    },
    onSuccess: (updatedJob) => {
      // Update specific job in cache
      queryClient.setQueryData(['job', updatedJob.id], updatedJob);
      
      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/jobs/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['job', deletedId] });
      
      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      // Navigate away
      router.push('/jobs');
    },
  });
}

// Usage in component
export default function JobForm({ job }: { job?: Job }) {
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  
  const handleSubmit = async (input: CreateJobInput) => {
    if (job) {
      await updateJob.mutateAsync({ id: job.id, input });
    } else {
      await createJob.mutateAsync(input);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={createJob.isPending || updateJob.isPending}
      >
        {createJob.isPending || updateJob.isPending ? 'Saving...' : 'Save'}
      </button>
      
      {createJob.error && <ErrorMessage message={createJob.error.message} />}
      {updateJob.error && <ErrorMessage message={updateJob.error.message} />}
    </form>
  );
}
```

### Pattern 5: Infinite Scroll / Pagination

```typescript
// hooks/useInfiniteJobs.ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Job, PaginatedResponse } from '@/types/api';

interface JobsParams {
  category?: string;
  search?: string;
}

export function useInfiniteJobs(params: JobsParams = {}) {
  return useInfiniteQuery({
    queryKey: ['jobs', 'infinite', params],
    queryFn: async ({ pageParam = 1, signal }) => {
      const { data } = await apiClient.get<PaginatedResponse<Job>>('/jobs', {
        params: {
          page: pageParam,
          limit: 20,
          ...params,
        },
        signal,
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page < lastPage.totalPages;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}

// Usage with infinite scroll
export default function InfiniteJobsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteJobs();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) return <JobsSkeleton />;
  if (error) return <ErrorMessage message={error.message} />;

  const allJobs = data?.pages.flatMap(page => page.data) || [];

  return (
    <div onScroll={handleScroll} className="h-screen overflow-auto">
      {allJobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
      {isFetchingNextPage && <LoadingSpinner />}
      {!hasNextPage && <div>No more jobs</div>}
    </div>
  );
}
```

### Pattern 6: Search with Debounce

```typescript
// hooks/useJobSearch.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Job } from '@/types/api';

export function useJobSearch(initialQuery: string = '') {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const query = useQuery({
    queryKey: ['jobs', 'search', debouncedQuery],
    queryFn: async ({ signal }) => {
      if (!debouncedQuery) return [];
      const { data } = await apiClient.get<Job[]>('/jobs/search', {
        params: { q: debouncedQuery },
        signal,
      });
      return data;
    },
    enabled: debouncedQuery.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    ...query,
    searchQuery,
    setSearchQuery,
  };
}

// Usage
export default function JobSearchPage() {
  const { data: jobs, isLoading, searchQuery, setSearchQuery } = useJobSearch();

  return (
    <div>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search jobs..."
      />
      
      {isLoading && <LoadingSpinner />}
      
      {jobs && jobs.length > 0 ? (
        jobs.map(job => <JobCard key={job.id} job={job} />)
      ) : (
        <EmptyState message="No jobs found" />
      )}
    </div>
  );
}
```

---

## Error Handling

### Error Boundary Component

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import logger from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error Boundary caught error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Custom Error Component

```typescript
// components/ErrorMessage.tsx
interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <p className="text-red-800">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}
```

---

## Loading States

### Skeleton Components

```typescript
// components/skeletons/JobsSkeleton.tsx
export function JobsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export function JobDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  );
}
```

### Loading Spinner

```typescript
// components/LoadingSpinner.tsx
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
      ></div>
    </div>
  );
}
```

---

## Common Patterns

### Pattern: Optimistic Updates

```typescript
export function useLikeJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await apiClient.post(`/jobs/${jobId}/like`);
      return data;
    },
    // Optimistically update UI before server responds
    onMutate: async (jobId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['job', jobId] });

      // Snapshot previous value
      const previousJob = queryClient.getQueryData(['job', jobId]);

      // Optimistically update
      queryClient.setQueryData(['job', jobId], (old: any) => ({
        ...old,
        isLiked: true,
        likesCount: (old?.likesCount || 0) + 1,
      }));

      return { previousJob };
    },
    // Rollback on error
    onError: (err, jobId, context) => {
      queryClient.setQueryData(['job', jobId], context?.previousJob);
    },
    // Always refetch after error or success
    onSettled: (data, error, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    },
  });
}
```

### Pattern: Prefetching

```typescript
// Prefetch job details on hover
export function JobCard({ job }: { job: Job }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['job', job.id],
      queryFn: async () => {
        const { data } = await apiClient.get(`/jobs/${job.id}`);
        return data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <Link href={`/jobs/${job.id}`} onMouseEnter={handleMouseEnter}>
      <div>{job.title}</div>
    </Link>
  );
}
```

### Pattern: Polling / Auto-refresh

```typescript
export function useRealtimeJobs() {
  return useQuery({
    queryKey: ['jobs', 'realtime'],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get('/jobs', { signal });
      return data;
    },
    refetchInterval: 30 * 1000, // Poll every 30 seconds
    refetchIntervalInBackground: false, // Stop when tab is not visible
  });
}
```

---

## Testing

### Mock API Client for Tests

```typescript
// __mocks__/apiClient.ts
import { vi } from 'vitest';

export const apiClient = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

export default apiClient;
```

### Test Query Hook

```typescript
// hooks/__tests__/useJobs.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useJobs } from '../useJobs';
import apiClient from '@/lib/apiClient';

// Mock the API client
vi.mock('@/lib/apiClient');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useJobs', () => {
  it('fetches jobs successfully', async () => {
    const mockJobs = [{ id: '1', title: 'Developer' }];
    (apiClient.get as any).mockResolvedValue({ data: mockJobs });

    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockJobs);
  });

  it('handles errors', async () => {
    const mockError = new Error('Failed to fetch');
    (apiClient.get as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(mockError);
  });
});
```

---

## Best Practices Summary

### ✅ DO

- **Always use TanStack Query** for data fetching
- **Use query keys consistently** - `['resource', id, params]`
- **Handle loading and error states** properly
- **Use skeleton loaders** instead of spinners when possible
- **Implement proper TypeScript types** for API responses
- **Use optimistic updates** for better UX
- **Prefetch data on hover** for instant navigation
- **Set appropriate staleTime** based on data freshness needs
- **Use dependent queries** with `enabled` option
- **Implement proper error boundaries**
- **Add request cancellation** with AbortSignal
- **Log API errors** for debugging

### ❌ DON'T

- **Don't use useState + useEffect** for data fetching
- **Don't manually manage AbortController refs**
- **Don't ignore cancellation errors** in logs
- **Don't fetch in components** - use custom hooks
- **Don't forget to handle empty states**
- **Don't over-fetch** - use proper cache times
- **Don't mutate query data** directly without using QueryClient
- **Don't forget to invalidate queries** after mutations
- **Don't use localStorage** for API state management
- **Don't make sequential requests** when you can use Promise.all

---

## Quick Reference

### Query Keys Convention

```typescript
['resource']                    // List all
['resource', id]                // Single item
['resource', id, 'related']     // Related data
['resource', 'search', query]   // Search
['resource', 'infinite', params] // Infinite scroll
```
