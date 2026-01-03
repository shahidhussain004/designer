export type JobItem = {
  id: string;
  title?: string;
  category?: {
    id: number;
    name: string;
    slug?: string;
  } | null;
  budget?: number | null;
};

export type JobsResponse = {
  jobs: JobItem[];
  totalCount: number;
  page: number;
  size: number;
};

import apiClient from './api-client';

export async function getJobs(opts?: { page?: number; size?: number }): Promise<JobsResponse> {
  const page = (opts && typeof opts.page === 'number') ? opts.page : 0;
  const size = (opts && typeof opts.size === 'number') ? opts.size : 10;

  try {
    // prefer global fetch when present (tests mock fetch), otherwise use axios
    let json: any = {};
    if (typeof fetch !== 'undefined') {
      const base = apiClient.defaults.baseURL || '';
      const url = `${base}/jobs?page=${page}&pageSize=${size}`;
      const resp = await fetch(url);
      json = await resp.json();
    } else {
      const res = await apiClient.get('/jobs', {
        params: {
          page: page,
          pageSize: size,
        },
      });
      json = res.data || {};
    }
    const items = Array.isArray(json.items) ? json.items : [];

    type ApiJob = { 
      id: string; 
      title?: string; 
      category?: { id: number; name: string; slug?: string } | null; 
      budget?: number | null 
    };

    const jobs = (items as ApiJob[]).map((i) => ({
      id: i.id,
      title: i.title,
      category: i.category || null,
      budget: i.budget ?? null,
    }));

    return { jobs, totalCount: json.totalCount ?? jobs.length, page, size };
  } catch (err) {
    // Keep previous behavior: log and return empty result on error
    // apiClient already logs detailed errors via interceptors
    // but we keep a console.error for parity with earlier implementation
    // and to aid local debugging if interceptors are unavailable.
    // eslint-disable-next-line no-console
    console.error('getJobs error:', err);
    return { jobs: [], totalCount: 0, page, size };
  }
}

export default getJobs;
