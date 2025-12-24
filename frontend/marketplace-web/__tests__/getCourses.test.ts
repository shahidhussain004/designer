import fetch from 'node-fetch';
import { jest } from '@jest/globals';

// Mock environment
process.env.NEXT_PUBLIC_LMS_API = 'http://localhost:8082';

// Import the adapter after setting env
import { getCourses } from '../lib/courses';

// Mock global fetch
global.fetch = jest.fn();

describe('getCourses adapter', () => {
  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it('transforms LMS items -> courses and returns safe defaults', async () => {
    const lmsResponse = {
      items: [
        { id: 'c1', title: 'Intro', description: 'desc', instructorName: 'Alice', price: 9.99, currency: 'USD', thumbnailUrl: null, category: 'Web', level: 'Beginner' }
      ],
      totalCount: 1,
      page: 1,
      pageSize: 20
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => lmsResponse });

    const result = await getCourses({ page: 0, size: 20 });

    expect(result).toHaveProperty('courses');
    expect(Array.isArray(result.courses)).toBe(true);
    expect(result.courses.length).toBe(1);
    expect(result.courses[0].title).toBe('Intro');
    expect(result.totalCount).toBe(1);
    expect(result.page).toBe(0);
    expect(result.size).toBe(20);
  });

  it('returns empty courses array when LMS omits items', async () => {
    const lmsResponse = { totalCount: 0, page: 1, pageSize: 12 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => lmsResponse });

    const result = await getCourses();

    expect(result.courses).toEqual([]);
    expect(result.totalCount).toBe(0);
    expect(result.page).toBe(0);
  });
});
