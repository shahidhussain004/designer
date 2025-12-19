'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { getDashboardData, ClientDashboard, FreelancerDashboard } from '@/lib/dashboard';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<ClientDashboard | FreelancerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, [router]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;

      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        console.error('Error fetching dashboard:', err);
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!user || !dashboardData) {
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
            <ClientDashboardContent data={dashboardData as ClientDashboard} />
          ) : (
            <FreelancerDashboardContent data={dashboardData as FreelancerDashboard} />
          )}
        </div>
      </main>
    </div>
  );
}

interface ClientDashboardProps {
  data: ClientDashboard;
}

function ClientDashboardContent({ data }: ClientDashboardProps) {
  const { stats, activeJobs, recentProposals } = data;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">{stats.activeJobs || 0}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Proposals Received</dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">{stats.totalProposalsReceived || 0}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Completed Jobs</dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">{stats.completedJobs || 0}</dd>
          </div>
        </div>
      </div>

      {/* Active Jobs */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Active Jobs</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Jobs you have posted</p>
          </div>
          <Link
            href="/jobs/create"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            Post New Job
          </Link>
        </div>
        <div className="border-t border-gray-200">
          {activeJobs.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-gray-600">No active jobs.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {activeJobs.map((job) => (
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
                        <p className="mt-1 text-xs text-gray-500">
                          {job.proposalCount} proposals
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

interface FreelancerDashboardProps {
  data: FreelancerDashboard;
}

function FreelancerDashboardContent({ data }: FreelancerDashboardProps) {
  const { stats, myProposals, availableJobs } = data;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Proposals Submitted</dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">{stats.proposalsSubmitted || 0}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Proposals Accepted</dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">{stats.proposalsAccepted || 0}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Completed Projects</dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">{stats.completedProjects || 0}</dd>
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
          {availableJobs.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-gray-600">No jobs available at the moment.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {availableJobs.slice(0, 5).map((job) => (
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
