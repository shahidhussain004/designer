"use client";

import { PageLayout } from '@/components/ui';
import { useCategories } from '@/hooks/useContent';
import { useCreateJob } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Import modular components
import { INITIAL_FORM_DATA } from '@/components/job-create/constants';
import { Step1BasicInfo } from '@/components/job-create/Step1BasicInfo';
import { Step2Location } from '@/components/job-create/Step2Location';
import { Step3Compensation } from '@/components/job-create/Step3Compensation';
import { Step4Requirements } from '@/components/job-create/Step4Requirements';
import { Step5Application } from '@/components/job-create/Step5Application';
import { StepNavigation } from '@/components/job-create/StepNavigation';
import { StickyTabs } from '@/components/job-create/StickyTabs';
import type { JobFormData } from '@/components/job-create/types';
import { prepareSubmitData, validateStep } from '@/components/job-create/validation';

export default function CreateJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createJobMutation = useCreateJob();
  const isPending = createJobMutation.status === 'pending';
  const { data: categories = [] } = useCategories();

  const [activeStep, setActiveStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [formData, setFormData] = useState<JobFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/jobs/create');
    } else if (user.role !== 'COMPANY' && user.role !== 'ADMIN') {
      window.alert('Access Denied: Only companies can post jobs');
      router.push('/jobs');
    } else {
      setCompanyName(user.companyName || user.fullName || user.email);
      setCompanyDescription(user.bio || user.companyDescription || '');
      // Initialize form data with company description
      setFormData(prev => ({
        ...prev,
        companyDescription: user.bio || user.companyDescription || ''
      }));
    }
  }, [user, router]);

  const handleNext = () => {
    const validationErrors = validateStep(activeStep, formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setActiveStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const validationErrors = validateStep(activeStep, formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const submitData = prepareSubmitData(formData);
      await createJobMutation.mutateAsync(submitData);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to create job');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!user || (user.role !== 'COMPANY' && user.role !== 'ADMIN')) {
    return null;
  }

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-secondary-900 text-white">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium text-secondary-300 mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              Post a Listing
            </span>
            <h1 className="text-5xl font-bold mb-5 leading-tight">
              Find the perfect <span className="text-primary-400">candidate</span> for your company
            </h1>
            <p className="text-xl text-secondary-300 leading-relaxed">
              Create a detailed job listing to attract top talent. Fill out all sections to get maximum visibility.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Form Container ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-secondary-200 overflow-hidden">
          {/* Sticky Tabs Navigation - Inside Form Card */}
          <StickyTabs 
            activeStep={activeStep} 
            onStepClick={setActiveStep}
            steps={[
              { num: 1, title: 'Basic Info' },
              { num: 2, title: 'Location' },
              { num: 3, title: 'Compensation' },
              { num: 4, title: 'Requirements' },
              { num: 5, title: 'Application' },
            ]}
          />

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {/* Step 1: Basic Information */}
            {activeStep === 1 && (
              <Step1BasicInfo
                companyName={companyName}
                companyDescription={companyDescription}
                formData={formData}
                errors={errors}
                categories={categories as { id: number; name: string }[]}
                onChange={handleChange}
              />
            )}

            {/* Step 2: Location */}
            {activeStep === 2 && (
              <Step2Location
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
            )}

            {/* Step 3: Compensation */}
            {activeStep === 3 && (
              <Step3Compensation
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
            )}

            {/* Step 4: Requirements */}
            {activeStep === 4 && (
              <Step4Requirements
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
            )}

            {/* Step 5: Application Settings */}
            {activeStep === 5 && (
              <Step5Application
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
            )}

            {/* Navigation Buttons */}
            <StepNavigation
              activeStep={activeStep}
              totalSteps={5}
              isSubmitting={isPending}
              onBack={handleBack}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}