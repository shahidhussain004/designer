import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { withAppRouter } from './testUtils';

jest.mock('../lib/jobs', () => ({
  getJobs: async () => ({ jobs: [], totalCount: 0, page: 0, size: 10 })
}));

describe('Jobs Page', () => {
  it('renders empty state when no jobs', async () => {
    // Mock fetch to return an empty content list
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ content: [] }) });
    // lazy-import to avoid module-level hook runs
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const JobsPage = require('../app/jobs/page').default;
    render(withAppRouter(React.createElement(JobsPage), { pathname: '/jobs' }));
    const emptyText = await screen.findByText(/no jobs found/i);
    expect(emptyText).toBeInTheDocument();
  });
});
