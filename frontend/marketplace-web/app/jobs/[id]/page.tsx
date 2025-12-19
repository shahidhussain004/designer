'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import Link from 'next/link';
import { User } from '@/types';

interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  experienceLevel: string;
  clientId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProposalRequest {
  jobId: number;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration?: number;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [client, setClient] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalRequest>({
    jobId: 0,
    coverLetter: '',
    proposedRate: 0,
    estimatedDuration: 30,
  });
  const [submittingProposal, setSubmittingProposal] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setJob(data);

        // Set jobId in proposal data
        setProposalData(prev => ({ ...prev, jobId: data.id }));

        // Fetch client details
        if (data.clientId) {
          try {
            const clientResponse = await fetch(
              `http://localhost:8080/api/users/${data.clientId}/profile`
            );
            if (clientResponse.ok) {
              const clientData = await clientResponse.json();
              setClient(clientData);
            }
          } catch (err) {
            console.error('Error fetching client details:', err);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== 'FREELANCER') {
      alert('Only freelancers can submit proposals');
      return;
    }

    setSubmittingProposal(true);
    try {
      const response = await fetch(`http://localhost:8080/api/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(proposalData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit proposal');
      }

      alert('Proposal submitted successfully!');
      setProposalOpen(false);
      setProposalData({ jobId: job!.id, coverLetter: '', proposedRate: 0, estimatedDuration: 30 });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit proposal');
    } finally {
      setSubmittingProposal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            Error: {error || 'Job not found'}
          </div>
          <Link href="/jobs" className="mt-4 inline-block text-primary-600 hover:underline">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/jobs" className="text-primary-600 hover:underline text-sm mb-4 inline-block">
            ← Back to Jobs
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">{job.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Job Description</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Job Meta */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Category</p>
                <p className="text-lg font-semibold text-gray-900">{job.category}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Experience Level</p>
                <p className="text-lg font-semibold text-gray-900">{job.experienceLevel}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
                <p className="text-lg font-semibold text-gray-900">{job.status}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Posted</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Client Info */}
            {client && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">About the Client</h2>
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900">{client.fullName}</p>
                    <p className="text-gray-600">@{client.username}</p>
                    <p className="text-gray-600">{client.email}</p>
                  </div>
                  <Link
                    href={`/users/${client.id}/profile`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Budget Card */}
            <div className="bg-primary-600 text-white rounded-lg shadow-md p-8 mb-6">
              <p className="text-sm font-medium text-primary-100 mb-2">Budget</p>
              <p className="text-4xl font-bold mb-6">${job.budget}</p>
              {user && user.role === 'FREELANCER' && user.id !== job.clientId ? (
                <button
                  onClick={() => setProposalOpen(!proposalOpen)}
                  className="w-full bg-white text-primary-600 font-semibold py-3 px-4 rounded-md hover:bg-gray-100 transition"
                >
                  {proposalOpen ? 'Cancel' : 'Send Proposal'}
                </button>
              ) : user && user.id === job.clientId ? (
                <div className="bg-blue-500 bg-opacity-50 py-3 px-4 rounded-md text-center">
                  <p className="text-sm">This is your job posting</p>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="block w-full bg-white text-primary-600 font-semibold py-3 px-4 rounded-md hover:bg-gray-100 transition text-center"
                >
                  Sign In to Propose
                </Link>
              )}
            </div>

            {/* Proposal Form */}
            {proposalOpen && user && user.role === 'FREELANCER' && (
              <form
                onSubmit={handleProposalSubmit}
                className="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Submit Your Proposal</h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposed Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      value={proposalData.proposedRate}
                      onChange={(e) =>
                        setProposalData({
                          ...proposalData,
                          proposedRate: parseFloat(e.target.value),
                        })
                      }
                      placeholder="Enter your proposed rate"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Duration (days)
                  </label>
                  <input
                    type="number"
                    value={proposalData.estimatedDuration || 30}
                    onChange={(e) =>
                      setProposalData({
                        ...proposalData,
                        estimatedDuration: parseInt(e.target.value),
                      })
                    }
                    placeholder="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={proposalData.coverLetter}
                    onChange={(e) =>
                      setProposalData({
                        ...proposalData,
                        coverLetter: e.target.value,
                      })
                    }
                    placeholder="Tell the client why you're the right fit for this job..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingProposal}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  {submittingProposal ? 'Submitting...' : 'Submit Proposal'}
                </button>
              </form>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-semibold">${job.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${
                    job.status === 'OPEN' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t">
                  <span className="text-gray-600">Posted</span>
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
