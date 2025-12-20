import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../lib/api'
import {
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface StatCard {
  name: string
  value: string | number
  icon: typeof UsersIcon
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: adminApi.getDashboardStats,
  })

  const { data: activity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: adminApi.getRecentActivity,
  })

  const statCards: StatCard[] = [
    {
      name: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      change: `+${stats?.newUsersThisWeek || 0} this week`,
      changeType: 'positive',
    },
    {
      name: 'Active Jobs',
      value: stats?.activeJobs || 0,
      icon: BriefcaseIcon,
      change: `${stats?.pendingJobs || 0} pending review`,
      changeType: 'neutral',
    },
    {
      name: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      change: `+${stats?.revenueGrowth || 0}% from last month`,
      changeType: 'positive',
    },
    {
      name: 'Pending Disputes',
      value: stats?.pendingDisputes || 0,
      icon: ClockIcon,
      change: `${stats?.resolvedDisputesThisWeek || 0} resolved this week`,
      changeType: stats?.pendingDisputes > 5 ? 'negative' : 'neutral',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
            <p
              className={clsx(
                'mt-2 text-sm',
                stat.changeType === 'positive' && 'text-green-600',
                stat.changeType === 'negative' && 'text-red-600',
                stat.changeType === 'neutral' && 'text-gray-500'
              )}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {activity?.slice(0, 5).map((item: any, index: number) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              </div>
            )) || (
              <div className="px-6 py-4 text-center text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <a
              href="/users"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <UsersIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Manage Users
              </span>
            </a>
            <a
              href="/jobs"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Review Jobs
              </span>
            </a>
            <a
              href="/disputes"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ClockIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Handle Disputes
              </span>
            </a>
            <a
              href="/analytics"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                View Analytics
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
