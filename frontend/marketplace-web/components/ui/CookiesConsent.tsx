 'use client';

import { Dialog } from '@/components/green';
import { cn } from '@/lib/design-system/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Logo } from './Icons';

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'strictly-necessary',
    name: 'Strictly Necessary Cookies',
    description:
      'Essential cookies that enable core functionality of the portal — sign-in, security, and user preferences. These cookies are always active to keep the site secure and usable.',
    isRequired: true,
  },
  {
    id: 'performance',
    name: 'Performance Cookies',
    description:
      'Performance cookies help us understand how people use the portal so we can improve speed, reliability and navigation. Information is aggregated and does not identify you personally.',
    isRequired: false,
  },
  {
    id: 'targeting',
    name: 'Targeting Cookies',
    description:
      'Targeting cookies enable personalised content, recommendations and promotions based on your activity. They may be set by third parties; disabling them reduces personalised features and targeted suggestions.',
    isRequired: false,
  },
];

interface CookiePreferences {
  'strictly-necessary': boolean;
  'performance': boolean;
  'targeting': boolean;
}

export interface CookiesConsentProps {
  onAccept?: (preferences: CookiePreferences) => void;
  onReject?: () => void;
}

export const CookiesConsent: React.FC<CookiesConsentProps> = ({ onAccept, onReject }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    'strictly-necessary': true,
    'performance': false,
    'targeting': false,
  });
  const [acknowledged, setAcknowledged] = useState(false);

  const ACK_KEY = 'cookie-consent-ack';

  type DialogRef = HTMLDialogElement & { show?: () => void; close?: () => void };
  const dialogRef = useRef<DialogRef | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      // if user already acknowledged (accepted/rejected/closed), keep banner hidden
      const ack = localStorage.getItem(ACK_KEY);
      if (ack) {
        setAcknowledged(true);
        return;
      }

      const stored = localStorage.getItem('cookie-consent');
      if (stored) {
        const parsed = JSON.parse(stored) as CookiePreferences;
        setPreferences((p) => ({ ...p, ...parsed }));
        // previous choices exist — hide banner by default
        setAcknowledged(true);
        return;
      }

      // show after small delay for first-time visitors
      const t = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(t);
    } catch (err: unknown) {
      console.error('CookiesConsent init error:', err);
    }
  }, []);

  useEffect(() => {
    if (!dialogRef.current) return;
    try {
      if (isOpen) dialogRef.current?.show?.();
      else dialogRef.current?.close?.();
    } catch (e: unknown) {
      console.warn('CookiesConsent dialog control error:', e);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const setPref = (id: keyof CookiePreferences, value: boolean) => {
    setPreferences((p) => ({ ...p, [id]: value }));
  };

  const handleConfirm = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem(ACK_KEY, '1');
    setAcknowledged(true);
    setIsOpen(false);
    onAccept?.(preferences);
  };

  const handleRejectAll = () => {
    const rejected: CookiePreferences = {
      'strictly-necessary': true,
      'performance': false,
      'targeting': false,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(rejected));
    localStorage.setItem(ACK_KEY, '1');
    setAcknowledged(true);
    setPreferences(rejected);
    setIsOpen(false);
    onReject?.();
  };

  if (acknowledged) return null;

  return (
    <>
      {/* Floating cookie icon at bottom-left */}
      <button
        aria-label="Open privacy preferences"
        title="Cookie preferences"
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-4 left-4 z-40 rounded-full p-3',
          'bg-white shadow-lg hover:shadow-xl transition-shadow',
          'border border-gray-200 hover:border-gray-300',
          'text-gray-700 hover:text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'md:bottom-6 md:left-6'
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('w-6 h-6')} aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="18" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
          <circle cx="6" cy="12" r="1" fill="currentColor" />
        </svg>
      </button>

      {/* Use Dialog */}
      <Dialog ref={dialogRef}>
        <div className="p-4" >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0">
              <Logo size="sm" variant="icon" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 id="cookies-dialog-title" className="text-2xl md:text-3xl font-bold text-gray-900 mb-0">
                Privacy Preference Center
              </h1>
              <p className="text-sm text-gray-600 mt-1">Manage your cookie and tracking preferences</p>
            </div>

            <div className="ml-4 flex-shrink-0">
              <button
                aria-label="Close privacy preferences"
                title="Close"
                onClick={() => setIsOpen(false)}
                className={cn(
                  'inline-flex items-center justify-center h-8 w-8 rounded-full',
                  'text-gray-600 hover:text-gray-900 bg-transparent',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('w-4 h-4')} aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use the Designer portal we store small pieces of data (cookies) that help the site work reliably
              and provide a personalised experience. You can change which categories are allowed below; some features
              require cookies to function.
            </p>
            <a href="/privacy" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">More information →</a>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Manage Consent Preferences</h2>

            <div className="space-y-4">
              {COOKIE_CATEGORIES.map((c) => (
                <div key={c.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full px-6 py-4 flex items-center justify-between gap-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => toggleExpanded(c.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpanded(c.id); }}>
                    <div className="flex items-start gap-3 flex-1 text-left">
                    
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base">{c.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{c.isRequired ? 'Required for core portal functionality' : 'Click the switch to enable or disable this category'}</p>
                      </div>
                    </div>
                         
                    <div className="pt-1">
                      {c.isRequired ? (
                        <div className="flex items-center gap-3">
                          <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Always Active
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPref(c.id as keyof CookiePreferences, !preferences[c.id as keyof CookiePreferences]);
                            }}
                            role="switch"
                            disabled
                            aria-checked={preferences[c.id as keyof CookiePreferences]}
                            className={cn(
                              'relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none',
                              preferences[c.id as keyof CookiePreferences] ? 'bg-blue-600' : 'bg-gray-300'
                            )}
                            aria-label={`${c.name} toggle`}
                          >
                            <span
                              className={cn(
                                'inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform',
                                preferences[c.id as keyof CookiePreferences] ? 'translate-x-5' : 'translate-x-0'
                              )}
                            />
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {!c.isRequired && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setPref(c.id as keyof CookiePreferences, !preferences[c.id as keyof CookiePreferences]); }}
                        role="switch"
                        aria-checked={preferences[c.id as keyof CookiePreferences]}
                        className={cn('relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none', preferences[c.id as keyof CookiePreferences] ? 'bg-blue-600' : 'bg-gray-300')}
                        aria-label={`${c.name} toggle`}
                      >
                        <span className={cn('inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform', preferences[c.id as keyof CookiePreferences] ? 'translate-x-5' : 'translate-x-0')} />
                      </button>
                    )}

                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('w-5 h-5 text-gray-400 ml-3')}> <polyline points="6 9 12 15 18 9" /></svg>
                  </div>

                  {expanded.includes(c.id) && (
                    <div id={`category-${c.id}`} className="px-6 py-4 bg-white border-t border-gray-200">
                      <p className="text-gray-700 text-sm leading-relaxed">{c.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 md:p-4 mt-6">
            <div className="flex flex-col-reverse md:flex-row gap-3">
              <button onClick={handleRejectAll} className={cn('flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all','border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400','focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500')}>Reject All</button>
              <button onClick={handleConfirm} className={cn('flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all','bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800','focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500','shadow-sm')}>Confirm My Choices</button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
