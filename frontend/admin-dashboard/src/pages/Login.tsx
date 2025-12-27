import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../lib/api'
import toast from 'react-hot-toast'
import {
  Flex,
  Card,
  Text,
  Button,
  Input,
  Divider,
} from '../components/green'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authApi.login(email, password)
     
      console.log('Login response:', response)
      // Check if user is admin (role is inside user object)
      if (response.user.role !== 'ADMIN') {
        toast.error('Access denied. Admin privileges required.')
        return
      }

      login(
        {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          fullName: response.user.fullName,
          role: response.user.role,
        },
        response.accessToken
      )

      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex justify-content="center" align-items="center" padding="l">
      <Card padding="xl">
        <Flex flex-direction="column" gap="l">
          {/* Header */}
          <Flex flex-direction="column" align-items="center" gap="s">
            <Text tag="h1" font-size="heading-l">
              Admin Dashboard
            </Text>
            <Text color="secondary">
              Sign in to access the admin panel
            </Text>
          </Flex>

          <Divider />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Flex flex-direction="column" gap="m">
              <Input
                label="Email address"
                type="email"
                value={email}
                onInput={(e: React.FormEvent<HTMLInputElement>) => setEmail((e.target as HTMLInputElement).value)}
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onInput={(e: React.FormEvent<HTMLInputElement>) => setPassword((e.target as HTMLInputElement).value)}
                required
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Flex>
          </form>

          <Divider />

          {/* Demo Credentials */}
          <Card padding="m" variant="secondary">
            <Flex flex-direction="column" gap="xs" align-items="center">
              <Text font-size="body-s" font-weight="book">
                Demo Admin Credentials
              </Text>
              <Text font-size="body-s" color="secondary">
                Email: admin@designermarket.com
              </Text>
              <Text font-size="body-s" color="secondary">
                Password: password123
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Card>
    </Flex>
  )
}


