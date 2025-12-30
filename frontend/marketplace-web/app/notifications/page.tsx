"use client"

import { Card, Div, Flex } from '@/components/green'
import { PageLayout } from '@/components/layout'
import { dashboardService, Notification } from '@/lib/dashboard'
import { useEffect, useState } from 'react'

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function NotificationItem({ n, onDelete }: { n: Notification; onDelete: (id: number) => void }) {
  return (
    <Card
      variant={n.isRead ? 'primary' : 'information'}
      style={{ marginBottom: 12, padding: '12px 16px' }}
    >
      <Flex justify-content="space-between" align-items="center">
        <Div>
          <div style={{ fontSize: 15, fontWeight: n.isRead ? 500 : 700, color: '#111827' }}>{n.title}</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>{n.message}</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>{formatTime(n.createdAt)}</div>
        </Div>
        <div style={{ marginLeft: 12 }}>
          <button
            onClick={() => onDelete(n.id)}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              cursor: 'pointer'
            }}
            aria-label="Delete notification"
          >
            ✕
          </button>
        </div>
      </Flex>
    </Card>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await dashboardService.getNotifications()
        if (mounted) setNotifications(data)
      } catch (e) {
        console.error('Failed to load notifications', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <PageLayout>
      <Div style={{ maxWidth: 980, margin: '32px auto', padding: '0 16px' }}>
        <h1 style={{ fontSize: 24, margin: '0 0 12px' }}>Notifications</h1>
        <p style={{ color: '#6b7280', marginTop: 0 }}>All your recent activity and important updates in one place.</p>

        <div style={{ marginTop: 20 }}>
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>Loading…</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>No notifications</div>
          ) : (
            notifications.map(n => (
              <NotificationItem key={n.id} n={n} onDelete={handleDelete} />
            ))
          )}
        </div>
      </Div>
    </PageLayout>
  )
}
