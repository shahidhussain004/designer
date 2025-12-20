/**
 * Integration Test Suite for Designer Marketplace API
 * Tests complete user workflows: registration, job creation, proposals, dashboard
 * 
 * To run: npm test -- tests/integration.test.ts (requires Jest + ts-jest)
 * Or use as reference for manual testing
 */

import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const api = axios.create({ baseURL: API_URL });

// Test data
interface TestUser {
  id?: number;
  email: string;
  username: string;
  password: string;
  fullName: string;
  role: 'CLIENT' | 'FREELANCER';
  token?: string;
  refreshToken?: string;
}

interface TestJob {
  id?: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  experienceLevel: string;
  timelineWeeks: number;
}

// Utility functions
async function registerUser(user: TestUser): Promise<TestUser> {
  const response = await api.post('/auth/register', {
    email: user.email,
    username: user.username,
    password: user.password,
    fullName: user.fullName,
    role: user.role,
  });

  return {
    ...user,
    id: response.data.user.id,
    token: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  };
}

async function login(emailOrUsername: string, password: string) {
  const response = await api.post('/auth/login', {
    emailOrUsername,
    password,
  });

  return response.data;
}

function getAuthHeader(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}

// Test Suites
interface TestProposal {
  id?: number;
  jobId: number;
  freelancerId: number;
  bidAmount: number;
  coverLetter: string;
  estimatedDays: number;
}

describe('Designer Marketplace API - Integration Tests', () => {
  let clientUser: TestUser;
  let freelancerUser: TestUser;
  let createdJob: TestJob;
  let createdProposal: TestProposal;

  // Setup
  beforeAll(async () => {
    console.log('🔄 Setting up test environment...');
  });

  afterAll(async () => {
    console.log('✅ Test suite completed');
  });

  // ==================== AUTHENTICATION TESTS ====================
  describe('Authentication Flow', () => {
    test('Should register a new CLIENT user', async () => {
      const newUser: TestUser = {
        email: `client_${Date.now()}@test.com`,
        username: `client_${Date.now()}`,
        password: 'TestPassword123!',
        fullName: 'Test Client',
        role: 'CLIENT',
      };

      clientUser = await registerUser(newUser);

      expect(clientUser.id).toBeDefined();
      expect(clientUser.token).toBeDefined();
      expect(clientUser.token).toMatch(/^eyJ/); // JWT format check
      expect(clientUser.refreshToken).toBeDefined();
    });

    test('Should register a new FREELANCER user', async () => {
      const newUser: TestUser = {
        email: `freelancer_${Date.now()}@test.com`,
        username: `freelancer_${Date.now()}`,
        password: 'TestPassword123!',
        fullName: 'Test Freelancer',
        role: 'FREELANCER',
      };

      freelancerUser = await registerUser(newUser);

      expect(freelancerUser.id).toBeDefined();
      expect(freelancerUser.token).toBeDefined();
      expect(freelancerUser.refreshToken).toBeDefined();
    });

    test('Should login with email', async () => {
      const response = await login(clientUser.email, clientUser.password);

      expect(response.accessToken).toBeDefined();
      expect(response.refreshToken).toBeDefined();
      expect(response.user.id).toBe(clientUser.id);
      expect(response.user.email).toBe(clientUser.email);

      // Update token for subsequent tests
      clientUser.token = response.accessToken;
    });

    test('Should login with username', async () => {
      const response = await login(freelancerUser.username, freelancerUser.password);

      expect(response.accessToken).toBeDefined();
      expect(response.user.username).toBe(freelancerUser.username);

      freelancerUser.token = response.accessToken;
    });

    test('Should reject login with invalid credentials', async () => {
      try {
        await api.post('/auth/login', {
          emailOrUsername: 'invalid@test.com',
          password: 'wrongpassword',
        });
        throw new Error('Should have thrown error');
      } catch (error) {
        const axiosError = error as import('axios').AxiosError;
        expect(axiosError.response?.status).toBe(401);
      }
    });

    test('Should refresh access token', async () => {
      const response = await api.post(
        '/auth/refresh',
        { refreshToken: clientUser.refreshToken },
        getAuthHeader(clientUser.token!)
      );

      expect(response.data.accessToken).toBeDefined();
      expect(response.data.accessToken).not.toBe(clientUser.token); // Should be new token
      expect(response.data.refreshToken).toBeDefined();
    });
  });

  // ==================== USER TESTS ====================
  describe('User Management', () => {
    test('Should get current user profile', async () => {
      const response = await api.get('/users/me', getAuthHeader(clientUser.token!));

      expect(response.data.id).toBe(clientUser.id);
      expect(response.data.email).toBe(clientUser.email);
      expect(response.data.role).toBe('CLIENT');
    });

    test('Should get user by ID', async () => {
      const response = await api.get(`/users/${clientUser.id}`, getAuthHeader(clientUser.token!));

      expect(response.data.id).toBe(clientUser.id);
      expect(response.data.email).toBe(clientUser.email);
    });

    test('Should get user profile details', async () => {
      const response = await api.get(`/users/${freelancerUser.id}/profile`);

      expect(response.data.id).toBe(freelancerUser.id);
      expect(response.data.fullName).toBe(freelancerUser.fullName);
    });

    test('Should update user profile', async () => {
      const updateData = {
        fullName: 'Updated Name',
        bio: 'Senior developer with 5+ years experience',
      };

      const response = await api.put(
        '/users/me',
        updateData,
        getAuthHeader(clientUser.token!)
      );

      expect(response.data.fullName).toBe(updateData.fullName);
      expect(response.data.bio).toBe(updateData.bio);
    });
  });

  // ==================== JOB TESTS ====================
  describe('Job Management', () => {
    test('Should get all jobs (public endpoint)', async () => {
      const response = await api.get('/jobs');

      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0]).toHaveProperty('title');
      expect(response.data[0]).toHaveProperty('budget');
      expect(response.data[0]).toHaveProperty('clientId');
    });

    test('Should filter jobs by category', async () => {
      const response = await api.get('/jobs?category=WEB_DEVELOPMENT');

      expect(Array.isArray(response.data)).toBe(true);
      response.data.forEach((job: any) => {
        expect(job.category).toBe('WEB_DEVELOPMENT');
      });
    });

    test('Should filter jobs by budget range', async () => {
      const response = await api.get('/jobs?minBudget=1000&maxBudget=5000');

      expect(Array.isArray(response.data)).toBe(true);
      response.data.forEach((job: any) => {
        expect(job.budget).toBeGreaterThanOrEqual(1000);
        expect(job.budget).toBeLessThanOrEqual(5000);
      });
    });

    test('Should get job by ID', async () => {
      const response = await api.get('/jobs/1');

      expect(response.data.id).toBe(1);
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('description');
      expect(response.data).toHaveProperty('clientId');
    });

    test('Should create a new job (CLIENT)', async () => {
      const newJob: TestJob = {
        title: `Integration Test Job ${Date.now()}`,
        description: 'Test job description for integration testing',
        budget: 4500,
        category: 'WEB_DEVELOPMENT',
        experienceLevel: 'INTERMEDIATE',
        timelineWeeks: 8,
      };

      const response = await api.post(
        '/jobs',
        newJob,
        getAuthHeader(clientUser.token!)
      );

      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.title).toBe(newJob.title);
      expect(response.data.budget).toBe(newJob.budget);
      expect(response.data.clientId).toBe(clientUser.id);

      createdJob = { ...newJob, id: response.data.id };
    });

    test('Should update a job (CLIENT)', async () => {
      const updatedJob = {
        title: `Updated Job Title ${Date.now()}`,
        budget: 5500,
        description: 'Updated description',
        category: 'WEB_DESIGN',
        experienceLevel: 'ADVANCED',
        timelineWeeks: 10,
      };

      const response = await api.put(
        `/jobs/${createdJob.id}`,
        updatedJob,
        getAuthHeader(clientUser.token!)
      );

      expect(response.data.title).toBe(updatedJob.title);
      expect(response.data.budget).toBe(updatedJob.budget);
    });

    test('Should get client jobs', async () => {
      const response = await api.get('/jobs/my-jobs', getAuthHeader(clientUser.token!));

      expect(Array.isArray(response.data)).toBe(true);
      response.data.forEach((job: any) => {
        expect(job.clientId).toBe(clientUser.id);
      });
    });
  });

  // ==================== PROPOSAL TESTS ====================
  describe('Proposal Management', () => {
    test('Should submit a proposal (FREELANCER)', async () => {
      const proposal = {
        jobId: createdJob.id,
        coverLetter: 'I am interested in this project and can deliver high-quality results.',
        proposedRate: 4200,
        estimatedDuration: 40,
      };

      const response = await api.post(
        '/proposals',
        proposal,
        getAuthHeader(freelancerUser.token!)
      );

      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.freelancerId).toBe(freelancerUser.id);
      expect(response.data.jobId).toBe(createdJob.id);
      expect(response.data.proposedRate).toBe(proposal.proposedRate);
      expect(response.data.coverLetter).toBe(proposal.coverLetter);

      createdProposal = response.data;
    });

    test('Should get proposals for a job', async () => {
      const response = await api.get(
        `/jobs/${createdJob.id}/proposals`,
        getAuthHeader(clientUser.token!)
      );

      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      const proposal = response.data.find((p: any) => p.id === createdProposal.id);
      expect(proposal).toBeDefined();
      expect(proposal.freelancerId).toBe(freelancerUser.id);
    });

    test('Should get freelancer proposals', async () => {
      const response = await api.get(
        '/proposals/my-proposals',
        getAuthHeader(freelancerUser.token!)
      );

      expect(Array.isArray(response.data)).toBe(true);
      const proposal = response.data.find((p: any) => p.id === createdProposal.id);
      expect(proposal).toBeDefined();
      expect(proposal.freelancerId).toBe(freelancerUser.id);
    });

    test('Should get proposal details', async () => {
      const response = await api.get(
        `/proposals/${createdProposal.id}`,
        getAuthHeader(freelancerUser.token!)
      );

      expect(response.data.id).toBe(createdProposal.id);
      expect(response.data.jobId).toBe(createdJob.id);
      expect(response.data.freelancerId).toBe(freelancerUser.id);
    });

    test('Should accept a proposal (CLIENT)', async () => {
      const response = await api.put(
        `/proposals/${createdProposal.id}/accept`,
        {},
        getAuthHeader(clientUser.token!)
      );

      expect(response.status).toBe(200);
      expect(response.data.status).toBe('ACCEPTED');
    });

    test('Should reject a proposal (CLIENT)', async () => {
      // Create another proposal first
      const proposal = {
        jobId: createdJob.id,
        coverLetter: 'I can also do this project.',
        proposedRate: 3800,
        estimatedDuration: 45,
      };

      const proposalResponse = await api.post(
        '/proposals',
        proposal,
        getAuthHeader(freelancerUser.token!)
      );

      const response = await api.put(
        `/proposals/${proposalResponse.data.id}/reject`,
        {},
        getAuthHeader(clientUser.token!)
      );

      expect(response.data.status).toBe('REJECTED');
    });
  });

  // ==================== DASHBOARD TESTS ====================
  describe('Dashboard Statistics', () => {
    test('Should get CLIENT dashboard stats', async () => {
      const response = await api.get(
        '/dashboard/client',
        getAuthHeader(clientUser.token!)
      );

      expect(response.data).toHaveProperty('stats');
      expect(response.data).toHaveProperty('activeJobs');
      expect(response.data).toHaveProperty('recentProposals');
      expect(response.data.stats).toHaveProperty('totalJobsPosted');
      expect(response.data.stats).toHaveProperty('activeJobs');
      expect(response.data.stats).toHaveProperty('completedJobs');
      expect(typeof response.data.stats.totalJobsPosted).toBe('number');
    });

    test('Should get FREELANCER dashboard stats', async () => {
      const response = await api.get(
        '/dashboard/freelancer',
        getAuthHeader(freelancerUser.token!)
      );

      expect(response.data).toHaveProperty('stats');
      expect(response.data).toHaveProperty('myProposals');
      expect(response.data).toHaveProperty('availableJobs');
      expect(response.data.stats).toHaveProperty('proposalsSubmitted');
      expect(response.data.stats).toHaveProperty('proposalsAccepted');
      expect(response.data.stats).toHaveProperty('completedProjects');
      expect(typeof response.data.stats.proposalsSubmitted).toBe('number');
    });
  });

  // ==================== SECURITY TESTS ====================
  describe('Security & Authorization', () => {
    test('Should reject unauthenticated requests to protected endpoints', async () => {
      try {
        await api.get('/users/me');
        throw new Error('Should have thrown error');
      } catch (error) {
        const axiosError = error as import('axios').AxiosError;
        expect(axiosError.response?.status).toBe(403);
      }
    });

    test('Should reject requests with invalid token', async () => {
      try {
        await api.get('/users/me', {
          headers: {
            Authorization: 'Bearer invalid.token.here',
          },
        });
        throw new Error('Should have thrown error');
      } catch (error) {
        const axiosError = error as import('axios').AxiosError;
        expect(error.response?.status).toBe(403);
      }
    });

    test('Should prevent FREELANCER from creating jobs', async () => {
      try {
        await api.post(
          '/jobs',
          {
            title: 'Test Job',
            description: 'Test',
            budget: 1000,
            category: 'WEB_DEVELOPMENT',
            experienceLevel: 'BEGINNER',
            timelineWeeks: 4,
          },
          getAuthHeader(freelancerUser.token!)
        );
        throw new Error('Should have thrown error');
      } catch (error: any) {
        expect(error.response?.status).toBe(403);
      }
    });

    test('Should have proper CORS headers', async () => {
      const response = await api.get('/jobs', {
        headers: {
          'Origin': 'http://localhost:3001',
        },
      });

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  // ==================== ERROR HANDLING TESTS ====================
  describe('Error Handling', () => {
    test('Should return 403 for non-existent job when unauthenticated', async () => {
      try {
        await api.get('/jobs/999999');
        throw new Error('Should have thrown error');
      } catch (error) {
        const axiosError = error as import('axios').AxiosError;
        expect(axiosError.response?.status).toBe(403);
      }
    });

    test('Should validate required fields on job creation', async () => {
      try {
        await api.post(
          '/jobs',
          { title: 'Test Job' }, // Missing required fields
          getAuthHeader(clientUser.token!)
        );
        throw new Error('Should have thrown error');
      } catch (error) {
        const axiosError = error as import('axios').AxiosError;
        expect(axiosError.response?.status).toBeGreaterThanOrEqual(400);
      }
    });

    test('Should prevent duplicate email registration', async () => {
      try {
        await registerUser(clientUser);
        throw new Error('Should have thrown error');
      } catch (error) {
        const axiosError = error as import('axios').AxiosError;
        expect(axiosError.response?.status).toBeGreaterThanOrEqual(400);
      }
    });
  });

  // ==================== PERFORMANCE TESTS ====================
  describe('Performance', () => {
    test('Should load jobs under 1 second', async () => {
      const startTime = Date.now();
      const response = await api.get('/jobs');
      const duration = Date.now() - startTime;

      expect(response.data).toBeDefined();
      expect(duration).toBeLessThan(1000); // Must complete in under 1 second
    });

    test('Should handle concurrent requests', async () => {
      const promises = Array.from({ length: 10 }).map(() =>
        api.get('/jobs')
      );

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
      });
    });
  });

  // ==================== END-TO-END WORKFLOW ====================
  describe('Complete E2E Workflow', () => {
    test('Should complete full marketplace workflow', async () => {
      // 1. Register users
      console.log('✓ Users registered');

      // 2. Login and get tokens
      expect(clientUser.token).toBeDefined();
      expect(freelancerUser.token).toBeDefined();
      console.log('✓ Users logged in');

      // 3. CLIENT creates job
      expect(createdJob.id).toBeDefined();
      console.log('✓ Job created by CLIENT');

      // 4. FREELANCER browses jobs
      const jobsResponse = await api.get('/jobs');
      expect(jobsResponse.data.length).toBeGreaterThan(0);
      console.log('✓ FREELANCER browsed jobs');

      // 5. FREELANCER submits proposal
      expect(createdProposal.id).toBeDefined();
      console.log('✓ FREELANCER submitted proposal');

      // 6. CLIENT accepts proposal
      const acceptResponse = await api.put(
        `/proposals/${createdProposal.id}/accept`,
        {},
        getAuthHeader(clientUser.token!)
      );
      expect(acceptResponse.data.status).toBe('ACCEPTED');
      console.log('✓ CLIENT accepted proposal');

      // 7. Check dashboards
      const clientDash = await api.get('/dashboard/client', getAuthHeader(clientUser.token!));
      const freelancerDash = await api.get('/dashboard/freelancer', getAuthHeader(freelancerUser.token!));
      expect(clientDash.data.totalJobsPosted).toBeGreaterThan(0);
      expect(freelancerDash.data.proposalsAccepted).toBeGreaterThan(0);
      console.log('✓ Dashboards show updated stats');

      console.log('✅ Complete E2E workflow successful!');
    });
  });
});

// Export for testing frameworks (using export type for isolatedModules)
export type { TestUser, TestJob };
export { registerUser, login, getAuthHeader };

