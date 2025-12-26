'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Flex,
  Card,
  Text,
  Button,
  Spinner,
  Divider,
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
    <Flex
      justify-content="center"
      align-items="center"
      padding="l"
    >
      {/* Confetti Effect - simple version */}
      {showConfetti && (
        <div>
          <Text font-size="heading-xl">🎉 🎊 ✨ 🎉 🎊 ✨ 🎉</Text>
        </div>
      )}

      <Card padding="xl">
        <Flex flex-direction="column" gap="l" align-items="center">
          {/* Success Icon */}
          <Flex
            justify-content="center"
            align-items="center"
          >
            <Text font-size="heading-xl">{details.icon}</Text>
          </Flex>

          <Text tag="h1" font-size="heading-l">
            {details.title}
          </Text>

          <Text color="secondary">
            {details.description}
          </Text>

          {/* Amount Confirmation */}
          {amount > 0 && (
            <Card padding="m" variant="secondary">
              <Flex flex-direction="column" gap="xs" align-items="center">
                <Text font-size="body-s" color="secondary">
                  Amount Paid
                </Text>
                <Text font-size="heading-xl">{formatCurrency(amount)}</Text>
              </Flex>
            </Card>
          )}

          {/* Transaction Details */}
          <Card padding="m">
            <Flex flex-direction="column" gap="m">
              <Text font-weight="book">Transaction Details</Text>
              <Flex flex-direction="column" gap="s">
                <Flex justify-content="space-between">
                  <Text font-size="body-s" color="secondary">
                    Transaction ID
                  </Text>
                  <Text font-size="body-s">
                    TXN-{Date.now().toString(36).toUpperCase()}
                  </Text>
                </Flex>
                <Flex justify-content="space-between">
                  <Text font-size="body-s" color="secondary">
                    Date
                  </Text>
                  <Text font-size="body-s">{new Date().toLocaleDateString()}</Text>
                </Flex>
                <Flex justify-content="space-between">
                  <Text font-size="body-s" color="secondary">
                    Payment Method
                  </Text>
                  <Text font-size="body-s">•••• 4242</Text>
                </Flex>
                <Flex justify-content="space-between">
                  <Text font-size="body-s" color="secondary">
                    Status
                  </Text>
                  <Text font-size="body-s" color="positive">
                    Completed
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>

          <Divider />

          {/* Actions */}
          <Flex flex-direction="column" gap="s">
            <Link href={details.primaryAction.href}>
              <Button>{details.primaryAction.label}</Button>
            </Link>
            <Link href={details.secondaryAction.href}>
              <Button rank="secondary">
                {details.secondaryAction.label}
              </Button>
            </Link>
          </Flex>

          {/* Receipt Link */}
          <Flex flex-direction="column" gap="xs" align-items="center">
            <Text font-size="body-s" color="secondary">
              A receipt has been sent to your email address.
            </Text>
            <Link
              href="/dashboard/invoices"
            >
              <Text font-size="body-s">View all invoices →</Text>
            </Link>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}

function SuccessLoading() {
  return (
    <Flex
      justify-content="center"
      align-items="center"
    >
      <Spinner />
    </Flex>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
