import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { analyticsApi } from '../lib/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface UserGrowthData {
  labels?: string[]
  data?: number[]
  activeData?: number[]
  totalActive?: number
}

interface RevenueData {
  labels?: string[]
  data?: number[]
  feesData?: number[]
  totalMTD?: number
  avgJobValue?: number
}

interface JobsData {
  labels?: string[]
  postedData?: number[]
  completedData?: number[]
  totalCompleted?: number
}

interface CategoryData {
  labels?: string[]
  data?: number[]
}

export default function Analytics() {
  const { data: userGrowth, isLoading: loadingUsers } = useQuery<UserGrowthData>({
    queryKey: ['analytics-users'],
    queryFn: () => analyticsApi.getUserGrowth(),
  })

  const { data: revenue, isLoading: loadingRevenue } = useQuery<RevenueData>({
    queryKey: ['analytics-revenue'],
    queryFn: () => analyticsApi.getRevenue(),
  })

  const { data: jobs, isLoading: loadingJobs } = useQuery<JobsData>({
    queryKey: ['analytics-jobs'],
    queryFn: () => analyticsApi.getJobStats(),
  })

  const { data: categories, isLoading: loadingCategories } = useQuery<CategoryData>({
    queryKey: ['analytics-categories'],
    queryFn: () => analyticsApi.getCategoryDistribution(),
  })

  const isLoading = loadingUsers || loadingRevenue || loadingJobs || loadingCategories

  const userGrowthData = {
    labels: userGrowth?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: userGrowth?.data || [120, 150, 180, 220, 290, 350],
        borderColor: 'rgb(31, 106, 186)',
        backgroundColor: 'rgba(31, 106, 186, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Active Users',
        data: userGrowth?.activeData || [100, 130, 160, 200, 260, 320],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const revenueData = {
    labels: revenue?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: revenue?.data || [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Platform Fees ($)',
        data: revenue?.feesData || [1200, 1900, 1500, 2500, 2200, 3000],
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderRadius: 4,
      },
    ],
  }

  const jobsData = {
    labels: jobs?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Jobs Posted',
        data: jobs?.postedData || [45, 60, 55, 80, 95, 110],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgb(99, 102, 241)',
        tension: 0.4,
      },
      {
        label: 'Jobs Completed',
        data: jobs?.completedData || [35, 48, 45, 65, 78, 92],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgb(16, 185, 129)',
        tension: 0.4,
      },
    ],
  }

  const categoryData = {
    labels: categories?.labels || [
      'Web Development',
      'Mobile Apps',
      'UI/UX Design',
      'Writing',
      'Marketing',
      'Other',
    ],
    datasets: [
      {
        data: categories?.data || [35, 25, 20, 10, 5, 5],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(31, 106, 186, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-secondary-600 mt-4">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Analytics & Insights</h1>
        <p className="text-secondary-600 mt-1">Platform performance metrics and trends</p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg shadow-sm p-6 border border-primary-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary-600 font-medium">Total Revenue (MTD)</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                ${(revenue?.totalMTD || 30000).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-success-600 mt-3">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                +12% from last month
              </div>
            </div>
            <div className="p-3 bg-primary-500 bg-opacity-20 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-lg shadow-sm p-6 border border-success-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-success-600 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-success-900 mt-2">
                {(userGrowth?.totalActive || 1250).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-success-600 mt-3">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                +8% from last month
              </div>
            </div>
            <div className="p-3 bg-success-500 bg-opacity-20 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        {/* Jobs Completed */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg shadow-sm p-6 border border-primary-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary-600 font-medium">Jobs Completed (MTD)</p>
              <p className="text-2xl font-bold text-primary-900 mt-2">
                {jobs?.totalCompleted || 92}
              </p>
              <div className="flex items-center gap-1 text-sm text-success-600 mt-3">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                +15% from last month
              </div>
            </div>
            <div className="p-3 bg-primary-500 bg-opacity-20 rounded-lg">
              <BriefcaseIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Avg Job Value */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-sm p-6 border border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Avg Job Value</p>
              <p className="text-2xl font-bold text-orange-900 mt-2">
                ${(revenue?.avgJobValue || 326).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-error-600 mt-3">
                <ArrowTrendingDownIcon className="w-4 h-4" />
                -2% from last month
              </div>
            </div>
            <div className="p-3 bg-orange-500 bg-opacity-20 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">User Growth Trends</h2>
          <div style={{ height: '300px' }}>
            <Line data={userGrowthData} options={chartOptions} />
          </div>
          <p className="text-xs text-secondary-500 mt-4 text-center">Monthly user acquisition and active users over the past 6 months</p>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Revenue Analysis</h2>
          <div style={{ height: '300px' }}>
            <Bar data={revenueData} options={chartOptions} />
          </div>
          <p className="text-xs text-secondary-500 mt-4 text-center">Total platform revenue and fees collected</p>
        </div>

        {/* Jobs Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Job Activity</h2>
          <div style={{ height: '300px' }}>
            <Line data={jobsData} options={chartOptions} />
          </div>
          <p className="text-xs text-secondary-500 mt-4 text-center">Posted vs Completed jobs over the past 6 months</p>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Jobs by Category</h2>
          <div style={{ height: '300px' }}>
            <Doughnut data={categoryData} options={doughnutOptions} />
          </div>
          <p className="text-xs text-secondary-500 mt-4 text-center">Distribution of jobs across different categories</p>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">Top Freelancers</h2>
          <p className="text-sm text-secondary-600 mt-1">Best performing freelancers by jobs completed and earnings</p>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50 border-b border-secondary-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-900">Freelancer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-900">Jobs Completed</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-900">Total Earned</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-900">Rating</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Alex Johnson', jobs: 45, earned: 28500, rating: 4.9 },
                { name: 'Sarah Chen', jobs: 38, earned: 24200, rating: 4.8 },
                { name: 'Mike Williams', jobs: 32, earned: 19800, rating: 4.9 },
                { name: 'Emily Davis', jobs: 28, earned: 17500, rating: 4.7 },
                { name: 'Chris Lee', jobs: 25, earned: 15200, rating: 4.8 },
              ].map((freelancer, index) => (
                <tr key={index} className="border-b border-secondary-200 hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-700">
                        {freelancer.name.charAt(0)}
                      </div>
                      <span className="font-medium text-secondary-900">{freelancer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary-600">{freelancer.jobs}</td>
                  <td className="px-6 py-4 font-semibold text-secondary-900">${freelancer.earned.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span className="font-medium text-secondary-900">{freelancer.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-3 p-4">
          {[
            { name: 'Alex Johnson', jobs: 45, earned: 28500, rating: 4.9 },
            { name: 'Sarah Chen', jobs: 38, earned: 24200, rating: 4.8 },
            { name: 'Mike Williams', jobs: 32, earned: 19800, rating: 4.9 },
            { name: 'Emily Davis', jobs: 28, earned: 17500, rating: 4.7 },
            { name: 'Chris Lee', jobs: 25, earned: 15200, rating: 4.8 },
          ].map((freelancer, index) => (
            <div key={index} className="bg-gradient-to-r from-secondary-50 to-white rounded-lg p-4 border border-secondary-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-700">
                  {freelancer.name.charAt(0)}
                </div>
                <span className="font-semibold text-secondary-900">{freelancer.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-secondary-600">Jobs</p>
                  <p className="font-semibold text-secondary-900">{freelancer.jobs}</p>
                </div>
                <div>
                  <p className="text-secondary-600">Earned</p>
                  <p className="font-semibold text-secondary-900">${(freelancer.earned / 1000).toFixed(1)}k</p>
                </div>
                <div>
                  <p className="text-secondary-600">Rating</p>
                  <p className="font-semibold text-secondary-900">⭐ {freelancer.rating}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
