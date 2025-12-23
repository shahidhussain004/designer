'use client';

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  GdsGrid,
  GdsFlex,
  GdsCard,
  GdsText,
  GdsButton,
  GdsInput,
  GdsAlert,
  GdsSpinner,
  GdsDivider,
} from '@/components/green';
import {
  createPaymentIntent,
  getPaymentMethods,
  PaymentIntent,
  PaymentMethod,
  formatCurrency,
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

  // Card form state
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

      // Simulate payment processing
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
      <GdsFlex
        justify-content="center"
        align-items="center"
        flex-direction="column"
        gap="m"
        style={{ minHeight: '100vh' } as any}
      >
        <GdsSpinner />
        <GdsText color="secondary">Setting up checkout...</GdsText>
      </GdsFlex>
    );
  }

  return (
    <GdsFlex
      flex-direction="column"
      padding="l"
      style={{ minHeight: '100vh', backgroundColor: 'var(--gds-color-l3-background-secondary)' } as any}
    >
      <GdsFlex flex-direction="column" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' } as any}>
        {/* Header */}
        <GdsFlex flex-direction="column" gap="s" padding="m">
          <Link href={returnUrl} style={{ color: 'var(--gds-color-l3-content-positive)', textDecoration: 'none' } as any}>
            ← Back
          </Link>
          <GdsText tag="h1" font-size="heading-l">
            Checkout
          </GdsText>
        </GdsFlex>

        <GdsGrid columns="1; m{3}" gap="l">
          {/* Payment Form */}
          <GdsFlex flex-direction="column" gap="m" style={{ gridColumn: 'span 2' } as any}>
            <form onSubmit={handleSubmit}>
              <GdsFlex flex-direction="column" gap="m">
                {/* Error Message */}
                {error && (
                  <GdsAlert variant="negative">{error}</GdsAlert>
                )}

                {/* Saved Payment Methods */}
                {paymentMethods.length > 0 && !showAddCard && (
                  <GdsCard padding="l">
                    <GdsFlex flex-direction="column" gap="m">
                      <GdsText tag="h2" font-size="heading-s">
                        Payment Method
                      </GdsText>

                      <GdsFlex flex-direction="column" gap="s">
                        {paymentMethods.map((method) => (
                          <GdsCard
                            key={method.id}
                            padding="m"
                            variant={selectedPaymentMethod === method.id ? 'positive' : 'secondary'}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            style={{ cursor: 'pointer' } as any}
                          >
                            <GdsFlex align-items="center" gap="m">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={selectedPaymentMethod === method.id}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              />
                              <GdsFlex flex-direction="column" gap="2xs" flex="1">
                                <GdsText font-weight="book">
                                  •••• {method.card?.last4}
                                </GdsText>
                                <GdsText font-size="body-s" color="secondary">
                                  Expires {method.card?.expMonth}/{method.card?.expYear}
                                </GdsText>
                              </GdsFlex>
                              {method.isDefault && (
                                <GdsText font-size="body-s" color="secondary">
                                  Default
                                </GdsText>
                              )}
                            </GdsFlex>
                          </GdsCard>
                        ))}
                      </GdsFlex>

                      <GdsButton rank="tertiary" onClick={() => setShowAddCard(true)}>
                        + Add new card
                      </GdsButton>
                    </GdsFlex>
                  </GdsCard>
                )}

                {/* New Card Form */}
                {showAddCard && (
                  <GdsCard padding="l">
                    <GdsFlex flex-direction="column" gap="m">
                      <GdsFlex justify-content="space-between" align-items="center">
                        <GdsText tag="h2" font-size="heading-s">
                          Card Details
                        </GdsText>
                        {paymentMethods.length > 0 && (
                          <GdsButton rank="tertiary" onClick={() => setShowAddCard(false)}>
                            Cancel
                          </GdsButton>
                        )}
                      </GdsFlex>

                      <GdsInput
                        label="Cardholder Name"
                        value={cardName}
                        onInput={(e: Event) => setCardName((e.target as HTMLInputElement).value)}
                        required
                      />

                      <GdsInput
                        label="Card Number"
                        value={cardNumber}
                        onInput={(e: Event) =>
                          setCardNumber(formatCardNumber((e.target as HTMLInputElement).value))
                        }
                        maxlength={19}
                        required
                      />

                      <GdsGrid columns="2" gap="m">
                        <GdsInput
                          label="Expiry Date"
                          value={cardExpiry}
                          onInput={(e: Event) =>
                            setCardExpiry(formatExpiry((e.target as HTMLInputElement).value))
                          }
                          maxlength={5}
                          required
                        />
                        <GdsInput
                          label="CVC"
                          value={cardCvc}
                          onInput={(e: Event) =>
                            setCardCvc((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4))
                          }
                          maxlength={4}
                          required
                        />
                      </GdsGrid>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' } as any}>
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                        />
                        <GdsText font-size="body-s">Save card for future payments</GdsText>
                      </label>
                    </GdsFlex>
                  </GdsCard>
                )}

                {/* Submit Button */}
                <GdsButton type="submit" disabled={processing}>
                  {processing ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
                </GdsButton>

                {/* Security Note */}
                <GdsFlex justify-content="center" align-items="center" gap="xs">
                  <GdsText font-size="body-s" color="secondary">
                    🔒 Secured by Stripe. Your payment information is encrypted.
                  </GdsText>
                </GdsFlex>
              </GdsFlex>
            </form>
          </GdsFlex>

          {/* Order Summary */}
          <GdsCard padding="l">
            <GdsFlex flex-direction="column" gap="m">
              <GdsText tag="h2" font-size="heading-s">
                Order Summary
              </GdsText>

              <GdsFlex flex-direction="column" gap="s">
                <GdsFlex justify-content="space-between">
                  <GdsText color="secondary">{title}</GdsText>
                  <GdsText font-weight="book">{formatCurrency(amount)}</GdsText>
                </GdsFlex>
                <GdsFlex justify-content="space-between">
                  <GdsText font-size="body-s" color="secondary">
                    Processing fee
                  </GdsText>
                  <GdsText font-size="body-s" color="secondary">
                    {formatCurrency(0)}
                  </GdsText>
                </GdsFlex>
              </GdsFlex>

              <GdsDivider />

              <GdsFlex justify-content="space-between">
                <GdsText font-size="heading-s" font-weight="book">
                  Total
                </GdsText>
                <GdsText font-size="heading-s" font-weight="book">
                  {formatCurrency(amount)}
                </GdsText>
              </GdsFlex>

              {/* Payment Type Info */}
              <GdsCard padding="m" variant="secondary">
                <GdsFlex gap="s">
                  <GdsText>🛡️</GdsText>
                  <GdsFlex flex-direction="column" gap="xs">
                    <GdsText font-weight="book">
                      {type === 'milestone' ? 'Escrow Protection' : 'Secure Payment'}
                    </GdsText>
                    <GdsText font-size="body-s" color="secondary">
                      {type === 'milestone'
                        ? 'Funds are held securely until the milestone is completed and approved.'
                        : 'Your payment is protected by our secure checkout system.'}
                    </GdsText>
                  </GdsFlex>
                </GdsFlex>
              </GdsCard>
            </GdsFlex>
          </GdsCard>
        </GdsGrid>
      </GdsFlex>
    </GdsFlex>
  );
}

function CheckoutLoading() {
  return (
    <GdsFlex
      justify-content="center"
      align-items="center"
      flex-direction="column"
      gap="m"
      style={{ minHeight: '100vh' } as any}
    >
      <GdsSpinner />
      <GdsText color="secondary">Loading checkout...</GdsText>
    </GdsFlex>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
