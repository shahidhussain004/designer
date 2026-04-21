// Types handled by 'any' casts
import {
    BriefcaseIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UsersIcon,
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import {
    Card,
    Flex,
    Grid,
    Spinner,
    Text
} from '../components/green'
import { adminApi } from '../lib/api'

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
      name: 'Open Jobs',
      value: stats?.openJobs || 0,
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

  // variant mapping removed (not currently used)

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
      <Flex justify-content="space-between" align-items="center">
        <Flex flex-direction="column" gap="2xs">
          <Text tag="h1" font-size="heading-l">
            Dashboard
          </Text>
          <Text color="secondary">Overview of the platform — quick insights and actions.</Text>
        </Flex>
        <Flex gap="s" align-items="center">
          <Text color="secondary">Last updated: {new Date().toLocaleString()}</Text>
        </Flex>
      </Flex>

      {/* Clean Stats Row */}
      <Grid columns="1" className="sm:grid-cols-2 md:grid-cols-4" gap="m">
        {statCards.map((stat) => (
          <Card key={stat.name} padding="m">
            <Flex align-items="center" gap="m">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50">
                <stat.icon width={20} height={20} className="text-primary-600" />
              </div>
              <Flex flex-direction="column">
                <Text font-size="body-s" color="secondary">{stat.name}</Text>
                <Text font-size="heading-m" font-weight="book">{stat.value}</Text>
                <Text color="secondary" style={{ marginTop: '6px' }}>{stat.change}</Text>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Lower Section */}
      <Grid columns="1" gap="l">
        <Card padding="m">
          <Flex flex-direction="column">
            <Text font-size="heading-s" className="mb-3">Recent Activity</Text>
            <Flex flex-direction="column" gap="s">
              {activity && activity.length > 0 ? (
                activity.slice(0, 6).map((item: any, idx: number) => (
                  <Flex key={idx} justify-content="space-between" align-items="center" className="border-b border-secondary-100 pb-3">
                    <Flex flex-direction="column">
                      <Text font-size="body-s" font-weight="book">{item.title}</Text>
                      <Text font-size="body-s" color="secondary">{item.description}</Text>
                    </Flex>
                    <Text color="secondary">{item.time}</Text>
                  </Flex>
                ))
              ) : (
                <Flex justify-content="center" padding="l"><Text color="secondary">No recent activity</Text></Flex>
              )}
            </Flex>
          </Flex>
        </Card>
      </Grid>
    </Flex>
  )
}
