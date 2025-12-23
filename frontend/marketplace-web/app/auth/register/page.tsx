'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GdsFlex,
  GdsCard,
  GdsText,
  GdsButton,
  GdsInput,
  GdsAlert,
  GdsDivider,
} from '@/components/green';
import { authService } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    email: string;
    username: string;
    password: string;
    fullName: string;
    role: 'CLIENT' | 'FREELANCER';
  }>({
    email: '',
    username: '',
    password: '',
    fullName: '',
    role: 'FREELANCER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      router.push('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GdsFlex
      justify-content="center"
      align-items="center"
      padding="l"
      style={{ minHeight: '100vh', backgroundColor: 'var(--gds-color-l3-background-secondary)' } as any}
    >
      <GdsCard padding="xl" style={{ maxWidth: '480px', width: '100%' } as any}>
        <GdsFlex flex-direction="column" gap="l">
          {/* Header */}
          <GdsFlex flex-direction="column" align-items="center" gap="s">
            <GdsText tag="h1" font-size="heading-l">
              Create your account
            </GdsText>
            <GdsText color="secondary">
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: 'var(--gds-color-l3-content-positive)' } as any}>
                Sign in
              </Link>
            </GdsText>
          </GdsFlex>

          <GdsDivider />

          {/* Error Alert */}
          {error && (
            <GdsAlert variant="negative">
              {error}
            </GdsAlert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <GdsFlex flex-direction="column" gap="m">
              <GdsInput
                label="Full Name"
                value={formData.fullName}
                onInput={(e: Event) =>
                  setFormData({ ...formData, fullName: (e.target as HTMLInputElement).value })
                }
                required
              />

              <GdsInput
                label="Email Address"
                type="email"
                value={formData.email}
                onInput={(e: Event) =>
                  setFormData({ ...formData, email: (e.target as HTMLInputElement).value })
                }
                required
              />

              <GdsFlex flex-direction="column" gap="xs">
                <GdsInput
                  label="Username"
                  value={formData.username}
                  onInput={(e: Event) =>
                    setFormData({ ...formData, username: (e.target as HTMLInputElement).value })
                  }
                  required
                />
                <GdsText font-size="body-s" color="secondary">
                  Letters, numbers, and underscores only (3-50 characters)
                </GdsText>
              </GdsFlex>

              <GdsFlex flex-direction="column" gap="xs">
                <GdsInput
                  label="Password"
                  type="password"
                  value={formData.password}
                  onInput={(e: Event) =>
                    setFormData({ ...formData, password: (e.target as HTMLInputElement).value })
                  }
                  required
                />
                <GdsText font-size="body-s" color="secondary">
                  Minimum 8 characters
                </GdsText>
              </GdsFlex>

              <GdsDivider />

              {/* Role Selection */}
              <GdsFlex flex-direction="column" gap="s">
                <GdsText font-weight="book">I want to:</GdsText>
                
                <GdsCard
                  padding="m"
                  variant={formData.role === 'FREELANCER' ? 'positive' : 'secondary'}
                  onClick={() => setFormData({ ...formData, role: 'FREELANCER' })}
                  style={{ cursor: 'pointer' } as any}
                >
                  <GdsFlex align-items="center" gap="m">
                    <input
                      type="radio"
                      name="role"
                      value="FREELANCER"
                      checked={formData.role === 'FREELANCER'}
                      onChange={() => setFormData({ ...formData, role: 'FREELANCER' })}
                      style={{ width: '18px', height: '18px' } as any}
                    />
                    <GdsFlex flex-direction="column" gap="2xs">
                      <GdsText font-weight="book">Work as a Freelancer</GdsText>
                      <GdsText font-size="body-s" color="secondary">
                        Find jobs and get hired
                      </GdsText>
                    </GdsFlex>
                  </GdsFlex>
                </GdsCard>

                <GdsCard
                  padding="m"
                  variant={formData.role === 'CLIENT' ? 'positive' : 'secondary'}
                  onClick={() => setFormData({ ...formData, role: 'CLIENT' })}
                  style={{ cursor: 'pointer' } as any}
                >
                  <GdsFlex align-items="center" gap="m">
                    <input
                      type="radio"
                      name="role"
                      value="CLIENT"
                      checked={formData.role === 'CLIENT'}
                      onChange={() => setFormData({ ...formData, role: 'CLIENT' })}
                      style={{ width: '18px', height: '18px' } as any}
                    />
                    <GdsFlex flex-direction="column" gap="2xs">
                      <GdsText font-weight="book">Hire as a Client</GdsText>
                      <GdsText font-size="body-s" color="secondary">
                        Post jobs and find talent
                      </GdsText>
                    </GdsFlex>
                  </GdsFlex>
                </GdsCard>
              </GdsFlex>

              <GdsDivider />

              <GdsButton type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </GdsButton>

              <GdsText font-size="body-s" color="secondary" style={{ textAlign: 'center' } as any}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </GdsText>
            </GdsFlex>
          </form>
        </GdsFlex>
      </GdsCard>
    </GdsFlex>
  );
}
