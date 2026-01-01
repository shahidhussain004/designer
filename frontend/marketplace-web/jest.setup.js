import '@testing-library/jest-dom';

// Mock environment variables if needed
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080/api'

// Provide basic mocks for Next app-router hooks used in client components
jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
	useSearchParams: () => ({ get: () => null }),
	usePathname: () => '/',
	// MemoryRouterProvider may not exist in this environment; tests that need it can provide their own wrapper
}));

// Provide a global fetch mock for components that call fetch during render
if (!globalThis.fetch) {
	globalThis.fetch = jest.fn(async () => ({ ok: false, json: async () => ({}) }));
} else {
	globalThis.fetch = globalThis.fetch || jest.fn(async () => ({ ok: false, json: async () => ({}) }));
}
