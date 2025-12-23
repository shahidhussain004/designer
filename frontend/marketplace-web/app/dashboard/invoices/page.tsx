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
  GdsCard,
  GdsFlex,
  GdsGrid,
  GdsText,
  GdsButton,
  GdsInput,
  GdsDiv,
  GdsDivider,
  GdsBadge,
  GdsSpinner,
  GdsAlert,
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
        return <GdsBadge variant="positive">{status}</GdsBadge>;
      case 'PENDING':
        return <GdsBadge variant="notice">{status}</GdsBadge>;
      case 'OVERDUE':
        return <GdsBadge variant="negative">{status}</GdsBadge>;
      default:
        return <GdsBadge variant="information">{status}</GdsBadge>;
    }
  };

  const getPayoutStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <GdsBadge variant="positive">{status}</GdsBadge>;
      case 'PENDING':
        return <GdsBadge variant="notice">{status}</GdsBadge>;
      case 'PROCESSING':
        return <GdsBadge variant="information">{status}</GdsBadge>;
      case 'FAILED':
        return <GdsBadge variant="negative">{status}</GdsBadge>;
      default:
        return <GdsBadge variant="information">{status}</GdsBadge>;
    }
  };

  if (loading) {
    return (
      <GdsFlex justify-content="center" align-items="center" style={{ minHeight: '100vh' } as any}>
        <GdsSpinner />
      </GdsFlex>
    );
  }

  return (
    <GdsDiv style={{ minHeight: '100vh', background: 'var(--gds-color-l3-background-secondary)' } as any}>
      {/* Navigation */}
      <GdsDiv style={{ background: 'var(--gds-color-l3-background-primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 10 } as any}>
        <GdsFlex justify-content="space-between" align-items="center" padding="m" style={{ maxWidth: '1280px', margin: '0 auto' } as any}>
          <GdsFlex align-items="center" gap="xl">
            <Link href="/" style={{ textDecoration: 'none' } as any}>
              <GdsText style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gds-color-l3-content-positive)' } as any}>
                Designer Marketplace
              </GdsText>
            </Link>
            <GdsFlex gap="l" className="desktop-nav">
              <Link href="/dashboard" style={{ textDecoration: 'none', color: 'var(--gds-color-l3-content-secondary)' } as any}>Dashboard</Link>
              <Link href="/dashboard/invoices" style={{ textDecoration: 'none', color: 'var(--gds-color-l3-content-positive)', fontWeight: 500 } as any}>Billing</Link>
            </GdsFlex>
          </GdsFlex>
        </GdsFlex>
      </GdsDiv>

      <GdsFlex flex-direction="column" gap="l" padding="xl" style={{ maxWidth: '1280px', margin: '0 auto' } as any}>
        {/* Balance Card */}
        {balance && (
          <GdsCard style={{ background: 'linear-gradient(to right, var(--gds-color-l3-background-positive), #166534)', color: 'white' } as any}>
            <GdsFlex justify-content="space-between" align-items="center" flex-wrap="wrap" gap="l" padding="l">
              <GdsDiv>
                <GdsText style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' } as any}>Available Balance</GdsText>
                <GdsText style={{ fontSize: '2.5rem', fontWeight: 700 } as any}>
                  {formatCurrency(balance.availableBalance, balance.currency)}
                </GdsText>
                {balance.pendingBalance > 0 && (
                  <GdsText style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' } as any}>
                    + {formatCurrency(balance.pendingBalance, balance.currency)} pending
                  </GdsText>
                )}
              </GdsDiv>
              <GdsButton
                rank="secondary"
                onClick={() => setShowPayoutModal(true)}
                disabled={balance.availableBalance <= 0}
                style={{ background: 'white', color: 'var(--gds-color-l3-content-positive)' } as any}
              >
                Request Payout
              </GdsButton>
            </GdsFlex>
          </GdsCard>
        )}

        {/* Tabs */}
        <GdsFlex gap="l" style={{ borderBottom: '1px solid var(--gds-color-l3-border-primary)' } as any}>
          <GdsButton
            rank="tertiary"
            onClick={() => setActiveTab('invoices')}
            style={{
              borderBottom: activeTab === 'invoices' ? '2px solid var(--gds-color-l3-content-positive)' : 'none',
              borderRadius: 0,
              color: activeTab === 'invoices' ? 'var(--gds-color-l3-content-positive)' : 'var(--gds-color-l3-content-tertiary)',
            } as any}
          >
            Invoices ({invoices.length})
          </GdsButton>
          <GdsButton
            rank="tertiary"
            onClick={() => setActiveTab('payouts')}
            style={{
              borderBottom: activeTab === 'payouts' ? '2px solid var(--gds-color-l3-content-positive)' : 'none',
              borderRadius: 0,
              color: activeTab === 'payouts' ? 'var(--gds-color-l3-content-positive)' : 'var(--gds-color-l3-content-tertiary)',
            } as any}
          >
            Payouts ({payouts.length})
          </GdsButton>
        </GdsFlex>

        {/* Error */}
        {error && <GdsAlert variant="negative">{error}</GdsAlert>}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <GdsCard>
            {invoices.length === 0 ? (
              <GdsFlex flex-direction="column" align-items="center" padding="3xl" gap="m">
                <GdsText style={{ fontSize: '3rem' } as any}>📄</GdsText>
                <GdsText style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>No invoices yet</GdsText>
                <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                  Invoices will appear here once you make or receive payments.
                </GdsText>
              </GdsFlex>
            ) : (
              <>
                <GdsGrid columns="1fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" style={{ background: 'var(--gds-color-l3-background-secondary)' } as any}>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Invoice</GdsText>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Type</GdsText>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Amount</GdsText>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Status</GdsText>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Date</GdsText>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)', textAlign: 'right' } as any}>Actions</GdsText>
                </GdsGrid>
                {invoices.map((invoice) => (
                  <GdsDiv key={invoice.id}>
                    <GdsDivider />
                    <GdsGrid columns="1fr 1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center">
                      <GdsText style={{ fontWeight: 500 } as any}>{invoice.invoiceNumber}</GdsText>
                      <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)', textTransform: 'capitalize' } as any}>{invoice.type.toLowerCase()}</GdsText>
                      <GdsText style={{ fontWeight: 500 } as any}>{formatCurrency(invoice.totalAmount, invoice.currency)}</GdsText>
                      <GdsDiv>{getInvoiceStatusBadge(invoice.status)}</GdsDiv>
                      <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                        {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : '-'}
                      </GdsText>
                      <GdsFlex justify-content="flex-end">
                        <GdsButton size="small" rank="tertiary" onClick={() => handleDownloadInvoice(invoice.id)}>
                          Download PDF
                        </GdsButton>
                      </GdsFlex>
                    </GdsGrid>
                  </GdsDiv>
                ))}
              </>
            )}
          </GdsCard>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <GdsCard>
            {payouts.length === 0 ? (
              <GdsFlex flex-direction="column" align-items="center" padding="3xl" gap="m">
                <GdsText style={{ fontSize: '3rem' } as any}>💸</GdsText>
                <GdsText style={{ fontSize: '1.125rem', fontWeight: 600 } as any}>No payouts yet</GdsText>
                <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                  Complete milestones to earn and request payouts.
                </GdsText>
              </GdsFlex>
            ) : (
              <>
                <GdsGrid columns="1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" style={{ background: 'var(--gds-color-l3-background-secondary)' } as any}>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>ID</GdsText>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Amount</GdsText>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Method</GdsText>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Status</GdsText>
                  <GdsText style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Date</GdsText>
                </GdsGrid>
                {payouts.map((payout) => (
                  <GdsDiv key={payout.id}>
                    <GdsDivider />
                    <GdsGrid columns="1fr 1fr 1fr 1fr 1fr" gap="m" padding="m" align-items="center">
                      <GdsText style={{ fontFamily: 'monospace', color: 'var(--gds-color-l3-content-tertiary)' } as any}>PAY-{payout.id}</GdsText>
                      <GdsText style={{ fontWeight: 500 } as any}>{formatCurrency(payout.amount, payout.currency)}</GdsText>
                      <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>{payout.payoutMethod.replace('_', ' ')}</GdsText>
                      <GdsDiv>
                        {getPayoutStatusBadge(payout.status)}
                        {payout.failedReason && (
                          <GdsText style={{ fontSize: '0.75rem', color: 'var(--gds-color-l3-content-negative)', marginTop: '0.25rem' } as any}>
                            {payout.failedReason}
                          </GdsText>
                        )}
                      </GdsDiv>
                      <GdsDiv>
                        <GdsText style={{ color: 'var(--gds-color-l3-content-tertiary)' } as any}>
                          {new Date(payout.createdAt).toLocaleDateString()}
                        </GdsText>
                        {payout.completedAt && (
                          <GdsText style={{ fontSize: '0.75rem', color: 'var(--gds-color-l3-content-positive)' } as any}>
                            Completed: {new Date(payout.completedAt).toLocaleDateString()}
                          </GdsText>
                        )}
                      </GdsDiv>
                    </GdsGrid>
                  </GdsDiv>
                ))}
              </>
            )}
          </GdsCard>
        )}
      </GdsFlex>

      {/* Payout Request Modal */}
      {showPayoutModal && balance && (
        <GdsDiv
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
          <GdsCard style={{ maxWidth: '400px', width: '100%' } as any}>
            <GdsFlex flex-direction="column" gap="l" padding="l">
              <GdsText tag="h3" style={{ fontSize: '1.25rem', fontWeight: 600 } as any}>Request Payout</GdsText>
              
              <GdsDiv>
                <GdsText style={{ fontSize: '0.875rem', color: 'var(--gds-color-l3-content-tertiary)' } as any}>Available balance</GdsText>
                <GdsText style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gds-color-l3-content-positive)' } as any}>
                  {formatCurrency(balance.availableBalance, balance.currency)}
                </GdsText>
              </GdsDiv>

              <GdsDiv>
                <GdsText style={{ fontWeight: 500, marginBottom: '0.5rem' } as any}>Amount (USD)</GdsText>
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
                    border: '1px solid var(--gds-color-l3-border-primary)',
                    borderRadius: '4px',
                    background: 'var(--gds-color-l3-background-secondary)',
                    color: 'var(--gds-color-l3-content-primary)',
                  } as any}
                />
              </GdsDiv>

              <GdsDiv>
                <GdsText style={{ fontWeight: 500, marginBottom: '0.5rem' } as any}>Payout Method</GdsText>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gds-color-l3-border-primary)',
                    borderRadius: '4px',
                    background: 'var(--gds-color-l3-background-secondary)',
                    color: 'var(--gds-color-l3-content-primary)',
                  } as any}
                >
                  <option value="STRIPE_CONNECT">Stripe Connect</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="PAYPAL">PayPal</option>
                </select>
              </GdsDiv>

              <GdsFlex justify-content="flex-end" gap="m">
                <GdsButton
                  rank="secondary"
                  onClick={() => {
                    setShowPayoutModal(false);
                    setPayoutAmount('');
                  }}
                >
                  Cancel
                </GdsButton>
                <GdsButton
                  rank="primary"
                  onClick={handleRequestPayout}
                  disabled={isRequesting || !payoutAmount || parseFloat(payoutAmount) <= 0}
                >
                  {isRequesting ? 'Processing...' : 'Request Payout'}
                </GdsButton>
              </GdsFlex>
            </GdsFlex>
          </GdsCard>
        </GdsDiv>
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
    </GdsDiv>
  );
}
