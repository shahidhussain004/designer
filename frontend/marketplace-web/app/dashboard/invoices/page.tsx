'use client';

import { authService } from '@/lib/auth';
import {
  downloadInvoicePdf,
  formatCurrency,
  getAvailableBalance,
  getMyInvoices,
  getMyPayouts,
  Invoice,
  Payout,
  requestPayout,
} from '@/lib/payments';
import { AlertCircle, ArrowLeft, CheckCircle, Clock, DollarSign, Download, FileText, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
            <CheckCircle className="w-3 h-3" />
            Paid
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-error-100 text-error-700">
            <XCircle className="w-3 h-3" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
            {status}
          </span>
        );
    }
  };

  const getPayoutStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-error-100 text-error-700">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-secondary-500">Loading billing data...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-secondary-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-secondary-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        {balance && (
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-secondary-500 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {formatCurrency(balance.availableBalance, balance.currency)}
                </p>
                {balance.pendingBalance > 0 && (
                  <p className="text-sm text-secondary-500 mt-1">
                    + {formatCurrency(balance.pendingBalance, balance.currency)} pending
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowPayoutModal(true)}
                disabled={balance.availableBalance <= 0}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Request Payout
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'invoices'
                ? 'bg-secondary-900 text-white'
                : 'bg-white border border-secondary-200 text-secondary-700 hover:bg-secondary-50'
            }`}
          >
            Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'payouts'
                ? 'bg-secondary-900 text-white'
                : 'bg-white border border-secondary-200 text-secondary-700 hover:bg-secondary-50'
            }`}
          >
            Payouts ({payouts.length})
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
            <p className="text-error-700">{error}</p>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
            {invoices.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-900 font-medium mb-1">No invoices yet</p>
                <p className="text-secondary-500">
                  Invoices will appear here once you make or receive payments.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">Invoice</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 text-sm font-medium text-secondary-900">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-secondary-600 capitalize">{invoice.type.toLowerCase()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-secondary-900">{formatCurrency(invoice.totalAmount, invoice.currency)}</td>
                      <td className="px-6 py-4">{getInvoiceStatusBadge(invoice.status)}</td>
                      <td className="px-6 py-4 text-sm text-secondary-600">
                        {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
            {payouts.length === 0 ? (
              <div className="text-center py-16">
                <DollarSign className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-900 font-medium mb-1">No payouts yet</p>
                <p className="text-secondary-500">
                  Complete milestones to earn and request payouts.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">Method</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 text-sm font-medium text-secondary-900">PAY-{payout.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-secondary-900">{formatCurrency(payout.amount, payout.currency)}</td>
                      <td className="px-6 py-4 text-sm text-secondary-600">{payout.payoutMethod.replace('_', ' ')}</td>
                      <td className="px-6 py-4">
                        {getPayoutStatusBadge(payout.status)}
                        {payout.failedReason && (
                          <p className="text-xs text-error-600 mt-1">{payout.failedReason}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-secondary-900">{new Date(payout.createdAt).toLocaleDateString()}</p>
                        {payout.completedAt && (
                          <p className="text-xs text-secondary-500">
                            Completed: {new Date(payout.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && balance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-secondary-900 mb-6">Request Payout</h3>
            
            <div className="mb-4">
              <p className="text-sm text-secondary-500 mb-1">Available balance</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(balance.availableBalance, balance.currency)}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-1">Amount (USD)</label>
              <input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                min="0"
                max={(balance.availableBalance / 100).toFixed(2)}
                step="0.01"
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none"
                placeholder="0.00"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-1">Payout Method</label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-input-focus focus:border-input-focus outline-none"
              >
                <option value="STRIPE_CONNECT">Stripe Connect</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="PAYPAL">PayPal</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPayoutModal(false);
                  setPayoutAmount('');
                }}
                className="px-4 py-2 border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPayout}
                disabled={isRequesting || !payoutAmount || parseFloat(payoutAmount) <= 0}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequesting ? 'Processing...' : 'Request Payout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
