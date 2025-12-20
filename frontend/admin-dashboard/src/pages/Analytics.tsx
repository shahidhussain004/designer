import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../lib/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

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
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
          'rgba(59, 130, 246, 0.8)',
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">Platform performance and insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Revenue (MTD)</p>
          <p className="text-2xl font-bold text-gray-900">
            ${(revenue?.totalMTD || 30000).toLocaleString()}
          </p>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="text-2xl font-bold text-gray-900">
            {(userGrowth?.totalActive || 1250).toLocaleString()}
          </p>
          <p className="text-sm text-green-600">+8% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Jobs Completed (MTD)</p>
          <p className="text-2xl font-bold text-gray-900">
            {jobs?.totalCompleted || 92}
          </p>
          <p className="text-sm text-green-600">+15% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Avg Job Value</p>
          <p className="text-2xl font-bold text-gray-900">
            ${(revenue?.avgJobValue || 326).toLocaleString()}
          </p>
          <p className="text-sm text-yellow-600">-2% from last month</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
          <div className="h-64">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue</h3>
          <div className="h-64">
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Jobs Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Activity</h3>
          <div className="h-64">
            <Line data={jobsData} options={chartOptions} />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Jobs by Category
          </h3>
          <div className="h-64">
            <Doughnut data={categoryData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Freelancers</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Freelancer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jobs Completed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Earned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { name: 'Alex Johnson', jobs: 45, earned: 28500, rating: 4.9 },
              { name: 'Sarah Chen', jobs: 38, earned: 24200, rating: 4.8 },
              { name: 'Mike Williams', jobs: 32, earned: 19800, rating: 4.9 },
              { name: 'Emily Davis', jobs: 28, earned: 17500, rating: 4.7 },
              { name: 'Chris Lee', jobs: 25, earned: 15200, rating: 4.8 },
            ].map((freelancer, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium text-sm">
                      {freelancer.name.charAt(0)}
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {freelancer.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {freelancer.jobs}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${freelancer.earned.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ⭐ {freelancer.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
