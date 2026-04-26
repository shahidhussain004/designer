'use client';

import { apiClient } from '@/lib/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
export interface Project {
  id: string | number;
  companyId?: number;
  title: string;
  description: string;
  scopeOfWork?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    displayOrder: number;
  };
  projectCategory?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    displayOrder: number;
  };
  experienceLevel?: {
    id: number;
    name: string;
    code: string;
    description: string;
    yearsMin: number;
    yearsMax: number;
    displayOrder: number;
  };
  experienceLevelCode?: string;
  projectType?: string;
  priorityLevel?: string;
  timeline?: string;
  estimatedDurationDays?: number;
  budget?: number;
  budgetAmountCents?: number;
  budgetMinCents?: number;
  budgetMaxCents?: number;
  minBudget?: number;
  maxBudget?: number;
  budgetType?: string;
  currency?: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  status: string;
  visibility?: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
  viewsCount?: number;
  proposalCount?: number;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  closedAt?: string;
  company?: {
    id: number;
    username: string;
    fullName: string;
    profileImageUrl: string | null;
    location: string | null;
    ratingAvg?: number;
    ratingCount?: number;
  };
}

interface ProjectFilters {
  categoryId?: string;
  experienceLevelId?: string;
  minBudget?: string;
  maxBudget?: string;
  search?: string;
}

interface ScreeningQuestion {
  question: string;
  required: boolean;
}

interface CreateProjectInput {
  title: string;
  description: string;
  categoryId: number;
  projectType?: string;
  experienceLevel?: string;
  priorityLevel?: string;
  timeline?: string;
  budgetType: 'FIXED' | 'HOURLY';
  budgetAmountCents?: number;
  hourlyRateMinCents?: number;
  hourlyRateMaxCents?: number;
  estimatedHours?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  maxProposals?: number;
  deliverables?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  screeningQuestions?: ScreeningQuestion[];
  status?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
}

interface ProposalInput {
  projectId: number;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration?: number;
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch all projects with filters
 */
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async ({ signal }) => {
      const params: Record<string, string | number> = {};
      if (filters?.categoryId) params.categoryId = filters.categoryId;
      if (filters?.experienceLevelId) params.experienceLevelId = filters.experienceLevelId;
      if (filters?.minBudget) params.minBudget = filters.minBudget;
      if (filters?.maxBudget) params.maxBudget = filters.maxBudget;
      if (filters?.search) params.search = filters.search;

      const { data } = await apiClient.get('/projects', { params, signal });
      return data.content || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch single project by ID
 */
export function useProject(projectId: string | number | null) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async ({ signal }) => {
      if (!projectId) throw new Error('Project ID is required');
      const { data } = await apiClient.get(`/projects/${projectId}`, { signal });
      return data;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch project categories
 */
export function useProjectCategories() {
  return useQuery({
    queryKey: ['project-categories'],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get('/project-categories', { signal });
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch experience levels
 */
export function useExperienceLevels() {
  return useQuery({
    queryKey: ['experience-levels'],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get('/experience-levels', { signal });
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { data } = await apiClient.post('/projects', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

/**
 * Update existing project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: Partial<CreateProjectInput> }) => {
      const { data } = await apiClient.put(`/projects/${id}`, input);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });
}

/**
 * Delete project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: number) => {
      await apiClient.delete(`/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
    },
  });
}

/**
 * Update project status (OPEN, CLOSED, IN_PROGRESS, etc.)
 */
export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await apiClient.patch(`/projects/${id}/status`, null, {
        params: { status }
      });
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
    },
  });
}

/**
 * Submit proposal for project
 */
export function useSubmitProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProposalInput) => {
      const { data } = await apiClient.post('/proposals', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

// ============================================================================
// Proposal Types
// ============================================================================

interface FreelancerInfo {
  id: number;
  username: string;
  fullName: string;
  profileImageUrl: string | null;
  location: string | null;
  bio: string | null;
  hourlyRate: number | null;
  skills: string[];
  portfolioUrl: string | null;
  ratingAvg: number;
  ratingCount: number;
}

interface Proposal {
  id: number;
  projectId: number;
  projectTitle: string;
  freelancer: FreelancerInfo;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: number;
  status: 'SUBMITTED' | 'REVIEWING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  companyMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Proposal Hooks (for Company)
// ============================================================================

/**
 * Fetch proposals for a specific project (company view)
 */
export function useProjectProposals(projectId: string | number | null) {
  return useQuery({
    queryKey: ['project-proposals', projectId],
    queryFn: async ({ signal }) => {
      if (!projectId) throw new Error('Project ID is required');
      const { data } = await apiClient.get(`/projects/${projectId}/proposals`, { 
        params: { page: 0, size: 100 },
        signal 
      });
      // Extract content array from Spring Data Page response
      if (data?.content && Array.isArray(data.content)) {
        return data.content as Proposal[];
      }
      // Fallback: if response is directly an array
      if (Array.isArray(data)) {
        return data as Proposal[];
      }
      // Default to empty array
      return [];
    },
    enabled: !!projectId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Update proposal status (accept, reject, shortlist)
 */
export function useUpdateProposalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      proposalId, 
      status, 
      companyMessage 
    }: { 
      proposalId: number; 
      status: string; 
      companyMessage?: string;
    }) => {
      const { data } = await apiClient.put(`/proposals/${proposalId}/status`, {
        status,
        companyMessage,
      });
      return data;
    },
    onSuccess: (_, { proposalId }) => {
      queryClient.invalidateQueries({ queryKey: ['project-proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', proposalId] });
    },
  });
}

/**
 * Accept a proposal (convenience hook)
 */
export function useAcceptProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposalId: number) => {
      const { data } = await apiClient.put(`/proposals/${proposalId}/accept`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-proposals'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

/**
 * Reject a proposal (convenience hook)
 */
export function useRejectProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ proposalId, reason }: { proposalId: number; reason?: string }) => {
      const { data } = await apiClient.put(`/proposals/${proposalId}/reject`, { 
        rejectionReason: reason 
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-proposals'] });
    },
  });
}

/**
 * Fetch current user's projects (company dashboard)
 */
export function useMyProjects(page = 0, size = 20) {
  return useQuery({
    queryKey: ['my-projects', page, size],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get('/projects/my-projects', {
        params: { page, size },
        signal
      });
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
