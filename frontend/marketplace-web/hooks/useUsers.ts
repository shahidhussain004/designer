'use client';

import { apiClient } from '@/lib/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ============================================================================
// Types
// ============================================================================

interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  role?: string;
  bio?: string;
  location?: string;
  hourlyRate?: number;
  skills?: string;
  experienceYears?: number;
  ratingAvg?: number;
  ratingCount?: number;
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

interface TimeEntry {
  id: number;
  contractId: number;
  freelancerId: number;
  date: string;
  hoursLogged: number;
  description: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
}

interface Review {
  id: number;
  reviewerId: number;
  reviewedUserId: number;
  contractId?: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Contract {
  id: number;
  projectId: number;
  companyId: number;
  freelancerId: number;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  totalAmount: number;
  startDate?: string;
  endDate?: string;
  title?: string; // optional title for display purposes
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

interface UpdateUserInput {
  fullName?: string;
  bio?: string;
  location?: string;
  hourlyRate?: number;
  skills?: string;
  experienceYears?: number;
}

interface CreateTimeEntryInput {
  contractId: number;
  freelancerId: number;
  date: string;
  hoursLogged: number;
  description: string;
}

interface CreateReviewInput {
  reviewedUserId: number;
  contractId?: number;
  rating: number;
  comment: string;
  reviewerId?: number; // optional - server may derive from auth, but allow passing explicitly
  isAnonymous?: boolean;
  categoryRatings?: {
    communication?: number;
    quality?: number;
    timeliness?: number;
    professionalism?: number;
  };
}

interface UsersFilters {
  role?: 'FREELANCER' | 'COMPANY' | 'ADMIN';
  search?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  content?: T[];
  data?: T[];
  page?: number;
  totalPages?: number;
  totalElements?: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Normalize API response to always return an array
 */
function normalizeArrayResponse<T>(data: T[] | PaginatedResponse<T>): T[] {
  if (Array.isArray(data)) return data;
  return data.content || data.data || [];
}

/**
 * Build query params, removing undefined/null values
 */
function buildQueryParams(params: Record<string, any>): Record<string, any> {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
}

// ============================================================================
// User Query Hooks
// ============================================================================

/**
 * Fetch user profile by ID
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
 * Fetch company profile by ID
 */
export function useCompanyProfile(companyId: string | number | null) {
  return useQuery({
    queryKey: ['company', companyId, 'profile'],
    queryFn: async ({ signal }) => {
      if (!companyId) throw new Error('Company ID is required');
      const { data } = await apiClient.get<User>(`/companies/${companyId}`, { signal });
      return data;
    },
    enabled: !!companyId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch all users with optional filters
 */
export function useUsers(filters?: UsersFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async ({ signal }) => {
      // Use specialized endpoint for freelancers
      const endpoint = filters?.role === 'FREELANCER' 
        ? '/users/freelancers' 
        : '/users';
      
      const params = buildQueryParams({
        search: filters?.search,
        role: filters?.role !== 'FREELANCER' ? filters?.role : undefined,
        page: filters?.page,
        limit: filters?.limit,
      });

      const { data } = await apiClient.get<User[] | PaginatedResponse<User>>(
        endpoint,
        { params, signal }
      );

      return normalizeArrayResponse(data);
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Search users (with debouncing handled by component)
 */
export function useUserSearch(searchQuery: string, options?: { role?: string }) {
  return useQuery({
    queryKey: ['users', 'search', searchQuery, options],
    queryFn: async ({ signal }) => {
      if (!searchQuery || searchQuery.length < 2) return [];
      
      const params = buildQueryParams({
        search: searchQuery,
        role: options?.role,
      });

      const { data } = await apiClient.get<User[] | PaginatedResponse<User>>(
        '/users/search',
        { params, signal }
      );
      return normalizeArrayResponse(data);
    },
    enabled: searchQuery.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// ============================================================================
// Portfolio Query Hooks
// ============================================================================

/**
 * Fetch user's portfolio items
 */
export function useUserPortfolio(userId: string | number | null) {
  return useQuery({
    queryKey: ['user', userId, 'portfolio'],
    queryFn: async ({ signal }) => {
      if (!userId) throw new Error('User ID is required');
      const { data } = await apiClient.get<PortfolioItem[] | PaginatedResponse<PortfolioItem>>(
        `/users/${userId}/portfolio-items`,
        { signal }
      );
      return normalizeArrayResponse(data);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// User Mutation Hooks
// ============================================================================

/**
 * Update user profile
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: number; userData: UpdateUserInput }) => {
      const { data } = await apiClient.put<User>(`/users/${userId}`, userData);
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
// Portfolio Mutation Hooks
// ============================================================================

/**
 * Create portfolio item
 */
export function useCreatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, input }: { userId: number; input: CreatePortfolioInput }) => {
      const { data } = await apiClient.post<PortfolioItem>(
        `/portfolio-items`,
        { ...input, userId }
      );
      return data;
    },
    onSuccess: (newItem) => {
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
    mutationFn: async ({ 
      userId, 
      itemId, 
      input 
    }: { 
      userId: number; 
      itemId: number; 
      input: Partial<CreatePortfolioInput>;
    }) => {
      const { data } = await apiClient.patch<PortfolioItem>(
        `/users/${userId}/portfolio/${itemId}`,
        input
      );
      return data;
    },
    onSuccess: (updatedItem) => {
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
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'portfolio'] });
    },
  });
}

// ============================================================================
// Time Entry Query Hooks
// ============================================================================

/**
 * Fetch time entries for a freelancer
 */
export function useTimeEntries(freelancerId: number | null) {
  return useQuery({
    queryKey: ['timeEntries', 'freelancer', freelancerId],
    queryFn: async ({ signal }) => {
      if (!freelancerId) throw new Error('Freelancer ID is required');
      const { data } = await apiClient.get<TimeEntry[] | PaginatedResponse<TimeEntry>>(
        `/users/${freelancerId}/time-entries`,
        { signal }
      );
      return normalizeArrayResponse(data);
    },
    enabled: !!freelancerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch time entries for a specific contract
 */
export function useContractTimeEntries(contractId: number | null) {
  return useQuery({
    queryKey: ['timeEntries', 'contract', contractId],
    queryFn: async ({ signal }) => {
      if (!contractId) throw new Error('Contract ID is required');
      const { data } = await apiClient.get<TimeEntry[] | PaginatedResponse<TimeEntry>>(
        `/contracts/${contractId}/time-entries`,
        { signal }
      );
      return normalizeArrayResponse(data);
    },
    enabled: !!contractId,
    staleTime: 2 * 60 * 1000,
  });
}

// ============================================================================
// Time Entry Mutation Hooks
// ============================================================================

/**
 * Create time entry
 */
export function useCreateTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTimeEntryInput) => {
      const { data } = await apiClient.post<TimeEntry>('/time-entries', input);
      return data;
    },
    onSuccess: (newEntry) => {
      // Invalidate time entries for both freelancer and contract
      queryClient.invalidateQueries({ 
        queryKey: ['timeEntries', 'freelancer', newEntry.freelancerId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['timeEntries', 'contract', newEntry.contractId] 
      });
    },
  });
}

/**
 * Update time entry
 */
export function useUpdateTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      entryId, 
      input 
    }: { 
      entryId: number; 
      input: Partial<CreateTimeEntryInput>;
    }) => {
      const { data } = await apiClient.patch<TimeEntry>(
        `/time-entries/${entryId}`,
        input
      );
      return data;
    },
    onSuccess: (updatedEntry) => {
      queryClient.invalidateQueries({ 
        queryKey: ['timeEntries', 'freelancer', updatedEntry.freelancerId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['timeEntries', 'contract', updatedEntry.contractId] 
      });
    },
  });
}

/**
 * Delete time entry
 */
export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: number) => {
      await apiClient.delete(`/time-entries/${entryId}`);
      return entryId;
    },
    onSuccess: () => {
      // Invalidate all time entries - we don't have the IDs to be more specific
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
    },
  });
}

// ============================================================================
// Review Query Hooks
// ============================================================================

/**
 * Fetch reviews given by a user
 */
export function useGivenReviews(reviewerId: number | null) {
  return useQuery({
    queryKey: ['reviews', 'reviewer', reviewerId],
    queryFn: async ({ signal }) => {
      if (!reviewerId) throw new Error('Reviewer ID is required');
      const { data } = await apiClient.get<Review[] | PaginatedResponse<Review>>(
        `/users/${reviewerId}/reviews-given`,
        { signal }
      );
      return normalizeArrayResponse(data);
    },
    enabled: !!reviewerId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch reviews received by a user
 */
export function useReceivedReviews(reviewedUserId: number | null) {
  return useQuery({
    queryKey: ['reviews', 'reviewee', reviewedUserId],
    queryFn: async ({ signal }) => {
      if (!reviewedUserId) throw new Error('Reviewed user ID is required');
      const { data } = await apiClient.get<Review[] | PaginatedResponse<Review>>(
        `/users/${reviewedUserId}/reviews`,
        { signal }
      );
      return normalizeArrayResponse(data);
    },
    enabled: !!reviewedUserId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch reviews for a specific contract
 */
export function useContractReviews(contractId: number | null) {
  return useQuery({
    queryKey: ['reviews', 'contract', contractId],
    queryFn: async ({ signal }) => {
      if (!contractId) throw new Error('Contract ID is required');
      const { data } = await apiClient.get<Review[] | PaginatedResponse<Review>>(
        `/reviews/contract/${contractId}`,
        { signal }
      );
      return normalizeArrayResponse(data);
    },
    enabled: !!contractId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Review Mutation Hooks
// ============================================================================

/**
 * Create review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const { data } = await apiClient.post<Review>('/reviews', input);
      return data;
    },
    onSuccess: (newReview) => {
      // Invalidate reviews for both reviewer and reviewee
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', 'reviewer', newReview.reviewerId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', 'reviewee', newReview.reviewedUserId] 
      });
      
      // Invalidate contract reviews if applicable
      if (newReview.contractId) {
        queryClient.invalidateQueries({ 
          queryKey: ['reviews', 'contract', newReview.contractId] 
        });
      }
      
      // Invalidate user profile to update rating
      queryClient.invalidateQueries({ 
        queryKey: ['user', newReview.reviewedUserId, 'profile'] 
      });
    },
  });
}

/**
 * Update review
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      reviewId, 
      input 
    }: { 
      reviewId: number; 
      input: Partial<CreateReviewInput>;
    }) => {
      const { data } = await apiClient.patch<Review>(`/reviews/${reviewId}`, input);
      return data;
    },
    onSuccess: (updatedReview) => {
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', 'reviewer', updatedReview.reviewerId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', 'reviewee', updatedReview.reviewedUserId] 
      });
      if (updatedReview.contractId) {
        queryClient.invalidateQueries({ 
          queryKey: ['reviews', 'contract', updatedReview.contractId] 
        });
      }
    },
  });
}

/**
 * Delete review
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: number) => {
      await apiClient.delete(`/reviews/${reviewId}`);
      return reviewId;
    },
    onSuccess: () => {
      // Invalidate all reviews - we don't have the IDs to be more specific
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

// ============================================================================
// Contract Query Hooks
// ============================================================================

/**
 * Fetch all contracts
 */
export function useContracts(filters?: { status?: Contract['status'] }) {
  return useQuery({
    queryKey: ['contracts', filters],
    queryFn: async ({ signal }) => {
      const params = buildQueryParams(filters || {});
      const { data } = await apiClient.get<Contract[] | PaginatedResponse<Contract>>(
        '/contracts',
        { params, signal }
      );
      return normalizeArrayResponse(data);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch active contracts
 */
export function useActiveContracts() {
  return useContracts({ status: 'ACTIVE' });
}

/**
 * Fetch completed contracts
 */
export function useCompletedContracts() {
  return useContracts({ status: 'COMPLETED' });
}

/**
 * Fetch single contract by ID
 */
export function useContract(contractId: number | null) {
  return useQuery({
    queryKey: ['contract', contractId],
    queryFn: async ({ signal }) => {
      if (!contractId) throw new Error('Contract ID is required');
      const { data } = await apiClient.get<Contract>(`/contracts/${contractId}`, { signal });
      return data;
    },
    enabled: !!contractId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch contracts for a specific user
 */
export function useUserContracts(
  userId: number | null,
  role?: 'COMPANY' | 'FREELANCER'
) {
  return useQuery({
    queryKey: ['contracts', 'user', userId, role],
    queryFn: async ({ signal }) => {
      if (!userId) throw new Error('User ID is required');
      const endpoint = role === 'COMPANY' 
        ? `/users/${userId}/contracts`
        : role === 'FREELANCER'
          ? `/users/${userId}/contracts`
          : `/users/${userId}/contracts`;
          
      const { data } = await apiClient.get<Contract[] | PaginatedResponse<Contract>>(
        endpoint,
        { signal }
      );
      return normalizeArrayResponse(data);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}