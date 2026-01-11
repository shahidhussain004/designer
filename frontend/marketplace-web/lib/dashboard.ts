import apiClient from './api-client';
import type { ExperienceLevel, PostCategory } from './apiTypes';
import { authService } from './auth';

export interface DashboardStats {
  totalJobsPosted?: number;
  openJobs?: number;
  filledJobs?: number;
  totalApplicationsReceived?: number;
  completedJobs?: number;
  totalProposalsReceived?: number;
  pendingProposals?: number;
  proposalsSubmitted?: number;
  proposalsAccepted?: number;
  activeProposals?: number;
  totalProjectsPosted?: number;
  activeProjects?: number;
  completedProjects?: number;
  totalEarnings?: number;
  avgRating?: number;
}

export interface JobSummary {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string | PostCategory;
  experienceLevel: string | ExperienceLevel;
  status: string;
  proposalCount: number;
  createdAt: string;
}

export interface ProjectSummary {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string | PostCategory;
  experienceLevel: string | ExperienceLevel;
  status: string;
  createdAt: string;
  client?: {
    id: number;
    username: string;
    fullName: string;
    profileImageUrl?: string | null;
  };
}

export interface ProposalSummary {
  id: number;
  jobId: number;
  jobTitle: string;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: number;
  status: string;
  createdAt: string;
}

export interface JobApplicationSummary {
  id: number;
  jobId: number;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  status: string;
  createdAt: string;
}

export interface ClientDashboard {
  stats: DashboardStats;
  activeProjects: ProjectSummary[];
  completedProjects: ProjectSummary[];
  openJobs: JobSummary[];
  recentProposals: ProposalSummary[];
  recentApplications: JobApplicationSummary[];
}

export interface FreelancerDashboard {
  stats: DashboardStats;
  myProposals: ProposalSummary[];
  availableJobs: JobSummary[];
  availableProjects?: ProjectSummary[];
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

/**
 * Dashboard API service
 */
export const dashboardService = {
  /**
   * Get client dashboard data
   */
  async getClientDashboard(): Promise<ClientDashboard> {
    const response = await apiClient.get<ClientDashboard>('/dashboard/client');
    return response.data;
  },

  /**
   * Get freelancer dashboard data
   */
  async getFreelancerDashboard(): Promise<FreelancerDashboard> {
    const response = await apiClient.get<FreelancerDashboard>('/dashboard/freelancer');
    return response.data;
  },

  /**
   * Get user notifications
   */
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },

  /**
   * Get current user's jobs (CLIENT only)
   */
  async getMyJobs(page = 0, size = 20): Promise<{ content: JobSummary[]; totalElements: number }> {
    const response = await apiClient.get('/jobs/my-jobs', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get current user's proposals (FREELANCER only)
   */
  async getMyProposals(page = 0, size = 20): Promise<{ content: ProposalSummary[]; totalElements: number }> {
    const response = await apiClient.get('/proposals/my-proposals', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get available jobs (public listing) - fallback for dashboard
   */
  async getAvailableJobs(page = 0, size = 20): Promise<{ content: JobSummary[]; totalElements: number }> {
    const response = await apiClient.get('/jobs', {
      params: { page, size },
    });
    return response.data;
  },
};

/**
 * Get dashboard data based on user role
 */
export async function getDashboardData() {
  const user = authService.getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  if (user.role === 'CLIENT') {
    return dashboardService.getClientDashboard();
  } else if (user.role === 'FREELANCER') {
    return dashboardService.getFreelancerDashboard();
  } else {
    throw new Error('Invalid user role');
  }
}
