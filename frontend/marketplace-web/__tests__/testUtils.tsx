import React from 'react';

// Do not require next/navigation at module load time — that can import the real Next module
// Tests use jest.setup.js to mock next/navigation. This helper simply wraps UI in a provider
// if the test environment provides one. For our tests we default to returning the UI directly.
export function withAppRouter(ui: React.ReactElement, { pathname: _pathname = '/' } = {}) {
  return ui;
}
