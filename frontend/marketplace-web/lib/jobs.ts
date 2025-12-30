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

export async function getJobs(opts?: { page?: number; size?: number }): Promise<JobsResponse> {
  const page = (opts && typeof opts.page === 'number') ? opts.page : 0;
  const size = (opts && typeof opts.size === 'number') ? opts.size : 10;
  const base = process.env.NEXT_PUBLIC_MARKETPLACE_API || '';
  const url = `${base}/jobs?page=${page + 1}&pageSize=${size}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return { jobs: [], totalCount: 0, page, size };
    const json = await res.json();
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
      console.error('getJobs error:', err);
      return { jobs: [], totalCount: 0, page, size };
  }
}

export default getJobs;
