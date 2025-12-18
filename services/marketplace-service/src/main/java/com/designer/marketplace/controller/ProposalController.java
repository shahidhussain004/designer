package com.designer.marketplace.controller;

import com.designer.marketplace.dto.CreateProposalRequest;
import com.designer.marketplace.dto.ProposalResponse;
import com.designer.marketplace.dto.UpdateProposalStatusRequest;
import com.designer.marketplace.service.ProposalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for proposal endpoints
 * 
 * Endpoints:
 * - GET /api/proposals - Get user's proposals
 * - GET /api/jobs/{jobId}/proposals - Get proposals for a job
 * - POST /api/proposals - Submit proposal
 * - PUT /api/proposals/{id}/status - Update proposal status
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ProposalController {

    private final ProposalService proposalService;

    /**
     * Task 3.12: Get user's proposals
     * GET /api/proposals?page=0&size=20
     */
    @GetMapping("/proposals")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Page<ProposalResponse>> getUserProposals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Getting user's proposals - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProposalResponse> proposals = proposalService.getUserProposals(pageable);
        return ResponseEntity.ok(proposals);
    }

    /**
     * Task 3.13: Get proposals for a job
     * GET /api/jobs/{jobId}/proposals?page=0&size=20
     */
    @GetMapping("/jobs/{jobId}/proposals")
    @PreAuthorize("isAuthenticated() and @jobService.isJobOwner(#jobId)")
    public ResponseEntity<Page<ProposalResponse>> getJobProposals(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Getting proposals for job: {}", jobId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProposalResponse> proposals = proposalService.getJobProposals(jobId, pageable);
        return ResponseEntity.ok(proposals);
    }

    /**
     * Task 3.14: Submit proposal (freelancers only)
     * POST /api/proposals
     */
    @PostMapping("/proposals")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<ProposalResponse> createProposal(@Valid @RequestBody CreateProposalRequest request) {
        log.info("Creating new proposal for job: {}", request.getJobId());
        ProposalResponse proposal = proposalService.createProposal(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(proposal);
    }

    /**
     * Task 3.15: Update proposal status (job owner only)
     * PUT /api/proposals/{id}/status
     */
    @PutMapping("/proposals/{id}/status")
    @PreAuthorize("isAuthenticated() and @proposalService.isJobOwnerForProposal(#id)")
    public ResponseEntity<ProposalResponse> updateProposalStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProposalStatusRequest request) {

        log.info("Updating proposal status: {}", id);
        ProposalResponse proposal = proposalService.updateProposalStatus(id, request);
        return ResponseEntity.ok(proposal);
    }

    /**
     * Get proposal by ID
     * GET /api/proposals/{id}
     */
    @GetMapping("/proposals/{id}")
    @PreAuthorize("isAuthenticated() and (@proposalService.isProposalOwner(#id) or @proposalService.isJobOwnerForProposal(#id))")
    public ResponseEntity<ProposalResponse> getProposalById(@PathVariable Long id) {
        log.info("Getting proposal by id: {}", id);
        ProposalResponse proposal = proposalService.getProposalById(id);
        return ResponseEntity.ok(proposal);
    }
}
