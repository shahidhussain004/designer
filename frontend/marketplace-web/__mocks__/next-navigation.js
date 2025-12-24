import React from 'react';

export function useRouter() {
  return { push: () => {}, replace: () => {}, prefetch: () => {} };
}

export function useSearchParams() {
  return { get: () => null };
}

export function usePathname() {
  return '/';
}

export const MemoryRouterProvider = ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children);
