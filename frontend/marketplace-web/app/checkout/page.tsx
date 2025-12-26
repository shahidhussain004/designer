'use client';

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Grid,
  Flex,
  Card,
  Text,
  Button,
  Input,
  Alert,
  Spinner,
  Divider,
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
      <Flex
        justify-content="center"
        align-items="center"
        flex-direction="column"
        gap="m"
      >
        <Spinner />
        <Text color="secondary">Setting up checkout...</Text>
      </Flex>
    );
  }

  return (
    <Flex
      flex-direction="column"
      padding="l"
    >
      <Flex flex-direction="column">
        {/* Header */}
        <Flex flex-direction="column" gap="s" padding="m">
          <Link href={returnUrl}>
            ← Back
          </Link>
          <Text tag="h1" font-size="heading-l">
            Checkout
          </Text>
        </Flex>

        <Grid columns="1; m{3}" gap="l">
          {/* Payment Form */}
          <Flex flex-direction="column" gap="m">
            <form onSubmit={handleSubmit}>
              <Flex flex-direction="column" gap="m">
                {/* Error Message */}
                {error && (
                  <Alert variant="negative">{error}</Alert>
                )}

                {/* Saved Payment Methods */}
                {paymentMethods.length > 0 && !showAddCard && (
                  <Card padding="l">
                    <Flex flex-direction="column" gap="m">
                      <Text tag="h2" font-size="heading-s">
                        Payment Method
                      </Text>

                      <Flex flex-direction="column" gap="s">
                        {paymentMethods.map((method) => (
                          <Card
                            key={method.id}
                            padding="m"
                            variant={selectedPaymentMethod === method.id ? 'positive' : 'secondary'}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                          >
                            <Flex align-items="center" gap="m">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={selectedPaymentMethod === method.id}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              />
                              <Flex flex-direction="column" gap="2xs" flex="1">
                                <Text font-weight="book">
                                  •••• {method.card?.last4}
                                </Text>
                                <Text font-size="body-s" color="secondary">
                                  Expires {method.card?.expMonth}/{method.card?.expYear}
                                </Text>
                              </Flex>
                              {method.isDefault && (
                                <Text font-size="body-s" color="secondary">
                                  Default
                                </Text>
                              )}
                            </Flex>
                          </Card>
                        ))}
                      </Flex>

                      <Button rank="tertiary" onClick={() => setShowAddCard(true)}>
                        + Add new card
                      </Button>
                    </Flex>
                  </Card>
                )}

                {/* New Card Form */}
                {showAddCard && (
                  <Card padding="l">
                    <Flex flex-direction="column" gap="m">
                      <Flex justify-content="space-between" align-items="center">
                        <Text tag="h2" font-size="heading-s">
                          Card Details
                        </Text>
                        {paymentMethods.length > 0 && (
                          <Button rank="tertiary" onClick={() => setShowAddCard(false)}>
                            Cancel
                          </Button>
                        )}
                      </Flex>

                      <Input
                        label="Cardholder Name"
                        value={cardName}
                        onInput={(e: Event) => setCardName((e.target as HTMLInputElement).value)}
                        required
                      />

                      <Input
                        label="Card Number"
                        value={cardNumber}
                        onInput={(e: Event) =>
                          setCardNumber(formatCardNumber((e.target as HTMLInputElement).value))
                        }
                        maxLength={19}
                        required
                      />

                      <Grid columns="2" gap="m">
                        <Input
                          label="Expiry Date"
                          value={cardExpiry}
                          onInput={(e: Event) =>
                            setCardExpiry(formatExpiry((e.target as HTMLInputElement).value))
                          }
                          maxLength={5}
                          required
                        />
                        <Input
                          label="CVC"
                          value={cardCvc}
                          onInput={(e: Event) =>
                            setCardCvc((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4))
                          }
                          maxLength={4}
                          required
                        />
                      </Grid>

                      <label>
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                        />
                        <Text font-size="body-s">Save card for future payments</Text>
                      </label>
                    </Flex>
                  </Card>
                )}

                {/* Submit Button */}
                <Button type="submit" disabled={processing}>
                  {processing ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
                </Button>

                {/* Security Note */}
                <Flex justify-content="center" align-items="center" gap="xs">
                  <Text font-size="body-s" color="secondary">
                    🔒 Secured by Stripe. Your payment information is encrypted.
                  </Text>
                </Flex>
              </Flex>
            </form>
          </Flex>

          {/* Order Summary */}
          <Card padding="l">
            <Flex flex-direction="column" gap="m">
              <Text tag="h2" font-size="heading-s">
                Order Summary
              </Text>

              <Flex flex-direction="column" gap="s">
                <Flex justify-content="space-between">
                  <Text color="secondary">{title}</Text>
                  <Text font-weight="book">{formatCurrency(amount)}</Text>
                </Flex>
                <Flex justify-content="space-between">
                  <Text font-size="body-s" color="secondary">
                    Processing fee
                  </Text>
                  <Text font-size="body-s" color="secondary">
                    {formatCurrency(0)}
                  </Text>
                </Flex>
              </Flex>

              <Divider />

              <Flex justify-content="space-between">
                <Text font-size="heading-s" font-weight="book">
                  Total
                </Text>
                <Text font-size="heading-s" font-weight="book">
                  {formatCurrency(amount)}
                </Text>
              </Flex>

              {/* Payment Type Info */}
              <Card padding="m" variant="secondary">
                <Flex gap="s">
                  <Text>🛡️</Text>
                  <Flex flex-direction="column" gap="xs">
                    <Text font-weight="book">
                      {type === 'milestone' ? 'Escrow Protection' : 'Secure Payment'}
                    </Text>
                    <Text font-size="body-s" color="secondary">
                      {type === 'milestone'
                        ? 'Funds are held securely until the milestone is completed and approved.'
                        : 'Your payment is protected by our secure checkout system.'}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            </Flex>
          </Card>
        </Grid>
      </Flex>
    </Flex>
  );
}

function CheckoutLoading() {
  return (
    <Flex
      justify-content="center"
      align-items="center"
      flex-direction="column"
      gap="m"
    >
      <Spinner />
      <Text color="secondary">Loading checkout...</Text>
    </Flex>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}
