'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  role: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  experienceLevel: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/jobs');
        if (response.ok) {
          const data = await response.json();
          setJobs(data.content || data || []);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setJobsLoading(false);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">Designer Marketplace</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, <strong>{user.fullName || user.username}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Profile
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details and account information
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.fullName}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Username</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.username}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span
                      className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'FREELANCER'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Role-Specific Dashboard */}
          {user.role === 'CLIENT' ? (
            <ClientDashboardContent jobs={jobs} jobsLoading={jobsLoading} />
          ) : (
            <FreelancerDashboardContent jobs={jobs} jobsLoading={jobsLoading} />
          )}
        </div>
      </main>
    </div>
  );
}

interface DashboardContentProps {
  jobs: Job[];
  jobsLoading: boolean;
}

function ClientDashboardContent({ jobs, jobsLoading }: DashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">-</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Proposals Received</dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">-</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Active Contracts</dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">-</dd>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Available Jobs</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Browse jobs for freelancers</p>
          </div>
          <Link
            href="/jobs/create"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            Post New Job
          </Link>
        </div>
        <div className="border-t border-gray-200">
          {jobsLoading ? (
            <div className="px-4 py-5 sm:px-6 text-gray-600">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-gray-600">No jobs available.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {jobs.slice(0, 5).map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-4 py-4 sm:px-6 block hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {job.description}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-sm font-semibold text-primary-600">${job.budget}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function FreelancerDashboardContent({ jobs, jobsLoading }: DashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Profile Rating</dt>
            <dd className="mt-1 text-3xl font-extrabold text-yellow-500">4.8 ★</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Jobs Completed</dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">-</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
            <dd className="mt-1 text-3xl font-extrabold text-green-600">$-</dd>
          </div>
        </div>
      </div>

      {/* Available Jobs */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Available Jobs</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Browse and apply for jobs that match your skills
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="border-t border-gray-200">
          {jobsLoading ? (
            <div className="px-4 py-5 sm:px-6 text-gray-600">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-gray-600">No jobs available at the moment.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {jobs.slice(0, 5).map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-4 py-4 sm:px-6 block hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {job.description}
                        </p>
                        <p className="mt-2 text-xs text-gray-600">
                          {job.category} • {job.experienceLevel}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 text-right">
                        <p className="text-sm font-semibold text-primary-600">${job.budget}</p>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="mt-2 inline-block px-3 py-1 text-xs font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
                        >
                          View & Propose
                        </Link>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
