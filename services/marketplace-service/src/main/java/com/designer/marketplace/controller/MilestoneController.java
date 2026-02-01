package com.designer.marketplace.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.MilestoneDTOs.ApproveMilestoneRequest;
import com.designer.marketplace.dto.MilestoneDTOs.CreateMilestoneRequest;
import com.designer.marketplace.dto.MilestoneDTOs.MilestoneResponse;
import com.designer.marketplace.dto.MilestoneDTOs.MilestoneSummary;
import com.designer.marketplace.dto.MilestoneDTOs.RequestRevisionRequest;
import com.designer.marketplace.dto.MilestoneDTOs.SubmitMilestoneRequest;
import com.designer.marketplace.service.MilestoneService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@Tag(name = "Milestones", description = "Milestone-based payment management")
@SecurityRequirement(name = "bearerAuth")
public class MilestoneController {

    private final MilestoneService milestoneService;

    @PostMapping("/milestones")
    @Operation(summary = "Create milestones for a job")
    public ResponseEntity<List<MilestoneResponse>> createMilestones(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody List<CreateMilestoneRequest> requests) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.createMilestones(userId, requests));
    }

    @PostMapping("/milestones/{milestoneId}/fund")
    @Operation(summary = "Fund a milestone")
    public ResponseEntity<MilestoneResponse> fundMilestone(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long companyId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.fundMilestone(milestoneId, companyId));
    }

    @PostMapping("/milestones/{milestoneId}/start")
    @Operation(summary = "Start working on a milestone")
    public ResponseEntity<MilestoneResponse> startMilestone(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long freelancerId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.startMilestone(milestoneId, freelancerId));
    }

    @PostMapping("/milestones/{milestoneId}/submit")
    @Operation(summary = "Submit milestone deliverables for review")
    public ResponseEntity<MilestoneResponse> submitMilestone(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubmitMilestoneRequest request) {
        Long freelancerId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.submitMilestone(milestoneId, freelancerId, request));
    }

    @PostMapping("/milestones/{milestoneId}/approve")
    @Operation(summary = "Approve milestone and release payment")
    public ResponseEntity<MilestoneResponse> approveMilestone(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) ApproveMilestoneRequest request) {
        Long companyId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.approveMilestone(milestoneId, companyId,
                request != null ? request : new ApproveMilestoneRequest()));
    }

    @PostMapping("/milestones/{milestoneId}/request-revision")
    @Operation(summary = "Request revision for a milestone")
    public ResponseEntity<MilestoneResponse> requestRevision(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RequestRevisionRequest request) {
        Long companyId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.requestRevision(milestoneId, companyId, request));
    }

    @GetMapping("/jobs/{jobId}/milestones")
    @Operation(summary = "Get milestones for a job")
    public ResponseEntity<List<MilestoneResponse>> getMilestonesByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(milestoneService.getMilestonesByJobId(jobId));
    }

    @GetMapping("/jobs/{jobId}/milestones/summary")
    @Operation(summary = "Get milestone summary for a job")
    public ResponseEntity<MilestoneSummary> getMilestoneSummary(@PathVariable Long jobId) {
        return ResponseEntity.ok(milestoneService.getMilestoneSummaryByJobId(jobId));
    }

    @GetMapping("/milestones/company")
    @Operation(summary = "Get milestones for the current company")
    public ResponseEntity<Page<MilestoneResponse>> getCompanyMilestones(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Long companyId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.getMilestonesByCompanyId(companyId, pageable));
    }

    @GetMapping("/milestones/freelancer")
    @Operation(summary = "Get milestones for the current freelancer")
    public ResponseEntity<Page<MilestoneResponse>> getFreelancerMilestones(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Long freelancerId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.getMilestonesByFreelancerId(freelancerId, pageable));
    }

    private Long getUserId(UserDetails userDetails) {
        // Extract user ID from the username or custom UserDetails implementation
        return Long.parseLong(userDetails.getUsername());
    }
}
