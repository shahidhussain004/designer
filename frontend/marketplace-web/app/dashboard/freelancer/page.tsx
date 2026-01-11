"use client"

import { PageLayout } from '@/components/ui'
import { authService } from '@/lib/auth'
import { DashboardStats, FreelancerDashboard, ProjectSummary, dashboardService, getDashboardData } from '@/lib/dashboard'
import { ArrowRight, Briefcase, CheckCircle, Clock, FileText, FolderOpen, Loader2, Send, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function FreelancerDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<FreelancerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
            console.debug('Fallback jobs fetch failed', e)
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
        <p className="text-gray-700 mt-4">Loading your dashboard…</p>
      </div>
    </PageLayout>
  )

  if (error || !data) return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-24 text-center">
        <p className="text-red-600">{error || 'Failed to load dashboard'}</p>
      </div>
    </PageLayout>
  )

  const { stats = {} as DashboardStats, availableJobs = [], availableProjects = [] } = data

  const quickLinks = [
    { href: `/portfolio/${authService.getCurrentUser()?.id}`, icon: FolderOpen, title: 'Portfolio', subtitle: 'Manage your work' },
    { href: '/dashboard/freelancer/reviews', icon: Star, title: 'Reviews', subtitle: 'Client feedback' },
    { href: '/dashboard/freelancer/time-tracking', icon: Clock, title: 'Time Tracking', subtitle: 'Log your hours' },
    { href: '/dashboard/freelancer/contracts', icon: FileText, title: 'Contracts', subtitle: 'Active agreements' },
  ]

  return (
    <PageLayout>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold">Freelancer Dashboard</h1>
          <p className="mt-2 text-emerald-100">Welcome back! Find jobs and manage your work.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Access */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
              >
                <link.icon className="w-8 h-8 text-primary-600 mb-2" />
                <p className="font-medium text-gray-900">{link.title}</p>
                <p className="text-xs text-gray-500">{link.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Proposals Submitted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.proposalsSubmitted || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Proposals Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.proposalsAccepted || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedProjects || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Jobs & Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Available Jobs</h2>
                <p className="text-sm text-gray-500 mt-1">Browse and apply for jobs that match your skills</p>
              </div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {availableJobs.length === 0 ? (
              <div className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No jobs available at the moment.</p>
              </div>
            ) : (
              availableJobs.slice(0, 5).map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block hover:bg-gray-50 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{job.description.substring(0, 100)}...</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {typeof job.category === 'string' ? job.category : job.category?.name}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {typeof job.experienceLevel === 'string' ? job.experienceLevel : job.experienceLevel?.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-primary-600">${job.budget}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700 transition-colors">
                          View & Propose
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          </div>

          {/* Available Projects */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Available Projects</h2>
                  <p className="text-sm text-gray-500 mt-1">Open projects posted by clients</p>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {(!availableProjects || availableProjects.length === 0) ? (
                <div className="p-8 text-center">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No projects available at the moment.</p>
                </div>
              ) : (
                availableProjects.slice(0, 5).map((project: ProjectSummary) => (
                  <Link key={project.id} href={`/projects/${project.id}`} className="block hover:bg-gray-50 transition-colors">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description.substring(0, 100)}...</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {typeof project.category === 'string' ? project.category : project.category?.name}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {typeof project.experienceLevel === 'string' ? project.experienceLevel : project.experienceLevel?.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-primary-600">${project.budget}</p>
                          <span className="inline-block mt-2 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700 transition-colors">
                            View Details
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}