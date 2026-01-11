'use client';

import { apiClient } from '@/lib/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    displayOrder: number;
  };
  experienceLevel: {
    id: number;
    name: string;
    code: string;
    description: string;
    yearsMin: number;
    yearsMax: number;
    displayOrder: number;
  };
  budget: number;
  status: string;
  createdAt: string;
  company: {
    id: number;
    username: string;
    fullName: string;
    profileImageUrl: string | null;
    location: string | null;
    ratingAvg: number;
    ratingCount: number;
  };
}

interface ProjectFilters {
  categoryId?: string;
  experienceLevelId?: string;
  minBudget?: string;
  maxBudget?: string;
  search?: string;
}

interface CreateProjectInput {
  title: string;
  description: string;
  categoryId: number;
  experienceLevelId: number;
  budget: number;
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
      const params: Record<string, any> = {};
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
