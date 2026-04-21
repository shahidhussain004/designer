import { FormErrors, JobFormData } from './types';

export function validateStep(step: number, formData: JobFormData): FormErrors {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!formData.title.trim()) errors.title = 'Job title is required';
    if (!String(formData.categoryId).trim()) errors.categoryId = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (formData.description.trim().length < 10) errors.description = 'Description must be at least 10 characters';
    if (!formData.requirements.trim()) errors.requirements = 'Requirements are required';
    if (formData.requirements.trim().length < 10) errors.requirements = 'Requirements must be at least 10 characters';
  }

  if (step === 2) {
    if (!formData.location.trim()) errors.location = 'Location is required';
  }

  if (step === 3) {
    const minSalary = formData.salaryMinCents ? Number(formData.salaryMinCents) : null;
    const maxSalary = formData.salaryMaxCents ? Number(formData.salaryMaxCents) : null;
    if (minSalary !== null && maxSalary !== null && minSalary > maxSalary) {
      errors.salary = 'Minimum salary cannot exceed maximum salary';
    }
  }

  return errors;
}

export function prepareSubmitData(formData: JobFormData) {
  const skillsArray = (str: string) =>
    str.split(',').map(s => s.trim()).filter(s => s.length > 0);

  return {
    categoryId: Number(formData.categoryId),
    title: formData.title,
    description: formData.description,
    // Note: companyDescription is for display only, not sent to backend
    jobType: formData.jobType,
    experienceLevel: formData.experienceLevel,
    location: formData.location,
    city: formData.city || undefined,
    state: formData.state || undefined,
    country: formData.country || undefined,
    isRemote: formData.isRemote,
    remoteType: formData.isRemote ? formData.remoteType : undefined,
    requirements: formData.requirements,
    responsibilities: formData.responsibilities || undefined,
    requiredSkills: skillsArray(formData.requiredSkills),
    preferredSkills: skillsArray(formData.preferredSkills),
    educationLevel: formData.educationLevel || undefined,
    certifications: skillsArray(formData.certifications),
    salaryMinCents: formData.salaryMinCents ? Math.round(Number(formData.salaryMinCents) * 100) : undefined,
    salaryMaxCents: formData.salaryMaxCents ? Math.round(Number(formData.salaryMaxCents) * 100) : undefined,
    salaryCurrency: formData.salaryCurrency,
    salaryPeriod: formData.salaryPeriod,
    showSalary: formData.showSalary,
    benefits: skillsArray(formData.benefits),
    perks: skillsArray(formData.perks),
    applicationEmail: formData.applicationEmail || undefined,
    applicationUrl: formData.applicationUrl || undefined,
    applyInstructions: formData.applyInstructions || undefined,
    status: formData.status || undefined,
    applicationDeadline: formData.applicationDeadline ? `${formData.applicationDeadline}T23:59:59` : undefined,
    startDate: formData.startDate || undefined,
    positionsAvailable: Number(formData.positionsAvailable) || undefined,
    travelRequirement: formData.travelRequirement || undefined,
    visaSponsorship: formData.visaSponsorship,
    securityClearanceRequired: formData.securityClearanceRequired,
  };
}
