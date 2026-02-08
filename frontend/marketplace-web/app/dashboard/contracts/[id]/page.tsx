"use client";

import { Breadcrumb, PageLayout } from '@/components/ui';
import { apiFetch } from '@/lib/api-fetch';
import logger from '@/lib/logger';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface ContractDetail {
  id: number;
  title: string;
  description: string;
  contractType: string;
  totalAmount: number;
  paymentSchedule: string;
  status: string;
  startDate: string;
  endDate?: string;
  job?: { id: number; title: string };
  company?: { id?: number; username?: string; fullName?: string };
  freelancer?: { id?: number; username?: string; fullName?: string };
}

export default function ContractDetailPage() {
  const params = useParams() as { id?: string }
  const router = useRouter()
  const id = params?.id
  const [contract, setContract] = useState<ContractDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchContract = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/contracts/${id}`)
      if (res.ok) {
        const data = await res.json()
        setContract(data)
      } else if (res.status === 404) {
        setContract(null)
      } else {
        logger.error('Failed to load contract', new Error(`Status ${res.status}`))
      }
    } catch (err) {
      logger.error('Failed to fetch contract detail', err as Error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    fetchContract()
  }, [id, fetchContract])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    )
  }

  if (!contract) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold">Contract Not Found</h2>
          <p className="text-gray-600 mt-2">This contract may not exist or you do not have access to view it.</p>
            <div className="mt-6">
            <button onClick={() => router.push('/dashboards')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Back to Dashboard</button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Contracts', href: '/dashboard/contracts' },
              { label: contract.title, href: `/dashboard/contracts/${contract.id}` },
            ]}
          />
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">{contract.title}</h1>
          <p className="text-gray-600 mt-2">{contract.job?.title}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium text-gray-900">{contract.company?.fullName ?? '—'}</p>

              <p className="text-sm text-gray-500 mt-4">Freelancer</p>
              <p className="font-medium text-gray-900">{contract.freelancer?.fullName ?? '—'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium text-gray-900">{typeof contract.totalAmount === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(contract.totalAmount) : '—'}</p>

              <p className="text-sm text-gray-500 mt-4">Status</p>
              <p className="font-medium text-gray-900">{contract.status ?? '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700">{contract.description}</p>

            <div className="mt-6 flex gap-3">
            <button onClick={() => router.push(`/dashboard/freelancer/time-tracking?contractId=${contract.id}`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Log Time</button>
            <button
              onClick={() => contract.freelancer?.id ? router.push(`/freelancers/${contract.freelancer.id}/portfolio`) : undefined}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg"
              disabled={!contract.freelancer?.id}
            >
              View Freelancer
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
