'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  experienceLevel: string;
  clientId?: number;
  createdAt?: string;
}

export default function JobsBrowsePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    experienceLevel: '',
    minBudget: '',
    maxBudget: '',
    searchTerm: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
      if (filters.minBudget) params.append('minBudget', filters.minBudget);
      if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
      if (filters.searchTerm) params.append('search', filters.searchTerm);

      const response = await fetch(
        `http://localhost:8080/api/jobs?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.content || data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange(e);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Browse Jobs</h1>
          <p className="text-lg text-primary-100">
            Find the perfect project that matches your skills
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Jobs
              </label>
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleSearch}
                placeholder="Keywords..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                <option value="WEB_DESIGN">Web Design</option>
                <option value="GRAPHIC_DESIGN">Graphic Design</option>
                <option value="MOBILE_DEV">Mobile Development</option>
                <option value="WEB_DEV">Web Development</option>
                <option value="DATA_ENTRY">Data Entry</option>
                <option value="WRITING">Writing</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={filters.experienceLevel}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            {/* Budget Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Budget
              </label>
              <input
                type="number"
                name="minBudget"
                value={filters.minBudget}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Budget
              </label>
              <input
                type="number"
                name="maxBudget"
                value={filters.maxBudget}
                onChange={handleFilterChange}
                placeholder="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <button
              onClick={() =>
                setFilters({
                  category: '',
                  experienceLevel: '',
                  minBudget: '',
                  maxBudget: '',
                  searchTerm: '',
                })
              }
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>

          {/* Jobs List */}
          <div className="md:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                Error: {error}
              </div>
            )}

            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600">No jobs found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Showing {jobs.length} job(s)
                </p>
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-primary-600"
                  >
                    <Link href={`/jobs/${job.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 mb-2 cursor-pointer">
                        {job.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {job.category}
                        </span>
                      )}
                      {job.experienceLevel && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {job.experienceLevel}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          ${job.budget}
                        </p>
                        {job.createdAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
