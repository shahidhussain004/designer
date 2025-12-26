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
      <Flex justify-content="center" align-items="center" style={{ minHeight: '100vh' } as any}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Div style={{ minHeight: '100vh', background: '#f3f4f6' } as any}>
      {/* Navigation */}
      <Div style={{ background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 10 } as any}>
        <Flex justify-content="space-between" align-items="center" padding="m" style={{ maxWidth: '1280px', margin: '0 auto' } as any}>
          <Flex align-items="center" gap="xl">
            <Link href="/" style={{ textDecoration: 'none' } as any}>
              <Text style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a' } as any}>
                Designer Marketplace
              </Text>
            </Link>
            <Flex gap="l" className="desktop-nav">
              <Link href="/dashboard" style={{ textDecoration: 'none', color: '#6b7280' } as any}>Dashboard</Link>
              <Link href="/dashboard/invoices" style={{ textDecoration: 'none', color: '#16a34a', fontWeight: 500 } as any}>Billing</Link>
            </Flex>
          </Flex>
        </Flex>
      </Div>

      <Flex flex-direction="column" gap="l" padding="xl" style={{ maxWidth: '1280px', margin: '0 auto' } as any}>
        {/* Balance Card */}
        {balance && (
          <Card style={{ background: 'linear-gradient(to right, #dcfce7, #166534)', color: 'white' } as any}>
            <Flex justify-content="space-between" align-items="center" flex-wrap="wrap" gap="l" padding="l">
              <Div>
                <Text style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' } as any}>Available Balance</Text>
                <Text style={{ fontSize: '2.5rem', fontWeight: 700 } as any}>
                  {formatCurrency(balance.availableBalance, balance.currency)}
                </Text>
                {balance.pendingBalance > 0 && (
                  <Text style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' } as any}>
                    + {formatCurrency(balance.pendingBalance, balance.currency)} pending
                  </Text>
                )}
              </Div>
              <Button
                rank="secondary"
                onClick={() => setShowPayoutModal(true)}
                disabled={balance.availableBalance <= 0}
                style={{ background: 'white', color: '#16a34a' } as any}
              >
                Request Payout
              </Button>
            </Flex>
          </Card>
        )}

        {/* Tabs */}
        <Flex gap="l" style={{ borderBottom: '1px solid #e5e7eb' } as any}>
          <Button
            rank="tertiary"
            onClick={() => setActiveTab('invoices')}
            style={{
              borderBottom: activeTab === 'invoices' ? '2px solid #16a34a' : 'none',
              borderRadius: 0,
              color: activeTab === 'invoices' ? '#16a34a' : '#9ca3af',
            } as any}
          >
            Invoices ({invoices.length})
          </Button>
          <Button
            rank="tertiary"
            onClick={() => setActiveTab('payouts')}
            style={{
              borderBottom: activeTab === 'payouts' ? '2px solid #16a34a' : 'none',
              borderRadius: 0,
              color: activeTab === 'payouts' ? '#16a34a' : '#9ca3af',
            } as any}
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
                <Text style={{ fontSize: '3rem' } as any}>📄</Text>
                <Text style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>No invoices yet</Text>
                <Text style={{ color: '#9ca3af' } as any}>
                  Invoices will appear here once you make or receive payments.
                </Text>
              </Flex>
            ) : (
              <>
                <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" style={{ background: '#f3f4f6' } as any}>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af' } as any}>Invoice</Text>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af' } as any}>Type</Text>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af' } as any}>Amount</Text>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af' } as any}>Status</Text>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af' } as any}>Date</Text>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af', textAlign: 'right' } as any}>Actions</Text>
                </Grid>
                {invoices.map((invoice) => (
                  <Div key={invoice.id}>
                    <Divider />
                    <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center">
                      <Text style={{ fontWeight: 500 } as any}>{invoice.invoiceNumber}</Text>
                      <Text style={{ color: '#9ca3af', textTransform: 'capitalize' } as any}>{invoice.type.toLowerCase()}</Text>
                      <Text style={{ fontWeight: 500 } as any}>{formatCurrency(invoice.totalAmount, invoice.currency)}</Text>
                      <Div>{getInvoiceStatusBadge(invoice.status)}</Div>
                      <Text style={{ color: '#9ca3af' } as any}>
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
                <Text style={{ fontSize: '3rem' } as any}>💸</Text>
                <Text style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>No payouts yet</Text>
                <Text style={{ color: '#9ca3af' } as any}>
                  Complete milestones to earn and request payouts.
                </Text>
              </Flex>
            ) : (
              <>
                <Grid columns="1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" style={{ background: '#f3f4f6' } as any}>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af' } as any}>ID</Text>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af' } as any}>Amount</Text>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af' } as any}>Method</Text>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af' } as any}>Status</Text>
                  <Text style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af' } as any}>Date</Text>
                </Grid>
                {payouts.map((payout) => (
                  <Div key={payout.id}>
                    <Divider />
                    <Grid columns="1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center">
                      <Text style={{ fontFamily: 'monospace', color: '#9ca3af' } as any}>PAY-{payout.id}</Text>
                      <Text style={{ fontWeight: 500 } as any}>{formatCurrency(payout.amount, payout.currency)}</Text>
                      <Text style={{ color: '#9ca3af' } as any}>{payout.payoutMethod.replace('_', ' ')}</Text>
                      <Div>
                        {getPayoutStatusBadge(payout.status)}
                        {payout.failedReason && (
                          <Text style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' } as any}>
                            {payout.failedReason}
                          </Text>
                        )}
                      </Div>
                      <Div>
                        <Text style={{ color: '#9ca3af' } as any}>
                          {new Date(payout.createdAt).toLocaleDateString()}
                        </Text>
                        {payout.completedAt && (
                          <Text style={{ fontSize: '0.75rem', color: '#16a34a' } as any}>
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
        <Div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
          } as any}
        >
          <Card style={{ maxWidth: '400px', width: '100%' } as any}>
            <Flex flex-direction="column" gap="l" padding="l">
              <Text tag="h3" style={{ fontSize: '1.25rem', fontWeight: 600 } as any}>Request Payout</Text>
              
              <Div>
                <Text style={{ fontSize: '0.875rem', color: '#9ca3af' } as any}>Available balance</Text>
                <Text style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a' } as any}>
                  {formatCurrency(balance.availableBalance, balance.currency)}
                </Text>
              </Div>

              <Div>
                <Text style={{ fontWeight: 500, marginBottom: '0.5rem' } as any}>Amount (USD)</Text>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  min="0"
                  max={(balance.availableBalance / 100).toFixed(2)}
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    background: '#f3f4f6',
                    color: '#111827',
                  } as any}
                />
              </Div>

              <Div>
                <Text style={{ fontWeight: 500, marginBottom: '0.5rem' } as any}>Payout Method</Text>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    background: '#f3f4f6',
                    color: '#111827',
                  } as any}
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

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          gds-grid[columns="1fr 1fr 1fr 1fr 1fr 1fr"],
          gds-grid[columns="1fr 1fr 1fr 1fr 1fr"] {
            display: flex !important;
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </Div>
  );
}
