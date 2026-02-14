"use client";

import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/Skeletons';
import { Breadcrumb, PageLayout } from '@/components/ui';
import { useActiveContracts, useCreateTimeEntry, useTimeEntries } from '@/hooks/useUsers';
import { useAuth } from '@/lib/context/AuthContext';
import logger from '@/lib/logger';
import { Calendar, Check, Clock, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimeEntry {
  id: number;
  description: string;
  hoursWorked: number;
  ratePerHour: number;
  workDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  approvedAt?: string;
  paidAt?: string;
  rejectionReason?: string;
  contract: {
    id: number;
    title: string;
  };
}

interface Contract {
  id: number;
  title: string;
  contractType: string;
  totalAmount: number;
  status: string;
}

export default function TimeTrackingPage() {
  const { user } = useAuth();
  const { data: timeEntries = [], isLoading, isError, error, refetch } = useTimeEntries(user?.id ?? null);
  const { data: contracts = [] } = useActiveContracts();
  const createTimeEntryMutation = useCreateTimeEntry();
  const [contractIdFromQuery, setContractIdFromQuery] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search);
        setContractIdFromQuery(sp.get('contractId'));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contractId: '',
    description: '',
    hoursWorked: '',
    ratePerHour: '',
    workDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      logger.error('User must be signed in to log time');
      return;
    }

    const payload = {
      contractId: parseInt(formData.contractId),
      freelancerId: user.id,
      description: formData.description,
      hoursLogged: parseFloat(formData.hoursWorked),
      ratePerHour: parseFloat(formData.ratePerHour),
      date: formData.workDate,
      status: 'PENDING',
    };

    try {
      await createTimeEntryMutation.mutateAsync(payload);
      resetForm();
    } catch (error) {
      logger.error('Failed to create time entry', error as Error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      contractId: '',
      description: '',
      hoursWorked: '',
      ratePerHour: '',
      workDate: new Date().toISOString().split('T')[0],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return <Check size={14} />;
      case 'REJECTED':
        return <X size={14} />;
      default:
        return <Clock size={14} />;
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

  const totalHours = timeEntries.reduce((sum: number, entry: any) => sum + entry.hoursWorked, 0);
  const totalEarnings = timeEntries
    .filter((e: any) => e.status === 'PAID')
    .reduce((sum: number, entry: any) => sum + entry.hoursWorked * entry.ratePerHour, 0);
  const pendingAmount = timeEntries
    .filter((e: any) => e.status === 'PENDING' || e.status === 'APPROVED')
    .reduce((sum: number, entry: any) => sum + entry.hoursWorked * entry.ratePerHour, 0);

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
          message={error?.message || 'Failed to load time tracking data'} 
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
        {(() => {
          const items: { label: string; href: string }[] = [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Freelancer', href: '/dashboard/freelancer' },
          ];

          if (contractIdFromQuery) {
            const found = contracts.find((c: any) => String(c.id) === String(contractIdFromQuery));
            if (found) items.push({ label: `Contract: ${found.title}`, href: `/dashboard/contracts/${found.id}` });
          }

          items.push({ label: 'Time Tracking', href: '/dashboard/freelancer/time-tracking' });

          return <Breadcrumb items={items} />;
        })()}
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-gray-600 mt-2">Log and manage your work hours</p>
        </div>
        {contracts.length > 0 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Log Time
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hours Logged</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalHours.toFixed(1)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings (Paid)</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{formatAmount(totalEarnings)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payment</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{formatAmount(pendingAmount)}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Log Work Hours</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Contract *
              </label>
              <select
                required
                value={formData.contractId}
                onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a contract...</option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what you worked on..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours Worked *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={formData.hoursWorked}
                  onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="8.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate per Hour ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={formData.ratePerHour}
                  onChange={(e) => setFormData({ ...formData, ratePerHour: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.workDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Log Hours
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {contracts.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No active contracts</p>
          <p className="text-sm text-gray-500">
            You need an active contract to start logging time
          </p>
        </div>
      )}

      {timeEntries.length === 0 && contracts.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No time entries logged yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Log your first hours
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {timeEntries.map((entry: any) => (
            <div key={entry.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {entry.contract.title}
                      </h3>
                      <p className="text-sm text-gray-600">{entry.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        entry.status
                      )}`}
                    >
                      {getStatusIcon(entry.status)}
                      {entry.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Hours</p>
                      <p className="font-medium text-gray-900">{entry.hoursWorked}h</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Rate</p>
                      <p className="font-medium text-gray-900">{formatAmount(entry.ratePerHour)}/h</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Total</p>
                      <p className="font-medium text-gray-900">
                        {formatAmount(entry.hoursWorked * entry.ratePerHour)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Work Date</p>
                      <p className="font-medium text-gray-900">{formatDate(entry.workDate)}</p>
                    </div>
                  </div>

                  {entry.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {entry.rejectionReason}
                      </p>
                    </div>
                  )}

                  {entry.paidAt && (
                    <div className="mt-3 text-sm text-gray-600">
                      <Calendar size={14} className="inline mr-1" />
                      Paid on {formatDate(entry.paidAt)}
                    </div>
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
