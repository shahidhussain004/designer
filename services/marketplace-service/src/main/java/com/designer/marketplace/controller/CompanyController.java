package com.designer.marketplace.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.CompanyProfileResponse;
import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.dto.UserResponse;
import com.designer.marketplace.service.JobService;
import com.designer.marketplace.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for company profile endpoints
 * 
 * Endpoints:
 * - GET /api/companies/{id} - Get company profile by ID
 * - GET /api/companies - List all companies (with pagination)
 * - GET /api/companies/{id}/jobs - Get jobs posted by a specific company
 */
@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
@Slf4j
public class CompanyController {

    private final UserService userService;
    private final com.designer.marketplace.repository.CompanyRepository companyRepository;
    private final JobService jobService;

    /**
     * Get company profile by ID
     * GET /api/companies/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CompanyProfileResponse> getCompanyProfile(@PathVariable Long id) {
        log.info("Getting company profile: {}", id);

        // Prefer company table as source of truth. Try to load Company by id.
        return companyRepository.findByIdWithUser(id)
                .map(c -> {
                    CompanyProfileResponse resp = CompanyProfileResponse.builder()
                            .id(c.getId())
                            .companyName(c.getCompanyName())
                            .companyType(c.getCompanyType())
                            .industry(c.getIndustry())
                            .websiteUrl(c.getWebsiteUrl())
                            .companySize(c.getCompanySize() != null ? c.getCompanySize().name() : null)
                            .registrationNumber(c.getRegistrationNumber())
                            .taxId(c.getTaxId())
                            .phone(c.getPhone())
                            .headquartersLocation(c.getHeadquartersLocation())
                            .description(c.getDescription())
                            .logoUrl(c.getLogoUrl())
                            .contactEmail(c.getContactEmail())
                            .totalJobsPosted(c.getTotalJobsPosted())
                            .createdAt(c.getCreatedAt())
                            .updatedAt(c.getUpdatedAt())
                            .build();
                    if (c.getUser() != null) {
                        resp.setUserId(c.getUser().getId());
                        resp.setUsername(c.getUser().getUsername());
                        resp.setFullName(c.getUser().getFullName());
                        resp.setEmail(c.getUser().getEmail());
                        resp.setProfileImageUrl(c.getUser().getProfileImageUrl());
                        resp.setLocation(c.getUser().getLocation());
                        resp.setBio(c.getUser().getBio());
                    }
                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> {
                    // Fallback: if no company record, return user profile for backwards compatibility
                    log.warn("Company id {} not found in companies table, falling back to userService", id);
                    return ResponseEntity.ok(CompanyProfileResponse.builder()
                            .id(id)
                            .username(userService.getUserById(id).getUsername())
                            .fullName(userService.getUserById(id).getFullName())
                            .email(userService.getUserById(id).getEmail())
                            .build());
                });
    }

    /**
     * List all companies with pagination
     * GET /api/companies?page=0&size=20
     */
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Getting all companies - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        // Note: This assumes there's a method to get users by role COMPANY
        // If not, this will need to be implemented in UserService
        Page<UserResponse> companies = userService.findUsersByRole(
            com.designer.marketplace.entity.User.UserRole.COMPANY, 
            pageable
        );
        return ResponseEntity.ok(companies);
    }

    /**
     * Get jobs posted by a specific company
     * GET /api/companies/{id}/jobs
     */
    @GetMapping("/{id}/jobs")
    public ResponseEntity<Page<JobResponse>> getJobsByCompany(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<JobResponse> jobs = jobService.getJobsByCompany(id, pageable);
        return ResponseEntity.ok(jobs);
    }
}
