export interface JobFormData {
  // Company Information
  companyDescription: string;

  // Basic Information
  categoryId: string;
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;

  // Job Details
  jobType: string;
  experienceLevel: string;
  positionsAvailable: string;
  startDate: string;
  applicationDeadline: string;

  // Location
  location: string;
  city: string;
  state: string;
  country: string;
  isRemote: boolean;
  remoteType: string;
  travelRequirement: string;

  // Compensation
  salaryMinCents: string;
  salaryMaxCents: string;
  salaryCurrency: string;
  salaryPeriod: string;
  showSalary: boolean;

  // Skills & Requirements
  requiredSkills: string;
  preferredSkills: string;
  educationLevel: string;
  certifications: string;

  // Benefits & Perks
  benefits: string;
  perks: string;

  // Application Settings
  applicationEmail: string;
  applicationUrl: string;
  applyInstructions: string;
  visaSponsorship: boolean;
  securityClearanceRequired: boolean;

  // Status
  status: string;
  isFeatured: boolean;
  isUrgent: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface StepConfig {
  num: number;
  title: string;
}
