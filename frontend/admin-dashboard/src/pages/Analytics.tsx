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
      <Flex justify-content="center" align-items="center" style={{ minHeight: '400px' } as any}>
        <Spinner />
      </Flex>
    )
  }

  return (
    <Flex flex-direction="column" gap="l">
      {/* Header */}
      <div>
        <Text tag="h1" style={{ fontSize: '1.5rem', fontWeight: 700 } as any}>
          Analytics
        </Text>
        <Text style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
          Platform performance and insights
        </Text>
      </div>

      {/* Summary Cards */}
      <Grid columns="1; s{2}; m{4}" gap="m">
        <Card>
          <Flex flex-direction="column" padding="m" gap="xs">
            <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
              Total Revenue (MTD)
            </Text>
            <Text style={{ fontSize: '1.75rem', fontWeight: 700 } as any}>
              ${(revenue?.totalMTD || 30000).toLocaleString()}
            </Text>
            <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-positive)' } as any}>
              +12% from last month
            </Text>
          </Flex>
        </Card>

        <Card>
          <Flex flex-direction="column" padding="m" gap="xs">
            <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
              Active Users
            </Text>
            <Text style={{ fontSize: '1.75rem', fontWeight: 700 } as any}>
              {(userGrowth?.totalActive || 1250).toLocaleString()}
            </Text>
            <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-positive)' } as any}>
              +8% from last month
            </Text>
          </Flex>
        </Card>

        <Card>
          <Flex flex-direction="column" padding="m" gap="xs">
            <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
              Jobs Completed (MTD)
            </Text>
            <Text style={{ fontSize: '1.75rem', fontWeight: 700 } as any}>
              {jobs?.totalCompleted || 92}
            </Text>
            <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-positive)' } as any}>
              +15% from last month
            </Text>
          </Flex>
        </Card>

        <Card>
          <Flex flex-direction="column" padding="m" gap="xs">
            <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
              Avg Job Value
            </Text>
            <Text style={{ fontSize: '1.75rem', fontWeight: 700 } as any}>
              ${(revenue?.avgJobValue || 326).toLocaleString()}
            </Text>
            <Text style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-notice)' } as any}>
              -2% from last month
            </Text>
          </Flex>
        </Card>
      </Grid>

      {/* Charts Grid */}
      <Grid columns="1; l{2}" gap="l">
        {/* User Growth Chart */}
        <Card>
          <Flex flex-direction="column" padding="l" gap="m">
            <Text style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>User Growth</Text>
            <div style={{ height: '256px' } as any}>
              <Line data={userGrowthData} options={chartOptions} />
            </div>
          </Flex>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <Flex flex-direction="column" padding="l" gap="m">
            <Text style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>Revenue</Text>
            <div style={{ height: '256px' } as any}>
              <Bar data={revenueData} options={chartOptions} />
            </div>
          </Flex>
        </Card>

        {/* Jobs Chart */}
        <Card>
          <Flex flex-direction="column" padding="l" gap="m">
            <Text style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>Job Activity</Text>
            <div style={{ height: '256px' } as any}>
              <Line data={jobsData} options={chartOptions} />
            </div>
          </Flex>
        </Card>

        {/* Category Distribution */}
        <Card>
          <Flex flex-direction="column" padding="l" gap="m">
            <Text style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>Jobs by Category</Text>
            <div style={{ height: '256px' } as any}>
              <Doughnut data={categoryData} options={doughnutOptions} />
            </div>
          </Flex>
        </Card>
      </Grid>

      {/* Top Performers Table */}
      <Card>
        <Flex flex-direction="column">
          <Flex padding="l">
            <Text style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>Top Freelancers</Text>
          </Flex>
          <Divider />

          {/* Table Header */}
          <Grid columns="2fr 1fr 1fr 1fr" gap="m" padding="m" style={{ background: 'var(--gds-color-l3-background-secondary)' } as any}>
            <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
              Freelancer
            </Text>
            <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
              Jobs Completed
            </Text>
            <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
              Total Earned
            </Text>
            <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>
              Rating
            </Text>
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
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--gds-color-l3-background-positive)',
                      color: 'var(--gds-color-l3-content-positive)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    } as any}
                  >
                    {freelancer.name.charAt(0)}
                  </div>
                  <Text style={{ fontWeight: 500 } as any}>{freelancer.name}</Text>
                </Flex>
                <Text style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>{freelancer.jobs}</Text>
                <Text style={{ fontWeight: 500 } as any}>${freelancer.earned.toLocaleString()}</Text>
                <Text style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>⭐ {freelancer.rating}</Text>
              </Grid>
            </div>
          ))}
        </Flex>
      </Card>
    </Flex>
  )
}
