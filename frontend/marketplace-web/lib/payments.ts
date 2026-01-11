import { apiClient } from './api-client';

// Payment types
export interface PaymentIntent {
  id: string;
  companySecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface Milestone {
  id: number;
  jobId: number;
  proposalId: number;
  title: string;
  description: string;
  amount: number;
  orderIndex: number;
  status: 'PENDING' | 'FUNDED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  dueDate?: string;
  submittedAt?: string;
  approvedAt?: string;
  escrowId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  type: 'PAYMENT' | 'MILESTONE' | 'REFUND' | 'PAYOUT';
  paymentId?: number;
  milestoneId?: number;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
  lineItems: InvoiceLineItem[];
  issuedAt?: string;
  paidAt?: string;
  createdAt: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Payout {
  id: number;
  freelancerId: number;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  payoutMethod: 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE_CONNECT';
  stripePayoutId?: string;
  completedAt?: string;
  failedReason?: string;
  createdAt: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

// API functions

// Payment Intents
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<PaymentIntent> {
  const response = await apiClient.post('/payments/create-intent', {
    amount,
    currency,
    metadata,
  });
  return response.data;
}

export async function confirmPayment(paymentIntentId: string): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(`/payments/${paymentIntentId}/confirm`);
  return response.data;
}

// Milestones
export async function getMilestones(jobId: number): Promise<Milestone[]> {
  const response = await apiClient.get(`/milestones/job/${jobId}`);
  return response.data;
}

export async function fundMilestone(milestoneId: number, paymentMethodId: string): Promise<Milestone> {
  const response = await apiClient.post(`/milestones/${milestoneId}/fund`, {
    paymentMethodId,
  });
  return response.data;
}

export async function startMilestone(milestoneId: number): Promise<Milestone> {
  const response = await apiClient.post(`/milestones/${milestoneId}/start`);
  return response.data;
}

export async function submitMilestone(milestoneId: number, deliverables?: string): Promise<Milestone> {
  const response = await apiClient.post(`/milestones/${milestoneId}/submit`, {
    deliverables,
  });
  return response.data;
}

export async function approveMilestone(milestoneId: number): Promise<Milestone> {
  const response = await apiClient.post(`/milestones/${milestoneId}/approve`);
  return response.data;
}

export async function requestMilestoneRevision(milestoneId: number, reason: string): Promise<Milestone> {
  const response = await apiClient.post(`/milestones/${milestoneId}/revision`, {
    reason,
  });
  return response.data;
}

// Invoices
export async function getInvoice(invoiceId: number): Promise<Invoice> {
  const response = await apiClient.get(`/invoices/${invoiceId}`);
  return response.data;
}

export async function getMyInvoices(): Promise<Invoice[]> {
  const response = await apiClient.get('/invoices/my');
  return response.data;
}

export async function downloadInvoicePdf(invoiceId: number): Promise<Blob> {
  const response = await apiClient.get(`/invoices/${invoiceId}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
}

// Payouts
export async function getMyPayouts(): Promise<Payout[]> {
  const response = await apiClient.get('/payouts/my');
  return response.data;
}

export async function requestPayout(amount: number, payoutMethod: string): Promise<Payout> {
  const response = await apiClient.post('/payouts/request', {
    amount,
    payoutMethod,
  });
  return response.data;
}

export async function getAvailableBalance(): Promise<{ availableBalance: number; pendingBalance: number; currency: string }> {
  const response = await apiClient.get('/payouts/balance');
  return response.data;
}

// Payment Methods
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const response = await apiClient.get('/payments/methods');
  return response.data;
}

export async function addPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
  const response = await apiClient.post('/payments/methods', {
    paymentMethodId,
  });
  return response.data;
}

export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
  await apiClient.post(`/payments/methods/${paymentMethodId}/default`);
}

export async function removePaymentMethod(paymentMethodId: string): Promise<void> {
  await apiClient.delete(`/payments/methods/${paymentMethodId}`);
}

// Checkout Sessions (for course purchases)
export async function createCourseCheckoutSession(
  courseId: string,
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSession> {
  const response = await apiClient.post('/payments/checkout/course', {
    courseId,
    successUrl,
    cancelUrl,
  });
  return response.data;
}

// Stripe Connect (for freelancers)
export async function createConnectAccount(): Promise<{ accountId: string; onboardingUrl: string }> {
  const response = await apiClient.post('/payments/connect/account');
  return response.data;
}

export async function getConnectAccountStatus(): Promise<{ 
  accountId: string; 
  isOnboarded: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
}> {
  const response = await apiClient.get('/payments/connect/status');
  return response.data;
}

// Utility functions
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Stripe amounts are in cents
}

export function getMilestoneStatusColor(status: Milestone['status']): string {
  const colors: Record<Milestone['status'], string> = {
    PENDING: 'bg-gray-100 text-gray-800',
    FUNDED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    SUBMITTED: 'bg-purple-100 text-purple-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-200 text-gray-600',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getInvoiceStatusColor(status: Invoice['status']): string {
  const colors: Record<Invoice['status'], string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    ISSUED: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPayoutStatusColor(status: Payout['status']): string {
  const colors: Record<Payout['status'], string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
