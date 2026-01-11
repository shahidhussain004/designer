"use client"

import { PageLayout } from '@/components/ui'
import { authService } from '@/lib/auth'
import { ClientDashboard, getDashboardData } from '@/lib/dashboard'
import { Briefcase, CheckCircle, FileText, Loader2, Plus, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ClientDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<ClientDashboard | null>(null)
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
        setData(d as ClientDashboard)
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

  const {
    stats,
    openJobs = [],
    recentApplications = [],
    activeProjects = [],
    completedProjects = [],
    recentProposals = []
  } = data

  return (
    <PageLayout>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold">Client Dashboard</h1>
          <p className="mt-2 text-blue-100">Manage your jobs and projects all in one place.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/jobs/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Post New Job
            </Link>
            <Link
              href="/projects/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Post New Project
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid - Jobs and Projects */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Open Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.openJobs || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplicationsReceived || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProjects || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Proposals Received</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProposalsReceived || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout - Jobs and Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* JOBS SECTION */}
          <div>
            {/* Open Jobs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Open Jobs</h2>
                <p className="text-sm text-gray-500 mt-1">{openJobs.length} active job(s)</p>
              </div>
              <div className="divide-y divide-gray-100">
                {openJobs.length === 0 ? (
                  <div className="p-8 text-center">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No open jobs yet</p>
                  </div>
                ) : (
                  openJobs.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.id}`} className="block hover:bg-gray-50 transition-colors">
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">${job.budget?.toLocaleString() || 'TBD'}</p>
                        <div className="text-xs text-gray-400 mt-2">
                          {job.proposalCount || 0} application(s)
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Applications Received</h2>
                <p className="text-sm text-gray-500 mt-1">{recentApplications.length} recent application(s)</p>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {recentApplications.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No applications received yet</p>
                  </div>
                ) : (
                  recentApplications.map((app) => (
                    <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <p className="font-semibold text-gray-900">{app.applicantName}</p>
                      <p className="text-sm text-gray-600">{app.applicantEmail}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{app.jobTitle}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'REVIEWING' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' :
                          app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* PROJECTS SECTION */}
          <div>
            {/* Active Projects */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
                <p className="text-sm text-gray-500 mt-1">{activeProjects.length} active project(s)</p>
              </div>
              <div className="divide-y divide-gray-100">
                {activeProjects.length === 0 ? (
                  <div className="p-8 text-center">
                    <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No active projects yet</p>
                  </div>
                ) : (
                  activeProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`} className="block hover:bg-gray-50 transition-colors">
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">${project.budget?.toLocaleString() || 'TBD'}</p>
                        <div className="text-xs text-gray-400 mt-2">
                          Status: {project.status}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Recent Proposals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Proposals Received</h2>
                <p className="text-sm text-gray-500 mt-1">{recentProposals.length} recent proposal(s)</p>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {recentProposals.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No proposals received yet</p>
                  </div>
                ) : (
                  recentProposals.map((proposal) => (
                    <div key={proposal.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <p className="font-semibold text-gray-900">{proposal.jobTitle}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">${proposal.proposedRate?.toLocaleString() || 'TBD'}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          proposal.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                          proposal.status === 'REVIEWING' ? 'bg-yellow-100 text-yellow-700' :
                          proposal.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' :
                          proposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                          proposal.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {proposal.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Completed Projects Section */}
        {completedProjects.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Completed Projects</h2>
              <p className="text-sm text-gray-500 mt-1">{completedProjects.length} completed project(s)</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {completedProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="block">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">${project.budget?.toLocaleString() || 'TBD'}</p>
                    <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}