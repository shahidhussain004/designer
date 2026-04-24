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
function isFullJobObject(item: unknown): boolean {
  if (!item || typeof item !== 'object') return false;
  const it = item as Record<string, unknown>;
  return it.status !== undefined || it.description !== undefined;
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
  return items.map((item: unknown) => {
    const it = item as Record<string, unknown>;
    const id = typeof it.id === 'string' || typeof it.id === 'number' ? String(it.id) : '';
    const title = typeof it.title === 'string' ? it.title : undefined;
    const category = (it.category as JobCategory) ?? null;
    const budget = typeof it.budget === 'number' ? (it.budget as number) : null;
    return { id, title, category, budget } as JobItem;
  });
}

/**
 * Fetches data from API using either fetch or axios
 */
async function fetchFromApi(page: number, size: number, companyId?: string | number | null): Promise<ApiResponse> {
  // Use axios client to ensure baseURL, headers and interceptors are applied
  const params: Record<string, unknown> = { page, pageSize: size };
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

// ============================================================================
// Saved Jobs API Functions
// ============================================================================

export type SavedJobResponse = {
  savedJobId: number;
  savedAt: string;
  job: JobItem;
};

/**
 * Save/favorite a job
 * @param jobId - The ID of the job to save
 */
export async function saveJob(jobId: string | number): Promise<SavedJobResponse> {
  const response = await apiClient.post(`/saved-jobs/${jobId}`);
  return response.data;
}

/**
 * Unsave/unfavorite a job
 * @param jobId - The ID of the job to unsave
 */
export async function unsaveJob(jobId: string | number): Promise<void> {
  await apiClient.delete(`/saved-jobs/${jobId}`);
}

/**
 * Get all saved jobs for the current user
 */
export async function getSavedJobs(): Promise<SavedJobResponse[]> {
  const response = await apiClient.get('/saved-jobs');
  return response.data;
}

/**
 * Check if a job is saved
 * @param jobId - The ID of the job to check
 */
export async function checkSavedStatus(jobId: string | number): Promise<boolean> {
  const response = await apiClient.get(`/saved-jobs/${jobId}/status`);
  return response.data.isSaved;
}

/**
 * Get count of saved jobs
 */
export async function getSavedJobsCount(): Promise<number> {
  const response = await apiClient.get('/saved-jobs/count');
  return response.data.count;
}