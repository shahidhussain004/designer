"use client"

import { authService } from '@/lib/auth'
import { ClientDashboard, getDashboardData } from '@/lib/dashboard'
import { Briefcase, CheckCircle, FileText, Loader2, Plus } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    </div>
  )

  if (error || !data) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-600">{error || 'No data'}</p>
    </div>
  )

  const { stats, openJobs = [] } = data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <p className="mt-2 text-gray-400">Welcome back! Manage your jobs and proposals.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-sm text-gray-500">Proposals Received</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProposalsReceived || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobs || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Open Jobs Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Open Jobs</h2>
                <p className="text-sm text-gray-500 mt-1">Jobs you have posted</p>
              </div>
              <Link
                href="/jobs/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Post New Job
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {openJobs.length === 0 ? (
              <div className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No open jobs. Post your first job to get started!</p>
              </div>
            ) : (
              openJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block hover:bg-gray-50 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{job.description.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-400 mt-2">{job.proposalCount} proposals</p>
                      </div>
                      <span className="text-lg font-bold text-primary-600">${job.budget}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}