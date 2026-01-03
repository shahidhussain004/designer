"use client"

import { dashboardService, Notification } from '@/lib/dashboard'
import { Bell, Loader2, Trash2 } from 'lucide-react'
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
    <div className={`bg-white rounded-lg shadow-sm border p-4 mb-3 ${n.isRead ? 'border-gray-200' : 'border-primary-300 bg-primary-50'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm ${n.isRead ? 'font-medium text-gray-900' : 'font-bold text-gray-900'}`}>
            {n.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{n.message}</p>
          <p className="text-xs text-gray-400 mt-2">{formatTime(n.createdAt)}</p>
        </div>
        <button
          onClick={() => onDelete(n.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete notification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-gray-400 mt-1">All your recent activity and important updates in one place.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p className="text-gray-500 mt-1">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div>
            {notifications.map(n => (
              <NotificationItem key={n.id} n={n} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
