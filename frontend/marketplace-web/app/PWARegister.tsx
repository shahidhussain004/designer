'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Service worker registered successfully
        })
        .catch((error) => {
          // Service worker registration failed - not critical
        });
    }
  }, []);

  return null;
}
