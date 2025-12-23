'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  GdsFlex,
  GdsCard,
  GdsText,
  GdsButton,
  GdsSpinner,
  GdsDivider,
} from '@/components/green';
import { formatCurrency } from '@/lib/payments';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();

  const type = searchParams.get('type') || 'payment';
  const itemId = searchParams.get('id');
  const amount = parseInt(searchParams.get('amount') || '0', 10);

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeDetails = () => {
    switch (type) {
      case 'milestone':
        return {
          icon: '🎯',
          title: 'Milestone Funded!',
          description:
            'The funds have been securely deposited into escrow. The freelancer has been notified and can begin work.',
          primaryAction: { label: 'View Milestone', href: `/jobs/${itemId}/milestones` },
          secondaryAction: { label: 'Go to Dashboard', href: '/dashboard' },
        };
      case 'course':
        return {
          icon: '📚',
          title: 'Course Purchased!',
          description: 'You now have full access to the course. Start learning right away!',
          primaryAction: { label: 'Start Learning', href: `/courses/${itemId}/learn` },
          secondaryAction: { label: 'Browse More Courses', href: '/courses' },
        };
      case 'escrow':
        return {
          icon: '🔒',
          title: 'Escrow Funded!',
          description: 'The funds are now held securely in escrow until the project is completed.',
          primaryAction: { label: 'View Project', href: `/jobs/${itemId}` },
          secondaryAction: { label: 'Go to Dashboard', href: '/dashboard' },
        };
      default:
        return {
          icon: '✅',
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
          primaryAction: { label: 'Go to Dashboard', href: '/dashboard' },
          secondaryAction: { label: 'View Receipts', href: '/dashboard/invoices' },
        };
    }
  };

  const details = getTypeDetails();

  return (
    <GdsFlex
      justify-content="center"
      align-items="center"
      padding="l"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--gds-color-l3-background-positive) 0%, var(--gds-color-l3-background-secondary) 100%)',
      } as any}
    >
      {/* Confetti Effect - simple version */}
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, pointerEvents: 'none', textAlign: 'center' } as any}>
          <GdsText font-size="heading-xl">🎉 🎊 ✨ 🎉 🎊 ✨ 🎉</GdsText>
        </div>
      )}

      <GdsCard padding="xl" style={{ maxWidth: '480px', width: '100%', textAlign: 'center' } as any}>
        <GdsFlex flex-direction="column" gap="l" align-items="center">
          {/* Success Icon */}
          <GdsFlex
            justify-content="center"
            align-items="center"
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              backgroundColor: 'var(--gds-color-l3-background-positive)',
            } as any}
          >
            <GdsText font-size="heading-xl">{details.icon}</GdsText>
          </GdsFlex>

          <GdsText tag="h1" font-size="heading-l">
            {details.title}
          </GdsText>

          <GdsText color="secondary" style={{ textAlign: 'center' } as any}>
            {details.description}
          </GdsText>

          {/* Amount Confirmation */}
          {amount > 0 && (
            <GdsCard padding="m" variant="secondary" style={{ width: '100%' } as any}>
              <GdsFlex flex-direction="column" gap="xs" align-items="center">
                <GdsText font-size="body-s" color="secondary">
                  Amount Paid
                </GdsText>
                <GdsText font-size="heading-xl">{formatCurrency(amount)}</GdsText>
              </GdsFlex>
            </GdsCard>
          )}

          {/* Transaction Details */}
          <GdsCard padding="m" style={{ width: '100%', textAlign: 'left' } as any}>
            <GdsFlex flex-direction="column" gap="m">
              <GdsText font-weight="book">Transaction Details</GdsText>
              <GdsFlex flex-direction="column" gap="s">
                <GdsFlex justify-content="space-between">
                  <GdsText font-size="body-s" color="secondary">
                    Transaction ID
                  </GdsText>
                  <GdsText font-size="body-s" style={{ fontFamily: 'monospace' } as any}>
                    TXN-{Date.now().toString(36).toUpperCase()}
                  </GdsText>
                </GdsFlex>
                <GdsFlex justify-content="space-between">
                  <GdsText font-size="body-s" color="secondary">
                    Date
                  </GdsText>
                  <GdsText font-size="body-s">{new Date().toLocaleDateString()}</GdsText>
                </GdsFlex>
                <GdsFlex justify-content="space-between">
                  <GdsText font-size="body-s" color="secondary">
                    Payment Method
                  </GdsText>
                  <GdsText font-size="body-s">•••• 4242</GdsText>
                </GdsFlex>
                <GdsFlex justify-content="space-between">
                  <GdsText font-size="body-s" color="secondary">
                    Status
                  </GdsText>
                  <GdsText font-size="body-s" color="positive">
                    Completed
                  </GdsText>
                </GdsFlex>
              </GdsFlex>
            </GdsFlex>
          </GdsCard>

          <GdsDivider />

          {/* Actions */}
          <GdsFlex flex-direction="column" gap="s" style={{ width: '100%' } as any}>
            <Link href={details.primaryAction.href} style={{ width: '100%', textDecoration: 'none' } as any}>
              <GdsButton style={{ width: '100%' } as any}>{details.primaryAction.label}</GdsButton>
            </Link>
            <Link href={details.secondaryAction.href} style={{ width: '100%', textDecoration: 'none' } as any}>
              <GdsButton rank="secondary" style={{ width: '100%' } as any}>
                {details.secondaryAction.label}
              </GdsButton>
            </Link>
          </GdsFlex>

          {/* Receipt Link */}
          <GdsFlex flex-direction="column" gap="xs" align-items="center">
            <GdsText font-size="body-s" color="secondary">
              A receipt has been sent to your email address.
            </GdsText>
            <Link
              href="/dashboard/invoices"
              style={{ color: 'var(--gds-color-l3-content-positive)', textDecoration: 'none' } as any}
            >
              <GdsText font-size="body-s">View all invoices →</GdsText>
            </Link>
          </GdsFlex>
        </GdsFlex>
      </GdsCard>
    </GdsFlex>
  );
}

function SuccessLoading() {
  return (
    <GdsFlex
      justify-content="center"
      align-items="center"
      style={{ minHeight: '100vh' } as any}
    >
      <GdsSpinner />
    </GdsFlex>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
