package com.designer.marketplace.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.UserResponse;
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
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Slf4j
public class CompanyController {

    private final UserService userService;

    /**
     * Get company profile by ID
     * GET /api/companies/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getCompanyProfile(@PathVariable Long id) {
        log.info("Getting company profile: {}", id);
        UserResponse company = userService.getUserById(id);
        return ResponseEntity.ok(company);
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
}
