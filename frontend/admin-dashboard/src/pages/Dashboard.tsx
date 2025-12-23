// Types handled by 'any' casts
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../lib/api'
import { Link } from 'react-router-dom'
import {
  GdsGrid,
  GdsFlex,
  GdsCard,
  GdsText,
  GdsBadge,
  GdsSpinner,
} from '../components/green'
import {
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

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

  const getVariant = (changeType: string): 'positive' | 'negative' | 'information' => {
    switch (changeType) {
      case 'positive':
        return 'positive'
      case 'negative':
        return 'negative'
      default:
        return 'information'
    }
  }

  if (isLoading) {
    return (
      <GdsFlex justify-content="center" align-items="center" style={{ height: '256px' } as any}>
        <GdsSpinner />
      </GdsFlex>
    )
  }

  return (
    <GdsFlex flex-direction="column" gap="l">
      {/* Header */}
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText tag="h1" font-size="heading-l">
          Dashboard
        </GdsText>
        <GdsText color="secondary">
          Welcome back! Here&apos;s what&apos;s happening.
        </GdsText>
      </GdsFlex>

      {/* Stats Grid */}
      <GdsGrid columns="1; s{2}; l{4}" gap="m">
        {statCards.map((stat) => (
          <GdsCard key={stat.name} padding="l">
            <GdsFlex flex-direction="column" gap="m">
              <GdsFlex align-items="center" gap="m">
                <GdsFlex
                  justify-content="center"
                  align-items="center"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--gds-color-l3-background-positive)',
                  } as any}
                >
                  <stat.icon style={{ width: '24px', height: '24px', color: 'var(--gds-color-l3-content-positive)' }} />
                </GdsFlex>
                <GdsFlex flex-direction="column" gap="2xs">
                  <GdsText font-size="body-s" color="secondary">
                    {stat.name}
                  </GdsText>
                  <GdsText font-size="heading-m" font-weight="book">
                    {stat.value}
                  </GdsText>
                </GdsFlex>
              </GdsFlex>
              <GdsBadge variant={getVariant(stat.changeType)}>
                {stat.change}
              </GdsBadge>
            </GdsFlex>
          </GdsCard>
        ))}
      </GdsGrid>

      {/* Bottom Section */}
      <GdsGrid columns="1; l{2}" gap="l">
        {/* Recent Activity */}
        <GdsCard padding="0">
          <GdsFlex flex-direction="column">
            <GdsFlex padding="m" style={{ borderBottom: '1px solid var(--gds-color-l3-border-primary)' } as any}>
              <GdsText font-size="heading-s">Recent Activity</GdsText>
            </GdsFlex>
            <GdsFlex flex-direction="column">
              {activity?.slice(0, 5).map((item: { title: string; description: string; time: string }, index: number) => (
                <GdsFlex
                  key={index}
                  justify-content="space-between"
                  align-items="center"
                  padding="m"
                  style={{
                    borderBottom: index < 4 ? '1px solid var(--gds-color-l3-border-primary)' : 'none',
                  } as any}
                >
                  <GdsFlex flex-direction="column" gap="2xs">
                    <GdsText font-size="body-s" font-weight="book">
                      {item.title}
                    </GdsText>
                    <GdsText font-size="body-s" color="secondary">
                      {item.description}
                    </GdsText>
                  </GdsFlex>
                  <GdsText font-size="body-s" color="secondary">
                    {item.time}
                  </GdsText>
                </GdsFlex>
              )) || (
                <GdsFlex justify-content="center" padding="l">
                  <GdsText color="secondary">No recent activity</GdsText>
                </GdsFlex>
              )}
            </GdsFlex>
          </GdsFlex>
        </GdsCard>

        {/* Quick Actions */}
        <GdsCard padding="0">
          <GdsFlex flex-direction="column">
            <GdsFlex padding="m" style={{ borderBottom: '1px solid var(--gds-color-l3-border-primary)' } as any}>
              <GdsText font-size="heading-s">Quick Actions</GdsText>
            </GdsFlex>
            <GdsGrid columns="2" gap="m" padding="m">
              <Link to="/users" style={{ textDecoration: 'none' }}>
                <GdsCard padding="m" variant="secondary" style={{ cursor: 'pointer' } as any}>
                  <GdsFlex align-items="center" justify-content="center" gap="s">
                    <UsersIcon style={{ width: '20px', height: '20px' }} />
                    <GdsText font-size="body-s">Manage Users</GdsText>
                  </GdsFlex>
                </GdsCard>
              </Link>
              <Link to="/jobs" style={{ textDecoration: 'none' }}>
                <GdsCard padding="m" variant="secondary" style={{ cursor: 'pointer' } as any}>
                  <GdsFlex align-items="center" justify-content="center" gap="s">
                    <BriefcaseIcon style={{ width: '20px', height: '20px' }} />
                    <GdsText font-size="body-s">Review Jobs</GdsText>
                  </GdsFlex>
                </GdsCard>
              </Link>
              <Link to="/disputes" style={{ textDecoration: 'none' }}>
                <GdsCard padding="m" variant="secondary" style={{ cursor: 'pointer' } as any}>
                  <GdsFlex align-items="center" justify-content="center" gap="s">
                    <ClockIcon style={{ width: '20px', height: '20px' }} />
                    <GdsText font-size="body-s">Handle Disputes</GdsText>
                  </GdsFlex>
                </GdsCard>
              </Link>
              <Link to="/analytics" style={{ textDecoration: 'none' }}>
                <GdsCard padding="m" variant="secondary" style={{ cursor: 'pointer' } as any}>
                  <GdsFlex align-items="center" justify-content="center" gap="s">
                    <CurrencyDollarIcon style={{ width: '20px', height: '20px' }} />
                    <GdsText font-size="body-s">View Analytics</GdsText>
                  </GdsFlex>
                </GdsCard>
              </Link>
            </GdsGrid>
          </GdsFlex>
        </GdsCard>
      </GdsGrid>
    </GdsFlex>
  )
}
