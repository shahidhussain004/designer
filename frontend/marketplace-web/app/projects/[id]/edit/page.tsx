"use client";

import { PageLayout } from "@/components/ui";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { useAuth } from "@/lib/auth";
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    Loader2,
    Save,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// Constants aligned with database schema
const BUDGET_TYPES = [
  { value: "HOURLY", label: "Hourly Rate" },
  { value: "FIXED_PRICE", label: "Fixed Price" },
  { value: "NOT_SURE", label: "Not Sure Yet" },
];

const TIMELINES = [
  { value: "ASAP", label: "ASAP (< 1 month)" },
  { value: "1-3_MONTHS", label: "1-3 Months" },
  { value: "3-6_MONTHS", label: "3-6 Months" },
  { value: "6_PLUS_MONTHS", label: "6+ Months" },
];

const PROJECT_TYPES = [
  { value: "SINGLE_PROJECT", label: "One-Time Project" },
  { value: "ONGOING", label: "Ongoing Work" },
  { value: "CONTRACT", label: "Contract Position" },
];

const PRIORITY_LEVELS = [
  { value: "LOW", label: "Low Priority" },
  { value: "MEDIUM", label: "Medium Priority" },
  { value: "HIGH", label: "High Priority" },
  { value: "URGENT", label: "Urgent" },
];

const PROJECT_STATUSES = [
  { value: "DRAFT", label: "Draft" },
  { value: "OPEN", label: "Open for Proposals" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CLOSED", label: "Closed" },
];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuth();

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const updateMutation = useUpdateProject();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scopeOfWork: "",
    projectType: "SINGLE_PROJECT",
    priorityLevel: "MEDIUM",
    timeline: "1-3_MONTHS",
    estimatedDurationDays: "",
    budgetType: "FIXED_PRICE",
    budgetAmountCents: "",
    hourlyRateMinCents: "",
    hourlyRateMaxCents: "",
    currency: "USD",
    requiredSkillsInput: "",
    preferredSkillsInput: "",
    status: "OPEN",
    isUrgent: false,
    isFeatured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Load project data when it loads
  useEffect(() => {
    if (project && user) {
      // Check authorization - only redirect if data is loaded and not authorized
      if (user.id !== project.companyId) {
        router.push(`/projects/${projectId}`);
        return;
      }

      // Extract skills arrays from JSON
      const requiredSkills = project.requiredSkills
        ? Array.isArray(project.requiredSkills)
          ? project.requiredSkills
              .map((s: any) => (typeof s === "string" ? s : s.skill || ""))
              .join(", ")
          : ""
        : "";

      const preferredSkills = project.preferredSkills
        ? Array.isArray(project.preferredSkills)
          ? project.preferredSkills
              .map((s: any) => (typeof s === "string" ? s : s.skill || ""))
              .join(", ")
          : ""
        : "";

      setFormData({
        title: project.title || "",
        description: project.description || "",
        scopeOfWork: project.scopeOfWork || "",
        projectType: project.projectType || "SINGLE_PROJECT",
        priorityLevel: project.priorityLevel || "MEDIUM",
        timeline: project.timeline || "1-3_MONTHS",
        estimatedDurationDays: project.estimatedDurationDays?.toString() || "",
        budgetType: project.budgetType === "HOURLY" ? "HOURLY" : "FIXED_PRICE",
        budgetAmountCents:
          project.budgetMaxCents || project.budget
            ? ((project.budgetMaxCents || project.budget) / 100).toString()
            : "",
        hourlyRateMinCents:
          project.budgetMinCents && project.budgetType === "HOURLY"
            ? (project.budgetMinCents / 100).toString()
            : "",
        hourlyRateMaxCents:
          project.budgetMaxCents && project.budgetType === "HOURLY"
            ? (project.budgetMaxCents / 100).toString()
            : "",
        currency: project.currency || "USD",
        requiredSkillsInput: requiredSkills,
        preferredSkillsInput: preferredSkills,
        status: project.status || "OPEN",
        isUrgent: project.isUrgent || false,
        isFeatured: project.isFeatured || false,
      });
    }
  }, [project, user, router, projectId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Project title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (formData.budgetType === "FIXED_PRICE") {
      if (!formData.budgetAmountCents || Number(formData.budgetAmountCents) <= 0) {
        newErrors.budget = "Budget amount is required for fixed price projects";
      }
    } else if (formData.budgetType === "HOURLY") {
      if (
        !formData.hourlyRateMinCents ||
        Number(formData.hourlyRateMinCents) <= 0
      ) {
        newErrors.hourlyRate = "Hourly rate range is required";
      }
      const minRate = formData.hourlyRateMinCents
        ? Number(formData.hourlyRateMinCents)
        : null;
      const maxRate = formData.hourlyRateMaxCents
        ? Number(formData.hourlyRateMaxCents)
        : null;
      if (minRate !== null && maxRate !== null && minRate > maxRate) {
        newErrors.hourlyRate = "Minimum rate cannot exceed maximum rate";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const requiredSkills = formData.requiredSkillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const preferredSkills = formData.preferredSkillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const apiBudgetType: "FIXED" | "HOURLY" =
        formData.budgetType === "FIXED_PRICE" ? "FIXED" : "HOURLY";

      await updateMutation.mutateAsync({
        id: Number(projectId),
        input: {
          title: formData.title,
          description: formData.description,
          scopeOfWork: formData.scopeOfWork,
          projectType: formData.projectType,
          priorityLevel: formData.priorityLevel,
          timeline: formData.timeline,
          estimatedHours: formData.estimatedDurationDays
            ? Number(formData.estimatedDurationDays)
            : undefined,
          budgetType: apiBudgetType,
          budgetAmountCents:
            formData.budgetType === "FIXED_PRICE" && formData.budgetAmountCents
              ? Math.round(Number(formData.budgetAmountCents) * 100)
              : undefined,
          hourlyRateMinCents:
            formData.budgetType === "HOURLY" && formData.hourlyRateMinCents
              ? Math.round(Number(formData.hourlyRateMinCents) * 100)
              : undefined,
          hourlyRateMaxCents:
            formData.budgetType === "HOURLY" && formData.hourlyRateMaxCents
              ? Math.round(Number(formData.hourlyRateMaxCents) * 100)
              : undefined,
          currency: formData.currency,
          requiredSkills: requiredSkills.length > 0 ? requiredSkills : undefined,
          preferredSkills: preferredSkills.length > 0 ? preferredSkills : undefined,
          status: formData.status,
          isUrgent: formData.isUrgent,
          isFeatured: formData.isFeatured,
        }
      });

      setSuccessMessage("Project updated successfully!");
      setTimeout(() => {
        router.push(`/projects/${projectId}`);
      }, 1500);
    } catch (err: any) {
      setErrors({
        submit: err.message || "Failed to update project",
      });
    }
  };

  if (projectLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <AlertCircle className="w-8 h-8 text-error-600" />
          <p className="text-error-700 ml-2">Project not found</p>
        </div>
      </PageLayout>
    );
  }

  if (!user || user.id !== project.companyId) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-error-50 border border-error-200 rounded-lg p-8 max-w-md">
            <AlertCircle className="w-8 h-8 text-error-600 mx-auto mb-4" />
            <p className="text-error-700 text-center font-medium mb-4">You don't have permission to edit this project</p>
            <Link 
              href={`/projects/${projectId}`}
              className="block text-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Project
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Success Message */}
      {successMessage && (
        <div className="bg-success-50 border-b border-success-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success-600" />
            <p className="text-success-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-secondary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href={`/projects/${projectId}`}
            className="inline-flex items-center gap-2 text-secondary-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </Link>
          <h1 className="text-4xl font-bold">Edit Project</h1>
          <p className="text-secondary-300 mt-2">{project.title}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Error */}
          {errors.submit && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-error-600" />
              <p className="text-error-700">{errors.submit}</p>
            </div>
          )}

          {/* Basic Information */}
          <section className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.title
                      ? "border-error-300 bg-error-50"
                      : "border-secondary-300"
                  }`}
                  placeholder="e.g., Design a modern website"
                />
                {errors.title && (
                  <p className="text-error-600 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                    errors.description
                      ? "border-error-300 bg-error-50"
                      : "border-secondary-300"
                  }`}
                  placeholder="Describe your project in detail..."
                />
                {errors.description && (
                  <p className="text-error-600 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Scope of Work (Optional)
                </label>
                <textarea
                  value={formData.scopeOfWork}
                  onChange={(e) =>
                    setFormData({ ...formData, scopeOfWork: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Detailed breakdown of deliverables, milestones, etc."
                />
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Required & Preferred Skills
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Required Skills (comma-separated)
                </label>
                <textarea
                  value={formData.requiredSkillsInput}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requiredSkillsInput: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="e.g., React, TypeScript, Node.js"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Preferred Skills (comma-separated)
                </label>
                <textarea
                  value={formData.preferredSkillsInput}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredSkillsInput: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="e.g., Docker, GraphQL, AWS"
                />
              </div>
            </div>
          </section>

          {/* Project Details */}
          <section className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Project Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) =>
                    setFormData({ ...formData, projectType: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {PROJECT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) =>
                    setFormData({ ...formData, timeline: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {TIMELINES.map((timeline) => (
                    <option key={timeline.value} value={timeline.value}>
                      {timeline.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Estimated Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.estimatedDurationDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDurationDays: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 30"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Priority Level
                </label>
                <select
                  value={formData.priorityLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, priorityLevel: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {PRIORITY_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Budget */}
          <section className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Budget Information
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    Budget Type
                  </label>
                  <select
                    value={formData.budgetType}
                    onChange={(e) =>
                      setFormData({ ...formData, budgetType: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {BUDGET_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>

              {formData.budgetType === "FIXED_PRICE" ? (
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    Total Budget *
                  </label>
                  <input
                    type="number"
                    value={formData.budgetAmountCents}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        budgetAmountCents: e.target.value,
                      })
                    }
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.budget
                        ? "border-error-300 bg-error-50"
                        : "border-secondary-300"
                    }`}
                    placeholder="e.g., 5000"
                  />
                  {errors.budget && (
                    <p className="text-error-600 text-sm mt-1">
                      {errors.budget}
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">
                      Minimum Hourly Rate *
                    </label>
                    <input
                      type="number"
                      value={formData.hourlyRateMinCents}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hourlyRateMinCents: e.target.value,
                        })
                      }
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.hourlyRate
                          ? "border-error-300 bg-error-50"
                          : "border-secondary-300"
                      }`}
                      placeholder="e.g., 25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">
                      Maximum Hourly Rate
                    </label>
                    <input
                      type="number"
                      value={formData.hourlyRateMaxCents}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hourlyRateMaxCents: e.target.value,
                        })
                      }
                      step="0.01"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Status & Visibility */}
          <section className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Status & Visibility
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Project Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {PROJECT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isUrgent}
                  onChange={(e) =>
                    setFormData({ ...formData, isUrgent: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="font-medium text-secondary-900">
                  Mark as URGENT
                </span>
                <span className="text-sm text-secondary-500">
                  Increases visibility
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="font-medium text-secondary-900">
                  Featured Project
                </span>
                <span className="text-sm text-secondary-500">
                  Appears at the top
                </span>
              </label>
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/projects/${projectId}`}
              className="px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
