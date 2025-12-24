export type JobItem = {
  id: string;
  title?: string;
  category?: string | null;
  budget?: number | null;
};

export type JobsResponse = {
  jobs: JobItem[];
  totalCount: number;
  page: number;
  size: number;
};

function normalizeCategory(cat?: string | null) {
  if (!cat) return null;
  return cat.trim().toUpperCase().replace(/\s+/g, '_');
}

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
    const jobs = items.map((i: any) => ({
      id: i.id,
      title: i.title,
      category: normalizeCategory(i.category),
      budget: i.budget ?? null,
    }));
    return { jobs, totalCount: json.totalCount ?? jobs.length, page, size };
  } catch (err) {
    return { jobs: [], totalCount: 0, page, size };
  }
}

export default getJobs;
