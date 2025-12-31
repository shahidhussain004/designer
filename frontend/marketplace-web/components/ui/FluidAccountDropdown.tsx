'use client';

import { authService } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';

export const FluidAccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ fullName?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            Login
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.5rem',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'rgb(229, 231, 235)',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <span>{user?.fullName || 'Account'}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          style={{
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'rgb(229, 231, 235)'
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: '0.5rem',
            width: '224px',
            zIndex: 50,
            backgroundColor: '#0b1220',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '0.75rem' }}>
            <div style={{ padding: '0.5rem 1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgb(229, 231, 235)', margin: 0 }}>{user?.fullName}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgb(156, 163, 175)', margin: '0.25rem 0 0 0' }}>{user?.email}</p>
            </div>

            <div style={{ margin: '0.5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

            <button
              onClick={() => { router.push('/dashboard'); setIsOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: 'rgb(209, 213, 219)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Dashboard
            </button>

            <button
              onClick={() => { router.push('/profile'); setIsOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: 'rgb(209, 213, 219)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Profile
            </button>

            <button
              onClick={() => { router.push('/settings'); setIsOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: 'rgb(209, 213, 219)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Settings
            </button>

            <div style={{ margin: '0.5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

            <button
              onClick={handleLogout}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: '#ef4444',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
