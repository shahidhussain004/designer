import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button, Card, Flex, Input, Text } from '../components/green'
import { authApi, usersApi } from '../lib/api'

export default function Profile() {
  const queryClient = useQueryClient()
  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: authApi.me })
  const [form, setForm] = useState({ email: '', fullName: '' })

  useEffect(() => {
    if (me) setForm({ email: me.email || '', fullName: me.fullName || '' })
  }, [me])

  const updateMut = useMutation({
    mutationFn: (payload: any) => usersApi.update(me.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Profile updated')
    },
    onError: () => toast.error('Failed to update profile')
  })

  const handleSave = () => updateMut.mutate({ email: form.email, fullName: form.fullName })

  if (isLoading) return <Flex justify-content="center" align-items="center"><Text>Loading...</Text></Flex>

  return (
    <Flex flex-direction="column" gap="l">
      <Text className="text-2xl font-bold">My Profile</Text>
      <Card>
        <Flex flex-direction="column" gap="m">
          <Input label="Full name" value={form.fullName} onInput={(e) => setForm({...form, fullName: (e.target as HTMLInputElement).value})} />
          <Input label="Email" value={form.email} onInput={(e) => setForm({...form, email: (e.target as HTMLInputElement).value})} />
          <Flex justify-content="flex-end">
            <Button onClick={handleSave}>Save</Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  )
}
