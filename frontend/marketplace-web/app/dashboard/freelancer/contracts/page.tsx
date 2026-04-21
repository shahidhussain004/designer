"use client";

import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/Skeletons';
import { Breadcrumb, PageLayout } from '@/components/ui';
import { useContracts } from '@/hooks/useUsers';
import { useAuth } from '@/lib/context/AuthContext';
import { Calendar, CheckCircle, Clock, DollarSign, FileText, Users, XCircle } from 'lucide-react';
import { useState } from 'react';

interface FreelancerContract {
  id: number;
  title: string;
  description: string;
  contractType?: 'FIXED_PRICE' | 'HOURLY' | 'MILESTONE_BASED';
  totalAmount?: number;
  paymentSchedule?: 'UPFRONT' | 'ON_COMPLETION' | 'MILESTONE_BASED' | 'WEEKLY' | 'MONTHLY';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  startDate: string;
  endDate?: string;
  job?: { id: number; title: string };
  company?: { id: number; username: string; fullName: string };
  freelancer: { id: number; username: string; fullName: string };
  createdAt: string;
}

export default function ContractsPage() {
  const { user: _user } = useAuth();
  const { data: contracts = [], isLoading, isError, error, refetch } = useContracts();
  const localContracts = (contracts as unknown) as FreelancerContract[];
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-success-100 text-success-800';
      case 'COMPLETED':
        return 'bg-primary-100 text-blue-800';
      case 'PENDING':
        return 'bg-warning-100 text-warning-800';
      case 'CANCELLED':
        return 'bg-secondary-100 text-secondary-800';
      case 'DISPUTED':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle size={16} />;
      case 'COMPLETED':
        return <CheckCircle size={16} />;
      case 'PENDING':
        return <Clock size={16} />;
      case 'CANCELLED':
      case 'DISPUTED':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredContracts = localContracts.filter((contract: FreelancerContract) => {
    if (filterStatus === 'ALL') return true;
    return contract.status === filterStatus;
  });

  const contractStats = {
    active: localContracts.filter((c: FreelancerContract) => c.status === 'ACTIVE').length,
    completed: localContracts.filter((c: FreelancerContract) => c.status === 'COMPLETED').length,
    totalEarned: localContracts
      .filter((c: FreelancerContract) => c.status === 'COMPLETED')
      .reduce((sum: number, c: FreelancerContract) => sum + (c.totalAmount ?? 0), 0),
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout>
        <ErrorMessage 
          message={error?.message || 'Failed to load contracts'} 
          retry={refetch}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Freelancer', href: '/dashboard/freelancer' },
            { label: 'Contracts', href: '/dashboard/freelancer/contracts' },
          ]}
        />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">My Contracts</h1>
        <p className="text-secondary-600 mt-2">Manage all your project contracts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Active Contracts</p>
              <p className="text-3xl font-bold text-success-600 mt-2">{contractStats.active}</p>
            </div>
            <div className="bg-success-100 p-3 rounded-full">
              <FileText className="text-success-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Completed</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">{contractStats.completed}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <CheckCircle className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Total Earned</p>
              <p className="text-3xl font-bold text-secondary-900 mt-2">
                {formatAmount(contractStats.totalEarned)}
              </p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <DollarSign className="text-primary-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {['ALL', 'ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED', 'DISPUTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                filterStatus === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Contracts List */}
      {filteredContracts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText size={48} className="mx-auto text-secondary-400 mb-4" />
          <p className="text-secondary-600 mb-2">No contracts found</p>
          <p className="text-sm text-secondary-500">
            {filterStatus !== 'ALL'
              ? 'Try changing the filter'
              : 'Your contracts will appear here once you start working'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract: FreelancerContract) => (
            <div key={contract.id} className="bg-white rounded-lg shadow hover:shadow-md transition p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                        {contract.title}
                      </h3>
                      <p className="text-sm text-secondary-600">Job: {contract.job?.title ?? '—'}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        contract.status
                      )}`}
                    >
                      {getStatusIcon(contract.status)}
                      {contract.status}
                    </span>
                  </div>

                  <p className="text-secondary-600 mb-4">{contract.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-secondary-500 mb-1">Type</p>
                      <p className="text-sm font-medium text-secondary-900">
                        {contract.contractType?.replace('_', ' ') ?? '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-1">Amount</p>
                      <p className="text-sm font-medium text-secondary-900">
                        {formatAmount(contract.totalAmount ?? 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-1">Payment</p>
                      <p className="text-sm font-medium text-secondary-900">
                        {contract.paymentSchedule?.replace('_', ' ') ?? '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-1">Start Date</p>
                      <p className="text-sm font-medium text-secondary-900">
                        {formatDate(contract.startDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-secondary-600">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>Company: {contract.company?.fullName ?? '—'}</span>
                    </div>
                    {contract.endDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Ends: {formatDate(contract.endDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={() => (window.location.href = `/dashboard/contracts/${contract.id}`)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm"
                    >
                      View Details
                    </button>
                    {contract.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={() => (window.location.href = `/dashboard/freelancer/time-tracking?contractId=${contract.id}`)}
                          className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition text-sm"
                        >
                          Log Time
                        </button>
                        <button
                          onClick={() => (window.location.href = `/dashboard/freelancer/time-tracking?contractId=${contract.id}`)}
                          className="px-4 py-2 bg-white border border-secondary-200 text-secondary-800 rounded-lg hover:bg-secondary-50 transition text-sm"
                        >
                          View Time Tracking
                        </button>
                      </>
                    )}
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </PageLayout>
  );
}
