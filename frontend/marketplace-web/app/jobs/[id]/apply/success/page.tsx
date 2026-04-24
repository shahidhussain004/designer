"use client";

import { PageLayout } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ApplicationData {
  id: number;
  jobTitle: string;
  companyName: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
  status: string;
}

export default function ApplicationSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = params?.id as string;
  const applicationId = searchParams?.get('applicationId');
  const { user: _user } = useAuth();
  
  const [copied, setCopied] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock application data - in production, this would come from backend
  useEffect(() => {
    const mockData: ApplicationData = {
      id: parseInt(applicationId || '26'),
      jobTitle: 'Frontend Developer',
      companyName: 'InnovateLab',
      fullName: 'Shahid Hussain',
      email: 'shahid.hussain@seb.se',
      phone: '0704622760',
      createdAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'PENDING'
    };
    setApplicationData(mockData);
    setLoading(false);
  }, [applicationId]);

  const copyToClipboard = () => {
    if (applicationData) {
      navigator.clipboard.writeText(`Application #${applicationData.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-secondary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  if (!applicationData) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">Application Not Found</h1>
            <p className="text-secondary-600 mb-6">We couldn&apos;t load your application details.</p>
            <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Back to Jobs
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-success-50 via-white to-secondary-50 min-h-screen py-12 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          {/* Success Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success-100 to-success-100 rounded-full mb-6 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-success-600" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-success-600 to-success-600 bg-clip-text text-transparent mb-4">
              Application Submitted!
            </h1>
            
            <p className="text-xl text-secondary-600 mb-2">
              Your application for <strong>{applicationData.jobTitle}</strong> at <strong>{applicationData.companyName}</strong> has been successfully submitted.
            </p>
            
            <p className="text-secondary-500">
              We&apos;re excited to have you in our candidate pool. Here&apos;s what comes next.
            </p>
          </div>

          {/* Application Reference Card */}
          <div className="bg-white rounded-xl shadow-lg border border-success-100 p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Reference Info */}
              <div>
                <p className="text-sm font-semibold text-secondary-500 uppercase tracking-wide mb-2">Application Reference</p>
                <div className="flex items-center gap-3 mb-6">
                  <code className="text-2xl font-mono font-bold text-primary-600">#{applicationData.id}</code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors group"
                    title="Copy application ID"
                  >
                    <Copy className="w-5 h-5 text-secondary-600 group-hover:text-secondary-900" />
                  </button>
                </div>
                {copied && <p className="text-sm text-success-600 font-medium">Copied to clipboard!</p>}
                
                <p className="text-sm font-semibold text-secondary-500 uppercase tracking-wide mb-2 mt-6">Submitted On</p>
                <p className="text-secondary-900 font-medium">{applicationData.createdAt}</p>
              </div>

              {/* Right Column - Contact Info */}
              <div>
                <p className="text-sm font-semibold text-secondary-500 uppercase tracking-wide mb-2">Your Information</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-secondary-500 mb-1">Full Name</p>
                    <p className="font-medium text-secondary-900">{applicationData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500 mb-1">Email Address</p>
                    <p className="font-medium text-secondary-900">{applicationData.email}</p>
                  </div>
                  {applicationData.phone && (
                    <div>
                      <p className="text-xs text-secondary-500 mb-1">Phone Number</p>
                      <p className="font-medium text-secondary-900">{applicationData.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Timeline */}
          <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-8 mb-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-8 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary-600" />
              What Happens Next
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center text-lg font-semibold">
                    1
                  </div>
                  <div className="w-1 h-20 bg-primary-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-bold text-secondary-900 mb-2">Application Review</h3>
                  <p className="text-secondary-600 mb-3">
                    The hiring team at {applicationData.companyName} will carefully review your application. We typically review applications within 3-5 business days.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    3-5 business days
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center text-lg font-semibold">
                    2
                  </div>
                  <div className="w-1 h-20 bg-primary-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-bold text-secondary-900 mb-2">Receive Updates</h3>
                  <p className="text-secondary-600 mb-3">
                    We&apos;ll keep you updated on your application status via email. You&apos;ll be notified immediately if you move forward to the next stage.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-warning-50 text-warning-700 rounded-full text-sm font-medium">
                    <Mail className="w-4 h-4" />
                    Check your inbox
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center text-lg font-semibold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary-900 mb-2">Interview or Next Step</h3>
                  <p className="text-secondary-600">
                    If your application matches what we&apos;re looking for, the team will reach out to schedule a conversation or next steps in the hiring process.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips & Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Tip 1 */}
            <div className="bg-white rounded-lg border border-secondary-200 p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-secondary-900 mb-2">Enable Notifications</h3>
              <p className="text-sm text-secondary-600">
                Turn on notifications to get instant updates about your application status.
              </p>
            </div>

            {/* Tip 2 */}
            <div className="bg-white rounded-lg border border-secondary-200 p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-secondary-900 mb-2">Prepare Your Story</h3>
              <p className="text-sm text-secondary-600">
                While you wait, polish your interview skills and prepare to share your experiences.
              </p>
            </div>

            {/* Tip 3 */}
            <div className="bg-white rounded-lg border border-secondary-200 p-6">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="font-bold text-secondary-900 mb-2">Keep Exploring</h3>
              <p className="text-sm text-secondary-600">
                Don&apos;t wait passively! Explore other opportunities while your application is being reviewed.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200 p-8 mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Ready for More Opportunities?</h2>
              <p className="text-secondary-600 mb-6">
                While you wait for updates on this application, explore other exciting roles that match your profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/jobs/${jobId}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-secondary-300 text-secondary-900 rounded-lg hover:bg-secondary-50 transition-colors font-medium"
                >
                  <ArrowRight className="w-4 h-4" />
                  Back to Job Posting
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:from-primary-700 hover:to-accent-700 transition-colors font-medium shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  Browse Similar Jobs
                </Link>
              </div>
            </div>
          </div>

          {/* My Applications Link */}
          <div className="text-center">
            <Link
              href="/my-applications"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium group"
            >
              <span>View All My Applications</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
