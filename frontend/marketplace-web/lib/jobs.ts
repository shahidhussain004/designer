import apiClient from './api-client';

// ============================================================================
// Types
// ============================================================================

export type JobCategory = {
  id: number;
  name: string;
  slug?: string;
};

export type JobItem = {
  id: string;
  title?: string;
  category?: JobCategory | null;
  budget?: number | null;
  // Extended fields (when API returns full job objects)
  status?: string;
  companyName?: string;
  description?: string;
  jobType?: string;
  location?: string;
  createdAt?: string;
};

export type JobsResponse = {
  jobs: JobItem[];
  totalCount: number;
  page: number;
  size: number;
};

type GetJobsOptions = {
  page?: number;
  size?: number;
  companyId?: string | number | null;
};

// API response can be either Spring Data Page format or legacy format
type ApiResponse = {
  content?: unknown[];
  items?: unknown[];
  totalElements?: number;
  totalCount?: number;
};

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Checks if an item looks like a full job object with extended fields
 */
function isFullJobObject(item: any): boolean {
  return item && (
    item.status !== undefined || 
    item.description !== undefined
  );
}

/**
 * Extracts job items from API response, supporting multiple formats
 */
function extractJobItems(apiResponse: ApiResponse): unknown[] {
  if (Array.isArray(apiResponse.content)) {
    return apiResponse.content;
  }
  if (Array.isArray(apiResponse.items)) {
    return apiResponse.items;
  }
  return [];
}

/**
 * Extracts total count from API response, supporting multiple formats
 */
function extractTotalCount(apiResponse: ApiResponse, fallback: number): number {
  if (typeof apiResponse.totalElements === 'number') {
    return apiResponse.totalElements;
  }
  if (typeof apiResponse.totalCount === 'number') {
    return apiResponse.totalCount;
  }
  return fallback;
}

/**
 * Normalizes job items to ensure consistent structure
 */
function normalizeJobItems(items: unknown[]): JobItem[] {
  if (items.length === 0) {
    return [];
  }

  // If items already have extended fields, return as-is
  if (isFullJobObject(items[0])) {
    return items as JobItem[];
  }

  // Otherwise, map to minimal JobItem structure
  return items.map((item: any) => ({
    id: item.id,
    title: item.title,
    category: item.category || null,
    budget: item.budget ?? null,
  }));
}

/**
 * Fetches data from API using either fetch or axios
 */
async function fetchFromApi(page: number, size: number, companyId?: string | number | null): Promise<ApiResponse> {
  // Use axios client to ensure baseURL, headers and interceptors are applied
  const params: Record<string, any> = { page, pageSize: size };
  if (companyId !== undefined && companyId !== null && companyId !== '') {
    params.companyId = companyId;
  }

  const response = await apiClient.get('/jobs', { params });

  return response.data || {};
}

// ============================================================================
// Main API Function
// ============================================================================

/**
 * Fetches paginated jobs from the API
 * 
 * @param options - Pagination options
 * @returns Promise resolving to jobs response with pagination metadata
 */
export async function getJobs(options?: GetJobsOptions): Promise<JobsResponse> {
  const page = options?.page ?? DEFAULT_PAGE;
  const size = options?.size ?? DEFAULT_SIZE;
  const companyId = options?.companyId ?? null;

  try {
    const apiResponse = await fetchFromApi(page, size, companyId);
    const items = extractJobItems(apiResponse);
    const jobs = normalizeJobItems(items);
    const totalCount = extractTotalCount(apiResponse, jobs.length);

    return {
      jobs,
      totalCount,
      page,
      size,
    };
  } catch (error) {
    // Log error for debugging (apiClient interceptors also log)
    console.error('Failed to fetch jobs:', error);
    
    // Return empty result to prevent UI breakage
    return {
      jobs: [],
      totalCount: 0,
      page,
      size,
    };
  }
}

export default getJobs;