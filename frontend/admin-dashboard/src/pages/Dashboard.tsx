// Types handled by 'any' casts
import {
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Badge,
  Card,
  Flex,
  Grid,
  Spinner,
  Text,
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

  const getVariant = (changeType: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
    switch (changeType) {
      case 'positive':
        return 'success'
      case 'negative':
        return 'danger'
      default:
        return 'primary'
    }
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
      <Flex flex-direction="column" gap="xs">
        <Text tag="h1" font-size="heading-l">
          Dashboard
        </Text>
        <Text color="secondary">
          Welcome back! Here&apos;s what&apos;s happening.
        </Text>
      </Flex>

      {/* Stats Grid */}
      <Grid columns="1; s{2}; l{4}" gap="m">
        {statCards.map((stat) => (
          <Card key={stat.name} padding="l">
            <Flex flex-direction="column" gap="m">
              <Flex align-items="center" gap="m">
                <Flex justify-content="center" align-items="center">
                  <stat.icon width={24} height={24} />
                </Flex>
                <Flex flex-direction="column" gap="2xs">
                  <Text font-size="body-s" color="secondary">
                    {stat.name}
                  </Text>
                  <Text font-size="heading-m" font-weight="book">
                    {stat.value}
                  </Text>
                </Flex>
              </Flex>
              <Badge variant={getVariant(stat.changeType)}>
                {stat.change}
              </Badge>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Bottom Section */}
      <Grid columns="1; l{2}" gap="l">
        {/* Recent Activity */}
        <Card padding="0">
          <Flex flex-direction="column">
            <Flex padding="m">
              <Text font-size="heading-s">Recent Activity</Text>
            </Flex>
            <Flex flex-direction="column">
              {activity?.slice(0, 5).map((item: { title: string; description: string; time: string }, index: number) => (
                <Flex key={index} justify-content="space-between" align-items="center" padding="m">
                  <Flex flex-direction="column" gap="2xs">
                    <Text font-size="body-s" font-weight="book">
                      {item.title}
                    </Text>
                    <Text font-size="body-s" color="secondary">
                      {item.description}
                    </Text>
                  </Flex>
                  <Text font-size="body-s" color="secondary">
                    {item.time}
                  </Text>
                </Flex>
              )) || (
                <Flex justify-content="center" padding="l">
                  <Text color="secondary">No recent activity</Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Card>

        {/* Quick Actions */}
        <Card padding="0">
          <Flex flex-direction="column">
            <Flex padding="m">
              <Text font-size="heading-s">Quick Actions</Text>
            </Flex>
            <Grid columns="2" gap="m" padding="m">
              <Link to="/users">
                <Card padding="m" variant="secondary">
                  <Flex align-items="center" justify-content="center" gap="s">
                    <UsersIcon width={20} height={20} />
                    <Text font-size="body-s">Manage Users</Text>
                  </Flex>
                </Card>
              </Link>
              <Link to="/jobs">
                <Card padding="m" variant="secondary">
                  <Flex align-items="center" justify-content="center" gap="s">
                    <BriefcaseIcon width={20} height={20} />
                    <Text font-size="body-s">Review Jobs</Text>
                  </Flex>
                </Card>
              </Link>
              <Link to="/disputes">
                <Card padding="m" variant="secondary">
                  <Flex align-items="center" justify-content="center" gap="s">
                    <ClockIcon width={20} height={20} />
                    <Text font-size="body-s">Handle Disputes</Text>
                  </Flex>
                </Card>
              </Link>
              <Link to="/analytics">
                <Card padding="m" variant="secondary">
                  <Flex align-items="center" justify-content="center" gap="s">
                    <CurrencyDollarIcon width={20} height={20} />
                    <Text font-size="body-s">View Analytics</Text>
                  </Flex>
                </Card>
              </Link>
            </Grid>
          </Flex>
        </Card>
      </Grid>
    </Flex>
  )
}
