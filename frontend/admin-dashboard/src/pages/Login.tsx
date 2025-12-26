import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../lib/api'
import toast from 'react-hot-toast'
import {
  GdsFlex,
  GdsCard,
  GdsText,
  GdsButton,
  GdsInput,
  GdsDivider,
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
      
      // Check if user is admin
      if (response.role !== 'ADMIN') {
        toast.error('Access denied. Admin privileges required.')
        return
      }

      login(
        {
          id: response.userId,
          email: response.email,
          username: response.username,
          fullName: response.fullName,
          role: response.role,
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
    <GdsFlex
      justify-content="center"
      align-items="center"
      padding="l"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--gds-color-l3-background-secondary)',
      } as any}
    >
      <GdsCard padding="xl" style={{ maxWidth: '400px', width: '100%' } as any}>
        <GdsFlex flex-direction="column" gap="l">
          {/* Header */}
          <GdsFlex flex-direction="column" align-items="center" gap="s">
            <GdsText tag="h1" font-size="heading-l">
              Admin Dashboard
            </GdsText>
            <GdsText color="secondary">
              Sign in to access the admin panel
            </GdsText>
          </GdsFlex>

          <GdsDivider />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <GdsFlex flex-direction="column" gap="m">
              <GdsInput
                label="Email address"
                type="email"
                value={email}
                onInput={(e: React.FormEvent<HTMLInputElement>) => setEmail((e.target as HTMLInputElement).value)}
                required
              />

              <GdsInput
                label="Password"
                type="password"
                value={password}
                onInput={(e: React.FormEvent<HTMLInputElement>) => setPassword((e.target as HTMLInputElement).value)}
                required
              />

              <GdsButton type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </GdsButton>
            </GdsFlex>
          </form>

          <GdsDivider />

          {/* Demo Credentials */}
          <GdsCard padding="m" variant="secondary">
            <GdsFlex flex-direction="column" gap="xs" align-items="center">
              <GdsText font-size="body-s" font-weight="book">
                Demo Admin Credentials
              </GdsText>
              <GdsText font-size="body-s" color="secondary">
                Email: admin@designermarket.com
              </GdsText>
              <GdsText font-size="body-s" color="secondary">
                Password: Admin123!
              </GdsText>
            </GdsFlex>
          </GdsCard>
        </GdsFlex>
      </GdsCard>
    </GdsFlex>
  )
}


