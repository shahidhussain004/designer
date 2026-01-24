"use client";

import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/Skeletons';
import { PageLayout } from '@/components/ui';
import { useContracts } from '@/hooks/useUsers';
import { useAuth } from '@/lib/context/AuthContext';
import { Calendar, CheckCircle, Clock, DollarSign, FileText, Users, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Contract {
  id: number;
  title: string;
  description: string;
  contractType: 'FIXED_PRICE' | 'HOURLY' | 'MILESTONE_BASED';
  totalAmount: number;
  paymentSchedule: 'UPFRONT' | 'ON_COMPLETION' | 'MILESTONE_BASED' | 'WEEKLY' | 'MONTHLY';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  startDate: string;
  endDate?: string;
  job: { id: number; title: string };
  company: { id: number; username: string; fullName: string };
  freelancer: { id: number; username: string; fullName: string };
  createdAt: string;
}

export default function ContractsPage() {
  const { user } = useAuth();
  const { data: contracts = [], isLoading, isError, error, refetch } = useContracts();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'DISPUTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const filteredContracts = contracts.filter((contract: any) => {
    if (filterStatus === 'ALL') return true;
    return contract.status === filterStatus;
  });

  const contractStats = {
    active: contracts.filter((c: any) => c.status === 'ACTIVE').length,
    completed: contracts.filter((c: any) => c.status === 'COMPLETED').length,
    totalEarned: contracts
      .filter((c: any) => c.status === 'COMPLETED')
      .reduce((sum: number, c: any) => sum + c.totalAmount, 0),
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
        <p className="text-gray-600 mt-2">Manage all your project contracts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contracts</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{contractStats.active}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{contractStats.completed}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckCircle className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatAmount(contractStats.totalEarned)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="text-purple-600" size={24} />
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No contracts found</p>
          <p className="text-sm text-gray-500">
            {filterStatus !== 'ALL'
              ? 'Try changing the filter'
              : 'Your contracts will appear here once you start working'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract: any) => (
            <div key={contract.id} className="bg-white rounded-lg shadow hover:shadow-md transition p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {contract.title}
                      </h3>
                      <p className="text-sm text-gray-600">Job: {contract.job.title}</p>
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

                  <p className="text-gray-600 mb-4">{contract.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {contract.contractType.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatAmount(contract.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment</p>
                      <p className="text-sm font-medium text-gray-900">
                        {contract.paymentSchedule.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(contract.startDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>Company: {contract.company.fullName}</span>
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
                      onClick={() => (window.location.href = `/dashboards/contracts/${contract.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      View Details
                    </button>
                    {contract.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={() => (window.location.href = `/dashboards/freelancer/time-tracking?contractId=${contract.id}`)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                        >
                          Log Time
                        </button>
                        <button
                          onClick={() => (window.location.href = `/dashboards/freelancer/time-tracking?contractId=${contract.id}`)}
                          className="px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg hover:bg-gray-50 transition text-sm"
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
