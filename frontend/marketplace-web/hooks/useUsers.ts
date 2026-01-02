'use client';

import { apiClient } from '@/lib/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  role?: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  technologies?: string[];
  completionDate?: string;
  displayOrder: number;
  isVisible: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface CreatePortfolioInput {
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  technologies?: string[];
  completionDate?: string;
  isVisible?: boolean;
  displayOrder?: number;
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch user profile
 */
export function useUserProfile(userId: string | number | null) {
  return useQuery({
    queryKey: ['user', userId, 'profile'],
    queryFn: async ({ signal }) => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await apiClient.get<User>(`/users/${userId}/profile`, { signal });
      return data;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch user's portfolio items
 */
export function useUserPortfolio(userId: string | number | null) {
  return useQuery({
    queryKey: ['user', userId, 'portfolio'],
    queryFn: async ({ signal }) => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await apiClient.get<PortfolioItem[]>(`/users/${userId}/portfolio`, { signal });
      return Array.isArray(data) ? data : [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch all users/talents
 */
export function useUsers(filters?: { role?: string; search?: string }) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get('/users', { 
        params: filters,
        signal 
      });
      return Array.isArray(data) ? data : (data as any).content || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create portfolio item
 */
export function useCreatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, input }: { userId: number; input: CreatePortfolioInput }) => {
      const { data } = await apiClient.post<PortfolioItem>(`/users/${userId}/portfolio`, input);
      return data;
    },
    onSuccess: (newItem) => {
      // Invalidate portfolio list
      queryClient.invalidateQueries({ queryKey: ['user', newItem.userId, 'portfolio'] });
    },
  });
}

/**
 * Update portfolio item
 */
export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, itemId, input }: { 
      userId: number; 
      itemId: number; 
      input: Partial<CreatePortfolioInput> 
    }) => {
      const { data } = await apiClient.patch<PortfolioItem>(
        `/users/${userId}/portfolio/${itemId}`, 
        input
      );
      return data;
    },
    onSuccess: (updatedItem) => {
      // Invalidate portfolio list
      queryClient.invalidateQueries({ queryKey: ['user', updatedItem.userId, 'portfolio'] });
    },
  });
}

/**
 * Delete portfolio item
 */
export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, itemId }: { userId: number; itemId: number }) => {
      await apiClient.delete(`/users/${userId}/portfolio/${itemId}`);
      return { userId, itemId };
    },
    onSuccess: ({ userId }) => {
      // Invalidate portfolio list
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'portfolio'] });
    },
  });
}

/**
 * Update user profile
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: number; userData: any }) => {
      const { data } = await apiClient.put(`/users/${userId}`, userData);
      return data;
    },
    onSuccess: (updatedUser) => {
      // Update specific user in cache
      queryClient.setQueryData(['user', updatedUser.id, 'profile'], updatedUser);
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// ============================================================================
// Time Entry Hooks
// ============================================================================

/**
 * Fetch time entries for a freelancer
 */
export function useTimeEntries(freelancerId: number | undefined) {
  return useQuery({
    queryKey: ['timeEntries', 'freelancer', freelancerId],
    queryFn: async () => {
      if (!freelancerId) return [];
      const { data } = await apiClient.get(`/time-entries/freelancer/${freelancerId}`);
      return data || [];
    },
    enabled: !!freelancerId,
  });
}

/**
 * Fetch active contracts
 */
export function useActiveContracts() {
  return useQuery({
    queryKey: ['contracts', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get('/contracts');
      return (data as any[]).filter((c: any) => c.status === 'ACTIVE') || [];
    },
  });
}

/**
 * Create time entry
 */
export function useCreateTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/time-entries', payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate time entries for the freelancer
      queryClient.invalidateQueries({ 
        queryKey: ['timeEntries', 'freelancer', variables.freelancer?.id] 
      });
    },
  });
}

// ============================================================================
// Review Hooks
// ============================================================================

/**
 * Fetch reviews given by a user
 */
export function useGivenReviews(reviewerId: number | undefined) {
  return useQuery({
    queryKey: ['reviews', 'reviewer', reviewerId],
    queryFn: async () => {
      if (!reviewerId) return [];
      const { data } = await apiClient.get(`/reviews/reviewer/${reviewerId}`);
      return data || [];
    },
    enabled: !!reviewerId,
  });
}

/**
 * Fetch reviews received by a user
 */
export function useReceivedReviews(revieweeId: number | undefined) {
  return useQuery({
    queryKey: ['reviews', 'reviewee', revieweeId],
    queryFn: async () => {
      if (!revieweeId) return [];
      const { data } = await apiClient.get(`/reviews/reviewee/${revieweeId}`);
      return data || [];
    },
    enabled: !!revieweeId,
  });
}

/**
 * Fetch completed contracts
 */
export function useCompletedContracts() {
  return useQuery({
    queryKey: ['contracts', 'completed'],
    queryFn: async () => {
      const { data } = await apiClient.get('/contracts');
      return (data as any[]).filter((c: any) => c.status === 'COMPLETED') || [];
    },
  });
}

/**
 * Create review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/reviews', payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate reviews for both reviewer and reviewee
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', 'reviewer', variables.reviewer?.id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', 'reviewee', variables.reviewee?.id] 
      });
    },
  });
}

// ============================================================================
// Contract Hooks
// ============================================================================

/**
 * Fetch all contracts
 */
export function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data } = await apiClient.get('/contracts');
      return data || [];
    },
  });
}
