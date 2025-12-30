import { jest } from '@jest/globals';

// Mock environment (if the adapter uses env)
process.env.NEXT_PUBLIC_MARKETPLACE_API = 'http://localhost:8083';

import { getJobs } from '../lib/jobs';

// Provide a properly typed jest mock for global fetch
global.fetch = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;

describe('getJobs adapter', () => {
  afterEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockReset();
  });

  it('transforms API job items with category object', async () => {
    const apiResponse = {
      items: [
        { 
          id: 'j1', 
          title: 'Design Logo', 
          category: { id: 1, name: 'Web Design', slug: 'web-design' }, 
          budget: 100 
        }
      ],
      totalCount: 1,
      page: 1,
      pageSize: 10
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({ ok: true, json: async () => apiResponse } as unknown as Response);

    const result = await getJobs({ page: 0, size: 10 });

    expect(result).toHaveProperty('jobs');
    expect(Array.isArray(result.jobs)).toBe(true);
    expect(result.jobs.length).toBe(1);
    expect(result.jobs[0].category).toEqual({ id: 1, name: 'Web Design', slug: 'web-design' });
    expect(result.totalCount).toBe(1);
    expect(result.page).toBe(0);
    expect(result.size).toBe(10);
  });

  it('returns empty jobs array when API omits items', async () => {
    const apiResponse = { totalCount: 0, page: 1, pageSize: 10 };
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({ ok: true, json: async () => apiResponse } as unknown as Response);

    const result = await getJobs();

    expect(result.jobs).toEqual([]);
    expect(result.totalCount).toBe(0);
  });
});
