"use client";

import { useCategories } from '@/hooks/useContent';
import { useCreateProject } from '@/hooks/useProjects';
import { useAuth } from '@/lib/auth';
import { 
  AlertCircle, 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  Lightbulb, 
  Shield, 
  Star, 
  Target,
  Zap 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Constants aligned with database schema
const BUDGET_TYPES = [
  { value: 'HOURLY', label: 'Hourly Rate' },
  { value: 'FIXED_PRICE', label: 'Fixed Price' },
  { value: 'NOT_SURE', label: 'Not Sure Yet' },
];

const TIMELINES = [
  { value: 'ASAP', label: 'ASAP (< 1 month)' },
  { value: '1-3_MONTHS', label: '1-3 Months' },
  { value: '3-6_MONTHS', label: '3-6 Months' },
  { value: '6_PLUS_MONTHS', label: '6+ Months' },
];

const PROJECT_TYPES = [
  { value: 'SINGLE_PROJECT', label: 'One-Time Project' },
  { value: 'ONGOING', label: 'Ongoing Work' },
  { value: 'CONTRACT', label: 'Contract Position' },
];

const PRIORITY_LEVELS = [
  { value: 'LOW', label: 'Low Priority' },
  { value: 'MEDIUM', label: 'Medium Priority' },
  { value: 'HIGH', label: 'High Priority' },
  { value: 'URGENT', label: 'Urgent' },
];

const EXPERIENCE_LEVELS = [
  { value: 'ENTRY', label: 'Entry Level' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead / Expert' },
  { value: 'EXECUTIVE', label: 'Executive' },
];

interface SkillInput {
  skill: string;
  level: string;
  required: boolean;
}

interface ScreeningQuestion {
  question: string;
  required: boolean;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createProjectMutation = useCreateProject();
  const isPending = createProjectMutation.status === 'pending';
  const { data: categories = [] } = useCategories();

  const [activeStep, setActiveStep] = useState(1);

  const [formData, setFormData] = useState({
    // Basic Information
    categoryId: '',
    title: '',
    description: '',
    
    // Project Details
    projectType: 'SINGLE_PROJECT',
    experienceLevel: 'INTERMEDIATE',
    priorityLevel: 'MEDIUM',
    timeline: '1-3_MONTHS',
    startDate: '',
    endDate: '',

    // Budget
    budgetType: 'FIXED_PRICE',
    budgetAmountCents: '',
    hourlyRateMinCents: '',
    hourlyRateMaxCents: '',
    estimatedHours: '',
    currency: 'USD',

    // Deliverables
    deliverables: '',

    // Skills (will be converted to JSONB array)
    requiredSkillsInput: '',
    preferredSkillsInput: '',

    // Screening Questions
    question1: '',
    question1Required: false,
    question2: '',
    question2Required: false,
    question3: '',
    question3Required: false,

    // Application Settings
    applicationDeadline: '',
    maxProposals: '',
    status: 'DRAFT',
    isFeatured: false,
    isUrgent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/projects/create');
    } else if (user.role !== 'COMPANY' && user.role !== 'ADMIN') {
      window.alert('Access Denied: Only companies can create projects');
      router.push('/projects');
    }
  }, [user, router]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Project title is required';
      if (!String(formData.categoryId).trim()) newErrors.categoryId = 'Category is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }

    if (step === 2) {
      if (formData.budgetType === 'FIXED_PRICE') {
        if (!formData.budgetAmountCents || Number(formData.budgetAmountCents) <= 0) {
          newErrors.budget = 'Budget amount is required for fixed price projects';
        }
      } else if (formData.budgetType === 'HOURLY') {
        if (!formData.hourlyRateMinCents || Number(formData.hourlyRateMinCents) <= 0) {
          newErrors.hourlyRate = 'Hourly rate range is required';
        }
        const minRate = formData.hourlyRateMinCents ? Number(formData.hourlyRateMinCents) : null;
        const maxRate = formData.hourlyRateMaxCents ? Number(formData.hourlyRateMaxCents) : null;
        if (minRate !== null && maxRate !== null && minRate > maxRate) {
          newErrors.hourlyRate = 'Minimum rate cannot exceed maximum rate';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const parseSkills = (skillsStr: string, requiredByDefault: boolean): any[] => {
    return skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(skill => ({
        skill,
        level: 'intermediate',
        required: requiredByDefault
      }));
  };

  const getScreeningQuestions = (): any[] => {
    const questions: ScreeningQuestion[] = [];
    
    if (formData.question1.trim()) {
      questions.push({
        question: formData.question1,
        required: formData.question1Required
      });
    }
    if (formData.question2.trim()) {
      questions.push({
        question: formData.question2,
        required: formData.question2Required
      });
    }
    if (formData.question3.trim()) {
      questions.push({
        question: formData.question3,
        required: formData.question3Required
      });
    }
    
    return questions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(activeStep)) return;

    try {
      const deliverables = formData.deliverables
        .split('\n')
        .map(d => d.trim())
        .filter(d => d.length > 0);

      const requiredSkills = parseSkills(formData.requiredSkillsInput, true);
      const preferredSkills = parseSkills(formData.preferredSkillsInput, false);
      const screeningQuestions = getScreeningQuestions();

      await createProjectMutation.mutateAsync({
        categoryId: Number(formData.categoryId),
        title: formData.title,
        description: formData.description,
        projectType: formData.projectType,
        experienceLevel: formData.experienceLevel,
        priorityLevel: formData.priorityLevel,
        timeline: formData.timeline,
        budgetType: formData.budgetType,
        budgetAmountCents: formData.budgetType === 'FIXED_PRICE' && formData.budgetAmountCents
          ? Math.round(Number(formData.budgetAmountCents) * 100)
          : undefined,
        hourlyRateMinCents: formData.budgetType === 'HOURLY' && formData.hourlyRateMinCents
          ? Math.round(Number(formData.hourlyRateMinCents) * 100)
          : undefined,
        hourlyRateMaxCents: formData.budgetType === 'HOURLY' && formData.hourlyRateMaxCents
          ? Math.round(Number(formData.hourlyRateMaxCents) * 100)
          : undefined,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
        currency: formData.currency,
        deliverables: deliverables.length > 0 ? deliverables : undefined,
        requiredSkills: requiredSkills.length > 0 ? requiredSkills : undefined,
        preferredSkills: preferredSkills.length > 0 ? preferredSkills : undefined,
        screeningQuestions: screeningQuestions.length > 0 ? screeningQuestions : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        applicationDeadline: formData.applicationDeadline || undefined,
        maxProposals: formData.maxProposals ? Number(formData.maxProposals) : undefined,
        status: formData.status || undefined,
        isFeatured: formData.isFeatured,
        isUrgent: formData.isUrgent,
      });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to create project');
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

  const steps = [
    { num: 1, title: 'Project Info', icon: FileText },
    { num: 2, title: 'Budget & Timeline', icon: DollarSign },
    { num: 3, title: 'Requirements', icon: Target },
    { num: 4, title: 'Screening', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-success-600 via-success-700 to-success-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/projects" className="inline-flex items-center gap-2 text-success-200 hover:text-white mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Projects</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Post a New Project</h1>
              <p className="text-lg text-success-100 mt-2">Connect with talented freelancers to bring your vision to life</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-8">
            <div className="flex items-center justify-between max-w-3xl">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = step.num === activeStep;
                const isCompleted = step.num < activeStep;

                return (
                  <div key={step.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive ? 'bg-white text-success-700 shadow-lg scale-110' :
                        isCompleted ? 'bg-primary-500 text-white' :
                        'bg-white/20 text-white/60'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                      </div>
                      <span className={`text-sm mt-2 font-medium ${isActive ? 'text-white' : 'text-success-200'}`}>
                        {step.title}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 rounded transition-all ${
                        isCompleted ? 'bg-primary-500' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          
          {/* Step 1: Project Information */}
          {activeStep === 1 && (
            <div className="space-y-8">
              {/* Basic Project Details */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-success-600" />
                  <h2 className="text-2xl font-bold text-secondary-900">Project Details</h2>
                </div>

                <div className="space-y-6">
                  {/* Project Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Project Title <span className="text-error-600">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g., Build a Mobile App for Food Delivery"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent transition-all ${
                        errors.title ? 'border-error-300 bg-error-50' : 'border-secondary-300'
                      }`}
                    />
                    {errors.title && (
                      <div className="flex items-center gap-2 mt-2 text-error-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Category & Project Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-semibold text-secondary-700 mb-2">
                        Category <span className="text-error-600">*</span>
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent ${
                          errors.categoryId ? 'border-error-300 bg-error-50' : 'border-secondary-300'
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories?.map((cat: any) => (
                          <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                        ))}
                      </select>
                      {errors.categoryId && (
                        <div className="flex items-center gap-2 mt-2 text-error-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.categoryId}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="projectType" className="block text-sm font-semibold text-secondary-700 mb-2">
                        Project Type <span className="text-error-600">*</span>
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                      >
                        {PROJECT_TYPES.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Experience Level & Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="experienceLevel" className="block text-sm font-semibold text-secondary-700 mb-2">
                        Experience Level <span className="text-error-600">*</span>
                      </label>
                      <select
                        id="experienceLevel"
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                      >
                        {EXPERIENCE_LEVELS.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="priorityLevel" className="block text-sm font-semibold text-secondary-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        id="priorityLevel"
                        name="priorityLevel"
                        value={formData.priorityLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                      >
                        {PRIORITY_LEVELS.map(priority => (
                          <option key={priority.value} value={priority.value}>{priority.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Project Description <span className="text-error-600">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe your project in detail. Include objectives, target audience, key features, and any specific requirements..."
                      value={formData.description}
                      onChange={handleChange}
                      rows={10}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent ${
                        errors.description ? 'border-error-300 bg-error-50' : 'border-secondary-300'
                      }`}
                    />
                    {errors.description && (
                      <div className="flex items-center gap-2 mt-2 text-error-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.description}</span>
                      </div>
                    )}
                    <p className="text-xs text-secondary-500 mt-2">
                      Be as detailed as possible to attract the right talent
                    </p>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <label htmlFor="deliverables" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Key Deliverables
                    </label>
                    <textarea
                      id="deliverables"
                      name="deliverables"
                      placeholder="Mobile app (iOS & Android)&#10;Admin dashboard&#10;API documentation&#10;User manual"
                      value={formData.deliverables}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                    />
                    <p className="text-xs text-secondary-500 mt-2">
                      List each deliverable on a new line
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Budget & Timeline */}
          {activeStep === 2 && (
            <div className="space-y-8">
              {/* Budget Information */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-6 h-6 text-success-600" />
                  <h2 className="text-2xl font-bold text-secondary-900">Budget</h2>
                </div>

                <div className="space-y-6">
                  {/* Budget Type */}
                  <div>
                    <label htmlFor="budgetType" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Budget Type <span className="text-error-600">*</span>
                    </label>
                    <select
                      id="budgetType"
                      name="budgetType"
                      value={formData.budgetType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                    >
                      {BUDGET_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fixed Price Budget */}
                  {formData.budgetType === 'FIXED_PRICE' && (
                    <div>
                      <label htmlFor="budgetAmountCents" className="block text-sm font-semibold text-secondary-700 mb-2">
                        Project Budget ($) <span className="text-error-600">*</span>
                      </label>
                      <input
                        id="budgetAmountCents"
                        name="budgetAmountCents"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="5000"
                        value={formData.budgetAmountCents}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent ${
                          errors.budget ? 'border-error-300 bg-error-50' : 'border-secondary-300'
                        }`}
                      />
                      {errors.budget && (
                        <div className="flex items-center gap-2 mt-2 text-error-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.budget}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hourly Rate */}
                  {formData.budgetType === 'HOURLY' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="hourlyRateMinCents" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Minimum Hourly Rate ($) <span className="text-error-600">*</span>
                          </label>
                          <input
                            id="hourlyRateMinCents"
                            name="hourlyRateMinCents"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="25"
                            value={formData.hourlyRateMinCents}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent ${
                              errors.hourlyRate ? 'border-error-300 bg-error-50' : 'border-secondary-300'
                            }`}
                          />
                        </div>

                        <div>
                          <label htmlFor="hourlyRateMaxCents" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Maximum Hourly Rate ($)
                          </label>
                          <input
                            id="hourlyRateMaxCents"
                            name="hourlyRateMaxCents"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="50"
                            value={formData.hourlyRateMaxCents}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {errors.hourlyRate && (
                        <div className="flex items-center gap-2 text-error-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.hourlyRate}</span>
                        </div>
                      )}

                      <div>
                        <label htmlFor="estimatedHours" className="block text-sm font-semibold text-secondary-700 mb-2">
                          Estimated Hours
                        </label>
                        <input
                          id="estimatedHours"
                          name="estimatedHours"
                          type="number"
                          min="0"
                          placeholder="40"
                          value={formData.estimatedHours}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  {/* Currency */}
                  <div>
                    <label htmlFor="currency" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-success-600" />
                  <h2 className="text-2xl font-bold text-secondary-900">Timeline</h2>
                </div>

                <div className="space-y-6">
                  {/* Project Duration */}
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Project Duration <span className="text-error-600">*</span>
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                    >
                      {TIMELINES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Start & End Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-semibold text-secondary-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Preferred Start Date
                      </label>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="endDate" className="block text-sm font-semibold text-secondary-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Expected Completion Date
                      </label>
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Application Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="applicationDeadline" className="block text-sm font-semibold text-secondary-700 mb-2">
                        Application Deadline
                      </label>
                      <input
                        id="applicationDeadline"
                        name="applicationDeadline"
                        type="date"
                        value={formData.applicationDeadline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="maxProposals" className="block text-sm font-semibold text-secondary-700 mb-2">
                        Max Proposals to Review
                      </label>
                      <input
                        id="maxProposals"
                        name="maxProposals"
                        type="number"
                        min="1"
                        placeholder="20"
                        value={formData.maxProposals}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Requirements */}
          {activeStep === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-success-600" />
                <h2 className="text-2xl font-bold text-secondary-900">Skills & Requirements</h2>
              </div>

              <div className="space-y-6">
                {/* Required Skills */}
                <div>
                  <label htmlFor="requiredSkillsInput" className="block text-sm font-semibold text-secondary-700 mb-2">
                    Required Skills (comma-separated)
                  </label>
                  <textarea
                    id="requiredSkillsInput"
                    name="requiredSkillsInput"
                    placeholder="React Native, Firebase, RESTful APIs, UI/UX Design"
                    value={formData.requiredSkillsInput}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    Skills that are essential for this project - separate with commas
                  </p>
                </div>

                {/* Preferred Skills */}
                <div>
                  <label htmlFor="preferredSkillsInput" className="block text-sm font-semibold text-secondary-700 mb-2">
                    Preferred Skills (comma-separated)
                  </label>
                  <textarea
                    id="preferredSkillsInput"
                    name="preferredSkillsInput"
                    placeholder="GraphQL, Docker, Agile/Scrum, Previous food delivery app experience"
                    value={formData.preferredSkillsInput}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    Nice to have but not mandatory - separate with commas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Screening Questions */}
          {activeStep === 4 && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                  <h2 className="text-2xl font-bold text-secondary-900">Screening Questions</h2>
                </div>

                <p className="text-secondary-600 mb-6">
                  Ask questions to help qualify freelancers before they submit a proposal.
                </p>

                <div className="space-y-6">
                  {/* Question 1 */}
                  <div className="border border-secondary-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-semibold text-secondary-700">Question 1</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="question1Required"
                          checked={formData.question1Required}
                          onChange={handleChange}
                          className="w-4 h-4 text-success-600 border-secondary-300 rounded focus:ring-success-500"
                        />
                        <span className="text-sm text-secondary-600">Required</span>
                      </label>
                    </div>
                    <textarea
                      name="question1"
                      placeholder="e.g., Have you built a food delivery app before? Please share links to similar projects."
                      value={formData.question1}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                    />
                  </div>

                  {/* Question 2 */}
                  <div className="border border-secondary-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-semibold text-secondary-700">Question 2</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="question2Required"
                          checked={formData.question2Required}
                          onChange={handleChange}
                          className="w-4 h-4 text-success-600 border-secondary-300 rounded focus:ring-success-500"
                        />
                        <span className="text-sm text-secondary-600">Required</span>
                      </label>
                    </div>
                    <textarea
                      name="question2"
                      placeholder="e.g., What is your experience with real-time features and push notifications?"
                      value={formData.question2}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                    />
                  </div>

                  {/* Question 3 */}
                  <div className="border border-secondary-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-semibold text-secondary-700">Question 3</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="question3Required"
                          checked={formData.question3Required}
                          onChange={handleChange}
                          className="w-4 h-4 text-success-600 border-secondary-300 rounded focus:ring-success-500"
                        />
                        <span className="text-sm text-secondary-600">Required</span>
                      </label>
                    </div>
                    <textarea
                      name="question3"
                      placeholder="e.g., Can you commit to weekly progress updates and Zoom meetings?"
                      value={formData.question3}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Publication Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6 text-success-600" />
                  <h2 className="text-2xl font-bold text-secondary-900">Publication Settings</h2>
                </div>

                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Project Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                    >
                      <option value="DRAFT">Draft (not visible to freelancers)</option>
                      <option value="OPEN">Open (accepting proposals)</option>
                    </select>
                    <p className="text-xs text-secondary-500 mt-1">You can publish later from your dashboard</p>
                  </div>

                  {/* Featured & Urgent */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="w-5 h-5 text-success-600 border-secondary-300 rounded focus:ring-success-500"
                      />
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-warning-600" />
                        <div>
                          <span className="font-semibold text-secondary-900">Featured Project</span>
                          <p className="text-sm text-secondary-600">Highlight this project in search results</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
                      <input
                        type="checkbox"
                        name="isUrgent"
                        checked={formData.isUrgent}
                        onChange={handleChange}
                        className="w-5 h-5 text-success-600 border-secondary-300 rounded focus:ring-success-500"
                      />
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-error-600" />
                        <div>
                          <span className="font-semibold text-secondary-900">Urgent Project</span>
                          <p className="text-sm text-secondary-600">Mark as urgent to attract immediate attention</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Preview Note */}
              <div className="bg-success-50 border border-success-200 rounded-xl p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-success-600 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">Ready to Post?</h3>
                    <p className="text-secondary-700">
                      Review all the information above before submitting. You can edit the project anytime from your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-secondary-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={activeStep === 1}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeStep === 1
                  ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                  : 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {activeStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold bg-success-600 text-white hover:bg-success-700 transition-all shadow-lg hover:shadow-xl"
              >
                Next Step
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Create Project
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
