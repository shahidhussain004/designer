import { jest } from '@jest/globals';

// Mock axios client before importing getJobs
jest.mock('../lib/api-client');

import apiClient from '../lib/api-client';
import { getJobs } from '../lib/jobs';

describe('getJobs adapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      page: 0,
      pageSize: 10
    };

    const mockedGet = jest.fn() as jest.MockedFunction<(...args: any[]) => Promise<{ data: typeof apiResponse }>>;
    mockedGet.mockResolvedValueOnce({ data: apiResponse });
    const mockedApiClient = apiClient as unknown as { get: typeof mockedGet };
    mockedApiClient.get = mockedGet;

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
    const apiResponse = { totalCount: 0, page: 0, pageSize: 10 };
    const mockedGet = jest.fn() as jest.MockedFunction<(...args: any[]) => Promise<{ data: typeof apiResponse }>>;
    mockedGet.mockResolvedValueOnce({ data: apiResponse });
    const mockedApiClient = apiClient as unknown as { get: typeof mockedGet };
    mockedApiClient.get = mockedGet;

    const result = await getJobs();

    expect(result.jobs).toEqual([]);
    expect(result.totalCount).toBe(0);
  });
});
