import { afterEach, beforeEach, vi } from 'vitest';

// Provide a minimal jest compatibility shim used by older tests.
(globalThis as any).jest = {
  mock: (modulePath: string) => vi.mock(modulePath),
  fn: vi.fn,
  spyOn: vi.spyOn,
  clearAllMocks: () => vi.clearAllMocks(),
  resetAllMocks: () => vi.resetAllMocks(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});
