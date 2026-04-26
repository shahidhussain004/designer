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
  categoryId?: number;
  categoryName?: string;
  companyId?: number;
  companyName?: string;
  jobType: string;
  location: string;
  city?: string;
  state?: string;
  country?: string;
  isRemote?: boolean;
  remoteType?: string;
  salaryMinCents?: number;
  salaryMaxCents?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  showSalary?: boolean;
  requirements?: string;
  responsibilities?: string;
  benefits?: string | Record<string, unknown>;
  perks?: string | Record<string, unknown>;
  requiredSkills?: string | Record<string, unknown>;
  preferredSkills?: string | Record<string, unknown>;
  educationLevel?: string;
  experienceLevel?: string;
  certifications?: string | Record<string, unknown>;
  applicationDeadline?: string;
  applicationEmail?: string;
  applicationUrl?: string;
  applyInstructions?: string;
  startDate?: string;
  positionsAvailable?: number;
  travelRequirement?: string;
  securityClearanceRequired?: boolean;
  visaSponsorship?: boolean;
  status: string;
  viewsCount?: number;
  applicationsCount?: number;
  isFeatured?: boolean;
  isUrgent?: boolean;
  isOwner?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  closedAt?: string;
}

interface CreateJobInput {
  categoryId: number;
  title: string;
  description: string;
  responsibilities?: string;
  requirements: string;
  jobType: string;
  experienceLevel?: string;
  location: string;
  city?: string;
  state?: string;
  country?: string;
  isRemote?: boolean;
  remoteType?: string;
  salaryMinCents?: number;
  salaryMaxCents?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  showSalary?: boolean;
  benefits?: string | string[];
  perks?: string | string[];
  requiredSkills?: string | string[];
  preferredSkills?: string | string[];
  educationLevel?: string;
  certifications?: string | string[];
  applicationDeadline?: string;
  applicationEmail?: string;
  applicationUrl?: string;
  applyInstructions?: string;
  startDate?: string;
  positionsAvailable?: number;
  travelRequirement?: string;
  securityClearanceRequired?: boolean;
  visaSponsorship?: boolean;
  status?: string;
}

type UpdateJobInput = Partial<CreateJobInput>

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch all jobs with optional company filter
 */
export function useJobs(companyId?: string | number | null) {
  return useQuery({
    queryKey: ['jobs', companyId],
    queryFn: async ({ signal }) => {
      // Prefer the library helper `getJobs` (tests mock this). If it's not available
      // for any reason, fall back to using the axios `apiClient` so the app still works.
      try {
        if (typeof getJobs === 'function') {
          const res = await getJobs({ page: 0, size: 10, companyId });
          return res.jobs;
        }
      } catch {
        // swallow and fall back to apiClient below
      }

      const url = companyId ? `/jobs?companyId=${companyId}` : '/jobs';
      const { data } = await apiClient.get<Job[] | { content: Job[] }>(url, { signal });
      return Array.isArray(data) ? data : data.content || [];
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
      try {
        const { data } = await apiClient.get('/job-applications/my-applications', { signal });
        // Extract content array from Spring Data Page response
        if (data?.content && Array.isArray(data.content)) {
          return data.content;
        }
        return [];
      } catch {
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch a single job application by ID
 */
export function useApplication(applicationId: string | number | null) {
  return useQuery({
    queryKey: ['job-application', applicationId],
    queryFn: async ({ signal }) => {
      if (!applicationId) throw new Error('Application ID is required');
      const { data } = await apiClient.get(`/job-applications/${applicationId}`, { signal });
      return data;
    },
    enabled: !!applicationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch current user's company profile
 * Only useful for COMPANY role users
 * @param enabled - Optional flag to conditionally enable the query (defaults to true)
 */
export function useMyCompany(enabled = true) {
  return useQuery({
    queryKey: ['my-company'],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get('/companies/me', { signal });
      return data as { id: number; companyName: string; userId: number; [key: string]: unknown };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry if user isn't a company
    enabled: enabled, // Only run query if enabled
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
      const { data } = await apiClient.post<Job>('/companies/me/jobs', input);
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
 * Update an existing job (company owner only)
 */
export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string | number; input: Partial<CreateJobInput> }) => {
      const { data } = await apiClient.put<Job>(`/companies/me/jobs/${id}`, input);
      return data;
    },
    onSuccess: (updatedJob) => {
      // Update specific job in cache
      queryClient.setQueryData(['job', updatedJob.id], updatedJob);
      queryClient.setQueryData(['job', String(updatedJob.id)], updatedJob);
      
      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-company-jobs'] });
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
      await apiClient.delete(`/companies/me/jobs/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['job', deletedId] });
      
      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      // Navigate away
      router.push('/dashboard/company');
    },
  });
}

/**
 * Publish a job (change status from DRAFT to OPEN)
 */
export function usePublishJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const { data } = await apiClient.post<Job>(`/companies/me/jobs/${id}/publish`);
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
 * Close a job (change status from OPEN to CLOSED)
 */
export function useCloseJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const { data } = await apiClient.post<Job>(`/companies/me/jobs/${id}/close`);
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
 * Mark job as filled (change status to FILLED)
 */
export function useMarkJobAsFilled() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, applicationId }: { id: string | number; applicationId?: number }) => {
      const url = applicationId 
        ? `/companies/me/jobs/${id}/mark-filled?applicationId=${applicationId}`
        : `/companies/me/jobs/${id}/mark-filled`;
      const { data } = await apiClient.post<Job>(url);
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
 * Apply for a job
 */
export function useApplyForJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationData: {
      jobId: number;
      fullName: string;
      email: string;
      phone?: string;
      coverLetter?: string;
      resumeUrl?: string;
      linkedinUrl?: string;
      portfolioUrl?: string;
      answers?: Record<string, any>;
    }) => {
      const { data } = await apiClient.post('/job-applications', applicationData);
      return data;
    },
    onSuccess: () => {
      // Invalidate applications list
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications', 'my'] });
    },
  });
}

/**
 * Get all applications for a specific job (company owner only)
 */
export function useJobApplicationsForCompany(jobId: string | number | null | undefined) {
  return useQuery({
    queryKey: ['company-job-applications', jobId],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get(`/companies/me/jobs/${jobId}/applications`, { signal });
      if (data?.content && Array.isArray(data.content)) {
        return data.content;
      }
      if (Array.isArray(data)) return data;
      return [];
    },
    enabled: !!jobId,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Update the status of a job application (company owner only)
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      companyNotes,
      rejectionReason,
    }: {
      id: number;
      status: string;
      companyNotes?: string;
      rejectionReason?: string;
    }) => {
      const { data } = await apiClient.put(`/job-applications/${id}/status`, {
        status,
        companyNotes,
        rejectionReason,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-application'] });
    },
  });
}

/**
 * Respond to a job offer (freelancer only)
 * Allows freelancer to accept or reject an offer
 */
export function useRespondToOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      response,
      notes,
    }: {
      id: number;
      response: 'ACCEPTED' | 'REJECTED';
      notes?: string;
    }) => {
      const { data } = await apiClient.post(`/job-applications/${id}/respond`, {
        response,
        notes,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['job-application'] });
    },
  });
}

/**
 * Make a formal job offer to a candidate (company only)
 * Includes salary, start date, benefits, and all offer terms
 */
export function useMakeOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      offeredSalaryCents,
      offeredSalaryCurrency,
      offeredSalaryPeriod,
      offeredStartDate,
      offerExpirationDate,
      contractType,
      contractDurationMonths,
      offerBenefits,
      offerAdditionalTerms,
      offerDocumentUrl,
      companyNotes,
    }: {
      id: number;
      offeredSalaryCents: number;
      offeredSalaryCurrency: string;
      offeredSalaryPeriod: string;
      offeredStartDate: string;
      offerExpirationDate: string;
      contractType: string;
      contractDurationMonths?: number;
      offerBenefits?: string;
      offerAdditionalTerms?: string;
      offerDocumentUrl?: string;
      companyNotes?: string;
    }) => {
      const { data } = await apiClient.post(`/job-applications/${id}/offer`, {
        offeredSalaryCents,
        offeredSalaryCurrency,
        offeredSalaryPeriod,
        offeredStartDate,
        offerExpirationDate,
        contractType,
        contractDurationMonths,
        offerBenefits,
        offerAdditionalTerms,
        offerDocumentUrl,
        companyNotes,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-application'] });
    },
  });
}
