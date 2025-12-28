import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { withAppRouter } from './testUtils';

jest.mock('../lib/jobs', () => ({
  getJobs: async () => ({ jobs: [], totalCount: 0, page: 0, size: 10 })
}));

describe('Jobs Page', () => {
  beforeEach(() => {
    // Mock all fetch calls
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no jobs', async () => {
    // Mock fetch for job-categories
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: [] })
      })
      // Mock fetch for experience-levels
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: [] })
      })
      // Mock fetch for jobs - empty list
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: [] })
      });

    // dynamic import to avoid module-level hook runs
    const JobsModule = await import('../app/jobs/page');
    const JobsPage = JobsModule.default;
    render(withAppRouter(React.createElement(JobsPage), { pathname: '/jobs' }));
    const emptyText = await screen.findByText(/no jobs found/i);
    expect(emptyText).toBeInTheDocument();
  });
});
