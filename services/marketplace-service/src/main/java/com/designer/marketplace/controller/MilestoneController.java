package com.designer.marketplace.controller;

import com.designer.marketplace.dto.MilestoneDTOs.*;
import com.designer.marketplace.service.MilestoneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milestones")
@RequiredArgsConstructor
@Tag(name = "Milestones", description = "Milestone-based payment management")
@SecurityRequirement(name = "bearerAuth")
public class MilestoneController {

    private final MilestoneService milestoneService;

    @PostMapping
    @Operation(summary = "Create milestones for a job")
    public ResponseEntity<List<MilestoneResponse>> createMilestones(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody List<CreateMilestoneRequest> requests) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.createMilestones(userId, requests));
    }

    @PostMapping("/{milestoneId}/fund")
    @Operation(summary = "Fund a milestone")
    public ResponseEntity<MilestoneResponse> fundMilestone(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long clientId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.fundMilestone(milestoneId, clientId));
    }

    @PostMapping("/{milestoneId}/start")
    @Operation(summary = "Start working on a milestone")
    public ResponseEntity<MilestoneResponse> startMilestone(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long freelancerId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.startMilestone(milestoneId, freelancerId));
    }

    @PostMapping("/{milestoneId}/submit")
    @Operation(summary = "Submit milestone deliverables for review")
    public ResponseEntity<MilestoneResponse> submitMilestone(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubmitMilestoneRequest request) {
        Long freelancerId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.submitMilestone(milestoneId, freelancerId, request));
    }

    @PostMapping("/{milestoneId}/approve")
    @Operation(summary = "Approve milestone and release payment")
    public ResponseEntity<MilestoneResponse> approveMilestone(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) ApproveMilestoneRequest request) {
        Long clientId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.approveMilestone(milestoneId, clientId,
                request != null ? request : new ApproveMilestoneRequest()));
    }

    @PostMapping("/{milestoneId}/request-revision")
    @Operation(summary = "Request revision for a milestone")
    public ResponseEntity<MilestoneResponse> requestRevision(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RequestRevisionRequest request) {
        Long clientId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.requestRevision(milestoneId, clientId, request));
    }

    @GetMapping("/job/{jobId}")
    @Operation(summary = "Get milestones for a job")
    public ResponseEntity<List<MilestoneResponse>> getMilestonesByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(milestoneService.getMilestonesByJobId(jobId));
    }

    @GetMapping("/job/{jobId}/summary")
    @Operation(summary = "Get milestone summary for a job")
    public ResponseEntity<MilestoneSummary> getMilestoneSummary(@PathVariable Long jobId) {
        return ResponseEntity.ok(milestoneService.getMilestoneSummary(jobId));
    }

    @GetMapping("/client")
    @Operation(summary = "Get milestones for the current client")
    public ResponseEntity<Page<MilestoneResponse>> getClientMilestones(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Long clientId = getUserId(userDetails);
        return ResponseEntity.ok(milestoneService.getMilestonesByClientId(clientId, pageable));
    }

    @GetMapping("/freelancer")
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
