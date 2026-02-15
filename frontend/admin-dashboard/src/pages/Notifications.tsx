import { useQuery } from '@tanstack/react-query'
import { Card, Flex, Spinner, Text } from '../components/green'
import api from '../lib/api'

export default function Notifications() {
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const resp = await api.get('/notifications')
      return resp.data
    },
  })

  return (
    <Flex flex-direction="column" gap="l">
      <Text className="text-2xl font-bold">Notifications</Text>

      <Card>
        {isLoading ? (
          <Flex justify-content="center" align-items="center" padding="l"><Spinner /></Flex>
        ) : !data || data.length === 0 ? (
          <Flex justify-content="center" padding="l"><Text color="secondary">No notifications</Text></Flex>
        ) : (
          <div className="space-y-3">
            {data.map((n: any) => (
              <div key={n.id} className="p-3 border rounded bg-white">
                <Text className="font-medium">{n.title}</Text>
                <Text color="secondary">{n.message}</Text>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Flex>
  )
}
