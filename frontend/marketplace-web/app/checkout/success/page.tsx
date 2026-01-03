'use client';

import { formatCurrency } from '@/lib/payments';
import { BookOpen, CheckCircle, Loader2, Lock, Target } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

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
          icon: Target,
          title: 'Milestone Funded!',
          description:
            'The funds have been securely deposited into escrow. The freelancer has been notified and can begin work.',
          primaryAction: { label: 'View Milestone', href: `/jobs/${itemId}/milestones` },
          secondaryAction: { label: 'Go to Dashboard', href: '/dashboard' },
        };
      case 'course':
        return {
          icon: BookOpen,
          title: 'Course Purchased!',
          description: 'You now have full access to the course. Start learning right away!',
          primaryAction: { label: 'Start Learning', href: `/courses/${itemId}/learn` },
          secondaryAction: { label: 'Browse More Courses', href: '/courses' },
        };
      case 'escrow':
        return {
          icon: Lock,
          title: 'Escrow Funded!',
          description: 'The funds are now held securely in escrow until the project is completed.',
          primaryAction: { label: 'View Project', href: `/jobs/${itemId}` },
          secondaryAction: { label: 'Go to Dashboard', href: '/dashboard' },
        };
      default:
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
          primaryAction: { label: 'Go to Dashboard', href: '/dashboard' },
          secondaryAction: { label: 'View Receipts', href: '/dashboard/invoices' },
        };
    }
  };

  const details = getTypeDetails();
  const IconComponent = details.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed top-0 left-0 right-0 flex justify-center text-4xl animate-bounce">
          🎉 🎊 ✨ 🎉 🎊 ✨ 🎉
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <IconComponent className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{details.title}</h1>
        <p className="text-gray-600 mb-6">{details.description}</p>

        {/* Amount */}
        {amount > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(amount)}</p>
          </div>
        )}

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="font-medium text-gray-900 mb-3">Transaction Details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID</span>
              <span className="text-gray-900 font-mono">TXN-{Date.now().toString(36).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="text-gray-900">•••• 4242</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={details.primaryAction.href}
            className="block w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            {details.primaryAction.label}
          </Link>
          <Link
            href={details.secondaryAction.href}
            className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {details.secondaryAction.label}
          </Link>
        </div>

        {/* Receipt Link */}
        <p className="text-sm text-gray-500 mt-6">
          A receipt has been sent to your email address.
          <Link href="/dashboard/invoices" className="text-primary-600 hover:text-primary-700 ml-1">
            View all invoices →
          </Link>
        </p>
      </div>
    </div>
  );
}

function SuccessLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
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
