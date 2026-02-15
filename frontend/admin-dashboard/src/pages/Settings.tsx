import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button, Card, Flex, Text } from '../components/green'
import { authApi, usersApi } from '../lib/api'

export default function Settings() {
  const queryClient = useQueryClient()
  const { data: me } = useQuery<any>({ queryKey: ['me'], queryFn: () => authApi.me() })

  const [emailNotifications, setEmailNotifications] = useState({ jobAlerts: true, messages: true })

  useEffect(() => {
    if (me?.preferences) setEmailNotifications(me.preferences.emailNotifications || emailNotifications)
  }, [me])

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => usersApi.update(me?.id, { ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Settings saved')
    },
    onError: () => toast.error('Failed to save settings'),
  })

  const handleSave = () => {
    saveMutation.mutate({ preferences: { emailNotifications } })
  }

  return (
    <Flex flex-direction="column" gap="l">
      <Text className="text-2xl font-bold">Settings</Text>
      <Card>
        <Text className="font-semibold mb-3">Email Notifications</Text>
        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={emailNotifications.jobAlerts} onChange={(e) => setEmailNotifications({...emailNotifications, jobAlerts: e.target.checked})} />
            <span>Job Alerts</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={emailNotifications.messages} onChange={(e) => setEmailNotifications({...emailNotifications, messages: e.target.checked})} />
            <span>Messages</span>
          </label>
        </div>

        <Flex justify-content="flex-end" className="mt-4">
          <Button onClick={handleSave}>Save</Button>
        </Flex>
      </Card>
    </Flex>
  )
}
