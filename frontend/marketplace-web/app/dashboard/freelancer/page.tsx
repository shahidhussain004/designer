"use client"

import { PageLayout } from '@/components/ui'
import { useMyApplications } from '@/hooks/useJobs'
import { authService } from '@/lib/auth'
import { DashboardStats, FreelancerDashboard, ProjectSummary, dashboardService, getDashboardData } from '@/lib/dashboard'
import { AlertCircle, ArrowRight, Award, Briefcase, Calendar, CheckCheck, CheckCircle, Clock, FileText, FolderOpen, Loader2, MapPin, Send, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function FreelancerDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<FreelancerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: myApplications = [], isLoading: applicationsLoading } = useMyApplications()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    const load = async () => {
      try {
        const d = await getDashboardData()
        const fd = d as FreelancerDashboard
        // if backend didn't include availableJobs, fetch public jobs as a fallback
        if ((!fd.availableJobs || fd.availableJobs.length === 0)) {
          try {
            const jobsResp = await dashboardService.getAvailableJobs(0, 5)
            fd.availableJobs = jobsResp?.content || []
          } catch (e) {
            // Silently fail fallback
          }
        }
        setData(fd)
      } catch (err) {
        console.error(err)
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  if (loading) return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-24 text-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
        <p className="text-secondary-700 mt-4">Loading your dashboard…</p>
      </div>
    </PageLayout>
  )

  if (error || !data) return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-24 text-center">
        <p className="text-error-600">{error || 'Failed to load dashboard'}</p>
      </div>
    </PageLayout>
  )

  const { stats = {} as DashboardStats, availableJobs = [], availableProjects = [] } = data

  const quickLinks = [
    { href: '/portfolio', icon: FolderOpen, title: 'Portfolio', subtitle: 'Manage your work' },
    { href: '/dashboard/freelancer/reviews', icon: Star, title: 'Reviews', subtitle: 'Company feedback' },
    { href: '/dashboard/freelancer/time-tracking', icon: Clock, title: 'Time Tracking', subtitle: 'Log your hours' },
    { href: '/dashboard/freelancer/contracts', icon: FileText, title: 'Contracts', subtitle: 'Active agreements' },
  ]

  return (
    <PageLayout>
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-success-600 via-success-700 to-success-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">Freelancer Dashboard</h1>
              <p className="text-lg text-success-100">Welcome back! Track your applications and manage your work.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-success-700 rounded-lg hover:bg-success-50 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Briefcase className="w-5 h-5" />
                Browse Jobs
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-success-400"
              >
                <FolderOpen className="w-5 h-5" />
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-secondary-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white rounded-xl shadow-sm border border-secondary-200 hover:border-primary-300 hover:shadow-lg transition-all p-6 text-center transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <link.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-secondary-900 text-lg mb-1">{link.title}</h3>
              <p className="text-sm text-secondary-500">{link.subtitle}</p>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Your Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
                  <Send className="w-7 h-7 text-primary-600" />
                </div>
                <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-1">Proposals</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.proposalsSubmitted || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-success-100 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle className="w-7 h-7 text-success-600" />
                </div>
                <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-1">Accepted</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.proposalsAccepted || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-info-100 rounded-xl flex items-center justify-center mb-3">
                  <Briefcase className="w-7 h-7 text-info-600" />
                </div>
                <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-1">Completed</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.completedProjects || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-warning-100 rounded-xl flex items-center justify-center mb-3">
                  <FileText className="w-7 h-7 text-warning-600" />
                </div>
                <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-1">Applied</p>
                <p className="text-3xl font-bold text-secondary-900">{myApplications.length || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
                </div>
                <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-1">Active</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.activeContracts || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-success-100 rounded-xl flex items-center justify-center mb-3">
                  <Award className="w-7 h-7 text-success-600" />
                </div>
                <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-1">Rating</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.avgRating ? stats.avgRating.toFixed(1) : '0.0'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Jobs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">Available Jobs</h2>
                <p className="text-sm text-secondary-500 mt-1">Browse and apply for jobs that match your skills</p>
              </div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
              {availableJobs.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-secondary-400" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">No jobs available</h3>
                  <p className="text-sm text-secondary-500 mb-6">Check back later for new opportunities</p>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    Browse All Jobs
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-secondary-100">
                  {availableJobs.slice(0, 5).map((job) => (
                    <Link key={job.id} href={`/jobs/${job.id}`} className="block group hover:bg-secondary-50 transition-colors">
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">{job.title}</h3>
                            <p className="text-sm text-secondary-600 mt-2 line-clamp-2">{job.description.substring(0, 120)}...</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="inline-flex items-center px-2.5 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">
                                {typeof job.category === 'string' ? job.category : job.category?.name}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                {typeof job.experienceLevel === 'string' ? job.experienceLevel : job.experienceLevel?.name}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-primary-600">${job.budget}</p>
                            <span className="inline-block mt-3 px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg group-hover:bg-primary-700 transition-colors shadow-sm">
                              View Job
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Projects */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">Available Projects</h2>
                <p className="text-sm text-secondary-500 mt-1">Open projects posted by companies</p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
              {(!availableProjects || availableProjects.length === 0) ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="w-8 h-8 text-secondary-400" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">No projects available</h3>
                  <p className="text-sm text-secondary-500 mb-6">Check back later for new opportunities</p>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    Browse All Projects
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-secondary-100">
                  {availableProjects.slice(0, 5).map((project: ProjectSummary) => (
                    <Link key={project.id} href={`/projects/${project.id}`} className="block group hover:bg-secondary-50 transition-colors">
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">{project.title}</h3>
                            <p className="text-sm text-secondary-600 mt-2 line-clamp-2">{project.description.substring(0, 120)}...</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="inline-flex items-center px-2.5 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">
                                {typeof project.category === 'string' ? project.category : project.category?.name}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                {typeof project.experienceLevel === 'string' ? project.experienceLevel : project.experienceLevel?.name}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-primary-600">${project.budget}</p>
                            <span className="inline-block mt-3 px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg group-hover:bg-primary-700 transition-colors shadow-sm">
                              View Details
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Applications */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">My Job Applications</h2>
              <p className="text-sm text-secondary-500 mt-1">Track your submitted applications and their status</p>
            </div>
            <Link
              href="/my-applications"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
            {applicationsLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
                <p className="text-secondary-600 font-medium">Loading applications...</p>
              </div>
            ) : myApplications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-secondary-400" />
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">No applications yet</h3>
                <p className="text-sm text-secondary-500 mb-6">Start applying for jobs to track your progress here</p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-secondary-100">
                {myApplications.slice(0, 5).map((app: any) => {
                  const statusConfig = {
                    PENDING: { bg: 'bg-primary-50 group-hover:bg-primary-100', icon: Clock, badge: 'bg-primary-100 text-primary-800', text: 'Pending Review' },
                    REVIEWING: { bg: 'bg-info-50 group-hover:bg-info-100', icon: AlertCircle, badge: 'bg-info-100 text-info-800', text: 'Under Review' },
                    SHORTLISTED: { bg: 'bg-warning-50 group-hover:bg-warning-100', icon: CheckCircle, badge: 'bg-warning-100 text-warning-800', text: 'Shortlisted' },
                    ACCEPTED: { bg: 'bg-success-50 group-hover:bg-success-100', icon: CheckCheck, badge: 'bg-success-100 text-success-800', text: 'Accepted' },
                    REJECTED: { bg: 'bg-error-50 group-hover:bg-error-100', icon: AlertCircle, badge: 'bg-error-100 text-error-800', text: 'Not Selected' },
                  } as Record<string, any>;

                  const config = statusConfig[app?.status?.toUpperCase()] || statusConfig.PENDING;
                  const StatusIcon = config.icon;

                  return (
                    <Link
                      key={app?.id}
                      href={`/jobs/${app?.jobId}`}
                      className={`block group transition-colors ${config.bg}`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{app?.jobTitle}</h3>
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {config.text}
                              </span>
                            </div>
                            <p className="text-sm text-secondary-700 font-medium mb-2">{app?.companyName}</p>
                            {app?.location && (
                              <div className="flex items-center gap-1.5 text-sm text-secondary-600">
                                <MapPin className="w-4 h-4" />
                                {app?.location}
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1.5 text-secondary-500 text-xs mb-3">
                              <Calendar className="w-4 h-4" />
                              {app?.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                            </div>
                            <span className="inline-block px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg group-hover:bg-primary-700 transition-colors shadow-sm">
                              View Job
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  )
}