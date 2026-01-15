import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { AuthProvider } from '../lib/context/AuthContext';

// Do not require next/navigation at module load time — that can import the real Next module
// Tests use jest.setup.js to mock next/navigation. This helper wraps UI in a small
// test environment that includes a fresh React Query `QueryClientProvider` so hooks
// that call `useQuery` / `useMutation` don't throw during render.
export function withAppRouter(ui: React.ReactElement, { pathname: _pathname = '/' } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{ui}</AuthProvider>
    </QueryClientProvider>
  );
}
