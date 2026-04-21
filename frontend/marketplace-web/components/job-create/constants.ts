export const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'TEMPORARY', label: 'Temporary' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'ENTRY', label: 'Entry Level' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'EXECUTIVE', label: 'Executive' },
];

export const REMOTE_TYPES = [
  { value: 'FULLY_REMOTE', label: 'Fully Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ON_SITE', label: 'On Site' },
];

export const SALARY_PERIODS = [
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'ANNUAL', label: 'Annual' },
];

export const TRAVEL_REQUIREMENTS = [
  { value: 'NONE', label: 'None' },
  { value: 'MINIMAL', label: 'Minimal (< 10%)' },
  { value: 'MODERATE', label: 'Moderate (10-25%)' },
  { value: 'EXTENSIVE', label: 'Extensive (> 25%)' },
];

export const EDUCATION_LEVELS = [
  { value: 'BACHELOR', label: "Bachelor's Degree" },
  { value: 'MASTER', label: "Master's Degree" },
  { value: 'PHD', label: 'PhD' },
];

export const INITIAL_FORM_DATA = {
  companyDescription: '',
  categoryId: '',
  title: '',
  description: '',
  responsibilities: '',
  requirements: '',
  jobType: 'FULL_TIME',
  experienceLevel: 'INTERMEDIATE',
  positionsAvailable: '1',
  startDate: '',
  applicationDeadline: '',
  location: '',
  city: '',
  state: '',
  country: '',
  isRemote: false,
  remoteType: '',
  travelRequirement: 'NONE',
  salaryMinCents: '',
  salaryMaxCents: '',
  salaryCurrency: 'USD',
  salaryPeriod: 'ANNUAL',
  showSalary: true,
  requiredSkills: '',
  preferredSkills: '',
  educationLevel: '',
  certifications: '',
  benefits: '',
  perks: '',
  applicationEmail: '',
  applicationUrl: '',
  applyInstructions: '',
  visaSponsorship: false,
  securityClearanceRequired: false,
  status: 'DRAFT',
  isFeatured: false,
  isUrgent: false,
};
