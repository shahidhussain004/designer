// Types handled by 'any' casts
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
import {
  Card,
  Flex,
  Grid,
  Text,
  Divider,
  Spinner,
} from '../components/green'

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
      <Flex justify-content="center" align-items="center">
        <Spinner />
      </Flex>
    )
  }

  return (
    <Flex flex-direction="column" gap="l">
      {/* Header */}
      <div>
        <Text tag="h1">Analytics</Text>
        <Text>Platform performance and insights</Text>
      </div>

      {/* Summary Cards */}
      <Grid columns="1; s{2}; m{4}" gap="m">
        <Card>
          <Flex flex-direction="column" padding="m" gap="xs">
            <Text>Total Revenue (MTD)</Text>
            <Text>{(revenue?.totalMTD || 30000).toLocaleString()}</Text>
            <Text>+12% from last month</Text>
          </Flex>
        </Card>

        <Card>
          <Flex flex-direction="column" padding="m" gap="xs">
            <Text>Active Users</Text>
            <Text>{(userGrowth?.totalActive || 1250).toLocaleString()}</Text>
            <Text>+8% from last month</Text>
          </Flex>
        </Card>

        <Card>
          <Flex flex-direction="column" padding="m" gap="xs">
            <Text>Jobs Completed (MTD)</Text>
            <Text>{jobs?.totalCompleted || 92}</Text>
            <Text>+15% from last month</Text>
          </Flex>
        </Card>

        <Card>
          <Flex flex-direction="column" padding="m" gap="xs">
            <Text>Avg Job Value</Text>
            <Text>{(revenue?.avgJobValue || 326).toLocaleString()}</Text>
            <Text>-2% from last month</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Charts Grid */}
      <Grid columns="1; l{2}" gap="l">
        {/* User Growth Chart */}
        <Card>
          <Flex flex-direction="column" padding="l" gap="m">
            <Text>User Growth</Text>
            <div>
              <Line data={userGrowthData} options={chartOptions} />
            </div>
          </Flex>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <Flex flex-direction="column" padding="l" gap="m">
            <Text>Revenue</Text>
            <div>
              <Bar data={revenueData} options={chartOptions} />
            </div>
          </Flex>
        </Card>

        {/* Jobs Chart */}
        <Card>
          <Flex flex-direction="column" padding="l" gap="m">
            <Text>Job Activity</Text>
            <div>
              <Line data={jobsData} options={chartOptions} />
            </div>
          </Flex>
        </Card>

        {/* Category Distribution */}
        <Card>
          <Flex flex-direction="column" padding="l" gap="m">
            <Text>Jobs by Category</Text>
            <div>
              <Doughnut data={categoryData} options={doughnutOptions} />
            </div>
          </Flex>
        </Card>
      </Grid>

      {/* Top Performers Table */}
      <Card>
        <Flex flex-direction="column">
          <Flex padding="l">
            <Text>Top Freelancers</Text>
          </Flex>
          <Divider />

          {/* Table Header */}
          <Grid columns="2fr 1fr 1fr 1fr" gap="m" padding="m">
            <Text>Freelancer</Text>
            <Text>Jobs Completed</Text>
            <Text>Total Earned</Text>
            <Text>Rating</Text>
          </Grid>

          {/* Table Body */}
          {[
            { name: 'Alex Johnson', jobs: 45, earned: 28500, rating: 4.9 },
            { name: 'Sarah Chen', jobs: 38, earned: 24200, rating: 4.8 },
            { name: 'Mike Williams', jobs: 32, earned: 19800, rating: 4.9 },
            { name: 'Emily Davis', jobs: 28, earned: 17500, rating: 4.7 },
            { name: 'Chris Lee', jobs: 25, earned: 15200, rating: 4.8 },
          ].map((freelancer, index) => (
            <div key={index}>
              <Divider />
              <Grid columns="2fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center">
                <Flex gap="m" align-items="center">
                  <div>
                    {freelancer.name.charAt(0)}
                  </div>
                  <Text>{freelancer.name}</Text>
                </Flex>
                <Text>{freelancer.jobs}</Text>
                <Text>${freelancer.earned.toLocaleString()}</Text>
                <Text>⭐ {freelancer.rating}</Text>
              </Grid>
            </div>
          ))}
        </Flex>
      </Card>
    </Flex>
  )
}
