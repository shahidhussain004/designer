'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Flex,
  Card,
  Text,
  Button,
  Input,
  Alert,
  Divider,
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
    <Flex
      justify-content="center"
      align-items="center"
      padding="l"
      style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' } as any}
    >
      <Card padding="xl" style={{ maxWidth: '480px', width: '100%' } as any}>
        <Flex flex-direction="column" gap="l">
          {/* Header */}
          <Flex flex-direction="column" align-items="center" gap="s">
            <Text tag="h1" font-size="heading-l">
              Create your account
            </Text>
            <Text color="secondary">
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: '#16a34a' } as any}>
                Sign in
              </Link>
            </Text>
          </Flex>

          <Divider />

          {/* Error Alert */}
          {error && (
            <Alert variant="negative">
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Flex flex-direction="column" gap="m">
              <Input
                label="Full Name"
                value={formData.fullName}
                onInput={(e: Event) =>
                  setFormData({ ...formData, fullName: (e.target as HTMLInputElement).value })
                }
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onInput={(e: Event) =>
                  setFormData({ ...formData, email: (e.target as HTMLInputElement).value })
                }
                required
              />

              <Flex flex-direction="column" gap="xs">
                <Input
                  label="Username"
                  value={formData.username}
                  onInput={(e: Event) =>
                    setFormData({ ...formData, username: (e.target as HTMLInputElement).value })
                  }
                  required
                />
                <Text font-size="body-s" color="secondary">
                  Letters, numbers, and underscores only (3-50 characters)
                </Text>
              </Flex>

              <Flex flex-direction="column" gap="xs">
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  onInput={(e: Event) =>
                    setFormData({ ...formData, password: (e.target as HTMLInputElement).value })
                  }
                  required
                />
                <Text font-size="body-s" color="secondary">
                  Minimum 8 characters
                </Text>
              </Flex>

              <Divider />

              {/* Role Selection */}
              <Flex flex-direction="column" gap="s">
                <Text font-weight="book">I want to:</Text>
                
                <Card
                  padding="m"
                  variant={formData.role === 'FREELANCER' ? 'positive' : 'secondary'}
                  onClick={() => setFormData({ ...formData, role: 'FREELANCER' })}
                  style={{ cursor: 'pointer' } as any}
                >
                  <Flex align-items="center" gap="m">
                    <input
                      type="radio"
                      name="role"
                      value="FREELANCER"
                      checked={formData.role === 'FREELANCER'}
                      onChange={() => setFormData({ ...formData, role: 'FREELANCER' })}
                      style={{ width: '18px', height: '18px' } as any}
                    />
                    <Flex flex-direction="column" gap="2xs">
                      <Text font-weight="book">Work as a Freelancer</Text>
                      <Text font-size="body-s" color="secondary">
                        Find jobs and get hired
                      </Text>
                    </Flex>
                  </Flex>
                </Card>

                <Card
                  padding="m"
                  variant={formData.role === 'CLIENT' ? 'positive' : 'secondary'}
                  onClick={() => setFormData({ ...formData, role: 'CLIENT' })}
                  style={{ cursor: 'pointer' } as any}
                >
                  <Flex align-items="center" gap="m">
                    <input
                      type="radio"
                      name="role"
                      value="CLIENT"
                      checked={formData.role === 'CLIENT'}
                      onChange={() => setFormData({ ...formData, role: 'CLIENT' })}
                      style={{ width: '18px', height: '18px' } as any}
                    />
                    <Flex flex-direction="column" gap="2xs">
                      <Text font-weight="book">Hire as a Client</Text>
                      <Text font-size="body-s" color="secondary">
                        Post jobs and find talent
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Flex>

              <Divider />

              <Button type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>

              <Text font-size="body-s" color="secondary" style={{ textAlign: 'center' } as any}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </Text>
            </Flex>
          </form>
        </Flex>
      </Card>
    </Flex>
  );
}
