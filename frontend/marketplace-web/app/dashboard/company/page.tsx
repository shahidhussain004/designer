"use client"

import { PageLayout } from '@/components/ui'
import { apiClient } from '@/lib/api-client'
import { authService } from '@/lib/auth'
import { CompanyDashboard, getDashboardData, JobSummary } from '@/lib/dashboard'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Briefcase, CheckCircle, Eye, FileText, Loader2, Plus, RefreshCw, Send, TrendingUp, Users, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function CompanyDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<CompanyDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Fetch company's jobs directly using new /jobs/my-jobs endpoint
  const _currentUser = authService.getCurrentUser()
  const [companyJobs, setCompanyJobs] = useState<JobSummary[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  
  const refetchJobs = useCallback(async () => {
    try {
      const response = await apiClient.get('/companies/me/jobs', {
        params: { page: 0, size: 100 }
      })
      const jobs = response.data?.content || response.data || []
      setCompanyJobs(Array.isArray(jobs) ? jobs : [])
    } catch (_err) {
      console.error('Error fetching company jobs:', _err)
      setCompanyJobs([])
    } finally {
      setJobsLoading(false)
    }
  }, [])

  // Mutations for job status management
  const publishJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const { data } = await apiClient.post(`/companies/me/jobs/${jobId}/publish`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      refetchJobs()
      void loadDashboardData() // Reload dashboard stats
    },
  })

  const closeJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const { data } = await apiClient.post(`/companies/me/jobs/${jobId}/close`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      refetchJobs()
      loadDashboardData()
    },
  })

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      await apiClient.delete(`/companies/me/jobs/${jobId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      refetchJobs()
      loadDashboardData()
    },
  })

  const loadDashboardData = useCallback(async () => {
    try {
      const d = await getDashboardData()
      setData(d as CompanyDashboard)
      setError(null)
    } catch (_err) {
      console.error('Dashboard API error:', _err)
      if (companyJobs && companyJobs.length > 0) {
        setData({
          stats: {
            openJobs: companyJobs.filter((j) => j.status === 'OPEN').length,
            totalJobsPosted: companyJobs.length,
          },
          openJobs: companyJobs,
          activeProjects: [],
          completedProjects: [],
          recentProposals: [],
          recentApplications: [],
        } as CompanyDashboard)
      }
      setError('Some dashboard data may be unavailable')
    } finally {
      setLoading(false)
    }
  }, [companyJobs])

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    loadDashboardData()
    refetchJobs()
  }, [router, loadDashboardData, refetchJobs])

  // Use company jobs from direct fetch if dashboard data is not available
  const displayJobs = data?.openJobs && data.openJobs.length > 0 
    ? data.openJobs 
    : (companyJobs || [])

  if (loading || jobsLoading) return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-24 text-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
        <p className="text-secondary-700 mt-4">Loading your dashboard…</p>
      </div>
    </PageLayout>
  )

  if (!data && !companyJobs) return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-24 text-center">
        <p className="text-error-600">{error || 'Failed to load dashboard'}</p>
        <button 
          onClick={() => {
            setLoading(true)
            loadDashboardData()
          }}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    </PageLayout>
  )

  const {
    stats,
    activeProjects = [],
    completedProjects = [],
    recentProposals = [],
    recentApplications = []
  } = data || { stats: {} }

  const handlePublish = async (jobId: number, jobTitle: string) => {
    if (confirm(`Publish "${jobTitle}"? This will make it visible to job seekers.`)) {
      await publishJobMutation.mutateAsync(jobId)
    }
  }

  const handleClose = async (jobId: number, jobTitle: string) => {
    if (confirm(`Close "${jobTitle}"? No further applications will be accepted.`)) {
      await closeJobMutation.mutateAsync(jobId)
    }
  }

  const handleDelete = async (jobId: number, jobTitle: string) => {
    if (confirm(`Delete "${jobTitle}"? This action cannot be undone.`)) {
      await deleteJobMutation.mutateAsync(jobId)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-secondary-100 text-secondary-700'
      case 'OPEN': return 'bg-success-100 text-success-700'
      case 'CLOSED': return 'bg-error-100 text-error-700'
      case 'FILLED': return 'bg-info-100 text-info-700'
      default: return 'bg-secondary-100 text-secondary-700'
    }
  }

  return (
    <PageLayout>
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">Company Dashboard</h1>
              <p className="text-lg text-primary-100">Manage your jobs, projects, and applications all in one place.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/jobs/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Post New Job
              </Link>
              <Link
                href="/projects/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-primary-400"
              >
                <Plus className="w-5 h-5" />
                Post New Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-secondary-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          
          {/* Stats Grid */}
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-2">Open Jobs</p>
                    <p className="text-4xl font-bold text-secondary-900">{stats.openJobs || 0}</p>
                    <p className="text-xs text-secondary-500 mt-2">Active positions</p>
                  </div>
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-2">Applications</p>
                    <p className="text-4xl font-bold text-secondary-900">{stats.totalApplicationsReceived || 0}</p>
                    <p className="text-xs text-secondary-500 mt-2">Total received</p>
                  </div>
                  <div className="w-16 h-16 bg-info-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-info-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-2">Active Projects</p>
                    <p className="text-4xl font-bold text-secondary-900">{stats.activeProjects || 0}</p>
                    <p className="text-xs text-secondary-500 mt-2">In progress</p>
                  </div>
                  <div className="w-16 h-16 bg-warning-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-warning-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-2">Proposals</p>
                    <p className="text-4xl font-bold text-secondary-900">{stats.totalProposalsReceived || 0}</p>
                    <p className="text-xs text-secondary-500 mt-2">Received</p>
                  </div>
                  <div className="w-16 h-16 bg-success-100 rounded-xl flex items-center justify-center">
                    <Send className="w-8 h-8 text-success-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout - Jobs and Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* JOBS SECTION */}
            <div>
              {/* All Jobs Posted */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900">Your Job Postings</h2>
                    <p className="text-sm text-secondary-500 mt-1">
                      {displayJobs.length} total job{displayJobs.length !== 1 ? 's' : ''} 
                      {stats.openJobs ? ` • ${stats.openJobs} active` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => refetchJobs()}
                      className="inline-flex items-center gap-1 text-secondary-600 hover:text-secondary-900 text-sm"
                      title="Refresh jobs"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <Link
                      href="/jobs/create"
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
                    >
                      Post Job
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg text-sm text-warning-800">
                    <p>{error}</p>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                  {displayJobs.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-secondary-400" />
                      </div>
                      <h3 className="font-semibold text-secondary-900 mb-2">No jobs posted yet</h3>
                      <p className="text-sm text-secondary-500 mb-6">Start posting jobs to find great talent</p>
                      <Link
                        href="/jobs/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Post Your First Job
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-secondary-100">
                      {displayJobs.map((job) => (
                        <div key={job.id} className="p-6 hover:bg-secondary-50 transition-colors">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <Link 
                                    href={`/jobs/${job.id}`}
                                    className="font-bold text-secondary-900 hover:text-primary-600 transition-colors line-clamp-1 block"
                                  >
                                    {job.title}
                                  </Link>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(job.status)}`}>
                                      {job.status}
                                    </span>
                                    {job.isFeatured && (
                                      <span className="text-xs px-2 py-1 bg-warning-100 text-warning-700 rounded">
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-xs text-secondary-500">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5" />
                                  {job.applicationsCount || 0} application{job.applicationsCount !== 1 ? 's' : ''}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" />
                                  {job.viewsCount || 0} views
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/jobs/${job.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 text-xs font-medium rounded transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Link>
                            
                            {job.status === 'DRAFT' && (
                              <button
                                onClick={() => handlePublish(job.id, job.title)}
                                disabled={publishJobMutation.isPending}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-success-100 hover:bg-success-200 text-success-700 text-xs font-medium rounded transition-colors disabled:opacity-50"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Publish
                              </button>
                            )}

                            {job.status === 'OPEN' && (
                              <button
                                onClick={() => handleClose(job.id, job.title)}
                                disabled={closeJobMutation.isPending}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-warning-100 hover:bg-warning-200 text-warning-700 text-xs font-medium rounded transition-colors disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Close
                              </button>
                            )}

                            <Link
                              href={`/jobs/${job.id}/edit`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-info-100 hover:bg-info-200 text-info-700 text-xs font-medium rounded transition-colors"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(job.id, job.title)}
                              disabled={deleteJobMutation.isPending}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-error-100 hover:bg-error-200 text-error-700 text-xs font-medium rounded transition-colors disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Applications */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900">Applications Received</h2>
                    <p className="text-sm text-secondary-500 mt-1">{recentApplications.length} recent application{recentApplications.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                  {recentApplications.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-secondary-400" />
                      </div>
                      <h3 className="font-semibold text-secondary-900 mb-2">No applications yet</h3>
                      <p className="text-sm text-secondary-500">Applications will appear here when freelancers apply</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-secondary-100 max-h-[500px] overflow-y-auto">
                      {recentApplications.map((app) => (
                        <div key={app.id} className="p-6 hover:bg-secondary-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-secondary-900">{app.applicantName}</p>
                              <p className="text-sm text-secondary-600 mt-1">{app.applicantEmail}</p>
                              <div className="flex items-center gap-3 mt-3">
                                <span className="text-xs text-secondary-500">for {app.jobTitle}</span>
                              </div>
                            </div>
                            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                              app.status === 'SUBMITTED' ? 'bg-primary-100 text-primary-700' :
                              app.status === 'REVIEWING' ? 'bg-warning-100 text-warning-700' :
                              app.status === 'SHORTLISTED' ? 'bg-success-100 text-success-700' :
                              app.status === 'REJECTED' ? 'bg-error-100 text-error-700' :
                              'bg-secondary-100 text-secondary-700'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PROJECTS SECTION */}
            <div>
              {/* Active Projects */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900">Active Projects</h2>
                    <p className="text-sm text-secondary-500 mt-1">{activeProjects.length} in progress</p>
                  </div>
                  <Link
                    href="/projects/create"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
                  >
                    Post Project
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                  {activeProjects.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-secondary-400" />
                      </div>
                      <h3 className="font-semibold text-secondary-900 mb-2">No active projects yet</h3>
                      <p className="text-sm text-secondary-500 mb-6">Start posting projects to collaborate with freelancers</p>
                      <Link
                        href="/projects/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Post Your First Project
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-secondary-100">
                      {activeProjects.map((project) => (
                        <Link key={project.id} href={`/projects/${project.id}`} className="block group hover:bg-secondary-50 transition-colors">
                          <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">{project.title}</h3>
                                <p className="text-sm text-secondary-600 mt-2">${project.budget?.toLocaleString() || 'TBD'}</p>
                                <div className="mt-3">
                                  <span className="inline-flex items-center px-2.5 py-1 bg-warning-100 text-warning-700 rounded-full text-xs font-medium">
                                    {project.status}
                                  </span>
                                </div>
                              </div>
                              <span className="inline-block px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg group-hover:bg-primary-700 transition-colors shadow-sm">
                                Manage
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Proposals */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900">Proposals Received</h2>
                    <p className="text-sm text-secondary-500 mt-1">{recentProposals.length} recent proposal{recentProposals.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                  {recentProposals.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-secondary-400" />
                      </div>
                      <h3 className="font-semibold text-secondary-900 mb-2">No proposals yet</h3>
                      <p className="text-sm text-secondary-500">Proposals will appear here when freelancers submit them</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-secondary-100 max-h-[500px] overflow-y-auto">
                      {recentProposals.map((proposal) => (
                        <div key={proposal.id} className="p-6 hover:bg-secondary-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-secondary-900">{proposal.jobTitle}</p>
                              <p className="text-sm text-secondary-600 mt-1">${proposal.proposedRate?.toLocaleString() || 'TBD'}</p>
                            </div>
                            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                              proposal.status === 'SUBMITTED' ? 'bg-primary-100 text-primary-700' :
                              proposal.status === 'REVIEWING' ? 'bg-warning-100 text-warning-700' :
                              proposal.status === 'SHORTLISTED' ? 'bg-success-100 text-success-700' :
                              proposal.status === 'ACCEPTED' ? 'bg-success-100 text-success-700' :
                              proposal.status === 'REJECTED' ? 'bg-error-100 text-error-700' :
                              'bg-secondary-100 text-secondary-700'
                            }`}>
                              {proposal.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Completed Projects Section */}
          {completedProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900">Completed Projects</h2>
                  <p className="text-sm text-secondary-500 mt-1">{completedProjects.length} successfully completed</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedProjects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`} className="block group">
                    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 hover:border-primary-300 hover:shadow-lg transition-all p-6 transform hover:-translate-y-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-success-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">{project.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-secondary-600 font-semibold">${project.budget?.toLocaleString() || 'TBD'}</p>
                      <div className="mt-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-success-700 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}