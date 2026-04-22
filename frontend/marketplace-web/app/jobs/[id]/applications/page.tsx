"use client";

import { PageLayout } from "@/components/ui";
import { useJob, useJobApplicationsForCompany, useUpdateApplicationStatus } from "@/hooks/useJobs";
import { useAuth } from "@/lib/auth";
import {
    ArrowLeft,
    Briefcase,
    CheckCircle,
    ChevronDown,
    ExternalLink,
    FileText,
    Linkedin,
    Mail,
    Phone,
    User,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  applicantId: number;
  applicantName: string;
  fullName: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  status: string;
  companyNotes?: string;
  rejectionReason?: string;
  appliedAt?: string;
}

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  REVIEWING: { label: "Reviewing", color: "bg-blue-100 text-blue-800" },
  SHORTLISTED: { label: "Shortlisted", color: "bg-purple-100 text-purple-800" },
  INTERVIEWING: { label: "Interviewing", color: "bg-indigo-100 text-indigo-800" },
  OFFERED: { label: "Offered", color: "bg-teal-100 text-teal-800" },
  ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800" },
  WITHDRAWN: { label: "Withdrawn", color: "bg-secondary-100 text-secondary-600" },
};

const FILTER_TABS = ["ALL", "PENDING", "REVIEWING", "SHORTLISTED", "INTERVIEWING", "OFFERED", "ACCEPTED", "REJECTED"];

const NEXT_STATUS_ACTIONS: Record<string, { label: string; status: string; variant: "primary" | "success" | "warning" | "danger" }[]> = {
  PENDING: [
    { label: "Start Reviewing", status: "REVIEWING", variant: "primary" },
    { label: "Reject", status: "REJECTED", variant: "danger" },
  ],
  REVIEWING: [
    { label: "Shortlist", status: "SHORTLISTED", variant: "primary" },
    { label: "Reject", status: "REJECTED", variant: "danger" },
  ],
  SHORTLISTED: [
    { label: "Schedule Interview", status: "INTERVIEWING", variant: "primary" },
    { label: "Reject", status: "REJECTED", variant: "danger" },
  ],
  INTERVIEWING: [
    { label: "Make Offer", status: "OFFERED", variant: "success" },
    { label: "Reject", status: "REJECTED", variant: "danger" },
  ],
  OFFERED: [
    { label: "Mark Accepted", status: "ACCEPTED", variant: "success" },
    { label: "Reject", status: "REJECTED", variant: "danger" },
  ],
};

// ─── Rejection Modal ──────────────────────────────────────────────────────────

function RejectionModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
        <h2 className="text-lg font-semibold text-secondary-900 mb-2">Reject Application</h2>
        <p className="text-secondary-600 text-sm mb-4">Optionally provide a reason for the rejection:</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-28"
          placeholder="Rejection reason (optional)"
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Application Card ─────────────────────────────────────────────────────────

function ApplicationCard({
  app,
  onAction,
}: {
  app: Application;
  onAction: (id: number, status: string, rejectionReason?: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const actions = NEXT_STATUS_ACTIONS[app.status] ?? [];
  const cfg = STATUS_CONFIG[app.status] ?? { label: app.status, color: "bg-secondary-100 text-secondary-600" };

  const handleAction = (status: string) => {
    if (status === "REJECTED") {
      setPendingStatus("REJECTED");
    } else {
      onAction(app.id, status);
    }
  };

  return (
    <>
      {pendingStatus === "REJECTED" && (
        <RejectionModal
          onConfirm={(reason) => {
            setPendingStatus(null);
            onAction(app.id, "REJECTED", reason);
          }}
          onCancel={() => setPendingStatus(null)}
        />
      )}

      <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-primary-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-secondary-900 truncate">
                {app.fullName || app.applicantName || "Applicant"}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-secondary-500">
              {app.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {app.email}
                </span>
              )}
              {app.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {app.phone}
                </span>
              )}
              {app.appliedAt && (
                <span>
                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* External links */}
            <div className="flex flex-wrap gap-3 mt-2">
              {app.linkedinUrl && (
                <a
                  href={app.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}
              {app.portfolioUrl && (
                <a
                  href={app.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Portfolio
                </a>
              )}
              {app.resumeUrl && (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Resume
                </a>
              )}
            </div>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-secondary-400 hover:text-secondary-600 transition-colors flex-shrink-0"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Expanded: cover letter + notes */}
        {expanded && (
          <div className="px-5 pb-5 border-t border-secondary-100 pt-4 space-y-4">
            {app.coverLetter && (
              <div>
                <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-1">
                  Cover Letter
                </p>
                <p className="text-sm text-secondary-700 whitespace-pre-line">{app.coverLetter}</p>
              </div>
            )}
            {app.companyNotes && (
              <div>
                <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-1">
                  Internal Notes
                </p>
                <p className="text-sm text-secondary-700">{app.companyNotes}</p>
              </div>
            )}
            {app.rejectionReason && (
              <div>
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">
                  Rejection Reason
                </p>
                <p className="text-sm text-red-700">{app.rejectionReason}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="px-5 pb-4 flex flex-wrap gap-2">
            {actions.map((action) => {
              const btnClass =
                action.variant === "danger"
                  ? "border border-red-300 text-red-700 hover:bg-red-50"
                  : action.variant === "success"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-primary-600 text-white hover:bg-primary-700";
              return (
                <button
                  key={action.status}
                  onClick={() => handleAction(action.status)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${btnClass}`}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Terminal states */}
        {(app.status === "ACCEPTED" || app.status === "WITHDRAWN") && (
          <div className="px-5 pb-4 flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" />
            {app.status === "ACCEPTED" ? "Accepted — process complete." : "Applicant withdrew."}
          </div>
        )}
        {app.status === "REJECTED" && (
          <div className="px-5 pb-4 flex items-center gap-2 text-sm text-red-600">
            <XCircle className="w-4 h-4" />
            Application rejected.
          </div>
        )}
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobApplicationsPage() {
  const { id: jobId } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: job, isLoading: jobLoading } = useJob(jobId);
  const { data: applications = [], isLoading: appsLoading, error: appsError } = useJobApplicationsForCompany(jobId);
  const updateStatus = useUpdateApplicationStatus();

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [actionError, setActionError] = useState<string | null>(null);

  // Guard: only company owners
  if (!jobLoading && job && user && user.role !== "COMPANY") {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto py-12 text-center">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-secondary-400" />
          <h1 className="text-xl font-bold text-secondary-900 mb-2">Access Denied</h1>
          <p className="text-secondary-600">Only company accounts can view applications.</p>
        </div>
      </PageLayout>
    );
  }

  const filteredApps = (applications as Application[]).filter(
    (app) => activeFilter === "ALL" || app.status === activeFilter
  );

  const handleAction = async (id: number, status: string, rejectionReason?: string) => {
    setActionError(null);
    try {
      await updateStatus.mutateAsync({ id, status, rejectionReason });
    } catch {
      setActionError("Failed to update application status. Please try again.");
    }
  };

  const isLoading = jobLoading || appsLoading;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Back link */}
        <Link
          href={`/jobs/${jobId}`}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">
            {jobLoading ? "Loading…" : `Applications for "${job?.title}"`}
          </h1>
          {!isLoading && (
            <p className="text-secondary-500 mt-1 text-sm">
              {(applications as Application[]).length} total application
              {(applications as Application[]).length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Error banner */}
        {actionError && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex justify-between items-center">
            {actionError}
            <button onClick={() => setActionError(null)} className="ml-4 text-red-500 hover:text-red-700 font-bold">
              ×
            </button>
          </div>
        )}

        {/* Filter tabs */}
        {!isLoading && (applications as Application[]).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTER_TABS.map((tab) => {
              const count =
                tab === "ALL"
                  ? (applications as Application[]).length
                  : (applications as Application[]).filter((a) => a.status === tab).length;
              if (tab !== "ALL" && count === 0) return null;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === tab
                      ? "bg-primary-600 text-white"
                      : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
                  }`}
                >
                  {tab === "ALL" ? "All" : STATUS_CONFIG[tab]?.label ?? tab} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-secondary-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && appsError && (
          <div className="text-center py-16">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <p className="text-secondary-600">Failed to load applications. Make sure you own this job posting.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !appsError && filteredApps.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
            <h2 className="text-lg font-semibold text-secondary-700 mb-1">
              {activeFilter === "ALL" ? "No applications yet" : `No ${STATUS_CONFIG[activeFilter]?.label ?? activeFilter} applications`}
            </h2>
            <p className="text-secondary-500 text-sm">
              {activeFilter === "ALL"
                ? "Applications will appear here once freelancers start applying."
                : "Try a different filter to see more applications."}
            </p>
          </div>
        )}

        {/* Application cards */}
        {!isLoading && !appsError && filteredApps.length > 0 && (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <ApplicationCard key={app.id} app={app} onAction={handleAction} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
