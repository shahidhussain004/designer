'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { JobDetailsSkeleton } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useProject, useSubmitProposal } from '@/hooks/useProjects';
import { useUserProfile } from '@/hooks/useUsers';
import { useAuth } from '@/lib/auth';
import logger from '@/lib/logger';
import {
  AlertCircle, ArrowLeft, Briefcase, Calendar, CheckCircle, Clock, DollarSign,
  Eye,
  FileText, Flame,
  MessageSquare,
  Send, Star,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface _Project {
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
  companyId: number;
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
  const { data: company } = useUserProfile(project?.companyId || null);
  const submitProposalMutation = useSubmitProposal();
  const { user } = useAuth();
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
    } catch (err: unknown) {
      const error = err as Record<string, unknown>;
      const response = error?.response as Record<string, unknown> | undefined;
      const data = response?.data as Record<string, unknown> | undefined;
      logger.error('Proposal submission failed', err as Error);

      let message = 'Failed to submit proposal';
      if (data) {
        if (data.errors && Array.isArray(data.errors)) {
          const fe: typeof fieldErrors = {};
          data.errors.forEach((e: Record<string, unknown>) => {
            if (e.field && e.message) {
              const fieldKey = e.field as keyof typeof fieldErrors;
              fe[fieldKey] = e.message as string;
            }
          });
          setFieldErrors(fe);
          message = 'Please fix the highlighted fields';
        } else if (typeof data === 'object') {
          if (data.field && data.message) {
            setFieldErrors({ [data.field as string]: data.message as string });
            message = data.message as string;
          } else if (data.message) {
            message = data.message as string;
          } else if (data.error) {
            message = data.error as string;
          }
        } else if (typeof data === 'string') {
          message = data;
        }
      } else if (error?.message) {
        message = error.message as string;
      }

      setProposalError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <JobDetailsSkeleton />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {error ? (
            <ErrorMessage message={(error as Error).message} retry={refetch} />
          ) : (
            <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
              <XCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
              <p className="text-error-700 font-medium mb-4">Project not found</p>
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
        <div className="bg-success-50 border-b border-success-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success-600" />
            <p className="text-success-700">Proposal submitted successfully! The company will review your proposal.</p>
          </div>
        </div>
      )}
      
      {proposalError && (
        <div className="bg-error-50 border-b border-error-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-error-600" />
            <p className="text-error-700">{proposalError}</p>
          </div>
        </div>
      )}

      {/* Header with Status Badges */}
      <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/projects" className="inline-flex items-center gap-2 text-secondary-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                {project.isUrgent && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-200 rounded-full text-xs font-semibold border border-red-500/30">
                    <Flame className="w-3 h-3" />
                    URGENT
                  </span>
                )}
                {project.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-200 rounded-full text-xs font-semibold border border-amber-500/30">
                    <Star className="w-3 h-3" />
                    FEATURED
                  </span>
                )}
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'OPEN' ? 'bg-success-500/20 text-success-200 border border-success-500/30' : 
                  project.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' :
                  project.status === 'CLOSED' ? 'bg-secondary-500/20 text-secondary-300 border border-secondary-500/30' :
                  'bg-secondary-500/20 text-secondary-300 border border-secondary-500/30'
                }`}>
                  {project.status}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
              <p className="text-secondary-300 text-lg">{project.projectCategory?.name || 'Uncategorized'} • {project.experienceLevel?.name || 'Not specified'}</p>
            </div>
            
            {user && user.id === project.companyId && (
              <Link
                href={`/projects/${projectId}/edit`}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/20"
              >
                Edit Project
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Section */}
            <section className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Project Description</h2>
              <div className="prose prose-sm max-w-none text-secondary-700 whitespace-pre-wrap leading-relaxed">
                {project.description}
              </div>
            </section>

            {/* Scope of Work */}
            {project.scopeOfWork && (
              <section className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary-600" />
                  Scope of Work
                </h2>
                <div className="prose prose-sm max-w-none text-secondary-700 whitespace-pre-wrap leading-relaxed">
                  {project.scopeOfWork}
                </div>
              </section>
            )}

            {/* Skills Section */}
            <section className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Required Skills & Experience</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Required Skills */}
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-4">Required Skills</h3>
                  {project.requiredSkills && Array.isArray(project.requiredSkills) && project.requiredSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.requiredSkills.map((skill: any, i: number) => (
                        <span key={i} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-200">
                          {typeof skill === 'string' ? skill : skill.skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-500 text-sm">Not specified</p>
                  )}
                </div>

                {/* Preferred Skills */}
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-4">Preferred Skills</h3>
                  {project.preferredSkills && Array.isArray(project.preferredSkills) && project.preferredSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.preferredSkills.map((skill: any, i: number) => (
                        <span key={i} className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium border border-secondary-300">
                          {typeof skill === 'string' ? skill : skill.skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-500 text-sm">Not specified</p>
                  )}
                </div>
              </div>
              
              {/* Experience Level Detail */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <h3 className="font-semibold text-secondary-900 mb-3">Experience Level Required</h3>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-secondary-400" />
                  <p className="text-secondary-700">{project.experienceLevel?.name || 'Not specified'}</p>
                </div>
              </div>
            </section>

            {/* Timeline & Project Details */}
            <section className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Timeline & Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <p className="text-xs text-secondary-500 uppercase font-semibold tracking-wide mb-2">Duration</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-secondary-400" />
                    <p className="font-medium text-secondary-900">{project.estimatedDurationDays ? `${project.estimatedDurationDays} days` : 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <p className="text-xs text-secondary-500 uppercase font-semibold tracking-wide mb-2">Timeline</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-secondary-400" />
                    <p className="font-medium text-secondary-900">{project.timeline || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <p className="text-xs text-secondary-500 uppercase font-semibold tracking-wide mb-2">Project Type</p>
                  <p className="font-medium text-secondary-900">
                    {project.projectType === 'SINGLE_PROJECT' ? 'One-Time' : project.projectType === 'ONGOING' ? 'Ongoing' : project.projectType}
                  </p>
                </div>
              </div>
            </section>

            {/* Company Info */}
            {company && (
              <section className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-8">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">About the Hiring Company</h2>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {company.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-secondary-900">{company.fullName}</p>
                      <p className="text-secondary-600">@{company.username}</p>
                      {company.bio && <p className="text-sm text-secondary-600 mt-1">{company.bio}</p>}
                    </div>
                  </div>
                  <Link 
                    href={`/users/${company.id}/profile`} 
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium whitespace-nowrap"
                  >
                    View Profile
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="space-y-6">
            {/* Budget Card - Prominent */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl shadow-lg p-8">
              <p className="text-primary-100 text-sm uppercase font-semibold tracking-wide mb-2">
                {project.budgetType === 'HOURLY' ? 'Hourly Rate Range' : 'Total Budget'}
              </p>
              
              {project.budgetType === 'HOURLY' && project.budgetMinCents && project.budgetMaxCents ? (
                <h3 className="text-4xl font-bold mb-6">
                  ${(project.budgetMinCents / 100).toLocaleString()} - ${(project.budgetMaxCents / 100).toLocaleString()}
                </h3>
              ) : project.budgetAmountCents ? (
                <h3 className="text-4xl font-bold mb-6">
                  ${(project.budgetAmountCents / 100).toLocaleString()}
                </h3>
              ) : project.maxBudget ? (
                <h3 className="text-4xl font-bold mb-6">
                  ${project.maxBudget.toLocaleString()}
                </h3>
              ) : (
                <h3 className="text-2xl font-bold mb-6 text-primary-100">
                  Budget TBD
                </h3>
              )}
              
              <div className="space-y-4 mb-6 pt-6 border-t border-primary-500/50">
                {project.budgetMinCents && project.budgetMaxCents ? (
                  <div>
                    <p className="text-primary-100 text-xs font-semibold mb-1">Budget Range</p>
                    <p className="text-lg font-medium">${(project.budgetMinCents / 100).toLocaleString()} - ${(project.budgetMaxCents / 100).toLocaleString()}</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-primary-100 text-xs font-semibold mb-1">Budget Type</p>
                  <p className="font-medium">{project.budgetType === 'HOURLY' ? 'Hourly Rate' : 'Fixed Price'}</p>
                </div>
                {project.currency && (
                  <div>
                    <p className="text-primary-100 text-xs font-semibold mb-1">Currency</p>
                    <p className="font-medium">{project.currency}</p>
                  </div>
                )}
              </div>

              {/* Proposal Button Logic */}
              {user && Number(user.id) === Number(project.companyId) ? (
                <div className="space-y-3">
                  <div className="p-3 bg-white/10 border border-white/20 rounded-lg text-center">
                    <p className="text-sm text-primary-100">This is your project</p>
                  </div>
                  <Link
                    href={`/projects/${projectId}/proposals`}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                  >
                    <MessageSquare className="w-4 h-4" />
                    View Proposals
                  </Link>
                </div>
              ) : user && user.role === 'FREELANCER' ? (
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
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    proposalOpen 
                      ? 'bg-white/20 text-white border border-white/40 hover:bg-white/30'
                      : 'bg-white text-primary-600 hover:bg-primary-50 shadow-lg'
                  }`}
                >
                  {proposalOpen ? 'Cancel' : 'Send Proposal'}
                </button>
              ) : user && user.role === 'COMPANY' ? (
                <div className="p-3 bg-white/10 border border-white/20 rounded-lg text-center">
                  <p className="text-sm text-primary-100">
                    This project is for freelancers to apply to
                  </p>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="block w-full py-3 px-4 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold text-center"
                >
                  Sign In to Propose
                </Link>
              )}
            </section>

            {/* Proposal Form - Appears when freelancer opens it */}
            {proposalOpen && user && user.role === 'FREELANCER' && (
              <section className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
                <form onSubmit={handleProposalSubmit} className="space-y-5">
                  <h3 className="font-bold text-secondary-900 text-lg flex items-center gap-2">
                    <Send className="w-5 h-5 text-primary-600" />
                    Submit Your Proposal
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">
                      Your Proposed Rate ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                      <input
                        type="number"
                        value={proposalData.proposedRate}
                        onChange={(e) => setProposalData({ ...proposalData, proposedRate: parseFloat(e.target.value) })}
                        required
                        placeholder="Enter your rate"
                        className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    {fieldErrors.proposedRate && (
                      <p className="text-error-600 text-sm mt-1">{fieldErrors.proposedRate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">
                      Estimated Duration (days)
                    </label>
                    <input
                      type="number"
                      value={proposalData.estimatedDuration || 30}
                      onChange={(e) => setProposalData({ ...proposalData, estimatedDuration: parseInt(e.target.value) })}
                      placeholder="30"
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {fieldErrors.estimatedDuration && (
                      <p className="text-error-600 text-sm mt-1">{fieldErrors.estimatedDuration}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      value={proposalData.coverLetter}
                      onChange={(e) => setProposalData({ ...proposalData, coverLetter: e.target.value })}
                      rows={5}
                      required
                      placeholder="Tell the company why you're the perfect fit..."
                      className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                    {fieldErrors.coverLetter && (
                      <p className="text-error-600 text-sm mt-1">{fieldErrors.coverLetter}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitProposalMutation.isPending}
                    className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitProposalMutation.isPending ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </form>
              </section>
            )}

            {/* Project Stats */}
            <section className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="font-bold text-secondary-900 mb-4">Project Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <span className="flex items-center gap-2 text-secondary-600">
                    <Eye className="w-4 h-4" />
                    Views
                  </span>
                  <span className="font-bold text-secondary-900">{project.viewsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <span className="flex items-center gap-2 text-secondary-600">
                    <MessageSquare className="w-4 h-4" />
                    Proposals
                  </span>
                  <span className="font-bold text-secondary-900">{project.proposalCount || 0}</span>
                </div>
                <hr className="border-secondary-200" />
                <div className="flex items-center justify-between pt-2 text-sm">
                  <span className="text-secondary-600">Posted</span>
                  <span className="font-medium text-secondary-900">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                {project.publishedAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600">Published</span>
                    <span className="font-medium text-secondary-900">{new Date(project.publishedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Priority Badge */}
            {project.priorityLevel && (
              <section className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h3 className="font-bold text-secondary-900 mb-4">Priority Level</h3>
                <div className={`px-4 py-3 rounded-lg text-center font-semibold ${
                  project.priorityLevel === 'URGENT' ? 'bg-red-100 text-red-700 border border-red-300' :
                  project.priorityLevel === 'HIGH' ? 'bg-orange-100 text-orange-700 border border-orange-300' :
                  project.priorityLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                  'bg-green-100 text-green-700 border border-green-300'
                }`}>
                  {project.priorityLevel}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
