'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/payments';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  
  const type = searchParams.get('type') || 'payment';
  const itemId = searchParams.get('id');
  const amount = parseInt(searchParams.get('amount') || '0', 10);

  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeDetails = () => {
    switch (type) {
      case 'milestone':
        return {
          icon: '🎯',
          title: 'Milestone Funded!',
          description: 'The funds have been securely deposited into escrow. The freelancer has been notified and can begin work.',
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-50 flex items-center justify-center p-4">
      {/* Confetti Animation */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][
                    Math.floor(Math.random() * 5)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Animation */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
            <div className="relative w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">{details.icon}</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {details.title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {details.description}
          </p>

          {/* Amount Confirmation */}
          {amount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(amount)}</p>
            </div>
          )}

          {/* Transaction Details */}
          <div className="text-left border rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-gray-700">TXN-{Date.now().toString(36).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-700">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="text-gray-700">•••• 4242</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={details.primaryAction.href}
              className="block w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
            >
              {details.primaryAction.label}
            </Link>
            
            <Link
              href={details.secondaryAction.href}
              className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              {details.secondaryAction.label}
            </Link>
          </div>
        </div>

        {/* Receipt Link */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-500">
            A receipt has been sent to your email address.
          </p>
          <Link href="/dashboard/invoices" className="text-sm text-primary-600 hover:underline">
            View all invoices →
          </Link>
        </div>
      </div>

      {/* Confetti CSS */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}

function SuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
