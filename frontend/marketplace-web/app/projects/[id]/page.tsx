'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { JobDetailsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useProject, useSubmitProposal } from '@/hooks/useProjects';
import { useUserProfile } from '@/hooks/useUsers';
import { authService } from '@/lib/auth';
import logger from '@/lib/logger';
import { User } from '@/types';
import { AlertCircle, ArrowLeft, Briefcase, Calendar, CheckCircle, DollarSign, Layers, Send, User as UserIcon, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    displayOrder: number;
  };
  experienceLevel: {
    id: number;
    name: string;
    code: string;
    description: string;
    yearsMin: number;
    yearsMax: number | null;
    displayOrder: number;
  };
  clientId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProposalRequest {
  projectId: number;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration?: number;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: project, isLoading, error, refetch } = useProject(projectId);
  const { data: client } = useUserProfile(project?.clientId || null);
  const submitProposalMutation = useSubmitProposal();

  const [user, setUser] = useState<User | null>(null);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalRequest>({
    projectId: 0,
    coverLetter: '',
    proposedRate: 0,
    estimatedDuration: 30,
  });
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ coverLetter?: string; proposedRate?: string; estimatedDuration?: string }>({});

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    if (project) {
      setProposalData((prev) => ({ ...prev, projectId: project.id }));
    }
  }, [project]);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== 'FREELANCER') {
      setProposalError('Only freelancers can submit proposals');
      return;
    }

    setFieldErrors({});
    setProposalError(null);

    const newFieldErrors: { coverLetter?: string; proposedRate?: string; estimatedDuration?: string } = {};
    if (!proposalData.projectId || proposalData.projectId <= 0) {
      setProposalError('Invalid project selected for proposal');
      return;
    }

    if (!proposalData.coverLetter || proposalData.coverLetter.trim().length === 0) {
      newFieldErrors.coverLetter = 'Cover letter is required';
    }

    if (!isFinite(proposalData.proposedRate) || proposalData.proposedRate <= 0) {
      newFieldErrors.proposedRate = 'Please enter a valid proposed rate';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      await submitProposalMutation.mutateAsync(proposalData);

      setProposalSuccess(true);
      setProposalOpen(false);
      setProposalData({ projectId: project!.id, coverLetter: '', proposedRate: 0, estimatedDuration: 30 });

      setTimeout(() => setProposalSuccess(false), 5000);
    } catch (err: any) {
      logger.error('Proposal submission failed', err);

      let message = 'Failed to submit proposal';
      if (err?.response?.data) {
        const data = err.response.data;

        if (data.errors && Array.isArray(data.errors)) {
          const fe: typeof fieldErrors = {};
          data.errors.forEach((e: any) => {
            if (e.field && e.message) {
              const fieldKey = e.field as keyof typeof fieldErrors;
              fe[fieldKey] = e.message;
            }
          });
          setFieldErrors(fe);
          message = 'Please fix the highlighted fields';
        } else if (typeof data === 'object') {
          if (data.field && data.message) {
            setFieldErrors({ [data.field]: data.message });
            message = data.message;
          } else if (data.message) {
            message = data.message;
          } else if (data.error) {
            message = data.error;
          }
        } else if (typeof data === 'string') {
          message = data;
        }
      } else if (err?.message) {
        message = err.message;
      }

      setProposalError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <JobDetailsSkeleton />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {error ? (
            <ErrorMessage message={(error as Error).message} retry={refetch} />
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-700 font-medium mb-4">Project not found</p>
              <Link href="/projects" className="text-primary-600 hover:text-primary-700 font-medium">
                ← Back to Browse Projects
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      {/* Notifications */}
      {proposalSuccess && (
        <div className="bg-green-50 border-b border-green-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700">Proposal submitted successfully! The client will review your proposal.</p>
          </div>
        </div>
      )}
      
      {proposalError && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{proposalError}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Browse Projects
          </Link>
          <h1 className="text-3xl font-bold">{project.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Project Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">{project.category.name}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Experience Level</p>
                    <p className="font-medium text-gray-900">{project.experienceLevel?.name}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      project.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Posted</p>
                    <p className="font-medium text-gray-900">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            {client && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About the Client</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{client.fullName}</p>
                      <p className="text-sm text-gray-500">@{client.username}</p>
                    </div>
                  </div>
                  <Link href={`/users/${client.id}/profile`} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View Profile →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Budget</p>
                <p className="text-3xl font-bold text-gray-900">${project.budget}</p>
              </div>
              
              {user && user.role === 'FREELANCER' && user.id !== project.clientId ? (
                <button
                  onClick={() => {
                    if (!proposalOpen) {
                      setProposalData({
                        projectId: project!.id,
                        coverLetter: '',
                        proposedRate: 0,
                        estimatedDuration: 30
                      });
                    }
                    setProposalOpen(!proposalOpen);
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    proposalOpen 
                      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {proposalOpen ? 'Cancel' : 'Send Proposal'}
                </button>
              ) : user && user.id === project.clientId ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-sm text-blue-700">This is your project posting</p>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                >
                  Sign In to Propose
                </Link>
              )}
            </div>

            {/* Proposal Form */}
            {proposalOpen && user && user.role === 'FREELANCER' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleProposalSubmit} className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Your Proposal
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Proposed Rate ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={proposalData.proposedRate}
                        onChange={(e) => setProposalData({ ...proposalData, proposedRate: parseFloat(e.target.value) })}
                        required
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      />
                    </div>
                    {fieldErrors.proposedRate && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.proposedRate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Duration (days)
                    </label>
                    <input
                      type="number"
                      value={proposalData.estimatedDuration || 30}
                      onChange={(e) => setProposalData({ ...proposalData, estimatedDuration: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {fieldErrors.estimatedDuration && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.estimatedDuration}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter
                    </label>
                    <textarea
                      value={proposalData.coverLetter}
                      onChange={(e) => setProposalData({ ...proposalData, coverLetter: e.target.value })}
                      rows={6}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Introduce yourself and explain why you're the right fit for this project..."
                    />
                    {fieldErrors.coverLetter && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.coverLetter}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitProposalMutation.isPending}
                    className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {submitProposalMutation.isPending ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </form>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-medium text-gray-900">${project.budget}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    project.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Posted</span>
                  <span className="text-gray-700">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
