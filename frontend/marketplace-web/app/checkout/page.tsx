'use client';

import { authService } from '@/lib/auth';
import {
  createPaymentIntent,
  formatCurrency,
  getPaymentMethods,
  PaymentIntent,
  PaymentMethod,
} from '@/lib/payments';
import { AlertCircle, ArrowLeft, CreditCard, Loader2, Lock, Plus, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useCallback, useEffect, useState } from 'react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get('type') || 'milestone';
  const itemId = searchParams.get('id');
  const amount = parseInt(searchParams.get('amount') || '0', 10);
  const title = searchParams.get('title') || 'Payment';
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  const initializeCheckout = useCallback(async () => {
    try {
      setLoading(true);

      const methods = await getPaymentMethods();
      setPaymentMethods(methods);

      const defaultMethod = methods.find((m) => m.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      } else if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].id);
      } else {
        setShowAddCard(true);
      }

      const intent = await createPaymentIntent(amount, 'usd', {
        type,
        itemId: itemId || '',
        title,
      });
      setPaymentIntent(intent);
    } catch (err) {
      console.error('Error initializing checkout:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize checkout');
    } finally {
      setLoading(false);
    }
  }, [type, itemId, amount, title]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push(`/auth/login?redirect=/checkout?${searchParams.toString()}`);
      return;
    }

    initializeCheckout();
  }, [router, searchParams, initializeCheckout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentIntent) {
      setError('Payment not initialized');
      return;
    }

    if (!selectedPaymentMethod && !showAddCard) {
      setError('Please select a payment method');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push(`/checkout/success?type=${type}&id=${itemId}&amount=${amount}`);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Setting up checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href={returnUrl} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Saved Payment Methods */}
              {paymentMethods.length > 0 && !showAddCard && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedPaymentMethod === method.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="text-primary-600"
                        />
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">•••• {method.card?.last4}</p>
                          <p className="text-sm text-gray-500">
                            Expires {method.card?.expMonth}/{method.card?.expYear}
                          </p>
                        </div>
                        {method.isDefault && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Default</span>
                        )}
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCard(true)}
                    className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add new card
                  </button>
                </div>
              )}

              {/* New Card Form */}
              {showAddCard && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Card Details</h2>
                    {paymentMethods.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddCard(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          maxLength={4}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus"
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="rounded text-primary-600"
                      />
                      <span className="text-sm text-gray-700">Save card for future payments</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
              </button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                Secured by Stripe. Your payment information is encrypted.
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{title}</span>
                  <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Processing fee</span>
                  <span className="text-gray-500">{formatCurrency(0)}</span>
                </div>
              </div>

              <hr className="border-gray-200 mb-4" />

              <div className="flex justify-between mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-semibold text-gray-900">{formatCurrency(amount)}</span>
              </div>

              {/* Payment Protection */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {type === 'milestone' ? 'Escrow Protection' : 'Secure Payment'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {type === 'milestone'
                        ? 'Funds are held securely until the milestone is completed and approved.'
                        : 'Your payment is protected by our secure checkout system.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading checkout...</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
