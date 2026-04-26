"use client";

import { PageLayout } from "@/components/ui";
import { useAcceptProposal, useProject, useProjectProposals, useRejectProposal, useUpdateProposalStatus } from "@/hooks/useProjects";
import { useAuth } from "@/lib/auth";
import {
    ArrowLeft,
    CheckCircle,
    ChevronDown,
    Clock,
    DollarSign,
    ExternalLink,
    FileText,
    Loader2,
    MapPin,
    Star,
    User,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FreelancerInfo {
  id: number;
  username: string;
  fullName: string;
  profileImageUrl: string | null;
  location: string | null;
  bio: string | null;
  hourlyRate: number | null;
  skills: string[];
  portfolioUrl: string | null;
  ratingAvg: number;
  ratingCount: number;
}

interface Proposal {
  id: number;
  projectId: number;
  projectTitle: string;
  freelancer: FreelancerInfo;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: number;
  status: string;
  companyMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  SUBMITTED: { label: "New", color: "bg-blue-100 text-blue-800", icon: FileText },
  REVIEWING: { label: "Reviewing", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  SHORTLISTED: { label: "Shortlisted", color: "bg-purple-100 text-purple-800", icon: Star },
  ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-800", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  WITHDRAWN: { label: "Withdrawn", color: "bg-secondary-100 text-secondary-600", icon: ArrowLeft },
};

const FILTER_TABS = ["ALL", "SUBMITTED", "REVIEWING", "SHORTLISTED", "ACCEPTED", "REJECTED"];

const NEXT_STATUS_ACTIONS: Record<string, { label: string; status: string; variant: "primary" | "success" | "warning" | "danger" }[]> = {
  SUBMITTED: [
    { label: "Start Reviewing", status: "REVIEWING", variant: "primary" },
    { label: "Shortlist", status: "SHORTLISTED", variant: "success" },
    { label: "Reject", status: "REJECTED", variant: "danger" },
  ],
  REVIEWING: [
    { label: "Shortlist", status: "SHORTLISTED", variant: "success" },
    { label: "Accept & Hire", status: "ACCEPTED", variant: "success" },
    { label: "Reject", status: "REJECTED", variant: "danger" },
  ],
  SHORTLISTED: [
    { label: "Accept & Hire", status: "ACCEPTED", variant: "success" },
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
        <h2 className="text-lg font-semibold text-secondary-900 mb-2">Reject Proposal</h2>
        <p className="text-secondary-600 text-sm mb-4">Optionally provide feedback for the freelancer:</p>
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

// ─── Accept Confirmation Modal ────────────────────────────────────────────────

function AcceptModal({
  proposal,
  onConfirm,
  onCancel,
}: {
  proposal: Proposal;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-success-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">Accept Proposal & Hire</h2>
            <p className="text-sm text-secondary-500">This will start the project with this freelancer</p>
          </div>
        </div>
        
        <div className="bg-secondary-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
              {proposal.freelancer?.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={proposal.freelancer.profileImageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-secondary-500" />
              )}
            </div>
            <div>
              <p className="font-semibold text-secondary-900">{proposal.freelancer?.fullName}</p>
              <p className="text-sm text-secondary-500">@{proposal.freelancer?.username}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-secondary-500">Proposed Rate</p>
              <p className="font-semibold text-secondary-900">${proposal.proposedRate?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-secondary-500">Duration</p>
              <p className="font-semibold text-secondary-900">{proposal.estimatedDuration} days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-primary-800">
            <strong>What happens next:</strong>
          </p>
          <ul className="text-sm text-primary-700 mt-2 space-y-1">
            <li>• The project status will change to &ldquo;In Progress&rdquo;</li>
            <li>• A contract will be created between you and the freelancer</li>
            <li>• The freelancer will be notified to start work</li>
            <li>• Other proposals will remain for your reference</li>
          </ul>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-success-600 text-white hover:bg-success-700 transition-colors"
          >
            Accept & Hire Freelancer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Proposal Card ────────────────────────────────────────────────────────────

function ProposalCard({
  proposal,
  onAction,
  isProcessing,
}: {
  proposal: Proposal;
  onAction: (id: number, status: string, reason?: string) => void;
  isProcessing: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [pendingReject, setPendingReject] = useState(false);
  const [pendingAccept, setPendingAccept] = useState(false);

  const actions = NEXT_STATUS_ACTIONS[proposal.status] ?? [];
  const cfg = STATUS_CONFIG[proposal.status] ?? { label: proposal.status, color: "bg-secondary-100 text-secondary-600", icon: FileText };
  const StatusIcon = cfg.icon;

  const handleAction = (status: string) => {
    if (status === "REJECTED") {
      setPendingReject(true);
    } else if (status === "ACCEPTED") {
      setPendingAccept(true);
    } else {
      onAction(proposal.id, status);
    }
  };

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "primary": return "bg-primary-600 hover:bg-primary-700 text-white";
      case "success": return "bg-success-600 hover:bg-success-700 text-white";
      case "warning": return "bg-warning-500 hover:bg-warning-600 text-white";
      case "danger": return "border border-red-300 text-red-700 hover:bg-red-50";
      default: return "bg-secondary-100 hover:bg-secondary-200 text-secondary-700";
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            {/* Freelancer Info */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {proposal.freelancer?.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={proposal.freelancer.profileImageUrl} 
                    alt={proposal.freelancer.fullName}
                    className="w-14 h-14 object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-secondary-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-secondary-900">{proposal.freelancer?.fullName}</h3>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>
                <p className="text-sm text-secondary-500">@{proposal.freelancer?.username}</p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-secondary-600">
                  {proposal.freelancer?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {proposal.freelancer.location}
                    </span>
                  )}
                  {proposal.freelancer?.ratingAvg > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning-400 text-warning-400" />
                      {proposal.freelancer.ratingAvg.toFixed(1)} ({proposal.freelancer.ratingCount} reviews)
                    </span>
                  )}
                  {proposal.freelancer?.hourlyRate && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${proposal.freelancer.hourlyRate}/hr usual rate
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Proposal Rate */}
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold text-secondary-900">
                ${proposal.proposedRate?.toLocaleString()}
              </p>
              <p className="text-sm text-secondary-500">
                {proposal.estimatedDuration} days
              </p>
              <p className="text-xs text-secondary-400 mt-1">
                Submitted {new Date(proposal.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Skills */}
          {proposal.freelancer?.skills && proposal.freelancer.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {proposal.freelancer.skills.slice(0, 6).map((skill, i) => (
                <span key={i} className="px-2.5 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                  {skill}
                </span>
              ))}
              {proposal.freelancer.skills.length > 6 && (
                <span className="px-2.5 py-1 bg-secondary-50 text-secondary-500 text-xs rounded-full">
                  +{proposal.freelancer.skills.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Cover Letter Preview & Expand */}
        <div className="border-t border-secondary-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
          >
            <span>Cover Letter</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          
          {expanded && (
            <div className="px-6 pb-6">
              <div className="bg-secondary-50 rounded-lg p-4 mb-4">
                <p className="text-secondary-700 whitespace-pre-wrap text-sm">{proposal.coverLetter}</p>
              </div>
              
              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {proposal.freelancer?.portfolioUrl && (
                  <a
                    href={proposal.freelancer.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Portfolio
                  </a>
                )}
                <Link
                  href={`/freelancers/${proposal.freelancer?.id}`}
                  className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <User className="w-4 h-4" />
                  View Full Profile
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        {actions.length > 0 && (
          <div className="bg-secondary-50 border-t border-secondary-100 px-6 py-4 flex items-center justify-end gap-3">
            {isProcessing ? (
              <div className="flex items-center gap-2 text-secondary-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </div>
            ) : (
              actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(action.status)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${getVariantClasses(action.variant)}`}
                >
                  {action.label}
                </button>
              ))
            )}
          </div>
        )}
        
        {/* Company Notes (if any) */}
        {proposal.companyMessage && (
          <div className="bg-primary-50 border-t border-primary-100 px-6 py-3">
            <p className="text-xs text-primary-600 uppercase tracking-wide font-semibold mb-1">Your Notes</p>
            <p className="text-sm text-primary-800">{proposal.companyMessage}</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {pendingReject && (
        <RejectionModal
          onConfirm={(reason) => {
            onAction(proposal.id, "REJECTED", reason);
            setPendingReject(false);
          }}
          onCancel={() => setPendingReject(false)}
        />
      )}
      
      {pendingAccept && (
        <AcceptModal
          proposal={proposal}
          onConfirm={() => {
            onAction(proposal.id, "ACCEPTED");
            setPendingAccept(false);
          }}
          onCancel={() => setPendingAccept(false)}
        />
      )}
    </>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────

function StatsBar({ proposals }: { proposals: Proposal[] }) {
  const stats = {
    total: proposals.length,
    new: proposals.filter(p => p.status === 'SUBMITTED').length,
    reviewing: proposals.filter(p => p.status === 'REVIEWING').length,
    shortlisted: proposals.filter(p => p.status === 'SHORTLISTED').length,
    accepted: proposals.filter(p => p.status === 'ACCEPTED').length,
    rejected: proposals.filter(p => p.status === 'REJECTED').length,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
        <p className="text-3xl font-bold text-secondary-900">{stats.total}</p>
        <p className="text-xs text-secondary-500 uppercase tracking-wide mt-1">Total</p>
      </div>
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 text-center">
        <p className="text-3xl font-bold text-blue-700">{stats.new}</p>
        <p className="text-xs text-blue-600 uppercase tracking-wide mt-1">New</p>
      </div>
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 text-center">
        <p className="text-3xl font-bold text-yellow-700">{stats.reviewing}</p>
        <p className="text-xs text-yellow-600 uppercase tracking-wide mt-1">Reviewing</p>
      </div>
      <div className="bg-purple-50 rounded-lg border border-purple-200 p-4 text-center">
        <p className="text-3xl font-bold text-purple-700">{stats.shortlisted}</p>
        <p className="text-xs text-purple-600 uppercase tracking-wide mt-1">Shortlisted</p>
      </div>
      <div className="bg-green-50 rounded-lg border border-green-200 p-4 text-center">
        <p className="text-3xl font-bold text-green-700">{stats.accepted}</p>
        <p className="text-xs text-green-600 uppercase tracking-wide mt-1">Hired</p>
      </div>
      <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-center">
        <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
        <p className="text-xs text-red-600 uppercase tracking-wide mt-1">Rejected</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectProposalsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuth();

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: proposalData, isLoading: proposalsLoading, refetch } = useProjectProposals(projectId);
  const updateStatusMutation = useUpdateProposalStatus();
  const acceptMutation = useAcceptProposal();
  const rejectMutation = useRejectProposal();

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Ensure proposals is always an array
  const proposals: Proposal[] = Array.isArray(proposalData) ? proposalData : [];

  const isLoading = projectLoading || proposalsLoading;
  const isOwner = user?.id === project?.company?.id;

  const filteredProposals = filterStatus === "ALL" 
    ? proposals 
    : proposals.filter(p => p.status === filterStatus);

  const handleAction = async (proposalId: number, status: string, reason?: string) => {
    setProcessingId(proposalId);
    try {
      if (status === "ACCEPTED") {
        await acceptMutation.mutateAsync(proposalId);
      } else if (status === "REJECTED") {
        await rejectMutation.mutateAsync({ proposalId, reason });
      } else {
        await updateStatusMutation.mutateAsync({ proposalId, status });
      }
      refetch();
    } catch (err) {
      console.error("Failed to update proposal:", err);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
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
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
            <XCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
            <p className="text-error-700 font-medium mb-4">Project not found</p>
            <Link href="/projects" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Browse Projects
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!isOwner) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 text-center">
            <XCircle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
            <p className="text-warning-700 font-medium mb-4">You don&apos;t have permission to view proposals for this project</p>
            <Link href="/projects" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Browse Projects
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href={`/projects/${projectId}`} 
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Proposals</h1>
              <p className="text-primary-100 mt-1">{project.title}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <p className="text-sm text-primary-200">Budget</p>
                <p className="text-lg font-semibold">
                  ${project.minBudget?.toLocaleString()} - ${project.maxBudget?.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <p className="text-sm text-primary-200">Status</p>
                <p className="text-lg font-semibold capitalize">{project.status?.toLowerCase()}</p>
              </div>
              <Link
                href={`/projects/${projectId}/edit`}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors border border-white/30 text-sm"
              >
                Edit Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="mb-8">
          <StatsBar proposals={proposals} />
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {FILTER_TABS.map((tab) => {
            const count = tab === "ALL" ? proposals.length : proposals.filter(p => p.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === tab
                    ? "bg-primary-600 text-white"
                    : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                }`}
              >
                {tab === "ALL" ? "All" : STATUS_CONFIG[tab]?.label || tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Proposals List */}
        {filteredProposals.length === 0 ? (
          <div className="bg-white rounded-xl border border-secondary-200 p-12 text-center">
            <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              {filterStatus === "ALL" ? "No proposals yet" : `No ${STATUS_CONFIG[filterStatus]?.label?.toLowerCase() || filterStatus.toLowerCase()} proposals`}
            </h3>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              {filterStatus === "ALL" 
                ? "When freelancers submit proposals for this project, they'll appear here."
                : "Try selecting a different filter to see other proposals."}
            </p>
            {filterStatus !== "ALL" && (
              <button
                onClick={() => setFilterStatus("ALL")}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View all proposals
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onAction={handleAction}
                isProcessing={processingId === proposal.id}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
