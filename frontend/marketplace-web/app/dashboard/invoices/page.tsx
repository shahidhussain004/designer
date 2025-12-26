'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import {
  getMyInvoices,
  getMyPayouts,
  getAvailableBalance,
  requestPayout,
  downloadInvoicePdf,
  Invoice,
  Payout,
  formatCurrency,
} from '@/lib/payments';
import {
  Card,
  Flex,
  Grid,
  Text,
  Button,
  Input,
  Div,
  Divider,
  Badge,
  Spinner,
  Alert,
} from '@/components/green';

export default function InvoicesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payouts'>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [balance, setBalance] = useState<{ availableBalance: number; pendingBalance: number; currency: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('STRIPE_CONNECT');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login?redirect=/dashboard/invoices');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesData, payoutsData, balanceData] = await Promise.all([
        getMyInvoices(),
        getMyPayouts(),
        getAvailableBalance(),
      ]);
      setInvoices(invoicesData);
      setPayouts(payoutsData);
      setBalance(balanceData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: number) => {
    try {
      const blob = await downloadInvoicePdf(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice');
    }
  };

  const handleRequestPayout = async () => {
    if (!payoutAmount || !balance) return;

    const amount = parseFloat(payoutAmount) * 100;
    if (amount <= 0 || amount > balance.availableBalance) {
      alert('Invalid payout amount');
      return;
    }

    try {
      setIsRequesting(true);
      await requestPayout(amount, payoutMethod);
      setShowPayoutModal(false);
      setPayoutAmount('');
      fetchData();
    } catch (err) {
      console.error('Error requesting payout:', err);
      alert(err instanceof Error ? err.message : 'Failed to request payout');
    } finally {
      setIsRequesting(false);
    }
  };

  const getInvoiceStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <Badge variant="positive">{status}</Badge>;
      case 'PENDING':
        return <Badge variant="notice">{status}</Badge>;
      case 'OVERDUE':
        return <Badge variant="negative">{status}</Badge>;
      default:
        return <Badge variant="information">{status}</Badge>;
    }
  };

  const getPayoutStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <Badge variant="positive">{status}</Badge>;
      case 'PENDING':
        return <Badge variant="notice">{status}</Badge>;
      case 'PROCESSING':
        return <Badge variant="information">{status}</Badge>;
      case 'FAILED':
        return <Badge variant="negative">{status}</Badge>;
      default:
        return <Badge variant="information">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Flex justify-content="center" align-items="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Div>
      {/* Navigation */}
      <Div>
        <Flex justify-content="space-between" align-items="center" padding="m">
          <Flex align-items="center" gap="xl">
            <Link href="/">
              <Text>
                Designer Marketplace
              </Text>
            </Link>
            <Flex gap="l" className="desktop-nav">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/dashboard/invoices">Billing</Link>
            </Flex>
          </Flex>
        </Flex>
      </Div>

      <Flex flex-direction="column" gap="l" padding="xl">
        {/* Balance Card */}
        {balance && (
          <Card>
            <Flex justify-content="space-between" align-items="center" flex-wrap="wrap" gap="l" padding="l">
              <Div>
                <Text>Available Balance</Text>
                <Text>
                  {formatCurrency(balance.availableBalance, balance.currency)}
                </Text>
                {balance.pendingBalance > 0 && (
                  <Text>
                    + {formatCurrency(balance.pendingBalance, balance.currency)} pending
                  </Text>
                )}
              </Div>
              <Button
                rank="secondary"
                onClick={() => setShowPayoutModal(true)}
                disabled={balance.availableBalance <= 0}
              >
                Request Payout
              </Button>
            </Flex>
          </Card>
        )}

        {/* Tabs */}
        <Flex gap="l">
          <Button
            rank="tertiary"
            onClick={() => setActiveTab('invoices')}
          >
            Invoices ({invoices.length})
          </Button>
          <Button
            rank="tertiary"
            onClick={() => setActiveTab('payouts')}
          >
            Payouts ({payouts.length})
          </Button>
        </Flex>

        {/* Error */}
        {error && <Alert variant="negative">{error}</Alert>}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <Card>
            {invoices.length === 0 ? (
              <Flex flex-direction="column" align-items="center" padding="3xl" gap="m">
                <Text>📄</Text>
                <Text>No invoices yet</Text>
                <Text>
                  Invoices will appear here once you make or receive payments.
                </Text>
              </Flex>
            ) : (
              <>
                <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m">
                  <Text>Invoice</Text>
                  <Text>Type</Text>
                  <Text>Amount</Text>
                  <Text>Status</Text>
                  <Text>Date</Text>
                  <Text>Actions</Text>
                </Grid>
                {invoices.map((invoice) => (
                  <Div key={invoice.id}>
                    <Divider />
                    <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center">
                      <Text>{invoice.invoiceNumber}</Text>
                      <Text>{invoice.type.toLowerCase()}</Text>
                      <Text>{formatCurrency(invoice.totalAmount, invoice.currency)}</Text>
                      <Div>{getInvoiceStatusBadge(invoice.status)}</Div>
                      <Text>
                        {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : '-'}
                      </Text>
                      <Flex justify-content="flex-end">
                        <Button size="small" rank="tertiary" onClick={() => handleDownloadInvoice(invoice.id)}>
                          Download PDF
                        </Button>
                      </Flex>
                    </Grid>
                  </Div>
                ))}
              </>
            )}
          </Card>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <Card>
            {payouts.length === 0 ? (
              <Flex flex-direction="column" align-items="center" padding="3xl" gap="m">
                <Text>💸</Text>
                <Text>No payouts yet</Text>
                <Text>
                  Complete milestones to earn and request payouts.
                </Text>
              </Flex>
            ) : (
              <>
                <Grid columns="1fr 1fr 1fr 1fr 1fr" gap="m" padding="m">
                  <Text>ID</Text>
                  <Text>Amount</Text>
                  <Text>Method</Text>
                  <Text>Status</Text>
                  <Text>Date</Text>
                </Grid>
                {payouts.map((payout) => (
                  <Div key={payout.id}>
                    <Divider />
                    <Grid columns="1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center">
                      <Text>PAY-{payout.id}</Text>
                      <Text>{formatCurrency(payout.amount, payout.currency)}</Text>
                      <Text>{payout.payoutMethod.replace('_', ' ')}</Text>
                      <Div>
                        {getPayoutStatusBadge(payout.status)}
                        {payout.failedReason && (
                          <Text>
                            {payout.failedReason}
                          </Text>
                        )}
                      </Div>
                      <Div>
                        <Text>
                          {new Date(payout.createdAt).toLocaleDateString()}
                        </Text>
                        {payout.completedAt && (
                          <Text>
                            Completed: {new Date(payout.completedAt).toLocaleDateString()}
                          </Text>
                        )}
                      </Div>
                    </Grid>
                  </Div>
                ))}
              </>
            )}
          </Card>
        )}
      </Flex>

      {/* Payout Request Modal */}
      {showPayoutModal && balance && (
        <Div>
          <Card>
            <Flex flex-direction="column" gap="l" padding="l">
              <Text tag="h3">Request Payout</Text>
              
              <Div>
                <Text>Available balance</Text>
                <Text>
                  {formatCurrency(balance.availableBalance, balance.currency)}
                </Text>
              </Div>

              <Div>
                <Text>Amount (USD)</Text>
                <Input
                  type="number"
                  value={payoutAmount}
                  onInput={(e: Event) => {
                    const target = e.target as HTMLInputElement
                    setPayoutAmount(target.value)
                  }}
                  min="0"
                  max={(balance.availableBalance / 100).toFixed(2)}
                  step="0.01"
                />
              </Div>

              <Div>
                <Text>Payout Method</Text>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                >
                  <option value="STRIPE_CONNECT">Stripe Connect</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="PAYPAL">PayPal</option>
                </select>
              </Div>

              <Flex justify-content="flex-end" gap="m">
                <Button
                  rank="secondary"
                  onClick={() => {
                    setShowPayoutModal(false);
                    setPayoutAmount('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  rank="primary"
                  onClick={handleRequestPayout}
                  disabled={isRequesting || !payoutAmount || parseFloat(payoutAmount) <= 0}
                >
                  {isRequesting ? 'Processing...' : 'Request Payout'}
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Div>
      )}
    </Div>
  );
}
