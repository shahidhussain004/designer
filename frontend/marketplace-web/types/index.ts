export interface User {
  id: number;
  email: string;
  username: string;
  fullName?: string;
  role: 'COMPANY' | 'FREELANCER' | 'ADMIN';
  bio?: string;
  profileImageUrl?: string;
  location?: string;
  hourlyRate?: number;
  skills?: string[];
  portfolioUrl?: string;
  ratingAvg?: number;
  ratingCount?: number;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  category?: {
    id: number;
    name: string;
    slug?: string;
  };
  requiredSkills?: string[];
  budget?: number;
  budgetType: 'FIXED' | 'HOURLY';
  duration?: number;
  experienceLevel?: {
    id: number;
    name: string;
  };
  status: 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'CLOSED';
  companyId: number;
  viewCount?: number;
  proposalCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  id: number;
  jobId: number;
  freelancerId: number;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration?: number;
  status: 'DRAFT' | 'SUBMITTED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
