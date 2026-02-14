import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  Divider,
  Flex,
  Input,
  Text,
} from '../components/green'
import { authApi } from '../lib/api'
import { useAuthStore } from '../store/authStore'

function getCookie(name: string): string | null {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
  return value ? decodeURIComponent(value.split('=')[1]) : null
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(true)

  // Check if token was passed from marketplace via cookie (preferred) or URL params (fallback)
  React.useEffect(() => {
    const tryAutoLogin = async () => {
      // Preferred: token via shared cookie (SameSite=Lax, Domain=localhost)
      let token = getCookie('admin_access_token')
      let userFromUrl: any = null

      // Fallback: URL parameters (legacy)
      const searchParams = new URLSearchParams(window.location.search)
      const urlToken = searchParams.get('admin_token')
      const urlUser = searchParams.get('admin_user')
      if (!token && urlToken) {
        token = decodeURIComponent(urlToken)
        if (urlUser) {
          try {
            userFromUrl = JSON.parse(decodeURIComponent(urlUser))
          } catch (e) {
            console.error('[Login] Failed to parse user from URL:', e)
          }
        }
      }

      if (!token) {
        setIsAutoLoggingIn(false)
        return
      }

      try {
        console.log('[Login] Auto-login using shared token')
        // Fetch fresh user info using token for security
        const me = await authApi.me(token)
        const user = userFromUrl || me

        if (user.role !== 'ADMIN') {
          console.warn('[Login] Auto-login blocked: role is not ADMIN')
          setIsAutoLoggingIn(false)
          return
        }

        login(
          {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
          },
          token
        )

        console.log('[Login] Auto-login successful')

        // Clean up URL
        if (urlToken || urlUser) {
          window.history.replaceState({}, document.title, '/login')
        }

        navigate('/dashboard')
      } catch (e) {
        console.error('[Login] Auto-login failed:', e)
        setIsAutoLoggingIn(false)
      }
    }

    void tryAutoLogin()
  }, [login, navigate])

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
      setIsAutoLoggingIn(false)
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
            <Text font-size="body-s" color="secondary">
              (Auto-login available when redirected from marketplace)
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

              <Button type="submit" disabled={isLoading || isAutoLoggingIn}>
                {isLoading || isAutoLoggingIn ? 'Signing in...' : 'Sign in'}
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
                Email: admin@marketplace.com
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


