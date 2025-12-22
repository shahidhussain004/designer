'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  createPaymentIntent, 
  getPaymentMethods, 
  PaymentIntent, 
  PaymentMethod,
  formatCurrency 
} from '@/lib/payments';
import { authService } from '@/lib/auth';

declare global {
  interface Window {
    Stripe?: (key: string) => unknown;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Query params for checkout context
  const type = searchParams.get('type') || 'milestone'; // milestone, course, escrow
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

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  const initializeCheckout = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch payment methods
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);

      // Pre-select default payment method
      const defaultMethod = methods.find(m => m.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      } else if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].id);
      } else {
        setShowAddCard(true);
      }

      // Create payment intent
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

      // In a real implementation, this would use Stripe.js to:
      // 1. Create a payment method from card details (if new card)
      // 2. Confirm the payment intent
      // 3. Handle 3D Secure if required

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect to success page
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={returnUrl} className="text-primary-600 hover:underline text-sm mb-2 inline-block">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {/* Saved Payment Methods */}
              {paymentMethods.length > 0 && !showAddCard && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                          selectedPaymentMethod === method.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center flex-1">
                          {/* Card Brand Icon */}
                          <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center mr-3 text-xs font-medium uppercase">
                            {method.card?.brand || 'Card'}
                          </div>
                          <div>
                            <p className="font-medium">•••• {method.card?.last4}</p>
                            <p className="text-sm text-gray-500">
                              Expires {method.card?.expMonth}/{method.card?.expYear}
                            </p>
                          </div>
                        </div>
                        {method.isDefault && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Default</span>
                        )}
                        <div className={`ml-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === method.id
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddCard(true)}
                    className="mt-4 text-primary-600 text-sm font-medium hover:underline"
                  >
                    + Add new card
                  </button>
                </div>
              )}

              {/* New Card Form */}
              {showAddCard && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Card Details</h2>
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
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cardCvc"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="mr-2 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600">Save card for future payments</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ${formatCurrency(amount)}`
                )}
              </button>

              {/* Security Note */}
              <div className="flex items-center justify-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secured by Stripe. Your payment information is encrypted.
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{title}</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Processing fee</span>
                  <span>{formatCurrency(0)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
              </div>

              {/* Payment Type Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">
                      {type === 'milestone' ? 'Escrow Protection' : 'Secure Payment'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading checkout...</p>
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
