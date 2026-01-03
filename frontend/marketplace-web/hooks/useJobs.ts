 'use client';

import { apiClient } from '@/lib/api-client';
import { getJobs } from '@/lib/jobs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// Types
interface Job {
  id: number;
  title: string;
  description: string;
  companyName: string;
  salary: number;
  jobType: string;
  location: string;
  requirements?: string;
  benefits?: string;
  status: string;
  employerId?: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateJobInput {
  title: string;
  description: string;
  companyName: string;
  salary: number;
  jobType: string;
  location: string;
  requirements: string;
  benefits: string;
}

interface UpdateJobInput extends Partial<CreateJobInput> {}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch all jobs
 */
export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async ({ signal }) => {
      // Prefer the library helper `getJobs` (tests mock this). If it's not available
      // for any reason, fall back to using the axios `apiClient` so the app still works.
      try {
        if (typeof getJobs === 'function') {
          const res = await getJobs({ page: 0, size: 10 });
          return res.jobs;
        }
      } catch (err) {
        // swallow and fall back to apiClient below
      }

      const { data } = await apiClient.get<Job[]>('/jobs', { signal });
      return Array.isArray(data) ? data : (data as any).content || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single job by ID
 */
export function useJob(jobId: string | number | null) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async ({ signal }) => {
      if (!jobId) throw new Error('Job ID is required');
      const { data } = await apiClient.get<Job>(`/jobs/${jobId}`, { signal });
      return data;
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch user's job applications
 */
export function useJobApplications() {
  return useQuery({
    queryKey: ['job-applications'],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get('/job-applications', { signal });
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch user's own job applications (my applications)
 */
export function useMyApplications() {
  return useQuery({
    queryKey: ['job-applications', 'my'],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get('/job-applications/my-applications', { signal });
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new job
 */
export function useCreateJob() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: CreateJobInput) => {
      const { data } = await apiClient.post<Job>('/jobs', input);
      return data;
    },
    onSuccess: (newJob) => {
      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      // Add to cache
      queryClient.setQueryData(['job', newJob.id], newJob);
      
      // Navigate to new job
      router.push(`/jobs/${newJob.id}`);
    },
  });
}

/**
 * Update an existing job
 */
export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string | number; input: UpdateJobInput }) => {
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

/**
 * Delete a job
 */
export function useDeleteJob() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string | number) => {
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

/**
 * Apply for a job
 */
export function useApplyForJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationData: { jobId: number; coverLetter: string; resumeUrl?: string }) => {
      const { data } = await apiClient.post('/job-applications', applicationData);
      return data;
    },
    onSuccess: () => {
      // Invalidate applications list
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
    },
  });
}
